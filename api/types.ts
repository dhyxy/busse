import type { HttpError } from 'http-errors';

import * as DBTypes from '../node_modules/.prisma/client';

export interface Errors {
    errors: string[];
}

export type ServiceError = HttpError | unknown;

export { DBTypes };
