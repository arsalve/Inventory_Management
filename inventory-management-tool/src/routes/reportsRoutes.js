const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { requireRoles } = require('../middleware/authMiddleware');

router.get('/', requireRoles(['admin', 'staff']), reportsController.getReports);

module.exports = router;
