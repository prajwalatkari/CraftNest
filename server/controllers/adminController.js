const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const PlatformSetting = require('../models/PlatformSetting');

// Helper to get platform settings
const getSettings = async () => {
  let settings = await PlatformSetting.findOne();
  if (!settings) {
    settings = await PlatformSetting.create({
      commissionPercent: 10,
      marketplaceName: 'CraftNest',
      tagline: 'Handmade with Heart'
    });
  }
  return settings;
};

// @desc    Admin overview dashboard metrics
// @route   GET /api/v1/admin/dashboard
// @access  Private/Admin
exports.getDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalSellers,
      pendingSellersCount,
      totalProducts,
      orders
    ] = await Promise.all([
      User.countDocuments(),
      SellerProfile.countDocuments(),
      SellerProfile.countDocuments({ approvalStatus: 'pending' }),
      Product.countDocuments(),
      Order.find()
    ]);

    let totalPlatformRevenue = 0;
    let totalCommissionEarned = 0;
    let completedOrdersCount = 0;
    let pendingOrdersCount = 0;

    orders.forEach(order => {
      if (order.orderStatus !== 'Cancelled') {
        totalPlatformRevenue += order.total;
        totalCommissionEarned += order.commissionAmount || Math.round(order.subtotal * 0.1);
      }
      if (order.orderStatus === 'Delivered') completedOrdersCount++;
      if (['Pending', 'Confirmed', 'Processing'].includes(order.orderStatus)) pendingOrdersCount++;
    });

    const settings = await getSettings();

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('buyerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSellers,
        pendingSellersCount,
        totalProducts,
        totalOrders: orders.length,
        completedOrdersCount,
        pendingOrdersCount,
        totalPlatformRevenue,
        totalCommissionEarned,
        commissionPercent: settings.commissionPercent
      },
      recentOrders,
      recentUsers,
      settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search, pagination, and filter
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status) query.accountStatus = status;
    if (search) {
      query.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { email: new RegExp(search.trim(), 'i') }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [users, totalCount] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user account status (active/suspended) or role
// @route   PATCH /api/v1/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (status && ['active', 'suspended'].includes(status)) {
      user.accountStatus = status;
    }

    if (role && ['buyer', 'seller', 'admin'].includes(role)) {
      user.role = role;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sellers for admin review
// @route   GET /api/v1/admin/sellers
// @access  Private/Admin
exports.getSellers = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.approvalStatus = status;

    const sellers = await SellerProfile.find(query)
      .populate('userId', 'name email phone accountStatus createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sellers.length,
      sellers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or suspend seller account
// @route   PATCH /api/v1/admin/sellers/:id/approval
// @access  Private/Admin
exports.updateSellerApproval = async (req, res, next) => {
  try {
    const { approvalStatus } = req.body;
    const valid = ['pending', 'approved', 'rejected', 'suspended'];

    if (!valid.includes(approvalStatus)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${valid.join(', ')}` });
    }

    const seller = await SellerProfile.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller profile not found' });
    }

    seller.approvalStatus = approvalStatus;
    await seller.save();

    res.status(200).json({
      success: true,
      message: `Seller status updated to ${approvalStatus}`,
      seller
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders across marketplace
// @route   GET /api/v1/admin/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.orderStatus = status;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [orders, totalCount] = await Promise.all([
      Order.find(query)
        .populate('buyerId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get revenue & commission reports
// @route   GET /api/v1/admin/reports
// @access  Private/Admin
exports.getReports = async (req, res, next) => {
  try {
    const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } }).sort({ createdAt: 1 });

    const monthlyData = {};
    let grandGrossTotal = 0;
    let grandCommission = 0;
    let grandSellerPayouts = 0;

    orders.forEach(order => {
      const monthYear = new Date(order.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { month: monthYear, ordersCount: 0, revenue: 0, commission: 0 };
      }
      monthlyData[monthYear].ordersCount += 1;
      monthlyData[monthYear].revenue += order.total;
      monthlyData[monthYear].commission += order.commissionAmount || Math.round(order.subtotal * 0.1);

      grandGrossTotal += order.total;
      grandCommission += order.commissionAmount || Math.round(order.subtotal * 0.1);
      grandSellerPayouts += order.sellerEarnings || Math.round(order.subtotal * 0.9);
    });

    res.status(200).json({
      success: true,
      summary: {
        grandGrossTotal,
        grandCommission,
        grandSellerPayouts,
        totalEligibleOrders: orders.length
      },
      monthlyTrends: Object.values(monthlyData)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update platform commission and settings
// @route   PATCH /api/v1/admin/settings
// @access  Private/Admin
exports.updateSettings = async (req, res, next) => {
  try {
    const { commissionPercent, announcementNotice } = req.body;
    const settings = await getSettings();

    if (commissionPercent !== undefined) {
      settings.commissionPercent = Math.min(100, Math.max(0, Number(commissionPercent)));
    }
    if (announcementNotice !== undefined) {
      settings.announcementNotice = announcementNotice;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Platform settings updated',
      settings
    });
  } catch (error) {
    next(error);
  }
};
