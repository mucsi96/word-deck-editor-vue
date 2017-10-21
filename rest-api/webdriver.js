import { execFile } from 'child_process';
import { path as chromedriverPath } from 'chromedriver';
import waitOn from 'wait-on';
import logger from './logger';

const waitForBusyPort = port => new Promise((resolve, reject) => {
  waitOn({ resources: [`tcp:127.0.0.1:${port}`] }, err => (err ? reject(err) : resolve()));
});

const waitForFreePort = port => new Promise((resolve, reject) => {
  waitOn({ resources: [`tcp:127.0.0.1:${port}`], reverse: true }, err => (err ? reject(err) : resolve()));
});

let instance;
let usedPort;

export async function start(port) {
  const childArgs = [`--port=${port}`];
  const path = chromedriverPath;
  const name = 'Chromedriver';

  logger.info(`[webdriver:start] Starting ${name} ${path} ${childArgs.join(' ')}`);
  instance = execFile(path, childArgs);
  const onClose = () => logger.info(`[webdriver:start] ${name} terminated`);
  const onOut = chunk => logger.info(`[webdriver] ${chunk}`);
  instance.stdout.on('data', onOut);
  instance.stderr.on('data', onOut);
  instance.on('close', onClose);
  await waitForBusyPort(port);
  usedPort = port;
  logger.info(`[webdriver:start] ${name} started on port ${port}`);
}

export async function stop() {
  if (usedPort) {
    instance.kill();
    await waitForFreePort(usedPort);
  }
}
