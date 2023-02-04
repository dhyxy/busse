import { JwtPayload } from './api/auth/types';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_ACCESS_SECRET: string;
            JWT_REFRESH_SECRET: string;
        }
    }
    namespace Express {
        export interface Request {
            auth?: JwtPayload;
        }
    }
}
// eslint-disable-next-line prettier/prettier
export { };
