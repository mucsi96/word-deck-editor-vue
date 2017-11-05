import { validate as validateLang } from 'iso-639-1';
import { check } from '../services/hunspell';

export const get = async ({ params: { word, lang } }, res) => {
  if (!validateLang(lang)) throw new Error(`Not valid language ${lang}`);
  res.send(await check({ word, lang }));
};
