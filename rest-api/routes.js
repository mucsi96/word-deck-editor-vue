
import { Router } from 'express';
import controllers from './controllers';

const router = Router();
// Source https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/#usinges7asyncawait
const wrap = fn => (...args) => fn(...args).catch(args[2]);

router.get('/forvo/:lang/:word', wrap(controllers.forvo.get));

export default router;
