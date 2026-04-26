const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const User = require('./models/User');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Safety emergency report
app.post('/api/report-safety', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"CloudKitchen Safety" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `🚨 SAFETY EMERGENCY REPORT from ${name}`,
        html: `<b>Name:</b> ${name}<br><b>Email:</b> ${email}<br><b>Phone:</b> ${phone}<br><br><b>Message:</b><br>${message}`
      });
    } else {
      console.log(`[SAFETY REPORT] From: ${name} (${email})\n${message}`);
    }
    res.json({ message: 'Report received' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error submitting report' });
  }
});

// Update user profile
app.put('/api/user/:id', async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, phone, address }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role, cart: user.cart } });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cloudkitchen')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
