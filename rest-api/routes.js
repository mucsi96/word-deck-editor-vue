
import { Router } from 'express';
import controllers from './controllers';

const router = Router();
// Source https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/#usinges7asyncawait
const wrap = fn => (...args) => fn(...args).catch(args[2]);

router.get('/meta/:lang/:word', wrap(controllers.meta.get));
router.get('/languages', wrap(controllers.languages.get));
router.post('/upload', wrap(controllers.upload.post));

export default router;
