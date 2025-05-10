const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { requireRoles } = require('../middleware/authMiddleware');

/**
 * Route to get all suppliers.
 * @name GET /api/suppliers
 * @function
 * @memberof module:routes/supplierRoutes
 * @inner
 * @param {string} path - Express path.
 * @param {function} middleware - Middleware to require admin or staff role.
 * @param {function} handler - Controller function to handle the request.
 */
router.get('/', requireRoles(['admin', 'staff']), supplierController.getAllSuppliers);

/**
 * Route to create a new supplier.
 * @name POST /api/suppliers/create
 * @function
 * @memberof module:routes/supplierRoutes
 * @inner
 * @param {string} path - Express path.
 * @param {function} middleware - Middleware to require admin or staff role.
 * @param {function} handler - Controller function to handle the request.
 */
router.post('/create', requireRoles(['admin', 'staff']), supplierController.createSupplier);

/**
 * Route to delete a supplier by ID.
 * @name DELETE /api/suppliers/:id
 * @function
 * @memberof module:routes/supplierRoutes
 * @inner
 * @param {string} path - Express path.
 * @param {function} middleware - Middleware to require admin or staff role.
 * @param {function} handler - Controller function to handle the request.
 */
router.delete('/:id', requireRoles(['admin', 'staff']), supplierController.deleteSupplier);

module.exports = router;
