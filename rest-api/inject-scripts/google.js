const getPictures = () => Array.prototype.map.call(document.querySelectorAll('a[href*="imgurl"]'), link => ({
  file: decodeURIComponent(link.getAttribute('href').match(/imgurl=([^&]+)/)[1]),
}));

return {
  pictures: getPictures(),
};
