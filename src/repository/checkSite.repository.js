const axios = require('axios');
const cheerio = require('cheerio');
const { mappingData } = require('../utils/mapping');
const { urlSite } = require('../utils/contants');

const findAll = async () => {
  try {
    return await loadData();
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
};
