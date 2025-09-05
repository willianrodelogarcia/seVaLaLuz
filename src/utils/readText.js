const pdf = require('pdf-parse');
const axios = require('axios');
const dayjs = require('dayjs');
const readPdf = async url => {
  const pdfBuffer = await axios(url, { responseType: 'arraybuffer' });
  const pdfData = await pdf(pdfBuffer.data);
  return pdfData.text;
};

const getTextDesc = async specificDate => {
  const arrayData = [];

  for (const item of specificDate) {
    if (item.url_pdf) {
      const text = await readPdf(item.url_pdf);
      arrayData.push({ ...item, textDesc: parsear(text) });
    } else {
      arrayData.push(item);
    }
  }

  return arrayData;
};

const parseFechaISO = fechaTexto => {
  const match = fechaTexto.match(
    /(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo),\s*(\d{1,2})\s+de\s+(\w+)/,
  );
  if (!match) return null;

  const dia = match[2];
  const mes = match[3];
  const year = dayjs().year();

  const fechaISO = dayjs(`${dia} ${mes} ${year}`, 'D MMMM YYYY', 'es').format(
    'YYYY-MM-DD',
  );
  return fechaISO;
};

const extraerMunicipioYLugares = texto => {
  if (!texto) return { municipio: '', barrios: [] };

  let limpio = texto
    .replace(
      /^(Interrupción|Se\s+interrumpirá)\s+(del|el)?\s+servicio\s+en/i,
      '',
    )
    .replace(/^en\s*/i, '')
    .trim();

  let [municipio, resto] = limpio.split(':').map(t => t.trim());

  if (!resto) {
    return { municipio, barrios: [] };
  }

  const barrios = resto
    .split(/[,;]\s*/)
    .map(b => b.trim())
    .filter(b => b.length > 0);

  return { municipio, barrios };
};

const parsear = text => {
  const diasRegex =
    /(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo),\s*\d{1,2}\s+de\s+\w+/;
  let limpio = text
    .replace(/Afinia avanza plan[\s\S]*?actividades:/, '')
    .replace(/Afinia sigue trabajando[\s\S]*?Afiniapp\./, '')
    .replace(/Información para periodistas[\s\S]*$/m, '')
    .replace(/\n\s*\n/g, '\n')
    .replace(/Santo\s*\n\s*Domingo/g, 'Santo Domingo')
    .trim();

  const bloques = limpio.split(new RegExp(`(?=${diasRegex.source})`, 'g'));
  const resultado = [];

  for (const bloque of bloques) {
    const lineas = bloque
      .split('\n')
      .map(l => l.trim())
      .filter(l => l);

    if (!diasRegex.test(lineas[0])) continue;
    const fechaTexto = lineas[0];
    const fechaISO = parseFechaISO(fechaTexto);

    const circuitos = [];
    let i = 1;

    while (i < lineas.length) {
      if (/^(Circuito|Línea)/.test(lineas[i])) {
        const nombre = lineas[i];
        const horario = (lineas[i + 1] ?? '').replace(/^Horario:? /i, '');
        const interrupciones = [];

        let j = i + 2;
        while (
          j < lineas.length &&
          !/^(Circuito|Línea)/.test(lineas[j]) &&
          !diasRegex.test(lineas[j])
        ) {
          interrupciones.push(lineas[j]);
          j++;
        }

        const textoLugares = interrupciones.join(' ');
        const { municipio, barrios } = extraerMunicipioYLugares(textoLugares);

        circuitos.push({
          circuito: nombre,
          horario,
          municipio,
          barrios,
        });
        i = j;
      } else {
        i++;
      }
    }

    resultado.push({ fecha_texto: fechaTexto, fecha_iso: fechaISO, circuitos });
  }
  return resultado;
};

module.exports = {
  readPdf,
  getTextDesc,
};
