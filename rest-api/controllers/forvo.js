import fs from 'fs';
import path from 'path';
import { forvo as session } from '../session-provider';

const script = fs.readFileSync(path.resolve(__dirname, 'script.js'), 'utf8');

export async function get({ params: { word, lang } }, res) {
  const url = `https://forvo.com/search/${encodeURIComponent(word)}/${encodeURIComponent(lang)}`;
  await session.go(url);
  const result = await session.executeScript(script);
  res.send(result);
}
