const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 4000
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Handmade Candles',
      'Jewellery',
      'Crochet and Knitting',
      'Home Décor',
      'Paintings and Art',
      'Greeting Cards',
      'Gift Hampers',
      'Personalized Gifts',
      'Other Crafts'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1, 'Price must be at least ₹1']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 1
  },
  images: [{
    type: String,
    required: true
  }],
  materials: {
    type: String,
    default: 'Handmade eco-friendly materials'
  },
  dimensions: {
    type: String,
    default: 'Standard handmade dimensions'
  },
  customizationAvailable: {
    type: Boolean,
    default: false
  },
  customizationNotes: {
    type: String,
    default: ''
  },
  processingTime: {
    type: String,
    default: '2-4 business days'
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'inactive'],
    default: 'active'
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, status: 1, price: 1 });
ProductSchema.index({ sellerId: 1 });
ProductSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', ProductSchema);
