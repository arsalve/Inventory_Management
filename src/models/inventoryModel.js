const mongoose = require('mongoose');

// Schema for item types with max quantity
const itemTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true
    },
    maxQuantity: {
        type: Number,
        required: true,
        default: 100 // Default max quantity
    }
});

const ItemType = mongoose.model('ItemType', itemTypeSchema);

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
    addedDate: {
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

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = { Inventory, ItemType };