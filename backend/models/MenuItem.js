const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  img: { type: String, default: '' },
  category: { type: String, default: 'Main Course' },
  stock: { type: Number, default: 10 },
  rating: { type: Number, default: () => parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)) },
  cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  kitchenName: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  isVeg: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
