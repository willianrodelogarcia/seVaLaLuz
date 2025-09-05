const alertServices = require('../services/alerts.services');

const getAllAlerts = async (req, res) => {
  const data = await alertServices.getAlerts();
  res.status(200).json(data);
};

const getAlertByDepartment = async (req, res) => {
  const { department } = req.params;
  const data = await alertServices.getAlertByDepartment(department);
  res.status(200).json(data);
};

const getSpecificAlertByDepartment = async (req, res) => {
  const { department } = req.params;
  const data = await alertServices.getSpecificAlertByDepartment(department);
  res.status(200).json(data);
};

const getAlertByDepartmentAndCity = async (req, res) => {
  const { department, city } = req.params;
  const data = await alertServices.getAlertByDepartmentAndCity(
    department,
    city,
  );
  res.status(200).json(data);
};

module.exports = {
  getAllAlerts,
  getAlertByDepartment,
  getSpecificAlertByDepartment,
  getAlertByDepartmentAndCity,
};
