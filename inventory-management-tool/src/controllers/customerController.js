const Customer = require('../models/customerModel');

/**
 * Gets all customers.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Creates a new customer.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.createCustomer = async (req, res) => {
    const { name, email, phone } = req.body;

    try {
        const newCustomer = new Customer({ name, email, phone });
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};