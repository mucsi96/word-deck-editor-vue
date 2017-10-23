import fs from 'fs';
import path from 'path';
import ISO6391 from 'iso-639-1';
import { forvo as session } from '../session-provider';
import { getJSONCache, cacheMedia, cacheJSON } from '../cache';
import logger from '../logger';

const script = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/forvo.js'), 'utf8');

function makeURLCompatible(value) {
  if (typeof value === 'string') {
    return encodeURIComponent(value.replace(/ /g, '_').toLowerCase());
  }

  return value.toString();
}

export async function get({ params: { word, lang } }, res) {
  if (!ISO6391.validate(lang)) throw new Error(`Not valid language ${lang}`);
  const cacheName = `forvo/${lang}/${word}/index.json`;
  const cache = await getJSONCache(cacheName);
  if (cache) {
    logger.info(`${cacheName} served from cache`);
    res.send(cache);
    return;
  }
  logger.info(`${cacheName} not found in cache. Fetching...`);
  const url = `https://forvo.com/search/${makeURLCompatible(word)}/${lang}`;
  await session.go(url);
  const pronunciations = await session.executeScript(script);
  // eslint-disable-next-line no-restricted-syntax
  for (const pronunciation of pronunciations) {
    const target = `${path.dirname(cacheName)}/${pronunciation.word.replace(' ', '-')}.mp3`;
    // eslint-disable-next-line no-await-in-loop
    await cacheMedia(pronunciation.sound, target);
    pronunciation.sound = `/media/${target}`;
  }
  await cacheJSON(pronunciations, cacheName);
  logger.info(`${cacheName} cached`);
  res.send(pronunciations);
}
