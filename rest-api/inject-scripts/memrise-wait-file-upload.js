(function (selector, callback) {
  const untilCondition = async (condition) => {
    while (!condition()) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  untilCondition(() => {
    const audioDropdown = document.querySelector(`${selector} button[data-role="load-media"]`);
    return !audioDropdown.classList.contains('disabled');
  }).then(callback);
}(arguments[0], arguments[1]));
