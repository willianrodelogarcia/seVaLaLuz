const checkSiteRepository = require('../repository/checkSite.repository');

const getAlerts = async () => {
  const data = await checkSiteRepository.findAll();

  return data;
};

module.exports = {
  getAlerts,
};
