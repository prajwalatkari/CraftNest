const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const PlatformSetting = require('../models/PlatformSetting');

// @desc    Create new order with server validation and atomic stock decrement
// @route   POST /api/v1/orders
// @access  Private/Buyer
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = 'TestCard', notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your order must contain at least one item' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ success: false, message: 'Please provide a complete shipping address' });
    }

    // 1. Fetch live product data from database and validate stock & price
    const orderItems = [];
    let subtotal = 0;

    for (const reqItem of items) {
      const product = await Product.findById(reqItem.productId);

      if (!product || product.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: `Product "${reqItem.name || reqItem.productId}" is no longer available`
        });
      }

      const qty = parseInt(reqItem.quantity, 10);
      if (qty < 1) {
        return res.status(400).json({ success: false, message: 'Invalid item quantity' });
      }

      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`
        });
      }

      const itemTotal = product.price * qty;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        productNameSnapshot: product.name,
        unitPriceSnapshot: product.price,
        imageSnapshot: product.images && product.images.length > 0 ? product.images[0] : '',
        quantity: qty,
        itemStatus: 'Confirmed'
      });
    }

    // 2. Atomic stock decrement for each product
    const decrementedProducts = [];
    try {
      for (const item of orderItems) {
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity, salesCount: item.quantity } },
          { new: true }
        );

        if (!updatedProduct) {
          // Stock race condition: rollback any already decremented items
          for (const rolledBackItem of decrementedProducts) {
            await Product.findByIdAndUpdate(rolledBackItem.productId, {
              $inc: { stock: rolledBackItem.quantity, salesCount: -rolledBackItem.quantity }
            });
          }
          return res.status(409).json({
            success: false,
            message: `Could not secure stock for "${item.productNameSnapshot}". Please try again.`
          });
        }

        decrementedProducts.push(item);
      }
    } catch (atomicError) {
      return res.status(500).json({ success: false, message: 'Stock update failed: ' + atomicError.message });
    }

    // 3. Compute fees, commission, and totals
    const shippingFee = subtotal > 999 ? 0 : 79;
    const discount = 0;
    const total = subtotal + shippingFee - discount;

    const settings = await PlatformSetting.findOne() || { commissionPercent: 10 };
    const commissionPercent = settings.commissionPercent || 10;
    const commissionAmount = Math.round((subtotal * commissionPercent) / 100);
    const sellerEarnings = subtotal - commissionAmount;

    // Unique Order Number
    const orderNumber = `CN-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await Order.create({
      orderNumber,
      buyerId: req.user._id,
      items: orderItems,
      shippingAddressSnapshot: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state ? shippingAddress.state.trim() : '',
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country || 'India'
      },
      subtotal,
      shippingFee,
      discount,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
      orderStatus: 'Confirmed',
      commissionAmount,
      sellerEarnings,
      notes: notes || ''
    });

    // Clear user's cart
    await Cart.findOneAndUpdate({ buyerId: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get buyer's orders
// @route   GET /api/v1/orders/my
// @access  Private/Buyer
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID with authorization checks
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyerId', 'name email phone')
      .populate('items.sellerId', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isBuyer = order.buyerId._id.toString() === req.user._id.toString();
    const isSeller = order.items.some(item => item.sellerId && item.sellerId._id.toString() === req.user._id.toString());
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (if pending or confirmed) and restore stock
// @route   PATCH /api/v1/orders/:id/cancel
// @access  Private/Buyer
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.buyerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (!['Pending', 'Confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in '${order.orderStatus}' status`
      });
    }

    order.orderStatus = 'Cancelled';
    order.items.forEach(item => {
      item.itemStatus = 'Cancelled';
    });

    await order.save();

    // Restore stock atomically
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity, salesCount: -item.quantity }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and stock restored',
      order
    });
  } catch (error) {
    next(error);
  }
};
