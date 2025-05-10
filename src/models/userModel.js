const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * @typedef {Object} User
 * @property {string} username - The username of the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The hashed password of the user.
 * @property {string} role - The role of the user (admin, staff, customer).
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'staff', 'customer'],
        required: true
    }
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

/**
 * User Model
 * @type {mongoose.Model<User>}
 */
const User = mongoose.model('User', userSchema);

module.exports = User;