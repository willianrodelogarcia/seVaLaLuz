const dayjs = require('dayjs');
const { MOUTHS, ZONA_CO } = require('./constants');
const { format } = require('./normilizeText');

const mappingData = html => {
  const rows = [];
  const mouths = [];
  const dates = [];

  html(
    '#dnn_ctr1093_ViewEasyDNNNewsMain_ctl00_pnlListArticles > div > div > div > div',
  ).each((index, el) => {
    const department = html(el)
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
          .each(async (j, li) => {
            const date = dateFormatter(html(li).text().trim());
            const url_pdf = html(li).find('a').attr('href');
            dates.push({ date, url_pdf });
          });
        mouths.push({ mouth, info: [...dates] });
        dates.length = 0;
      });

    rows.push({ department, mouths: [...mouths] });
    mouths.length = 0;
  });

  return rows;
};

const dateFormatter = dateStr => {
  let match;
  const year = new Date().getFullYear();
  dateStr = dateStr.toLowerCase().trim();

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

  match = dateStr.match(/el\s+(\d+)\s+de\s+(\w+)/i);
  if (match) {
    const day = parseInt(match[1], 10);
    const mouth = MOUTHS[match[2].toUpperCase()];

    return { startDay: format(`${year}-${mouth}-${day}`, ZONA_CO) };
  }

  match = dateStr.match(/del\s+(\d+)\s+y\s+(\d+)\s+de\s+(\w+)/i);
  if (match) {
    const [, d1, d2, mouthText] = match;
    const mouth = MOUTHS[mouthText.toUpperCase()];
    return {
      startDay: format(`${year}-${mouth}-${Number(d1)}`),
      endDay: format(`${year}-${mouth}-${Number(d2)}`),
    };
  }

  return null;
};

function filterDates(info) {
  const currentDay = dayjs();
  return info.filter(item => {
    const start = dayjs(item.date.startDay);
    const end = item.date.endDay ? dayjs(item.date.endDay) : start;

    return (
      currentDay.isAfter(start.subtract(1, 'day')) &&
      currentDay.isBefore(end.add(1, 'day'))
    );
  });
}

module.exports = {
  mappingData,
  filterDates,
};
