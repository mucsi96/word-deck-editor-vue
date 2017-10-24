import fs from 'fs';
import path from 'path';
import ISO6391 from 'iso-639-1';
import perfy from 'perfy';
import { create as createSession, remove as removeSession } from '../session';
import { getJSONCache, cacheMedia, cacheJSON } from '../cache';
import logger from '../logger';

const script = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/linguee.js'), 'utf8');

export async function get({ word, from, to }) {
  perfy.start('linguee');
  const cacheName = `linguee/${from}/${to}/${word.replace(' ', '-')}/index.json`;
  const cache = await getJSONCache(cacheName);
  if (cache) {
    logger.info(`${cacheName} served from cache`);
    return cache;
  }
  logger.info(`${cacheName} not found in cache. Fetching...`);
  const session = await createSession();
  let result = null;
  try {
    const url = `https://www.linguee.com/${ISO6391.getName(from)}-${ISO6391.getName(to)}/search?source=${ISO6391.getName(from)}&query=${encodeURIComponent(word)}`;
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
    logger.info(perfy.end('linguee').summary);
    await removeSession(session);
  } catch (err) {
    await removeSession(session);
    throw err;
  }
  return result;
}
