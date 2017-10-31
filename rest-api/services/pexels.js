import fs from 'fs';
import path from 'path';
import { getJSONCache, cacheJSON, cacheMedia } from '../cache';
import logger from '../logger';

const script = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/pexels.js'), 'utf8');

export async function get({ session, word }) {
  const cacheName = `pexels/${word.replace(' ', '-')}/index.json`;
  const cache = await getJSONCache(cacheName);
  if (cache) {
    logger.info(`${cacheName} served from cache`);
    return cache;
  }
  logger.info(`${cacheName} not found in cache. Fetching...`);
  let result = null;
  const url = 'https://www.pexels.com/';
  await session.go(url);
  const searchInput = await session.findElement('css', 'input[name="s"]');
  const searchButton = await session.findElement('css', 'input[name="s"] + button');
  await searchInput.sendKeys(word);
  await searchButton.click();
  result = await session.executeScript(script);
  result.pictures = result.pictures.filter((pic, index) => index < 20);
  const tasks = result.pictures.map((picture) => {
    return cacheMedia(picture.file, path.dirname(cacheName)).then((target) => {
      picture.file = `/media/${target}`;
    }).catch(() => {
      logger.info(`Caching ${picture.file} was not successful`);
      picture.file = undefined;
    });
  });
  await Promise.all(tasks);
  result.pictures = result.pictures.filter(({ file }) => file);
  await cacheJSON(result, cacheName);
  logger.info(`${cacheName} cached`);
  return result;
}
