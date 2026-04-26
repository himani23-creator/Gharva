const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendMail(to, subject, html) {
  const mailOptions = {
    from: `"CloudKitchen" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    await transporter.sendMail(mailOptions);
  } else {
    console.log(`\n[Mock Email] To: ${to}\nSubject: ${subject}\n`);
  }
}

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { name, email, phone, address, role, kitchenName } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60000);

    let user = await User.findOne({ email });
    if (user) {
      // Update details if provided
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (address) user.address = address;
      if (kitchenName) user.kitchenName = kitchenName;
      // Only update role if explicitly provided (don't downgrade existing roles)
      if (role && user.role === 'customer') user.role = role;
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
    } else {
      user = new User({
        name,
        email,
        phone,
        address,
        kitchenName,
        role: role || 'customer',
        otp,
        otpExpiresAt
      });
    }

    await user.save();

    const roleLabel = {
      customer: 'Customer',
      cook: 'Home Cook',
      delivery: 'Delivery Partner',
      admin: 'Admin'
    }[user.role] || 'Customer';

    await sendMail(
      email,
      'Your CloudKitchen Login OTP',
      `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#111;color:#fff;border-radius:16px;padding:32px">
          <h2 style="color:#e50914;margin:0 0 8px">CloudKitchen 🍲</h2>
          <p style="color:#aaa;margin:0 0 24px">Welcome, ${name || user.name}! You are signing in as <b>${roleLabel}</b>.</p>
          <div style="background:#222;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
            <p style="color:#aaa;font-size:13px;margin:0 0 8px">Your one-time password</p>
            <h1 style="font-size:48px;letter-spacing:12px;color:#e50914;margin:0">${otp}</h1>
            <p style="color:#555;font-size:12px;margin:8px 0 0">Valid for 10 minutes</p>
          </div>
          <p style="color:#555;font-size:12px">If you didn't request this, please ignore this email.</p>
        </div>
      `
    );

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpiresAt < new Date()) return res.status(400).json({ message: 'OTP has expired' });

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        kitchenName: user.kitchenName,
        cart: user.cart
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

module.exports = router;
