const axios = require('axios');
const cheerio = require('cheerio');

const {
  constants: { urlSite },
  mappingData,
  normilizeText,
} = require('../utils');

const findAll = async () => {
  try {
    return await loadData();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const findByDepartment = async department => {
  try {
    const data = await loadData();

    return data.filter(item => {
      return (
        normilizeText(item.department.toLowerCase()) ===
        normilizeText(department.toLowerCase())
      );
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const loadData = async () => {
  const response = await axios.get(urlSite);
  const html = response.data;
  return mappingData(cheerio.load(html));
};

module.exports = {
  findAll,
  findByDepartment,
};
