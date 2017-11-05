/* global _AUDIO_HTTP_HOST, base64_decode */

const getWordPronunciations = () => Array.prototype.map.call(document.querySelectorAll('.list-words>ul>li .word'), (el) => {
  const wordEl = el.querySelector('.word');
  if (!wordEl) return null;
  const playScript = el.querySelector('.play').getAttribute('onClick');
  const base64 = playScript.match(/^Play\((\d+),'([a-zA-Z0-9=]+)'/)[2];
  const sound = `https://${_AUDIO_HTTP_HOST}/mp3/${base64_decode(base64)}`;

  return {
    word: wordEl.textContent,
    sound,
  };
});

const getPhrasePronunciations = () => Array.prototype.map.call(document.querySelectorAll('.list-phrases>ul>li'), (el) => {
  const wordEl = el.querySelector('.word');
  if (!wordEl) return null;
  const playScript = el.querySelector('.play').getAttribute('onClick');
  const base64 = playScript.match(/^PlayPhrase\((\d+),'([a-zA-Z0-9=]+)'/)[2];
  const sound = `https://${_AUDIO_HTTP_HOST}/phrases/mp3/${base64_decode(base64)}`;

  return {
    word: wordEl.textContent,
    sound,
  };
});

return {
  pronunciations: [...getWordPronunciations(), ...getPhrasePronunciations()].filter(item => item),
};
