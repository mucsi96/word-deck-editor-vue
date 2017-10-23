import fs from 'fs';
import path from 'path';
import ISO6391 from 'iso-639-1';
import { linguee as session } from '../session-provider';
import { getJSONCache, cacheMedia, cacheJSON } from '../cache';
import logger from '../logger';

const script = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/linguee.js'), 'utf8');

export async function get({ params: { word, from, to } }, res) {
  if (!ISO6391.validate(from)) throw new Error(`Not valid language ${from}`);
  if (!ISO6391.validate(to)) throw new Error(`Not valid language ${to}`);
  const cacheName = `linguee/${from}/${to}/${word}/index.json`;
  const cache = await getJSONCache(cacheName);
  if (cache) {
    logger.info(`${cacheName} served from cache`);
    res.send(cache);
    return;
  }
  logger.info(`${cacheName} not found in cache. Fetching...`);
  const url = `https://www.linguee.com/${ISO6391.getName(from)}-${ISO6391.getName(to)}/search?source=${ISO6391.getName(from)}&query=${encodeURIComponent(word)}`;
  await session.go(url);
  const result = await session.executeScript(script);
  if (result.pronunciation) {
    const target = `${path.dirname(cacheName)}/${word.replace(' ', '-')}.mp3`;
    await cacheMedia(result.pronunciation, target);
    result.pronunciation = `/media/${target}`;
  }
  await cacheJSON(result, cacheName);
  logger.info(`${cacheName} cached`);
  res.send(result);
}
