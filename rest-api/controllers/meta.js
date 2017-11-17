import { validate as validateLang } from 'iso-639-1';
import { get as getLingueeMeta } from '../services/linguee';
import { get as getForvoMeta } from '../services/forvo';
import { get as getWiktionaryMeta } from '../services/wiktionary';
import { get as getGoogleMeta } from '../services/google';
import { get as getGoogleSpeechMeta } from '../services/google-speech';
import { create as createSession, remove as removeSession } from '../session';
import logger from '../logger';

export const get = async ({ params: { word, lang } }, res) => {
  if (!validateLang(lang)) throw new Error(`Not valid language ${lang}`);
  let result;
  let session;
  try {
    session = await createSession();
    const lingueeMeta = await getLingueeMeta({ session, word, from: lang, to: lang === 'en' ? 'de' : 'en' });
    if (!lingueeMeta.word) lingueeMeta.word = word;
    const forvoMeta = await getForvoMeta({ session, word: lingueeMeta.word, lang });
    const wiktionaryMeta = await getWiktionaryMeta({ session, word: lingueeMeta.word, lang });
    // const googleMeta = [
    //   await getGoogleMeta({ session, word: lingueeMeta.translation }),
    //   await getGoogleMeta({ session, word: lingueeMeta.word }),
    // ];
    let googleSpeechMeta = { pronunciations: [] };
    if (!lingueeMeta.pronunciations.length) {
      googleSpeechMeta = await getGoogleSpeechMeta({ session, word: lingueeMeta.word, lang });
    }
    result = {
      wordClass: lingueeMeta.wordClass,
      gender: lingueeMeta.gender,
      ipa: wiktionaryMeta.ipa,
      pronunciations: [
        ...lingueeMeta.pronunciations,
        ...googleSpeechMeta.pronunciations,
        ...wiktionaryMeta.pronunciations,
        ...forvoMeta.pronunciations,
      ],
      pictures: [
        ...wiktionaryMeta.pictures,
        // ...googleMeta[0].pictures,
        // ...googleMeta[1].pictures,
      ],
    };
  } catch (err) {
    logger.error(err);
  }
  try {
    if (session) await removeSession(session);
  } catch (err) {
    logger.error(err);
  }
  if (!result) {
    res.sendStatus(404);
    return;
  }
  res.send(result);
};
