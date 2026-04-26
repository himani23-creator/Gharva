const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

async function sendMail(to, subject, html) {
  if (!to) return;
  const opts = { from: `"CloudKitchen" <${process.env.EMAIL_USER}>`, to, subject, html };
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    await transporter.sendMail(opts);
  } else {
    console.log(`\n[Mock Email] To: ${to} | Subject: ${subject}`);
  }
}

function orderEmailCard(order, extraContent = '') {
  const rows = order.items.map(i =>
    `<tr><td style="padding:6px 0;color:#ccc">${i.name} x${i.qty}</td><td style="padding:6px 0;color:#fff;text-align:right">₹${(i.price * i.qty).toFixed(2)}</td></tr>`
  ).join('');
  return `
    <div style="font-family:sans-serif;max-width:500px;margin:auto;background:#111;color:#fff;border-radius:16px;padding:32px">
      <h2 style="color:#e50914;margin:0 0 4px">CloudKitchen 🍲</h2>
      ${extraContent}
      <div style="background:#1a1a1a;border-radius:12px;padding:16px;margin:20px 0">
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        <hr style="border-color:#333;margin:12px 0">
        <div style="display:flex;justify-content:space-between">
          <span style="color:#aaa">Total</span>
          <span style="color:#e50914;font-weight:bold">₹${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
      <p style="color:#555;font-size:12px;margin:0">Order ID: ${order._id}</p>
    </div>
  `;
}

// POST /api/orders — customer places order
router.post('/', async (req, res) => {
  try {
    const { customerId, cartItems, deliveryAddress } = req.body;

    const customer = await User.findById(customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    // Group items by cook (kitchen)
    const cookGroups = {};
    for (const item of cartItems) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) return res.status(404).json({ message: `Item ${item.name} not found` });
      if (menuItem.stock < item.qty) {
        return res.status(400).json({ message: `Sorry! "${item.name}" only has ${menuItem.stock} left in stock.` });
      }
      const cid = menuItem.cookId.toString();
      if (!cookGroups[cid]) {
        cookGroups[cid] = { cookId: menuItem.cookId, kitchenName: menuItem.kitchenName, items: [] };
      }
      cookGroups[cid].items.push({ menuItemId: item.menuItemId, name: item.name, price: item.price, qty: item.qty, img: item.img });
    }

    const orders = [];
    for (const [cookId, group] of Object.entries(cookGroups)) {
      const cook = await User.findById(cookId);
      const total = group.items.reduce((s, i) => s + i.price * i.qty, 0) + 2.99;

      const order = new Order({
        customerId,
        customerName: customer.name,
        customerEmail: customer.email,
        cookId: group.cookId,
        cookEmail: cook?.email,
        items: group.items,
        totalAmount: total,
        deliveryAddress,
        kitchenName: group.kitchenName
      });
      await order.save();

      // Deduct stock
      for (const item of group.items) {
        await MenuItem.findByIdAndUpdate(item.menuItemId, { $inc: { stock: -item.qty } });
      }

      // Email cook about new order
      if (cook) {
        await sendMail(
          cook.email,
          `🍽️ New Order from ${customer.name}!`,
          orderEmailCard(order, `
            <p style="color:#aaa;margin:8px 0 0">You have a new order from <b style="color:#fff">${customer.name}</b>!</p>
            <p style="color:#aaa;font-size:13px">Deliver to: ${deliveryAddress}</p>
          `)
        );
      }

      // Clear customer cart
      await User.findByIdAndUpdate(customerId, { cart: [] });

      orders.push(order);
    }

    res.status(201).json({ message: 'Order placed successfully!', orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error placing order' });
  }
});

// GET /api/orders/my/:customerId
router.get('/my/:customerId', async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.customerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// GET /api/orders/incoming/:cookId — cook sees orders for their kitchen
router.get('/incoming/:cookId', async (req, res) => {
  try {
    const orders = await Order.find({ cookId: req.params.cookId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching incoming orders' });
  }
});

// GET /api/orders/available-deliveries — delivery partners see ready orders
router.get('/available-deliveries', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'ready', deliveryPartnerId: null }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching deliveries' });
  }
});

// GET /api/orders/my-deliveries/:partnerId
router.get('/my-deliveries/:partnerId', async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPartnerId: req.params.partnerId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your deliveries' });
  }
});

