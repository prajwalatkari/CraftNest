const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getUsers,
  updateUserStatus,
  getSellers,
  updateSellerApproval,
  getOrders,
  getReports,
  updateSettings
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All admin routes strictly require admin role
router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/sellers', getSellers);
router.patch('/sellers/:id/approval', updateSellerApproval);
router.get('/orders', getOrders);
router.get('/reports', getReports);
router.patch('/settings', updateSettings);

module.exports = router;
