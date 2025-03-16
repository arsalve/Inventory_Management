const mongoose = require('mongoose');

/**
 * Customer Schema
 * @typedef {Object} Customer
 * @property {string} name - The name of the customer.
 * @property {string} email - The email of the customer.
 * @property {string} phone - The phone number of the customer.
 */
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    }
});

/**
 * Customer Model
 * @type {mongoose.Model<Customer>}
 */
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;