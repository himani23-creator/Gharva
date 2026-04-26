const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  otp: { type: String },
  otpExpiresAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
