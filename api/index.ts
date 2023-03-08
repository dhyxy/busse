import express from 'express';

import auth from './auth/routing';
import core from './core/routing';
import { errorHandler } from './middleware';

const api = express.Router();

api.use('/auth', auth);
api.use(core);

api.use(errorHandler);
export default api;
