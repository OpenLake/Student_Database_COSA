const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.get('/stats',isAuthenticated, dashboardController.getDashboardStats);

module.exports = router;