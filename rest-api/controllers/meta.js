import ISO6391 from 'iso-639-1';
import { get as getLingueeMeta } from '../services/linguee';
import { get as getForvoMeta } from '../services/forvo';
import { get as getWiktionaryMeta } from '../services/wiktionary';

export const get = async ({ params: { word, lang } }, res) => {
  if (!ISO6391.validate(lang)) throw new Error(`Not valid language ${lang}`);
  const lingueeMeta = await getLingueeMeta({ word, from: lang, to: lang === 'en' ? 'de' : 'en' });
  const forvoMeta = await getForvoMeta({ word, lang });
  const wiktionaryMeta = await getWiktionaryMeta({ word, lang });
  const result = {
    wordClass: lingueeMeta.wordClass,
    gender: lingueeMeta.gender,
    ipa: wiktionaryMeta.ipa,
    pronunciations: [
      ...lingueeMeta.pronunciations,
      ...wiktionaryMeta.pronunciations,
      ...forvoMeta.pronunciations,
    ],
    pictures: [...wiktionaryMeta.pictures],
  };
  res.send(result);
};
