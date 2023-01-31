import express from 'express';
import { validationResult } from 'express-validator';
import { makeErrors } from './util';

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
