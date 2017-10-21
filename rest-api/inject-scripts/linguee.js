const getTranslation = () => {
  const translationNode = document.querySelector('.exact .tag_trans .dictLink');
  return translationNode && translationNode.textContent;
};

const getPronunciation = () => {
  const pronunciationNode = document.querySelector('.exact .tag_lemma .audio');
  if (!pronunciationNode) return '';
  const code = pronunciationNode.getAttribute('onclick').match(/^playSound\(this,"([a-zA-z0-9/-]+)"/)[1];
  return `https://www.linguee.com/mp3/${code}`;
};

return {
  translation: getTranslation(),
  pronunciation: getPronunciation(),
};
