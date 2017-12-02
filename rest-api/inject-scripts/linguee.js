const getWord = () => {
  const wordNode = document.querySelector('.exact .tag_lemma .dictLink');
  return wordNode && wordNode.textContent;
};

const getTranslation = () => {
  const translationNode = document.querySelector('.exact .tag_trans .dictLink');
  return translationNode && translationNode.textContent;
};

const getPronunciations = () => {
  const section = document.querySelector('.exact .tag_lemma:first-child');
  const soundNode = section.querySelector('.audio');
  const wordNode = section.querySelector('.dictLink');
  if (!soundNode || !wordNode) return [];
  const code = soundNode.getAttribute('onclick').match(/^playSound\(this,"([a-zA-z0-9/-]+)"/)[1];
  return [{
    word: wordNode.textContent,
    sound: `https://www.linguee.com/mp3/${code}`,
  }];
};

const getWordClass = () => {
  const tagsNode = document.querySelector('.exact .tag_lemma .tag_wordtype');
  if (!tagsNode) return undefined;
  const match = tagsNode.textContent.match(/noun|verb|adjective|adverb|pronoun|preposition|conjunction|article|interjection/);
  if (!match) return undefined;
  return match[0];
};

const getGender = () => {
  const tagsNode = document.querySelector('.exact .tag_lemma .tag_wordtype');
  if (!tagsNode) return undefined;
  const match = tagsNode.textContent.match(/masculine|feminine|neuter/);
  if (!match) return undefined;
  return match[0];
};

return {
  word: getWord(),
  translation: getTranslation(),
  pronunciations: getPronunciations(),
  wordClass: getWordClass(),
  gender: getGender(),
};
