import { checkWords } from '../services/hunspell';

export const post = async ({ params: { lang }, body: { words } }, res) => {
  res.send(await checkWords({ words, lang }));
};
