import { jest } from '@jest/globals';
import type { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

const mockDb = mockDeep<PrismaClient>();

jest.mock('./db', () => ({ base: mockDb, db: mockDb }));

beforeEach(() => {
    mockReset(mockDb);
});

export default mockDb;

it('ignore', () => {
    null;
});
