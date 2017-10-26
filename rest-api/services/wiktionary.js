import fs from 'fs';
import path from 'path';
import { create as createSession, remove as removeSession } from '../session';
import { getJSONCache, cacheJSON, cacheMedia } from '../cache';
import logger from '../logger';

const script = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/wiktionary.js'), 'utf8');

export async function get({ word, lang }) {
  const cacheName = `wiktionary/${lang}/${word.replace(' ', '-')}/index.json`;
  const cache = await getJSONCache(cacheName);
  if (cache) {
    logger.info(`${cacheName} served from cache`);
    return cache;
  }
  logger.info(`${cacheName} not found in cache. Fetching...`);
  const session = await createSession();
  let result = null;
  try {
    const url = `https://${lang}.wiktionary.org`;
    await session.go(url);
    const searchInput = await session.findElement('css', '#searchInput');
    const searchButton = await session.findElement('css', '#searchButton');
    await searchInput.sendKeys(word);
    await searchButton.click();
    await session.executeScript(`Array.prototype.map.call(
      document.querySelectorAll('.mwPlayerContainer.k-player'),
      (player) => {
        player.querySelector('.k-options').click();
        player.querySelector('.k-download-btn').click();
      },
    )`);
    result = await session.executeScript(script);
    // eslint-disable-next-line no-restricted-syntax
    for (const pronunciation of result.pronunciations) {
      const target = `${path.dirname(cacheName)}/${path.basename(pronunciation.sound).replace(' ', '-')}`;
      // eslint-disable-next-line no-await-in-loop
      await cacheMedia(pronunciation.sound, target);
      pronunciation.sound = `/media/${target}`;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const picture of result.pictures) {
      const target = `${path.dirname(cacheName)}/${path.basename(picture.file).replace(' ', '-')}`;
      // eslint-disable-next-line no-await-in-loop
      await cacheMedia(picture.file, target);
      picture.file = `/media/${target}`;
    }
    await cacheJSON(result, cacheName);
    logger.info(`${cacheName} cached`);
    await removeSession(session);
  } catch (err) {
    await removeSession(session);
    throw err;
  }
  return result;
}
