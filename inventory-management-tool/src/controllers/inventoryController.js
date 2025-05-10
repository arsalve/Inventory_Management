const { Inventory, ItemType } = require('../models/inventoryModel');
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
    const { name, quantity, price, receivePrice, sellPrice, addedDate, itemType } = req.body;

    try {
        // Find or create the item type
        let type = await ItemType.findOne({ type: itemType });
        if (!type) {
            // Create a new item type with the default max quantity
            type = new ItemType({ type: itemType });
            await type.save();
            console.log(`New item type "${itemType}" created with default max quantity.`);
        }

        // Check if an item with the same name and type already exists
        const existingItem = await Inventory.findOne({ name, itemType });

        let totalQuantity = quantity;
        if (existingItem) {
            totalQuantity += existingItem.quantity; // Add existing quantity to the new quantity
        }

        // Validate against the max quantity limit for the item type
        if (totalQuantity > type.maxQuantity) {
            return res.status(400).json({
                message: `Total quantity (${totalQuantity}) exceeds the max limit (${type.maxQuantity}) for item type "${itemType}".`
            });
        }

        // Create or update the inventory item
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = price;
            existingItem.receivePrice = receivePrice;
            existingItem.sellPrice = sellPrice;
            existingItem.addedDate = addedDate;
            await existingItem.save();
            return res.status(200).json(existingItem);
        } else {
            const newItem = new Inventory({ name, quantity, price, receivePrice, sellPrice, addedDate, itemType });
            const savedItem = await newItem.save();
            return res.status(201).json(savedItem);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
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
        item.usageHistory.push({ user: customerExists.name, reason, quantityUsed, customer: customerExists._id });
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
        const items = await Inventory.find({ 'usageHistory.0': { $exists: true } }).populate('usageHistory.customer', 'name');
        const usedItems = items.flatMap(item => item.usageHistory.map(history => ({
            name: item.name,
            quantityUsed: history.quantityUsed,
            usedBy: history.customer.name,
            reason: history.reason,
            date: history.date,
            customerName: history.customer.name
        })));
        res.status(200).json(usedItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin-only route to update max quantity for an item type
exports.updateMaxQuantity = async (req, res) => {
    const { itemType, maxQuantity } = req.body;

    try {
        // Validate input
        if (!itemType || !maxQuantity) {
            return res.status(400).json({ message: 'Item type and max quantity are required.' });
        }

        // Find the item type
        const type = await ItemType.findOne({ type: itemType });
        if (!type) {
            return res.status(404).json({ message: `Item type "${itemType}" not found.` });
        }

        // Update the max quantity
        type.maxQuantity = maxQuantity;
        await type.save();

        res.status(200).json({ message: `Max quantity for "${itemType}" updated to ${maxQuantity}.` });
    } catch (error) {
        console.error('Error updating max quantity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getQuantity = async (req, res) => {
    const { name, itemType } = req.query;

    try {
        // Find or create the item type
        let type = await ItemType.findOne({ type: itemType });
        if (!type) {
            // Create a new item type with the default max quantity
            type = new ItemType({ type: itemType });
            await type.save();
            console.log(`New item type "${itemType}" created with default max quantity.`);
        }

        // Find the inventory item to get the current quantity
        const item = await Inventory.findOne({ name, itemType });
        const currentQuantity = item ? item.quantity : 0;

        res.status(200).json({
            quantity: currentQuantity,
            maxQuantity: type.maxQuantity
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getItemTypes = async (req, res) => {
    try {
        const itemTypes = await ItemType.find({});
        res.status(200).json(itemTypes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};