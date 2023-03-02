import type express from 'express';
import { UnauthorizedError } from 'express-jwt';
import createHttpError, { HttpError } from 'http-errors';

import type { Errors, ServiceError } from './types';

/**
 * Create errors object for API response
 * @param errors
 * @returns
 */
export const makeErrors = (errors: string | string[]): Errors => {
    if (typeof errors === 'string') {
        errors = [errors];
    }
    return { errors };
};

export const handleServiceError = (
    res: express.Response,
    serviceError: ServiceError,
) => {
    if (serviceError instanceof UnauthorizedError) {
        serviceError = createHttpError.Unauthorized(
            serviceError.message ?? serviceError.inner.message,
        );
    }

    return serviceError instanceof HttpError
        ? res.status(serviceError.status).json(makeErrors(serviceError.message))
        : res.status(500).json(makeErrors(String(serviceError)));
};

// eslint-disable-next-line
type ShapeOf<T> = Record<keyof T, any>;
export type AssertKeysEqual<X extends ShapeOf<Y>, Y extends ShapeOf<X>> = never;
