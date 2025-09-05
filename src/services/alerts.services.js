const dayjs = require('dayjs');

const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const checkSiteRepository = require('../repository/checkSite.repository');
const {
  filterDates,
  constants: { MOUTHS },
  getTextDesc,
} = require('../utils/');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

const getAlerts = async () => {
  const data = await checkSiteRepository.findAll();

  return data;
};

const getAlertByDepartment = async department => {
  const data = await checkSiteRepository.findByDepartment(department);

  if (!data) {
    throw new Error('No alerts found for the specified department');
  }

  return data;
};

const getSpecificAlertByDepartment = async department => {
  let arrayData = [];
  const MOUTHS_INVERTED = Object.fromEntries(
    Object.entries(MOUTHS).map(([k, v]) => [v, k]),
  );
  const currentMouth = MOUTHS_INVERTED[dayjs().month() + 1];
  const data = await checkSiteRepository.findByDepartment(department);

  if (!data) {
    throw new Error('No alerts found for the specified department');
  }

  const arrayMouth = data[0].mouths.filter(
    item => item.mouth.toLowerCase() === currentMouth.toLowerCase(),
  );

  const specificDate = filterDates(arrayMouth[0].info);

  arrayData = await getTextDesc(specificDate);

  return arrayData;
};

const getAlertByDepartmentAndCity = async (department, city) => {
  let arrayDepartment = [];

  let arrayZone = [];
  const MOUTHS_INVERTED = Object.fromEntries(
    Object.entries(MOUTHS).map(([k, v]) => [v, k]),
  );
  const currentMouth = MOUTHS_INVERTED[dayjs().month() + 1];
  const data = await checkSiteRepository.findByDepartment(department);

  if (!data) {
    throw new Error('No alerts found for the specified department');
  }

  const arrayMouth = data[0].mouths.filter(
    item => item.mouth.toLowerCase() === currentMouth.toLowerCase(),
  );

  const specificDate = filterDates(arrayMouth[0].info);

  arrayDepartment = await getTextDesc(specificDate);

  for (const department of arrayDepartment) {
    for (const data of department.textDesc) {
      for (const zone of data.circuitos) {
        const { circuito, municipio } = zone;
        arrayZone.push({ circuito, municipio, barrios: zone.barrios });
      }
    }
  }

  const arrayCity = arrayZone.filter(item =>
    item.municipio.toLowerCase().includes(city.toLowerCase()),
  );

  return arrayCity;
};

module.exports = {
  getAlerts,
  getAlertByDepartment,
  getSpecificAlertByDepartment,
  getAlertByDepartmentAndCity,
};
