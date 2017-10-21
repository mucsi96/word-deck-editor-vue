import portscanner from 'portscanner';

import { start as startDriver, stop as stopDriver } from './webdriver';
import { start as createSession, stop as removeSession } from './session-provider';
import { start as startServer, stop as stopServer } from './server';
import logger from './logger';

const start = async () => {
  const webDriverPort = await portscanner.findAPortNotInUse(3001, 3050, '127.0.0.1');
  process.env.WEB_DRIVER_PORT = webDriverPort;
  await startDriver(webDriverPort);
  await startServer(3000);
  await createSession(webDriverPort);
};

const stop = async () => {
  await removeSession();
  await stopDriver();
  await stopServer();
};

process.on('SIGINT', () => stop().catch(err => logger.error(err)));
process.on('SIGTERM', () => stop().catch(err => logger.error(err)));

start().catch((err) => {
  logger.error(err);
  return stop();
});
