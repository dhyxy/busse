export interface Errors {
    errors: string[];
}

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
