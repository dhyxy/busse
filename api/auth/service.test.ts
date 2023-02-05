import { User } from '@prisma/client';
import createHttpError from 'http-errors';
import mockDb from '../db.test';
import * as service from './service';

describe('auth service', () => {
    const TEST_USER_PASSWORD = 'password';
    const TEST_USER: User = {
        id: 1,
        email: 'test@email.com',
        password: service.makePassword(TEST_USER_PASSWORD),
        createdAt: new Date(),
        name: 'test',
    };
    it('should register new user', async () => {
        mockDb.user.create.mockResolvedValue(TEST_USER);

        await expect(
            service.registerUser(
                TEST_USER.email,
                TEST_USER.password,
                TEST_USER.name,
            ),
        ).resolves.not.toThrow();
        expect(mockDb.user.create).toHaveBeenCalledTimes(1);
    });

    it('should throw if attempt to register existing user', async () => {
        mockDb.user.findUnique.mockResolvedValue(TEST_USER);

        await expect(
            service.registerUser(
                TEST_USER.email,
                TEST_USER.password,
                TEST_USER.name,
            ),
        ).rejects.toThrow();
        expect(mockDb.user.create).not.toHaveBeenCalled();
    });

    it('should login user', async () => {
        mockDb.user.findUnique.mockResolvedValue(TEST_USER);
        await expect(
            service.loginUser(TEST_USER.email, TEST_USER_PASSWORD),
        ).resolves.not.toThrow();
    });

    it("shouldn't login user if user doesn't exist", async () => {
        await expect(
            service.loginUser(TEST_USER.email, TEST_USER_PASSWORD),
        ).rejects.toThrowError(createHttpError.HttpError);
    });

    it("shouldn't login user if password is incorrect", async () => {
        mockDb.user.findUnique.mockResolvedValue(TEST_USER);
        await expect(
            service.loginUser(
                TEST_USER.email,
                TEST_USER_PASSWORD + 'haha wrong password',
            ),
        ).rejects.toThrowError(createHttpError.HttpError);
    });
});
