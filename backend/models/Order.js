const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  img: { type: String }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String },
  customerEmail: { type: String },
  cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cookEmail: { type: String },
  deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  deliveryPartnerName: { type: String, default: null },
  deliveryPartnerEmail: { type: String, default: null },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  kitchenName: { type: String },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered', 'declined'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
