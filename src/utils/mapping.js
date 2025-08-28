const dayjs = require('dayjs');

const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

const ZONA_CO = 'America/Bogota';

const { MOUTHS } = require('../utils/contants');

const mappingData = html => {
  const rows = [];
  const mouths = [];
  const dates = [];

  html(
    '#dnn_ctr1093_ViewEasyDNNNewsMain_ctl00_pnlListArticles > div > div > div > div',
  ).each((index, el) => {
    const city = html(el)
      .find(`div > div > p.mantenimientos__title`)
      .text()
      .trim();

    html(el)
      .find('#accordionExample')
      .each((i, e) => {
        const mouth = html(e).find('div > h2 > button').text().trim();

        const idMouth = html(e).find('div > div > div').attr('id');

        html(e)
          .find(`#${idMouth} > div > ul > li`)
          .each((j, li) => {
            const date = dateFormatter(html(li).text().trim());
            const url_pdf = html(li).find('a').attr('href');
            dates.push({ date, url_pdf });
          });
        mouths.push({ mouth, info: [...dates] });
      });

    rows.push({ city, mouths: [...mouths] });
    mouths.length = 0;
    dates.length = 0;
  });

  return rows;
};

const dateFormatter = dateStr => {
  let match;
  const year = new Date().getFullYear();
  dateStr = dateStr.toLowerCase().trim();
  // Caso: Rango "Del 25 al 30 de Agosto"
  match = dateStr.match(/del\s+(\d+)\s+al\s+(\d+)\s+de\s+(\w+)/i);

  if (match) {
    const startDay = parseInt(match[1], 10);
    const endDay = parseInt(match[2], 10);
    const mouth = MOUTHS[match[3].toUpperCase()];

    return {
      startDay: format(`${year}-${mouth}-${startDay}`, ZONA_CO),
      endDay: format(`${year}-${mouth}-${endDay}`, ZONA_CO),
    };
  }
  // Caso: Fecha única "El 15 de Agosto"
  match = dateStr.match(/el\s+(\d+)\s+de\s+(\w+)/i);
  if (match) {
    const day = parseInt(match[1], 10);
    const mouth = MOUTHS[match[2].toUpperCase()];

    return format(`${year}-${mouth}-${day}`, ZONA_CO);
  }
  // Caso: Rango "Del 25 y 30 de Agosto"
  match = dateStr.match(/del\s+(\d+)\s+y\s+(\d+)\s+de\s+(\w+)/i);
  if (match) {
    const [, d1, d2, mouthText] = match;
    const mouth = MOUTHS[mouthText.toUpperCase()];
    return {
      inicio: format(`${year}-${mouth}-${Number(d1)}`),
      fin: format(`${year}-${mouth}-${Number(d2)}`),
    };
  }

  return null;
};

const format = date => {
  return dayjs.tz(date).format('YYYY-MM-DD');
};

module.exports = {
  mappingData,
};
