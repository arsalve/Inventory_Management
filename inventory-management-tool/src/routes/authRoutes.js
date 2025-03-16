const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers } = require('../controllers/authController');
const { expressjwt: jwt } = require('express-jwt');

/**
 * Route to register a new user.
 * @name POST /api/auth/register
 * @function
 * @memberof module:routes/authRoutes
 * @inner
 * @param {string} path - Express path.
 * @param {function} middleware - JWT middleware to verify token.
 * @param {function} handler - Controller function to handle the request.
 */
router.post('/register', jwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256'], requestProperty: 'auth' }), registerUser);

/**
 * Route to login a user.
 * @name POST /api/auth/login
 * @function
 * @memberof module:routes/authRoutes
 * @inner
 * @param {string} path - Express path.
 * @param {function} handler - Controller function to handle the request.
 */
router.post('/login', loginUser);

/**
 * Route to get all users.
 * @name GET /api/auth/users
 * @function
 * @memberof module:routes/authRoutes
 * @inner
 * @param {string} path - Express path.
 * @param {function} middleware - JWT middleware to verify token.
 * @param {function} handler - Controller function to handle the request.
 */
router.get('/users', jwt({ secret: process.env.SECRET_KEY, algorithms: ['HS256'], requestProperty: 'auth' }), getUsers);

module.exports = router;