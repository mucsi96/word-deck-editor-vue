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

return {
  translation: getTranslation(),
  pronunciations: getPronunciations(),
};
