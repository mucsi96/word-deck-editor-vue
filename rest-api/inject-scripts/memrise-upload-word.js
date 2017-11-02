(function (word, callback) {
  const untilCondition = async (condition) => {
    while (!condition()) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const uploadWord = async ({ front, back }) => {
    await untilCondition(() => document.querySelector('.adding [data-key="1"] input'));
    const frontInput = document.querySelector('.adding [data-key="1"] input');
    const backInput = document.querySelector('.adding [data-key="2"] input');
    const addButton = document.querySelector('.adding .ico-plus');
    const wordsBeforeAdition = document.querySelectorAll('.things .thing').length;
    frontInput.value = front;
    backInput.value = back;
    addButton.click();
    await untilCondition(() => {
      const words = document.querySelectorAll('.things .thing').length;
      return words > wordsBeforeAdition;
    });
    callback('done');
  };

  uploadWord(word);
}(arguments[0], arguments[arguments.length - 1]));
