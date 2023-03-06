import express from 'express';
import { body } from 'express-validator';

import { jwtGuard, validate } from '../middleware';
import * as service from './service';
import type { LoginUserReq, RefreshTokenReq, RegisterUserReq } from './types';
import { assertUserEmail } from './util';

const router = express.Router();

router.post(
    '/register',
    body('email').isEmail().normalizeEmail(),
    body('password').isString().trim().isLength({ min: 6 }),
    body('name').isString().trim().isLength({ min: 1 }),
    validate,
    async (req, res, next) => {
        const { email, password, name } = req.body as RegisterUserReq;
        try {
            const tokens = await service.registerUser(email, password, name);
            return res.json(tokens);
        } catch (err) {
            next(err);
        }
    },
);

router.post(
    '/login',
    body('email').isEmail().normalizeEmail(),
    body('password').isString(),
    validate,
    async (req, res, next) => {
        const { email, password } = req.body as LoginUserReq;
        try {
            const tokens = await service.loginUser(email, password);
            return res.json(tokens);
        } catch (err) {
            next(err);
        }
    },
);

router.post(
    '/refreshToken',
    jwtGuard(),
    body('refreshToken').isString().trim(),
    validate,
    async (req, res, next) => {
        const { refreshToken } = req.body as RefreshTokenReq;
        try {
            const tokens = await service.refreshToken(refreshToken);
            return res.json(tokens);
        } catch (err) {
            next(err);
        }
    },
);

router.post('/logout', jwtGuard(), async (req, res, next) => {
    const email = assertUserEmail(req.auth?.email);
    try {
        await service.logoutUser(email);
        return res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.get('/whoami', jwtGuard(), async (req, res, next) => {
    try {
        const email = assertUserEmail(req.auth?.email);
        const user = await service.whoAmI(email);
        return res.json(user);
    } catch (err) {
        next(err);
    }
});

export default router;
