import type { Prisma, Question, User } from '@prisma/client';

import { db } from '../db';

const MAX_QUESTIONS_PER_PAGE = 15;

type CursorType = Question['id'];

export async function getQuestions(cursorId?: CursorType) {
    const questions = await db.question.findMany({
        take: MAX_QUESTIONS_PER_PAGE,
        orderBy: { id: 'asc' },
        ...(cursorId && { cursor: { id: cursorId } }),
    });
    return questions;
}

export async function createQuestion(
    question: Prisma.QuestionCreateWithoutAuthorInput,
    authorId: User['id'],
) {
    const data = { ...question, authorId };
    return await db.question.create({ data });
}

export async function getUser(email: string) {
    return await db.user.findUniqueOrThrow({ where: { email } });
}
