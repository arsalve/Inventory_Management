const Inventory = require('../models/inventoryModel');
const Customer = require('../models/customerModel');

/**
 * Get all inventory items.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getAllItems = async (req, res) => {
    try {
        const items = await Inventory.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Create a new inventory item or update the quantity if the item already exists.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.createItem = async (req, res) => {
    const { name, quantity, price, receivePrice, sellPrice, expiryDate, itemType } = req.body;

    try {
        let item = await Inventory.findOne({ name });
        if (item) {
            item.quantity += quantity;
            item.price = price;
            item.receivePrice = receivePrice;
            item.sellPrice = sellPrice;
            item.expiryDate = expiryDate;
            item.itemType = itemType;
        } else {
            item = new Inventory({ name, quantity, price, receivePrice, sellPrice, expiryDate, itemType });
        }
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Use an inventory item by reducing its quantity.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.useItem = async (req, res) => {
    const { id } = req.params;
    const { quantityUsed, usedBy, reason, customer } = req.body;

    try {
        const item = await Inventory.findById(id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        const customerExists = await Customer.findById(customer);
        if (!customerExists) return res.status(404).json({ message: 'Customer not found' });

        item.quantity -= quantityUsed;
        item.usageHistory.push({ user: usedBy, reason, quantityUsed, customer });
        await item.save();
        res.status(200).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Remove a specified quantity of an inventory item. If the quantity becomes zero or less, delete the item.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.removeItem = async (req, res) => {
    const { id } = req.params;
    const { quantityRemoved } = req.body;

    try {
        const item = await Inventory.findById(id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        item.quantity -= quantityRemoved;
        if (item.quantity <= 0) {
            await Inventory.findByIdAndDelete(id);
            res.status(200).json({ message: 'Item removed' });
        } else {
            await item.save();
            res.status(200).json(item);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Get all used inventory items.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getUsedItems = async (req, res) => {
    try {
        const items = await Inventory.find({ 'usageHistory.0': { $exists: true } });
        const usedItems = items.flatMap(item => item.usageHistory.map(history => ({
            name: item.name,
            quantityUsed: history.quantityUsed,
            usedBy: history.user,
            reason: history.reason,
            date: history.date
        })));
        res.status(200).json(usedItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};