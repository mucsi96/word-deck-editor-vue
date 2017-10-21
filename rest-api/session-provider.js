import { newSession } from 'w3c-webdriver';
import logger from './logger';

const sessionOption = {
  desiredCapabilities: {
    browserName: 'chrome',
    javascriptEnabled: true,
    // chromeOptions: {
    //   args: ['incognito', 'headless', 'no-sandbox', 'disable-gpu'],
    // },
  },
};

let forvoSession;
let lingueeSession;

export async function start(port) {
  forvoSession = await newSession(`http://localhost:${port}`, sessionOption);
  lingueeSession = await newSession(`http://localhost:${port}`, sessionOption);
}

export async function stop() {
  try {
    await forvoSession.delete();
  } catch (err) {
    logger.info('session already deleted');
  }
  try {
    await lingueeSession.delete();
  } catch (err) {
    logger.info('session already deleted');
  }
}

export const forvo = new Proxy({}, {
  get: (target, name) => forvoSession[name],
});

export const linguee = new Proxy({}, {
  get: (target, name) => lingueeSession[name],
});
