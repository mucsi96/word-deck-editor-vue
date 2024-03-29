import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import { execSync } from 'child_process';
import mkdirpCb from 'mkdirp';
import uid from 'uid-safe';
import { Readable } from 'stream';
import logger from './logger';

const base = path.resolve(__dirname, '../cache');

const mkdirp = dir => new Promise((resolve, reject) => {
  mkdirpCb(dir, err => (!err ? resolve() : reject(err)));
});

const downloadHTTP = (url, dest) => new Promise((resolve, reject) => {
  const file = fs.createWriteStream(dest);
  const protocol = url.startsWith('https') ? https : http;
  protocol.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(resolve);
    });
  }).on('error', (err) => {
    fs.unlink(dest);
    reject(err);
  });
});


const saveJSON = (data, dest) => new Promise((resolve, reject) => {
  const content = JSON.stringify(data, null, 2);
  fs.writeFile(dest, content, 'utf8', err => (!err ? resolve() : reject(err)));
});

export const saveBuffer = (data, dest) => new Promise((resolve, reject) => {
  fs.writeFile(dest, data, err => (err ? reject(err) : resolve()));
});

const readJSON = source => new Promise((resolve, reject) => {
  fs.readFile(source, 'utf8', (err, content) => {
    if (err) {
      reject(err);
      return;
    }

    try {
      const data = JSON.parse(content);
      resolve(data);
    } catch (jsonError) {
      reject(jsonError);
    }
  });
});

export const normalizeAudio = async (fileName) => {
  const ext = path.extname(fileName).replace(/^\./, '');
  const command = `ffmpeg-normalize -r ${ext} -xf ${fileName}`;
  try {
    logger.info(`Normalizing audio volume for ${fileName} using ffmpeg...`);
    execSync(command);
  } catch (err) {
    throw new Error('You need to have ffpmeg and fmpeg-normalize installed. (pip install ffmpeg-normalize)');
  }
};

export const cacheMedia = async (url, target, suggestedfileName) => {
  const targetName = (suggestedfileName || path.basename(url).split('?')[0])
    .replace(/ /g, '-')
    .replace(/[?()]/g, '')
    .toLowerCase();
  const ext = path.extname(targetName);
  const uid6 = await uid(6);
  const fileName = path.resolve(base, target, `${path.basename(targetName, ext)}-${uid6}${ext}`);
  await mkdirp(path.dirname(fileName));
  await downloadHTTP(url, fileName);
  if (['.mp3', '.ogg'].includes(ext)) {
    await normalizeAudio(fileName);
  }
  return path.join(target, path.basename(fileName));
};

export const resolveMediaUrl = mediaUrl => path.resolve(__dirname, '../cache', mediaUrl.replace(/^\/media\//, './'));

export const cacheJSON = async (data, target) => {
  const fileName = path.resolve(base, target);
  await mkdirp(path.dirname(fileName));
  await saveJSON(data, fileName);
};

export const getJSONCache = async (source) => {
  try {
    const fileName = path.resolve(base, source);
    return await readJSON(fileName);
  } catch (err) {
    return null;
  }
};

