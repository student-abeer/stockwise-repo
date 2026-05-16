const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  minQuantity: { type: Number, required: true, default: 0 },
  status: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
  location: { type: String, required: false },
  price: { type: Number, required: false, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
