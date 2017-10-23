import fs from 'fs';
import path from 'path';
import ISO6391 from 'iso-639-1';
import { create as createSession, remove as removeSession } from '../session';
import { getJSONCache, cacheJSON, cacheMedia } from '../cache';
import logger from '../logger';

const script = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/wiktionary.js'), 'utf8');

export async function get({ params: { word, lang } }, res) {
  if (!ISO6391.validate(lang)) throw new Error(`Not valid language ${lang}`);
  const cacheName = `wiktionary/${lang}/${word}/index.json`;
  const cache = await getJSONCache(cacheName);
  if (cache) {
    logger.info(`${cacheName} served from cache`);
    res.send(cache);
    return;
  }
  logger.info(`${cacheName} not found in cache. Fetching...`);
  const session = await createSession();
  try {
    const url = `https://${lang}.wiktionary.org`;
    await session.go(url);
    const searchInput = await session.findElement('css', '#searchInput');
    const searchButton = await session.findElement('css', '#searchButton');
    await searchInput.sendKeys(word);
    await searchButton.click();
    const result = await session.executeScript(script);
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
    res.send(result);
  } catch (err) {
    await removeSession(session);
    throw err;
  }
}
