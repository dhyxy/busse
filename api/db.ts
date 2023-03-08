import { PrismaClient } from '@prisma/client';

export const base = new PrismaClient();
export const db = base.$extends({
    result: { user: { password: { needs: {}, compute: () => '' } } },
});
