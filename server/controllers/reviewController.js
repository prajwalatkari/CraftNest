const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check review eligibility for a buyer and product
// @route   GET /api/v1/products/:productId/reviews/eligibility
// @access  Private/Buyer
exports.checkReviewEligibility = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const buyerId = req.user._id;

    // 1. Check if user already reviewed
    const existingReview = await Review.findOne({ buyerId, productId });
    if (existingReview) {
      return res.status(200).json({
        success: true,
        eligible: false,
        reason: 'already_reviewed',
        existingReview
      });
    }

    // 2. Check if user purchased the product
    const qualifyingOrder = await Order.findOne({
      buyerId,
      'items.productId': productId
    });

    if (!qualifyingOrder) {
      return res.status(200).json({
        success: true,
        eligible: false,
        reason: 'no_purchase'
      });
    }

    res.status(200).json({
      success: true,
      eligible: true,
      orderId: qualifyingOrder._id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a verified review
// @route   POST /api/v1/products/:productId/reviews
// @access  Private/Buyer
exports.createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const buyerId = req.user._id;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ buyerId, productId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this handcrafted item'
      });
    }

    // Verify purchase
    const qualifyingOrder = await Order.findOne({
      buyerId,
      'items.productId': productId
    });

    if (!qualifyingOrder) {
      return res.status(403).json({
        success: false,
        message: 'Verified Purchase required: Only customers who purchased this item can review it'
      });
    }

    const review = await Review.create({
      buyerId,
      productId,
      orderId: qualifyingOrder._id,
      buyerName: req.user.name,
      rating: ratingNum,
      comment: comment.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Your review has been published.',
      review
    });
  } catch (error) {
    next(error);
  }
};
