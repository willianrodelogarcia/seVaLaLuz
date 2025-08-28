const alertServices = require('../services/alerts.services');

const getAllAlerts = async (req, res) => {
  const data = await alertServices.getAlerts();
  res.status(200).json(data);
};

module.exports = {
  getAllAlerts,
};
