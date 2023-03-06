import createHttpError from 'http-errors';

export function assertUserEmail(email?: string): string {
    if (!email) {
        throw createHttpError.Unauthorized('invalid auth');
    }
    return email;
}
