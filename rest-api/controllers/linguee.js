import fs from 'fs';
import path from 'path';
import ISO6391 from 'iso-639-1';
import { linguee as session } from '../session-provider';

const script = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/linguee.js'), 'utf8');

export async function get({ params: { word, from, to } }, res) {
  if (!ISO6391.validate(from)) throw new Error(`Not valid language ${from}`);
  if (!ISO6391.validate(to)) throw new Error(`Not valid language ${to}`);
  const url = `https://www.linguee.com/${ISO6391.getName(from)}-${ISO6391.getName(to)}/search?source=${ISO6391.getName(from)}&query=${encodeURIComponent(word)}`;
  await session.go(url);
  const result = await session.executeScript(script);
  res.send(result);
}
