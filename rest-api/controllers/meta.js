import { validate as validateLang } from 'iso-639-1';
import { get as getLingueeMeta } from '../services/linguee';
import { get as getForvoMeta } from '../services/forvo';
import { get as getWiktionaryMeta } from '../services/wiktionary';
import { get as getGoogleMeta } from '../services/google';

export const get = async ({ params: { word, lang } }, res) => {
  if (!validateLang(lang)) throw new Error(`Not valid language ${lang}`);
  const lingueeMeta = await getLingueeMeta({ word, from: lang, to: lang === 'en' ? 'de' : 'en' });
  const results = await Promise.all([
    getForvoMeta({ word, lang }),
    getWiktionaryMeta({ word, lang }),
    getGoogleMeta({ word: lingueeMeta.translation }),
    getGoogleMeta({ word }),
  ]);
  const result = {
    wordClass: lingueeMeta.wordClass,
    gender: lingueeMeta.gender,
    ipa: results[1].ipa,
    pronunciations: [
      ...lingueeMeta.pronunciations,
      ...results[1].pronunciations,
      ...results[0].pronunciations,
    ],
    pictures: [
      ...results[1].pictures,
      ...results[2].pictures,
      ...results[3].pictures,
    ],
  };
  res.send(result);
};
