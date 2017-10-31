import { upload as uploadToMemrise } from '../services/memrise';
import { create as createSession, remove as removeSession } from '../session';
import logger from '../logger';

export const post = async ({ body: { provider, ...params } }, res) => {
  let session;
  try {
    session = await createSession();
    switch (provider) {
      case 'memrise':
        await uploadToMemrise({ session, ...params });
        break;
      default:
        throw new Error(`Not supported provider ${provider}`);
    }
  } catch (err) {
    logger.error(err);
  }
  try {
    if (session) await removeSession(session);
  } catch (err) {
    logger.error(err);
  }
  res.sendStatus(200);
};
