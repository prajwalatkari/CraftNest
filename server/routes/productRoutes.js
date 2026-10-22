const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const {
  getProductReviews,
  createReview,
  checkReviewEligibility
} = require('../controllers/reviewController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public product routes
router.get('/', optionalAuth, getProducts);
router.get('/:id', optionalAuth, getProductById);

// Seller / Admin product management
router.post('/', authenticate, authorize('seller', 'admin'), upload.array('images', 5), createProduct);
router.patch('/:id', authenticate, authorize('seller', 'admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', authenticate, authorize('seller', 'admin'), deleteProduct);

// Reviews nested under products
router.get('/:productId/reviews', getProductReviews);
router.get('/:productId/reviews/eligibility', authenticate, checkReviewEligibility);
router.post('/:productId/reviews', authenticate, createReview);

module.exports = router;
