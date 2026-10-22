const Product = require('../models/Product');
const Order = require('../models/Order');
const SellerProfile = require('../models/SellerProfile');
const PlatformSetting = require('../models/PlatformSetting');

// Helper to get or create seller profile
const getOrCreateSellerProfile = async (userId, user) => {
  let profile = await SellerProfile.findOne({ userId });
  if (!profile) {
    const slug = `${user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
    profile = await SellerProfile.create({
      userId,
      shopName: `${user.name}'s Workshop`,
      slug,
      description: 'Handmade crafts crafted with love and passion.',
      contactDetails: { email: user.email, phone: user.phone || '' },
      approvalStatus: 'approved'
    });
  }
  return profile;
};

// @desc    Get seller overview stats & chart
// @route   GET /api/v1/seller/dashboard
// @access  Private/Seller
exports.getDashboard = async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const profile = await getOrCreateSellerProfile(sellerId, req.user);

    // 1. Products stats
    const totalProducts = await Product.countDocuments({ sellerId });
    const lowStockProducts = await Product.find({ sellerId, stock: { $lte: 3 }, status: 'active' })
      .select('name stock price images')
      .limit(5);

    // 2. Orders containing seller's items
    const orders = await Order.find({ 'items.sellerId': sellerId }).sort({ createdAt: -1 });

    let grossSales = 0;
    let pendingOrdersCount = 0;
    let completedOrdersCount = 0;
    const recentOrders = [];

    // Map for sales by date (last 7 days)
    const salesByDate = {};
    const days = 7;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      salesByDate[dateKey] = 0;
    }

    orders.forEach(order => {
      // Filter items belonging to this seller
      const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
      const orderSellerTotal = sellerItems.reduce((acc, it) => acc + (it.unitPriceSnapshot * it.quantity), 0);

      const hasPending = sellerItems.some(it => ['Pending', 'Confirmed', 'Processing'].includes(it.itemStatus));
      const isDelivered = sellerItems.every(it => it.itemStatus === 'Delivered');

      if (hasPending) pendingOrdersCount++;
      if (isDelivered) completedOrdersCount++;

      // Non-cancelled sales count toward gross sales
      const validSellerTotal = sellerItems
        .filter(it => it.itemStatus !== 'Cancelled')
        .reduce((acc, it) => acc + (it.unitPriceSnapshot * it.quantity), 0);

      grossSales += validSellerTotal;

      // Group into sales by date if within range
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      if (salesByDate[orderDate] !== undefined) {
        salesByDate[orderDate] += validSellerTotal;
      }

      if (recentOrders.length < 5) {
        recentOrders.push({
          orderId: order._id,
          orderNumber: order.orderNumber,
          customerName: order.shippingAddressSnapshot.fullName,
          createdAt: order.createdAt,
          itemsCount: sellerItems.length,
          sellerTotal: orderSellerTotal,
          itemStatuses: sellerItems.map(it => it.itemStatus),
          paymentStatus: order.paymentStatus
        });
      }
    });

    const settings = await PlatformSetting.findOne() || { commissionPercent: 10 };
    const commissionPercent = settings.commissionPercent || 10;
    const platformCommission = Math.round((grossSales * commissionPercent) / 100);
    const netEarnings = grossSales - platformCommission;

    const chartData = Object.keys(salesByDate).map(date => ({
      date,
      sales: salesByDate[date]
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        pendingOrdersCount,
        completedOrdersCount,
        grossSales,
        netEarnings,
        platformCommission,
        commissionPercent,
        lowStockCount: lowStockProducts.length
      },
      lowStockProducts,
      recentOrders,
      chartData,
      profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller shop profile
// @route   GET /api/v1/seller/profile
// @access  Private/Seller
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await getOrCreateSellerProfile(req.user._id, req.user);
    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update seller shop profile
// @route   PATCH /api/v1/seller/profile
// @access  Private/Seller
exports.updateProfile = async (req, res, next) => {
  try {
    const { shopName, description, contactDetails, banner, logo } = req.body;
    const profile = await getOrCreateSellerProfile(req.user._id, req.user);

    if (shopName) {
      profile.shopName = shopName.trim();
      profile.slug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) profile.description = description;
    if (contactDetails) profile.contactDetails = { ...profile.contactDetails, ...contactDetails };
    if (banner) profile.banner = banner;
    if (logo) profile.logo = logo;

    await profile.save();

    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for current seller
// @route   GET /api/v1/seller/products
// @access  Private/Seller
exports.getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders containing current seller's items
// @route   GET /api/v1/seller/orders
// @access  Private/Seller
exports.getSellerOrders = async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ 'items.sellerId': sellerId })
      .populate('buyerId', 'name email phone')
      .sort({ createdAt: -1 });

    // Format orders so seller only sees their items + shipping info
    const formattedOrders = orders.map(order => {
      const myItems = order.items.filter(it => it.sellerId.toString() === sellerId.toString());
      const sellerSubtotal = myItems.reduce((acc, it) => acc + (it.unitPriceSnapshot * it.quantity), 0);
      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        buyer: order.buyerId,
        shippingAddress: order.shippingAddressSnapshot,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        sellerSubtotal,
        items: myItems
      };
    });

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update status of an item within an order
// @route   PATCH /api/v1/seller/orders/:orderId/items/:itemId/status
// @access  Private/Seller
exports.updateOrderItemStatus = async (req, res, next) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;
    const sellerId = req.user._id;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Order item not found' });
    }

    if (item.sellerId.toString() !== sellerId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this item' });
    }

    item.itemStatus = status;

    // Check if all items in order have reached the same status
    const allStatuses = order.items.map(i => i.itemStatus);
    if (allStatuses.every(s => s === 'Delivered')) {
      order.orderStatus = 'Delivered';
    } else if (allStatuses.some(s => s === 'Shipped')) {
      order.orderStatus = 'Shipped';
    } else if (allStatuses.some(s => s === 'Processing')) {
      order.orderStatus = 'Processing';
    } else if (allStatuses.every(s => s === 'Cancelled')) {
      order.orderStatus = 'Cancelled';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Item status updated to ${status}`,
      item,
      orderStatus: order.orderStatus
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed sales analytics for seller
// @route   GET /api/v1/seller/analytics
// @access  Private/Seller
exports.getAnalytics = async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ 'items.sellerId': sellerId }).sort({ createdAt: 1 });

    const productSalesMap = {};
    let totalItemsSold = 0;
    let totalGrossRevenue = 0;

    orders.forEach(order => {
      const sellerItems = order.items.filter(it => it.sellerId.toString() === sellerId.toString());
      sellerItems.forEach(it => {
        if (it.itemStatus !== 'Cancelled') {
          totalItemsSold += it.quantity;
          const revenue = it.unitPriceSnapshot * it.quantity;
          totalGrossRevenue += revenue;

          if (!productSalesMap[it.productNameSnapshot]) {
            productSalesMap[it.productNameSnapshot] = {
              name: it.productNameSnapshot,
              unitsSold: 0,
              revenue: 0,
              image: it.imageSnapshot
            };
          }
          productSalesMap[it.productNameSnapshot].unitsSold += it.quantity;
          productSalesMap[it.productNameSnapshot].revenue += revenue;
        }
      });
    });

    const bestSellers = Object.values(productSalesMap)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    const settings = await PlatformSetting.findOne() || { commissionPercent: 10 };
    const commissionPercent = settings.commissionPercent || 10;
    const totalCommission = Math.round((totalGrossRevenue * commissionPercent) / 100);
    const netEarnings = totalGrossRevenue - totalCommission;

    res.status(200).json({
      success: true,
      analytics: {
        totalItemsSold,
        totalGrossRevenue,
        commissionPercent,
        totalCommission,
        netEarnings,
        bestSellers
      }
    });
  } catch (error) {
    next(error);
  }
};
