import express, { ErrorRequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { handleServiceError, makeErrors } from './util';

export const validate = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    return res
        .status(422)
        .json(makeErrors(errors.array().map((err) => err.msg)));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    if (res.headersSent) {
        return next(err);
    }
    return handleServiceError(res, err);
};
