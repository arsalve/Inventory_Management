const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { requireRoles } = require('../middleware/authMiddleware');

/**
 * Route to get all inventory items.
 * @name get/
 * @function
 * @memberof module:routes/inventoryRoutes
 * @inner
 * @param {string} path - Express path.
 * @param {function} middleware - Express middleware.
 */
router.get('/', requireRoles(['admin', 'staff']), inventoryController.getAllItems);

/**
 * Route to create a new inventory item or update the quantity if the item already exists.
 * @name post/create
 * @function
 * @memberof module:routes/inventoryRoutes
 * @inner
 * @param {string} path - Express path.
 * @param {function} middleware - Express middleware.
 */
router.post('/create', requireRoles(['admin', 'staff']), inventoryController.createItem);

/**
 * Route to use an inventory item by reducing its quantity.
 * @name put/use/:id
 * @function
 * @memberof module:routes/inventoryRoutes
 * @inner
 * @param {string} path - Express path.
 * @param {function} middleware - Express middleware.
 */
router.put('/use/:id', requireRoles(['admin', 'staff']), inventoryController.useItem);

/**
 * Route to remove a specific quantity of an inventory item by ID.
 * @name put/remove/:id
 * @function
 * @memberof module:routes/inventoryRoutes
 * @inner
 * @param {string} path - Express path.
 * @param {function} middleware - Express middleware.
 */
router.put('/remove/:id', requireRoles(['admin', 'staff']), inventoryController.removeItem);

/**
 * Route to get all used inventory items.
 * @name get/used
 * @function
 * @memberof module:routes/inventoryRoutes
 * @inner
 * @param {string} path - Express path.
 * @param {function} middleware - Express middleware.
 */
router.get('/used', requireRoles(['admin', 'staff', 'customer']), inventoryController.getUsedItems);

module.exports = router;