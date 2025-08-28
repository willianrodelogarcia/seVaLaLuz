const express = require('express');
const { alertsController } = require('../controllers');

const router = express.Router();

router.get('/alerts', alertsController.getAllAlerts);

module.exports = router;
