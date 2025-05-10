const mongoose = require('mongoose');

/**
 * Supplier Schema
 * @typedef {Object} Supplier
 * @property {string} name - The name of the supplier.
 * @property {string} email - The email of the supplier.
 * @property {string} phone - The phone number of the supplier.
 * @property {string} address - The address of the supplier.
 */
const supplierSchema = new mongoose.Schema({
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
    },
    address: {
        type: String,
        required: true
    }
});

/**
 * Supplier Model
 * @type {mongoose.Model<Supplier>}
 */
const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
