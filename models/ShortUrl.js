const mongoose = require('mongoose');

const ShortUrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShortUrl', ShortUrlSchema);
