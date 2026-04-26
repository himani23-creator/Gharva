const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String },
  qty: { type: Number, default: 1 },
  kitchenName: { type: String }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  kitchenName: { type: String },
  role: {
    type: String,
    enum: ['customer', 'cook', 'delivery', 'admin'],
    default: 'customer'
  },
  cart: [cartItemSchema],
  otp: { type: String },
  otpExpiresAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
