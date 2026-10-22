const mongoose = require('mongoose');

const PlatformSettingSchema = new mongoose.Schema({
  commissionPercent: {
    type: Number,
    default: 10,
    min: 0,
    max: 100
  },
  marketplaceName: {
    type: String,
    default: 'CraftNest'
  },
  tagline: {
    type: String,
    default: 'Handmade with Heart'
  },
  announcementNotice: {
    type: String,
    default: 'Welcome to CraftNest! Free delivery across India on artisanal orders above ₹999.'
  },
  supportEmail: {
    type: String,
    default: 'support@craftnest.in'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PlatformSetting', PlatformSettingSchema);
