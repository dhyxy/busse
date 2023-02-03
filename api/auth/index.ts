import bcrypt from 'bcrypt';
import express from 'express';
import { body } from 'express-validator';
import jsonwebtoken from 'jsonwebtoken';
import db from '../../db';
import { validate } from '../middleware';
import { makeErrors } from '../util';
import {
    JwtPayload,
    LoginUserReq,
    RefreshTokenReq,
    RegisterUserReq,
    TokenResp,
} from './types';

const SALT_ROUNDS = 10;

require('express-async-errors');
const router = express.Router();

router.post(
    '/register',
    body('email').isEmail().normalizeEmail(),
    body('password').isString().trim().isLength({ min: 6 }),
    body('name').isString().trim().isLength({ min: 1 }),
    validate,
    async (req, res) => {
        const { email, password, name } = req.body as RegisterUserReq,
            existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json(makeErrors('email already in use'));
        }

        const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS),
            user = await db.user.create({
                data: { email, password: hashedPassword, name },
            }),
            tokens = makeTokenResp(email);
        await updateRefreshToken(user.id, tokens.refreshToken);
        return res.json(tokens);
    },
);

router.post(
    '/login',
    body('email').isEmail().normalizeEmail(),
    body('password').isString(),
    validate,
    async (req, res) => {
        const { email, password } = req.body as LoginUserReq,
            user = await db.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json(makeErrors('user does not exist'));
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json(makeErrors('invalid password'));
        }

        const tokens = makeTokenResp(email);
        await updateRefreshToken(user.id, tokens.refreshToken);
        return res.json(tokens);
    },
);

router.post(
    '/refreshToken',
    body('refreshToken').isString().trim(),
    validate,
    async (req, res) => {
        const { refreshToken } = req.body as RefreshTokenReq,
            parsed = jsonwebtoken.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET,
            ) as JwtPayload,
            nowInSeconds = Math.floor(Date.now() / 1000);
        if (parsed.exp && parsed.exp < nowInSeconds) {
            return res
                .status(401)
                .json(makeErrors('refresh token expired, log in again'));
        }

        const userWithTokens = await db.user.findUnique({
            where: { email: parsed.email },
            include: {
                refreshTokens: true,
            },
        });
        if (!userWithTokens) {
            return res.status(401).json(makeErrors('invalid refresh token'));
        }

        const isValidRefreshToken = userWithTokens.refreshTokens.find(
            (t) => t.token === refreshToken,
        );
        if (!isValidRefreshToken) {
            return res.status(401).json(makeErrors('invalid refresh token'));
        }

        const tokens = makeTokenResp(userWithTokens.email);
        await updateRefreshToken(userWithTokens.id, tokens.refreshToken);
        return res.json(tokens);
    },
);

router.post('/logout', async (req, res) => {
    if (!req.auth?.email) {
        return res.status(401).json(makeErrors('invalid token'));
    }
    const email = req.auth.email;
    await db.user.update({
        where: { email },
        data: {
            refreshTokens: {
                deleteMany: {},
            },
        },
    });
    return res.status(204).end();
});

function makeTokenResp(email: string): TokenResp {
    return {
        accessToken: jsonwebtoken.sign(
            { email },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: '1d',
            },
        ),
        ...makeRefreshToken(email),
    };
}

function makeRefreshToken(email: string) {
    return {
        refreshToken: jsonwebtoken.sign(
            { email },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: '12w',
            },
        ),
    };
}

async function updateRefreshToken(userId: number, refreshToken: string) {
    return await db.refreshToken.upsert({
        where: { userId },
        update: { token: refreshToken },
        create: { userId, token: refreshToken },
    });
}

export default router;
