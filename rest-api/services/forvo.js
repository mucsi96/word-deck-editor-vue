import fs from 'fs';
import path from 'path';
import { create as createSession, remove as removeSession } from '../session';
import { getJSONCache, cacheMedia, cacheJSON } from '../cache';
import logger from '../logger';

const script = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/forvo.js'), 'utf8');

function makeURLCompatible(value) {
  if (typeof value === 'string') {
    return encodeURIComponent(value.replace(/ /g, '_').toLowerCase());
  }

  return value.toString();
}

export async function get({ word, lang }) {
  const cacheName = `forvo/${lang}/${word.replace(' ', '-')}/index.json`;
  const cache = await getJSONCache(cacheName);
  if (cache) {
    logger.info(`${cacheName} served from cache`);
    return cache;
  }
  logger.info(`${cacheName} not found in cache. Fetching...`);
  const session = await createSession();
  let result = null;
  try {
    const url = `https://forvo.com/search/${makeURLCompatible(word)}/${lang}`;
    await session.go(url);
    result = await session.executeScript(script);
    // eslint-disable-next-line no-restricted-syntax
    for (const pronunciation of result.pronunciations) {
      const target = `${path.dirname(cacheName)}/${pronunciation.word.replace(' ', '-')}.mp3`;
      // eslint-disable-next-line no-await-in-loop
      await cacheMedia(pronunciation.sound, target);
      pronunciation.sound = `/media/${target}`;
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
