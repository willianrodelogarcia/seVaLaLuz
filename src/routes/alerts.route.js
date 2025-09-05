const express = require('express');
const { alertsController } = require('../controllers');

const router = express.Router();

router.get('/alerts', alertsController.getAllAlerts);
router.get('/alerts/:department', alertsController.getAlertByDepartment);
router.get(
  '/alerts/specific/:department',
  alertsController.getSpecificAlertByDepartment,
);
router.get(
  '/alerts/:department/:city',
  alertsController.getAlertByDepartmentAndCity,
);

module.exports = router;
