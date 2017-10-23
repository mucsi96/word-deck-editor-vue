const getTranslation = () => {
  const translationNode = document.querySelector('.exact .tag_trans .dictLink');
  return translationNode && translationNode.textContent;
};

const getPronunciations = () => {
  const soundNode = document.querySelector('.exact .tag_lemma .audio');
  const wordNode = document.querySelector('.exact .tag_lemma .dictLink');
  if (!soundNode) return [];
  const code = soundNode.getAttribute('onclick').match(/^playSound\(this,"([a-zA-z0-9/-]+)"/)[1];
  return [{
    word: wordNode.textContent,
    sound: `https://www.linguee.com/mp3/${code}`,
  }];
};

const getTags = () => {
  const tagsNode = document.querySelector('.exact .tag_lemma .tag_wordtype');
  if (!tagsNode) return [];
  return tagsNode.textContent.split(', ');
};

return {
  translation: getTranslation(),
  pronunciations: getPronunciations(),
  tags: getTags(),
};
