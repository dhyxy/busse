import { mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { jest } from '@jest/globals';

const mockDb = mockDeep<PrismaClient>();

jest.mock('./db', () => ({
    __esModule: true,
    default: mockDb,
}));

beforeEach(() => {
    mockReset(mockDb);
});

export default mockDb;

it('ignore', () => {
    null;
});
