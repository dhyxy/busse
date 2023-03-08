import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import type { ErrorRequestHandler } from 'express';
import type express from 'express';
import { expressjwt, UnauthorizedError } from 'express-jwt';
import { validationResult } from 'express-validator';
import createHttpError, { HttpError } from 'http-errors';

import type { Errors, ServiceError } from './types';

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

/**
 * Create errors object for API response
 * @param errors
 * @returns
 */
const makeErrors = (errors: string | string[]): Errors => {
    if (typeof errors === 'string') {
        errors = [errors];
    }
    return { errors };
};

const handleServiceError = (
    res: express.Response,
    serviceError: ServiceError,
) => {
    if (serviceError instanceof UnauthorizedError) {
        serviceError = createHttpError.Unauthorized(
            serviceError.message ?? serviceError.inner.message,
        );
    } else if (serviceError instanceof PrismaClientKnownRequestError) {
        serviceError = createHttpError.NotFound(serviceError.message);
    }

    return serviceError instanceof HttpError
        ? res.status(serviceError.status).json(makeErrors(serviceError.message))
        : res.status(500).json(makeErrors(String(serviceError)));
};
