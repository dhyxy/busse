import type express from 'express';
import { HttpError } from 'http-errors';

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
    return serviceError instanceof HttpError
        ? res.status(serviceError.status).json(makeErrors(serviceError.message))
        : res.status(500).json(makeErrors(String(serviceError)));
};

// eslint-disable-next-line
type ShapeOf<T> = Record<keyof T, any>;
export type AssertKeysEqual<X extends ShapeOf<Y>, Y extends ShapeOf<X>> = never;
