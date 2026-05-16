const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const InventoryItem = require('../models/InventoryItem');
const ActivityLog = require('../models/ActivityLog');

// @route   GET api/inventory
// @desc    Get all inventory items
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const items = await InventoryItem.find().sort({ lastUpdated: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
     res.status(500).json({ message: "Server error" });
  }
});

// @route   GET api/inventory/stats
// @desc    Get inventory stats
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const items = await InventoryItem.find();
    
    let totalItems = 0;
    let totalValue = 0;
    let lowStockCount = 0;

    items.forEach(item => {
      totalItems += item.quantity;
      totalValue += (item.quantity * item.price);
      if (item.quantity < 10 && item.quantity > 0) {
        lowStockCount += 1;
      }
    });

    res.json({ totalItems, totalValue, lowStockCount });
  } catch (err) {
    console.error(err.message);
      res.status(500).json({ message: "Server error" });
  }
});

// @route   POST api/inventory
// @desc    Add new inventory item
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, sku, category, quantity, minQuantity, status, location, price } = req.body;

  try {
    const newItem = new InventoryItem({
      name, sku, category, quantity, minQuantity, status, location, price
    });

    const item = await newItem.save();

    // Create activity log
    await new ActivityLog({
      action: 'ADDED',
      item: item.name,
      details: `Added ${item.quantity} units of ${item.name} (${item.sku}) to ${item.location || 'inventory'}.`,
      user: req.user.id
    }).save();

    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'SKU already exists' });
    }
      res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT api/inventory/:id
// @desc    Update inventory item
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, sku, category, quantity, minQuantity, status, location, price } = req.body;

  // Build item object
  const itemFields = {};
  if (name) itemFields.name = name;
  if (sku) itemFields.sku = sku;
  if (category) itemFields.category = category;
  if (quantity !== undefined) itemFields.quantity = quantity;
  if (minQuantity !== undefined) itemFields.minQuantity = minQuantity;
  if (status) itemFields.status = status;
  if (location) itemFields.location = location;
  if (price !== undefined) itemFields.price = price;
  itemFields.lastUpdated = Date.now();

  try {
    let item = await InventoryItem.findById(req.params.id);

    if (!item) return res.status(404).json({ message: 'Item not found' });

    item = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      { $set: itemFields },
      { new: true }
    );

    // Create activity log
    await new ActivityLog({
      action: 'UPDATED',
      item: item.name,
      details: `Updated details for ${item.name} (${item.sku}).`,
      user: req.user.id
    }).save();

    res.json(item);
  } catch (err) {
    console.error(err.message);
      res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE api/inventory/:id
// @desc    Delete inventory item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let item = await InventoryItem.findById(req.params.id);

    if (!item) return res.status(404).json({ message: 'Item not found' });

    await InventoryItem.findByIdAndDelete(req.params.id);

    // Create activity log
    await new ActivityLog({
      action: 'DELETED',
      item: item.name,
      details: `Removed ${item.name} (${item.sku}) from inventory.`,
      user: req.user.id
    }).save();

    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err.message);
      res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
