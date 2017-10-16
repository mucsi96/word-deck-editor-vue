import forvoApi from 'forvo';
import { getEnvProp } from '../env';

const forvo = forvoApi({ key: getEnvProp('FORVO_KEY') });

export async function getStandardPronunciation({ params: { word, lang } }, res) {
  const wordPronunciations = await forvo.standardPronunciation({ word, language: lang });
  if (!wordPronunciations.items.length) {
    res.send({});
    return;
  }

  res.send({
    soundFile: wordPronunciations.items[0].pathmp3,
  });
}
