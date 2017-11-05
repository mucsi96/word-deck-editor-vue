import path from 'path';
import fs from 'fs';
import { createDownloader } from 'hunspell-dict-downloader';
import { loadModule } from 'hunspell-asm';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);

export async function check({ word, lang }) {
  const downloader = await createDownloader(path.resolve(__dirname, '../../cache/hunspell'));
  const region = lang === 'en' ? 'us' : lang;
  const { aff: affPath, dic: dicPath } = await downloader.installDictionary(`${lang}-${region}`);
  const affBuffer = await readFileAsync(affPath);
  const dicBuffer = await readFileAsync(dicPath);
  const hunspellFactory = await loadModule();
  const affFile = hunspellFactory.mountBuffer(affBuffer, 'dictionary.aff');
  const dictFile = hunspellFactory.mountBuffer(dicBuffer, 'dictionary.dic');
  const hunspell = hunspellFactory.create(affFile, dictFile);

  const result = {
    correct: hunspell.spell(word),
    suggests: hunspell.suggest(word),
  };
  hunspell.dispose();
  hunspellFactory.unmount(affFile);
  hunspellFactory.unmount(dictFile);
  return result;
}
