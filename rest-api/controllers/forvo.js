import fs from 'fs';
import path from 'path';
import ISO6391 from 'iso-639-1';
import { forvo as session } from '../session-provider';

const script = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/forvo.js'), 'utf8');

function makeURLCompatible(value) {
  if (typeof value === 'string') {
    return encodeURIComponent(value.replace(/ /g, '_').toLowerCase());
  }

  return value.toString();
}

export async function get({ params: { word, lang } }, res) {
  if (!ISO6391.validate(lang)) throw new Error(`Not valid language ${lang}`);
  const url = `https://forvo.com/search/${makeURLCompatible(word)}/${lang}`;
  await session.go(url);
  const result = await session.executeScript(script);
  res.send(result);
}
