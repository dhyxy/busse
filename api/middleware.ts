import type { ErrorRequestHandler } from 'express';
import type express from 'express';
import { expressjwt } from 'express-jwt';
import { validationResult } from 'express-validator';

import { handleServiceError, makeErrors } from './util';

export const validate = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json(makeErrors(errors.array().map((err) => err.msg)));
    }

    return next();
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    if (res.headersSent) {
        return next(err);
    }
    return handleServiceError(res, err);
};

const JWT_GUARD = expressjwt({
    secret: process.env.JWT_ACCESS_SECRET,
    algorithms: ['HS256'],
});

export const jwtGuard = () => JWT_GUARD;
