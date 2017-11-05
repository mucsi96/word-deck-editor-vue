import fs from 'fs';
import path from 'path';
import { getJSONCache, cacheMedia, cacheJSON } from '../cache';
import logger from '../logger';

const script = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/google-speech.js'), 'utf8');

export async function get({ session, word, lang }) {
  const cacheName = `google-speech/${lang}/${word.replace(' ', '-')}/index.json`;
  const cache = await getJSONCache(cacheName);
  if (cache) {
    logger.info(`${cacheName} served from cache`);
    return cache;
  }
  logger.info(`${cacheName} not found in cache. Fetching...`);
  const url = `https://translate.google.com/#${lang}/${lang === 'en' ? 'de' : 'en'}/${encodeURIComponent(word)}`;
  await session.go(url);
  const result = {
    pronunciations: [{
      word,
      sound: await session.executeAsyncScript(script),
    }],
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const pronunciation of result.pronunciations) {
    // eslint-disable-next-line no-await-in-loop
    const target = await cacheMedia(pronunciation.sound, path.dirname(cacheName), `${pronunciation.word.replace(' ', '-')}.mp3`);
    pronunciation.sound = `/media/${target}`;
  }
  await cacheJSON(result, cacheName);
  logger.info(`${cacheName} cached`);
  return result;
}
