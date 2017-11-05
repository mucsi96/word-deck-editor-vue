(function (callback) {
  Audio.prototype.setAttribute = (name, value) => {
    if (name !== 'src') return;
    callback(`${location.protocol}//${location.host}${value}`);
  };
  const srcListenBtn = document.querySelector('#gt-src-listen');
  if (!srcListenBtn) {
    callback(null);
  }
  srcListenBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  srcListenBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
}(arguments[arguments.length - 1]));
