import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';
import { Request as JWTRequest } from 'express-jwt';

export interface RegisterUserReq {
    email: string;
    name: string;
    password: string;
}

export interface LoginUserReq {
    email: string;
    password: string;
}

export interface TokenResp {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenReq {
    refreshToken: string;
}

export interface JwtPayload extends BaseJwtPayload {
    email: string;
}

export type Request = JWTRequest<JwtPayload>;
