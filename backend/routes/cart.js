const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/cart/:userId — fetch cart on login
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

// POST /api/cart/sync — save entire cart to DB
router.post('/sync', async (req, res) => {
  try {
    const { userId, cart } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { cart },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Cart saved', cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving cart' });
  }
});

module.exports = router;
