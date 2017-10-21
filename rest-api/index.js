import portscanner from 'portscanner';

import { start as startDriver, stop as stopDriver } from './webdriver';
import { start as createSession, stop as removeSession } from './session-provider';
import { start as startServer, stop as stopServer } from './server';
import logger from './logger';

const getFreePorts = async (startPort, endPort, n) => {
  let port = startPort - 1;
  const ports = [];
  while (ports.length < n) {
    /* eslint-disable no-await-in-loop */
    port = await portscanner.findAPortNotInUse(port + 1, 3050, '127.0.0.1');
    ports.push(port);
  }
  return ports;
};

const start = async () => {
  const [webDriverPort, serverPort] = await getFreePorts(3000, 3050, 2);
  process.env.WEB_DRIVER_PORT = webDriverPort;
  process.env.TEST_APP_PORT = serverPort;
  await startDriver(webDriverPort);
  await startServer(serverPort);
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
