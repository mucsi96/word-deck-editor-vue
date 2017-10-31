import fs from 'fs';
import path from 'path';
import { newSession } from 'w3c-webdriver';
import logger from './logger';
import { saveBuffer } from './cache';

const sessionOption = {
  desiredCapabilities: {
    browserName: 'chrome',
    javascriptEnabled: true,
    acceptSslCerts: true,
    chromeOptions: {
      args: ['incognito', 'headless', 'no-sandbox', 'disable-gpu'],
    },
  },
};

export async function create() {
  try {
    logger.info('Creating new session');
    const session = await newSession(`http://localhost:${process.env.WEB_DRIVER_PORT}`, sessionOption);
    logger.info('Session created');
    return session;
  } catch (err) {
    logger.info('Unable to create session', err);
    throw err;
  }
}

export async function remove(session) {
  try {
    logger.info('Deleting session');
    await session.delete();
    logger.info('Session deleted');
  } catch (err) {
    logger.info('session already deleted');
  }
}


export async function takeScreenshot(session) {
  const screenshot = await session.takeScreenshot();
  const file = path.resolve(__dirname, `../screenshot-${Date.now()}.png`);
  await saveBuffer(screenshot, file);
}
