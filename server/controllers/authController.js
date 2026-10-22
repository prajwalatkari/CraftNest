const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'craftnest_super_secret_jwt_key_handmade_with_heart_2026', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register a user (Buyer or Seller)
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'buyer', phone, shopName, shopDescription } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Role safety: public register cannot register 'admin'
    const allowedRole = role === 'seller' ? 'seller' : 'buyer';

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: allowedRole,
      phone: phone || ''
    });

    let sellerProfile = null;
    if (allowedRole === 'seller') {
      const baseSlug = (shopName || `${name}'s Craft Studio`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      sellerProfile = await SellerProfile.create({
        userId: user._id,
        shopName: shopName || `${name}'s Craft Studio`,
        slug: uniqueSlug,
        description: shopDescription || 'Welcome to our handmade artisanal shop on CraftNest.',
        contactDetails: {
          email: user.email,
          phone: phone || ''
        },
        approvalStatus: 'approved'
      });
    }

    // Create Cart and Wishlist
    await Cart.create({ buyerId: user._id, items: [] });
    await Wishlist.create({ buyerId: user._id, products: [] });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        sellerProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.accountStatus === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account is suspended. Please contact support.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    let sellerProfile = null;
    if (user.role === 'seller') {
      sellerProfile = await SellerProfile.findOne({ userId: user._id });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses,
        sellerProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let sellerProfile = null;
    if (user.role === 'seller') {
      sellerProfile = await SellerProfile.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses,
        accountStatus: user.accountStatus,
        sellerProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & addresses
// @route   PATCH /api/v1/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (addresses) user.addresses = addresses;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout
// @route   POST /api/v1/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};
