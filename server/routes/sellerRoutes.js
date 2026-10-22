const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getProfile,
  updateProfile,
  getSellerProducts,
  getSellerOrders,
  updateOrderItemStatus,
  getAnalytics
} = require('../controllers/sellerController');
const { authenticate, authorize } = require('../middleware/auth');

// All seller routes require authentication and seller role
router.use(authenticate, authorize('seller', 'admin'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.get('/products', getSellerProducts);
router.get('/orders', getSellerOrders);
router.patch('/orders/:orderId/items/:itemId/status', updateOrderItemStatus);
router.get('/analytics', getAnalytics);

module.exports = router;
