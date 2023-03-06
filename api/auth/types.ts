import type { User } from '@prisma/client';
import type { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';

export interface RegisterUserReq {
    email: string;
    name: string;
    password: string;
}

export interface LoginUserReq {
    email: string;
    password: string;
}

/** [password] will always be '' for most purposes */
export type UserResp = Omit<User, 'password'> & { password: '' | string };

export interface TokenResp {
    accessToken: string;
    refreshToken: string;
    user: UserResp;
}

export interface RefreshTokenReq {
    refreshToken: string;
}

export interface JwtPayload extends BaseJwtPayload {
    email: string;
}
