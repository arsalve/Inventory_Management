const Supplier = require('../models/supplierModel');

/**
 * Gets all suppliers.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Creates a new supplier.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.createSupplier = async (req, res) => {
    const { name, email, phone, address } = req.body;

    try {
        const newSupplier = new Supplier({ name, email, phone, address });
        const savedSupplier = await newSupplier.save();
        res.status(201).json(savedSupplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Deletes a supplier by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.deleteSupplier = async (req, res) => {
    const { id } = req.params;

    try {
        await Supplier.findByIdAndDelete(id);
        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
