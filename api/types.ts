import { HttpError } from 'http-errors';

export interface Errors {
    errors: string[];
}

export type ServiceError = HttpError | unknown;
