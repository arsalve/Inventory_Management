const mongoose = require('mongoose');

/**
 * Inventory Schema
 * @typedef {Object} Inventory
 * @property {string} name - The name of the inventory item.
 * @property {number} quantity - The quantity of the inventory item.
 * @property {number} price - The price of the inventory item.
 * @property {number} receivePrice - The price at which the inventory item was received.
 * @property {number} sellPrice - The price at which the inventory item is sold.
 * @property {Date} expiryDate - The expiry date of the inventory item.
 * @property {string} itemType - The type/category of the inventory item.
 * @property {Array<Object>} usageHistory - The history of item usage.
 */
const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    receivePrice: {
        type: Number,
        required: true,
        min: 0
    },
    sellPrice: {
        type: Number,
        required: true,
        min: 0
    },
    expiryDate: {
        type: Date,
        required: true
    },
    itemType: {
        type: String,
        required: true
    },
    usageHistory: [
        {
            user: {
                type: String,
                required: true
            },
            reason: {
                type: String,
                required: true
            },
            quantityUsed: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
            customer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Customer',
                required: true
            }
        }
    ]
});

/**
 * Inventory Model
 * @type {mongoose.Model<Inventory>}
 */
const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;