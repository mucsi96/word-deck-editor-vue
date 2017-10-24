import fs from 'fs';
import path from 'path';
import perfy from 'perfy';
import { create as createSession, remove as removeSession } from '../session';
import { getJSONCache, cacheJSON, cacheMedia } from '../cache';
import logger from '../logger';

const script = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/google.js'), 'utf8');

export async function get({ word }) {
  perfy.start(`google-${word}`);
  const cacheName = `google/${word.replace(' ', '-')}/index.json`;
  const cache = await getJSONCache(cacheName);
  if (cache) {
    logger.info(`${cacheName} served from cache`);
    return cache;
  }
  logger.info(`${cacheName} not found in cache. Fetching...`);
  const session = await createSession();
  let result = null;
  try {
    const url = 'https://images.google.com';
    await session.go(url);
    const searchInput = await session.findElement('css', 'input[name="q"]');
    const searchButton = await session.findElement('css', 'button[name="btnG"]');
    await searchInput.sendKeys(word);
    await searchButton.click();
    result = await session.executeScript(script);
    result.pictures = result.pictures.filter((pic, index) => index < 10);
    const tasks = result.pictures.map((picture) => {
      const target = `${path.dirname(cacheName)}/${path.basename(picture.file).split('?')[0].replace(' ', '-')}`;
      return cacheMedia(picture.file, target).then(() => {
        picture.file = `/media/${target}`;
      });
    });
    await Promise.all(tasks);
    await cacheJSON(result, cacheName);
    logger.info(`${cacheName} cached`);
    logger.info(perfy.end(`google-${word}`).summary);
    await removeSession(session);
  } catch (err) {
    await removeSession(session);
    throw err;
  }
  return result;
}
