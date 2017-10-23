const getWord = () => {
  const headingNode = document.querySelector('#firstHeading');
  return headingNode && headingNode.textContent;
};

const getIPA = () => {
  const ipaNode = document.querySelector('.ipa');
  return ipaNode && ipaNode.textContent;
};

const getPronunciations = () => Array.prototype.map.call(document.querySelectorAll('a.internal[href$=".ogg"],a.internal[href$=".mp3"]'), link => ({
  word: link.textContent,
  sound: `${window.location.protocol}${link.getAttribute('href')}`,
}));

const getPictures = () => Array.prototype.map.call(document.querySelectorAll('.thumbimage'), thumbimage => ({
  file: thumbimage.src.replace('/thumb', '').split('/').slice(0, -1).join('/'),
}));

return {
  word: getWord(),
  ipa: getIPA(),
  pronunciations: getPronunciations(),
  pictures: getPictures(),
};
