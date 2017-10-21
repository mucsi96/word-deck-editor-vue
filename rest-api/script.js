const words = Array.prototype.map.call(document.querySelectorAll('.list-words>ul>li'), function (el) {
  const word = el.querySelector('.word').textContent;
  const playScript = el.querySelector('.play').getAttribute('onClick');
  const base64 = playScript.match(/^Play\((\d+),'([a-zA-Z0-9=]+)'/)[2];
  const sound = defaultProtocol +"//" + _AUDIO_HTTP_HOST + "/mp3/" + base64_decode(base64);

  return {
      word,
      sound
  };
});
console.log(words);
