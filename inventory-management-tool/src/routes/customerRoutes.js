const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { requireRoles } = require('../middleware/authMiddleware');

/**
 * Route to get all customers.
 * @name GET /api/customers
 * @function
 * @memberof module:routes/customerRoutes
 * @inner
 * @param {string} path - Express path.
 * @param {function} middleware - Middleware to require admin or staff role.
 * @param {function} handler - Controller function to handle the request.
 */
router.get('/', requireRoles(['admin', 'staff']), customerController.getAllCustomers);

/**
 * Route to create a new customer.
 * @name POST /api/customers/create
 * @function
 * @memberof module:routes/customerRoutes
 * @inner
 * @param {string} path - Express path.
 * @param {function} middleware - Middleware to require admin or staff role.
 * @param {function} handler - Controller function to handle the request.
 */
router.post('/create', requireRoles(['admin', 'staff']), customerController.createCustomer);

/**
 * Route to delete a customer by ID.
 * @name DELETE /api/customers/:id
 * @function
 * @memberof module:routes/customerRoutes
 * @inner
 * @param {string} path - Express path.
 * @param {function} middleware - Middleware to require admin or staff role.
 * @param {function} handler - Controller function to handle the request.
 */
router.delete('/:id', requireRoles(['admin', 'staff']), customerController.deleteCustomer);

module.exports = router;