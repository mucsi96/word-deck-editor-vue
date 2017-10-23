import portscanner from 'portscanner';

import { start as startDriver, stop as stopDriver } from './webdriver';
import { start as startServer, stop as stopServer } from './server';
import logger from './logger';

const start = async () => {
  const webDriverPort = await portscanner.findAPortNotInUse(3001, 3050, '127.0.0.1');
  process.env.WEB_DRIVER_PORT = webDriverPort;
  await startDriver(webDriverPort);
  await startServer(3000);
};

const stop = async () => {
  await stopDriver();
  await stopServer();
};

process.on('SIGINT', () => stop().catch(err => logger.error(err)).then(() => process.exit()));
process.on('SIGTERM', () => stop().catch(err => logger.error(err)).then(() => process.exit()));
process.on('SIGHUP', () => stop().catch(err => logger.error(err)).then(() => process.exit()));

start().catch((err) => {
  logger.error(err);
  return stop().catch(err2 => logger.error(err2)).then(() => process.exit());
});
