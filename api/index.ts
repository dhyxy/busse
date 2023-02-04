import express from 'express';
import { expressjwt } from 'express-jwt';
import auth from './auth/routing';
import { errorHandler } from './middleware';

const api = express.Router();

api.use(
    expressjwt({
        secret: process.env.JWT_ACCESS_SECRET,
        algorithms: ['HS256'],
    }).unless({
        path: [
            '/api/auth/login',
            '/api/auth/register',
            '/api/auth/refreshToken',
        ],
    }),
);

api.use('/auth', auth);

api.use(errorHandler);
export default api;
