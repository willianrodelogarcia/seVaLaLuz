const dayjs = require('dayjs');

const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

const normilizeText = text => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const format = date => {
  return dayjs.tz(date).format('YYYY-MM-DD');
};

module.exports = { normilizeText, format };
