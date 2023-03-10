import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jsonwebtoken from 'jsonwebtoken';

import { base, db } from '../db';
import type { JwtPayload, TokenResp, UserResp } from './types';

export async function registerUser(
    email: string,
    password: string,
    name: string,
): Promise<TokenResp> {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new createHttpError.BadRequest('user already exists');
    }

    const hashedPassword = makePassword(password);
    const user = await db.user.create({
        data: { email, password: hashedPassword, name },
    });
    const tokens = makeTokenResp(user);
    await updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
}

export async function loginUser(
    email: string,
    password: string,
): Promise<TokenResp> {
    const user = await base.user.findUnique({ where: { email } });
    if (!user) {
        throw new createHttpError.NotFound('user does not exist');
    }

    if (!bcrypt.compareSync(password, user.password)) {
        throw new createHttpError.Unauthorized('invalid password');
    }

    const tokens = makeTokenResp(user);
    await updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
}

export async function refreshToken(refreshToken: string): Promise<TokenResp> {
    const parsed = jsonwebtoken.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
    ) as JwtPayload;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (parsed.exp && parsed.exp < nowInSeconds) {
        throw new createHttpError.Unauthorized(
            'refresh token expired, log in again',
        );
    }

    const userWithTokens = await db.user.findUnique({
        where: { email: parsed.email },
        include: {
            refreshTokens: true,
        },
    });
    if (!userWithTokens) {
        throw new createHttpError.Unauthorized('invalid refresh token');
    }

    const isValidRefreshToken = userWithTokens.refreshTokens.find(
        (t) => t.token === refreshToken,
    );
    if (!isValidRefreshToken) {
        throw new createHttpError.Unauthorized('invalid refresh token');
    }

    const tokens = makeTokenResp(userWithTokens);
    await updateRefreshToken(userWithTokens.id, tokens.refreshToken);
    return tokens;
}

export async function logoutUser(email: string) {
    await db.user.update({
        where: { email },
        data: {
            refreshTokens: {
                deleteMany: {},
            },
        },
    });
}

export async function whoAmI(email: string): Promise<UserResp> {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
        throw new createHttpError.Unauthorized('invalid email');
    }
    return maskUser(user);
}

const SALT_ROUNDS = 10;

export function makePassword(password: string) {
    return bcrypt.hashSync(password, SALT_ROUNDS);
}

function makeTokenResp(user: User): TokenResp {
    const email = user.email;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return {
        accessToken: jsonwebtoken.sign(
            { email },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: '1d',
            },
        ),
        ...makeRefreshToken(email),
        user: maskUser(user),
    };
}

export function maskUser(user: User): UserResp {
    return { ...user, password: '' };
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
