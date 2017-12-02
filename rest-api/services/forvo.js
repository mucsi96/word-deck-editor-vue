import fs from 'fs';
import path from 'path';
import { getJSONCache, cacheMedia, cacheJSON } from '../cache';
import logger from '../logger';

const script = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/forvo.js'), 'utf8');

function makeURLCompatible(value) {
  if (typeof value === 'string') {
    return encodeURIComponent(value.replace(/ /g, '_'));
  }

  return value.toString();
}

export async function get({ session, word, lang }) {
  const cacheName = `forvo/${lang}/${word.replace(' ', '-')}/index.json`;
  const cache = await getJSONCache(cacheName);
  if (cache) {
    logger.info(`${cacheName} served from cache`);
    return cache;
  }
  logger.info(`${cacheName} not found in cache. Fetching...`);
  let result = null;
  const url = `https://forvo.com/search/${makeURLCompatible(word)}/${lang}`;
  await session.go(url);
  result = await session.executeScript(script);
  // eslint-disable-next-line no-restricted-syntax
  for (const pronunciation of result.pronunciations) {
    // eslint-disable-next-line no-await-in-loop
    const target = await cacheMedia(pronunciation.sound, path.dirname(cacheName), `${pronunciation.word.replace(/[.]/g, '')}.mp3`);
    pronunciation.sound = `/media/${target}`;
  }
  await cacheJSON(result, cacheName);
  logger.info(`${cacheName} cached`);
  return result;
}
