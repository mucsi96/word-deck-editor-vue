import fs from 'fs';
import path from 'path';
import { getJSONCache, cacheJSON, cacheMedia } from '../cache';
import logger from '../logger';

const script = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/wiktionary.js'), 'utf8');

export async function get({ session, word, lang }) {
  const cacheName = `wiktionary/${lang}/${word.replace(' ', '-')}/index.json`;
  const cache = await getJSONCache(cacheName);
  if (cache) {
    logger.info(`${cacheName} served from cache`);
    return cache;
  }
  logger.info(`${cacheName} not found in cache. Fetching...`);
  let result = null;
  const url = `https://${lang}.wiktionary.org`;
  await session.go(url);
  const searchInput = await session.findElement('css', '#searchInput');
  const searchButton = await session.findElement('css', '#searchButton');
  await searchInput.sendKeys(word);
  await searchButton.click();
  result = await session.executeScript(script);
  // eslint-disable-next-line no-restricted-syntax
  for (const pronunciation of result.pronunciations) {
    // eslint-disable-next-line no-await-in-loop
    const target = await cacheMedia(pronunciation.sound, path.dirname(cacheName));
    pronunciation.sound = `/media/${target}`;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const picture of result.pictures) {
    // eslint-disable-next-line no-await-in-loop
    const target = await cacheMedia(picture.file, path.dirname(cacheName));
    picture.file = `/media/${target}`;
  }
  await cacheJSON(result, cacheName);
  logger.info(`${cacheName} cached`);
  return result;
}
