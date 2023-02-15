import { User } from '@prisma/client';
import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';

export interface RegisterUserReq {
    email: string;
    name: string;
    password: string;
}

export interface LoginUserReq {
    email: string;
    password: string;
}

export type UserResp = Omit<User, 'password'>;

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
