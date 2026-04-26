const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// GET /api/menu — all available items, optional ?isVeg=true|false filter
router.get('/', async (req, res) => {
  try {
    const filter = { isAvailable: true };
    if (req.query.isVeg === 'true') filter.isVeg = true;
    if (req.query.isVeg === 'false') filter.isVeg = false;
    const items = await MenuItem.find(filter).populate('cookId', 'name');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching menu' });
  }
});

// GET /api/menu/kitchens — unique kitchen names for spotlight
router.get('/kitchens', async (req, res) => {
  try {
    const kitchens = await MenuItem.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: '$kitchenName', cookId: { $first: '$cookId' }, img: { $first: '$img' }, itemCount: { $sum: 1 } } },
      { $project: { kitchenName: '$_id', cookId: 1, img: 1, itemCount: 1, _id: 0 } }
    ]);
    res.json(kitchens);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching kitchens' });
  }
});

// GET /api/menu/my/:cookId — cook's own items
router.get('/my/:cookId', async (req, res) => {
  try {
    const items = await MenuItem.find({ cookId: req.params.cookId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your menu' });
  }
});

// POST /api/menu — cook adds a new item
router.post('/', async (req, res) => {
  try {
    const { cookId, name, description, price, img, category, stock, kitchenName, isVeg } = req.body;

    // Verify user is a cook
    const user = await User.findById(cookId);
    if (!user || user.role !== 'cook') {
      return res.status(403).json({ message: 'Only cooks can add menu items' });
    }

    const item = new MenuItem({ cookId, name, description, price, img, category, stock, kitchenName, isVeg: isVeg !== undefined ? isVeg : true });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding menu item' });
  }
});

// PUT /api/menu/:id — cook edits item
router.put('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error updating item' });
  }
});

// DELETE /api/menu/:id — cook removes item
router.delete('/:id', async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item' });
  }
});

module.exports = router;
