import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import logger from './logger';

const app = express();
let httpServer;

app.use(bodyParser.json());
app.use(routes);
app.use('/media', express.static(path.join(__dirname, '../cache')));

export function start(port) {
  return new Promise((resolve) => {
    httpServer = app.listen(port, resolve);
  }).then(() => logger.info(`REST server started on port ${port}`));
}

export function stop() {
  return new Promise((resolve) => {
    httpServer.close(resolve);
    logger.info('REST server stopped');
  });
}
