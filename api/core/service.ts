import type { Answer, Prisma, Question, User } from '@prisma/client';
import createHttpError from 'http-errors';

import { db } from '../db';
import type { AnswerPatchData } from './types';

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

export async function getQuestion(questionId: Question['id']) {
    return await db.question.findUnique({
        where: {
            id: questionId,
        },
        include: {
            author: true,
            answers: {
                include: { author: true },
            },
        },
    });
}

export async function createQuestion(question: Prisma.QuestionCreateInput) {
    return await db.question.create({ data: question });
}

export async function getUser(email: string) {
    return await db.user.findUniqueOrThrow({ where: { email } });
}

export async function postAnswer(answer: Prisma.AnswerCreateInput) {
    if (!answer.question.connect?.id || !answer.author.connect?.id) {
        throw new Error('question must connect via id');
    }
    const userAlreadySubmittedAnswer = await db.answer.findFirst({
        where: {
            questionId: answer.question.connect.id,
            author: { id: answer.author.connect.id },
        },
    });

    if (userAlreadySubmittedAnswer) {
        throw new createHttpError.Conflict(
            'user has already submitted an answer for this question',
        );
    }

    return await db.answer.create({
        data: answer,
    });
}

export async function deleteAnswer(userId: User['id'], answerId: Answer['id']) {
    await assertAnswerBelongsToUser(answerId, userId);
    return db.answer.delete({ where: { id: answerId } });
}

export async function getAnswer(id: Answer['id']) {
    return db.answer.findFirst({ where: { id } });
}

export async function patchAnswer(
    userId: User['id'],
    answerId: Answer['id'],
    data: AnswerPatchData,
) {
    await assertAnswerBelongsToUser(answerId, userId);

    return await db.answer.update({
        where: { id: answerId },
        data,
    });
}

async function assertAnswerBelongsToUser(
    userId: User['id'],
    answerId: Answer['id'],
) {
    const answerBelongsToUser = await db.answer.findFirst({
        where: { AND: [{ authorId: userId }, { id: answerId }] },
    });

    if (!answerBelongsToUser) {
        throw new createHttpError.Unauthorized('invalid auth');
    }
}
