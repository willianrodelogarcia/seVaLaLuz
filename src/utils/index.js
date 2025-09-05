const constants = require('./constants');
const { normilizeText, format } = require('./normilizeText');
const { mappingData, filterDates } = require('./mapping');
const { readPdf, getTextDesc } = require('./readText');

module.exports = {
  constants,
  normilizeText,
  format,
  mappingData,
  filterDates,
  readPdf,
  getTextDesc,
};
