const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/v1/wishlist
// @access  Private/Buyer
exports.getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ buyerId: req.user._id }).populate({
      path: 'products',
      select: 'name price stock images category status slug averageRating reviewCount'
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ buyerId: req.user._id, products: [] });
    }

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      products: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist/:productId
// @access  Private/Buyer
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ buyerId: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ buyerId: req.user._id, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Private/Buyer
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ buyerId: req.user._id });

    if (wishlist) {
      wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product in wishlist
// @route   POST /api/v1/wishlist/:productId/toggle
// @access  Private/Buyer
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ buyerId: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ buyerId: req.user._id, products: [] });
    }

    const index = wishlist.products.findIndex(id => id.toString() === productId);
    let added = false;

    if (index > -1) {
      wishlist.products.splice(index, 1);
      added = false;
    } else {
      wishlist.products.push(productId);
      added = true;
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      added,
      message: added ? 'Added to your favorites' : 'Removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};
