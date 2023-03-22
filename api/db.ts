import { PrismaClient } from '@prisma/client';

export const base = new PrismaClient();
export const db = base.$extends({
    result: {
        user: { password: { needs: {}, compute: () => '' } },
        answer: {
            file: {
                needs: { file: true },
                compute: (answer) =>
                    answer ? answer.file?.toString('base64') : null,
            },
        },
    },
});
