const getWord = () => {
  const headingNode = document.querySelector('#firstHeading');
  return headingNode && headingNode.textContent;
};

const getIPA = () => {
  const ipaNode = document.querySelector('.ipa,.IPA');
  return ipaNode && ipaNode.textContent;
};

const getFileName = path => path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));

const getPronunciations = () => Array.prototype.map.call(
  document.querySelectorAll('audio source'),
  element => ({
    word: getFileName(element.getAttribute('src')),
    sound: `${window.location.protocol}${element.getAttribute('src')}`,
  }),
);

const getPictures = () => Array.prototype.map.call(document.querySelectorAll('.thumbimage'), thumbimage => ({
  file: thumbimage.src.replace('/thumb', '').split('/').slice(0, -1).join('/'),
}));

return {
  word: getWord(),
  ipa: getIPA(),
  pronunciations: getPronunciations(),
  pictures: getPictures(),
};
