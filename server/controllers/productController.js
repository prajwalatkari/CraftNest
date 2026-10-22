const Product = require('../models/Product');
const SellerProfile = require('../models/SellerProfile');
const Review = require('../models/Review');

const CATEGORIES = [
  'Handmade Candles',
  'Jewellery',
  'Crochet and Knitting',
  'Home Décor',
  'Paintings and Art',
  'Greeting Cards',
  'Gift Hampers',
  'Personalized Gifts',
  'Other Crafts'
];

// @desc    Get all products with search, category, price filter, sorting & pagination
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 12,
      featured
    } = req.query;

    const query = { status: 'active' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') query.price.$lte = Number(maxPrice);
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { materials: searchRegex }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'popular') sortOption = { salesCount: -1, averageRating: -1 };
    else if (sort === 'rating') sortOption = { averageRating: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate('sellerId', 'name email')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query)
    ]);

    // Attach seller shop details
    const sellerIds = [...new Set(products.map(p => p.sellerId?._id?.toString()).filter(Boolean))];
    const sellerProfiles = await SellerProfile.find({ userId: { $in: sellerIds } });
    const profileMap = new Map();
    sellerProfiles.forEach(sp => profileMap.set(sp.userId.toString(), sp));

    const enrichedProducts = products.map(product => {
      const pObj = product.toObject();
      if (pObj.sellerId && pObj.sellerId._id) {
        pObj.shop = profileMap.get(pObj.sellerId._id.toString()) || null;
      }
      return pObj;
    });

    res.status(200).json({
      success: true,
      count: products.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      products: enrichedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by id or slug with reviews and related items
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).populate('sellerId', 'name email');
    } else {
      product = await Product.findOne({ slug: id }).populate('sellerId', 'name email');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch seller shop profile
    let shop = null;
    if (product.sellerId) {
      shop = await SellerProfile.findOne({ userId: product.sellerId._id });
    }

    // Fetch verified reviews
    const reviews = await Review.find({ productId: product._id }).sort({ createdAt: -1 }).limit(10);

    // Fetch related products from same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active'
    }).limit(4);

    const productData = product.toObject();
    productData.shop = shop;
    productData.reviews = reviews;
    productData.relatedProducts = relatedProducts;

    res.status(200).json({
      success: true,
      product: productData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Seller only)
// @route   POST /api/v1/products
// @access  Private/Seller
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      price,
      stock,
      materials,
      dimensions,
      customizationAvailable,
      customizationNotes,
      processingTime,
      images,
      status = 'active'
    } = req.body;

    if (!name || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product name, description, category, and price'
      });
    }

    let productImages = [];
    if (req.files && req.files.length > 0) {
      productImages = req.files.map(file => `/uploads/${file.filename}`);
    } else if (images) {
      productImages = Array.isArray(images) ? images : [images];
    }

    if (productImages.length === 0) {
      // Default artisan placeholder
      productImages = ['https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'];
    }

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;

    const product = await Product.create({
      sellerId: req.user._id,
      name: name.trim(),
      slug,
      description,
      category,
      price: Number(price),
      stock: Number(stock || 1),
      images: productImages,
      materials: materials || 'Handmade eco-friendly materials',
      dimensions: dimensions || 'Standard handmade dimensions',
      customizationAvailable: Boolean(customizationAvailable),
      customizationNotes: customizationNotes || '',
      processingTime: processingTime || '2-4 business days',
      status
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Seller or Admin)
// @route   PATCH /api/v1/products/:id
// @access  Private/Seller/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Verify ownership or admin
    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this product' });
    }

    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = newImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Seller or Admin)
// @route   DELETE /api/v1/products/:id
// @access  Private/Seller/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories with counts
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const counts = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach(item => {
      countMap[item._id] = item.count;
    });

    const categoriesWithCount = CATEGORIES.map(cat => ({
      name: cat,
      count: countMap[cat] || 0
    }));

    res.status(200).json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};
