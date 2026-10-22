const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to get or create cart
const getOrCreateCart = async (buyerId) => {
  let cart = await Cart.findOne({ buyerId }).populate({
    path: 'items.productId',
    select: 'name price stock images category status sellerId slug'
  });

  if (!cart) {
    cart = await Cart.create({ buyerId, items: [] });
  }
  return cart;
};

// @desc    Get user's cart with up-to-date pricing and stock
// @route   GET /api/v1/cart
// @access  Private/Buyer
exports.getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);

    // Filter out deleted products or populate cleanly
    let subtotal = 0;
    const validItems = [];

    cart.items.forEach(item => {
      if (item.productId && item.productId.status === 'active') {
        const itemTotal = item.productId.price * item.quantity;
        subtotal += itemTotal;
        validItems.push({
          _id: item._id,
          productId: item.productId._id,
          name: item.productId.name,
          slug: item.productId.slug,
          price: item.productId.price,
          stock: item.productId.stock,
          images: item.productId.images,
          category: item.productId.category,
          quantity: Math.min(item.quantity, item.productId.stock),
          itemTotal
        });
      }
    });

    const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 79;
    const total = subtotal + shippingFee;

    res.status(200).json({
      success: true,
      cart: {
        items: validItems,
        subtotal,
        shippingFee,
        total,
        freeShippingThreshold: 999
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/v1/cart/items
// @access  Private/Buyer
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product || product.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items currently in stock`
      });
    }

    let cart = await Cart.findOne({ buyerId: req.user._id });
    if (!cart) {
      cart = new Cart({ buyerId: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
      const newQty = cart.items[existingItemIndex].quantity + qty;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than available stock (${product.stock} available)`
        });
      }
      cart.items[existingItemIndex].quantity = newQty;
    } else {
      cart.items.push({ productId, quantity: qty });
    }

    await cart.save();

    // Re-fetch populated cart
    return exports.getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity in cart
// @route   PATCH /api/v1/cart/items/:productId
// @access  Private/Buyer
exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot exceed available stock of ${product.stock}`
      });
    }

    const cart = await Cart.findOne({ buyerId: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.find(it => it.productId.toString() === productId.toString());
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    item.quantity = qty;
    await cart.save();

    return exports.getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/items/:productId
// @access  Private/Buyer
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ buyerId: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(it => it.productId.toString() !== productId.toString());
    await cart.save();

    return exports.getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/v1/cart
// @access  Private/Buyer
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ buyerId: req.user._id }, { items: [] });
    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart: { items: [], subtotal: 0, shippingFee: 0, total: 0 }
    });
  } catch (error) {
    next(error);
  }
};
