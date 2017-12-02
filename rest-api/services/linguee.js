import fs from 'fs';
import path from 'path';
import { getName as getLangName } from 'iso-639-1';
import { getJSONCache, cacheMedia, cacheJSON, normalizeAudio } from '../cache';
import logger from '../logger';

const script = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/linguee.js'), 'utf8');

export async function get({ session, word, from, to }) {
  const cacheName = `linguee/${from}/${to}/${word.replace(' ', '-')}/index.json`;
  const cache = await getJSONCache(cacheName);
  if (cache) {
    logger.info(`${cacheName} served from cache`);
    return cache;
  }
  logger.info(`${cacheName} not found in cache. Fetching...`);
  let result = null;
  const url = [
    'https://www.linguee.com',
    `${getLangName(from).toLowerCase()}-${getLangName(to).toLowerCase()}`,
    `search?source=${getLangName(from).toLowerCase()}&query=${encodeURIComponent(word.replace(' ', '-').toLowerCase())}`,
  ].join('/');
  logger.info(url);
  await session.go(url);
  result = await session.executeScript(script);
  logger.info('linguee', result);
  // eslint-disable-next-line no-restricted-syntax
  for (const pronunciation of result.pronunciations) {
    // eslint-disable-next-line no-await-in-loop
    const target = await cacheMedia(pronunciation.sound, path.dirname(cacheName), `${pronunciation.word}.mp3`);
    pronunciation.sound = `/media/${target}`;
  }
  await cacheJSON(result, cacheName);
  logger.info(`${cacheName} cached`);
  return result;
}
