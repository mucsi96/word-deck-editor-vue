const getPictures = () => Array.prototype.map.call(document.querySelectorAll('.photo-item img'), img => ({
  file: img.src,
}));

return {
  pictures: getPictures(),
};
