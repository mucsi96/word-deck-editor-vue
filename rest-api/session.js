import { newSession } from 'w3c-webdriver';
import logger from './logger';

const sessionOption = {
  desiredCapabilities: {
    browserName: 'chrome',
    javascriptEnabled: true,
    chromeOptions: {
      args: ['incognito', 'headless', 'no-sandbox', 'disable-gpu'],
    },
  },
};

export function create() {
  return newSession(`http://localhost:${process.env.WEB_DRIVER_PORT}`, sessionOption);
}

export async function remove(session) {
  try {
    await session.delete();
  } catch (err) {
    logger.info('session already deleted');
  }
}