// PUT /api/orders/:id/accept — cook accepts order
router.put('/:id/accept', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
    await sendMail(
      order.customerEmail,
      '✅ Your order has been accepted!',
      orderEmailCard(order, `<p style="color:#4ade80;font-size:16px;margin:8px 0">Your order from <b>${order.kitchenName}</b> has been accepted and is being prepared! 🍳</p>`)
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error accepting order' });
  }
});

// PUT /api/orders/:id/preparing — cook marks as preparing
router.put('/:id/preparing', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'preparing' }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order' });
  }
});

// PUT /api/orders/:id/ready — cook marks as ready, emails all delivery partners
router.put('/:id/ready', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'ready' }, { new: true });

    // Fetch all delivery partners
    const partners = await User.find({ role: 'delivery' });

    if (partners.length === 0) {
      console.log('[No delivery partners registered yet]');
    }

    for (const partner of partners) {
      await sendMail(
        partner.email,
        '🛵 New Delivery Available — Accept Fast!',
        `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#111;color:#fff;border-radius:16px;padding:32px">
            <h2 style="color:#e50914;margin:0 0 8px">CloudKitchen 🍲</h2>
            <p style="color:#4ade80;font-size:18px;font-weight:bold;margin:0 0 8px">New Delivery Available!</p>
            <p style="color:#aaa">From: <b style="color:#fff">${order.kitchenName}</b></p>
            <p style="color:#aaa">To: <b style="color:#fff">${order.deliveryAddress}</b></p>
            <p style="color:#aaa">Amount: <b style="color:#e50914">₹${order.totalAmount.toFixed(2)}</b></p>
            <p style="color:#aaa;font-size:13px">First to accept gets this order. Open your delivery dashboard now!</p>
            <p style="color:#555;font-size:12px;margin-top:16px">Order ID: ${order._id}</p>
          </div>
        `
      );
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error marking ready' });
  }
});

// PUT /api/orders/:id/decline — cook declines order
router.put('/:id/decline', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'declined' }, { new: true });

    // Restore stock
    for (const item of order.items) {
      await MenuItem.findByIdAndUpdate(item.menuItemId, { $inc: { stock: item.qty } });
    }

    await sendMail(
      order.customerEmail,
      '❌ Your order was declined',
      orderEmailCard(order, `<p style="color:#f87171;font-size:16px;margin:8px 0">Unfortunately, <b>${order.kitchenName}</b> is unable to fulfil your order right now. Please try ordering from another kitchen.</p>`)
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error declining order' });
  }
});

// PUT /api/orders/:id/accept-delivery — first delivery partner wins
router.put('/:id/accept-delivery', async (req, res) => {
  try {
    const { partnerId } = req.body;
    const partner = await User.findById(partnerId);
    if (!partner) return res.status(404).json({ message: 'Partner not found' });

    // Atomic check: only assign if still unassigned
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, status: 'ready', deliveryPartnerId: null },
      {
        deliveryPartnerId: partner._id,
        deliveryPartnerName: partner.name,
        deliveryPartnerEmail: partner.email,
        status: 'picked_up'
      },
      { new: true }
    );

    if (!order) {
      return res.status(409).json({ message: 'This delivery was already taken by someone else!' });
    }

    await sendMail(
      order.customerEmail,
      '🛵 Your order is on the way!',
      orderEmailCard(order, `
        <p style="color:#60a5fa;font-size:16px;margin:8px 0">Your order is on the way! 🛵</p>
        <p style="color:#aaa">Your delivery partner is <b style="color:#fff">${partner.name}</b>.</p>
      `)
    );

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error accepting delivery' });
  }
});

// PUT /api/orders/:id/delivered — partner marks as delivered
router.put('/:id/delivered', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'delivered' }, { new: true });

    await sendMail(
      order.customerEmail,
      '🎉 Order Delivered! Enjoy your meal!',
      orderEmailCard(order, `<p style="color:#4ade80;font-size:18px;font-weight:bold;margin:8px 0">Your order has been delivered! Enjoy your meal 🎉</p>`)
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error marking delivered' });
  }
});

module.exports = router;
