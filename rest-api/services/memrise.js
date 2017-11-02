import fs from 'fs';
import path from 'path';
import { takeScreenshot } from '../session';
import { resolveMediaUrl } from '../cache';
import logger from '../logger';

const uploadWordScript = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/memrise-upload-word.js'), 'utf8');
const waitFileUploadScript = fs.readFileSync(path.resolve(__dirname, '../inject-scripts/memrise-wait-file-upload.js'), 'utf8');

const uploadWord = async ({ session, word: { front, back, pronunciation } }) => {
  logger.info(`Uploading word ${front} (${back})`);
  const result = await session.executeAsyncScript(uploadWordScript, [{ front, back }]);
  logger.info(`pro ${pronunciation} ${result}`);
  if (pronunciation) {
    logger.info(`Uploading pronunciation ${resolveMediaUrl(pronunciation)}`);
    const audioField = await session.findElement('css', '.things .thing:last-child [data-key="3"] input[type="file"]');
    await audioField.sendKeys(resolveMediaUrl(pronunciation));
    await session.executeAsyncScript(waitFileUploadScript, ['.things .thing:last-child [data-key="3"]']);
  }
  logger.info('Uploading word done');
};

export const upload = async ({ session, username, password, courseUrl, deck }) => {
  await session.go('https://www.memrise.com/login/');
  const loginButton = await session.findElement('link text', 'Login');
  await loginButton.click();
  const usernameField = await session.findElement('css', '#login [name="username"]');
  const passwordField = await session.findElement('css', '#login [name="password"]');
  const submitButton = await session.findElement('css', '#login input[type="submit"]');
  await usernameField.sendKeys(username);
  await passwordField.sendKeys(password);
  await submitButton.click();
  await session.go(courseUrl);
  // eslint-disable-next-line no-restricted-syntax
  for (const word of deck) {
    // eslint-disable-next-line no-await-in-loop
    await uploadWord({ session, word });
  }
  const saveButton = await session.findElement('link text', 'Save and continue');
  await saveButton.click();
};
