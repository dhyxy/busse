import type { Prisma } from '@prisma/client';

import type { getQuestion, postAnswer } from './service';

export interface PostQuestionReq {
    question: { title: string; body: string };
}

export type GetQuestionResp = Awaited<ReturnType<typeof getQuestion>>;

const answerCreateData = {
    select: { text: true },
} satisfies Prisma.AnswerArgs;

export type AnswerCreateData = Prisma.AnswerGetPayload<typeof answerCreateData>;

export interface PostAnswerReq {
    answer: AnswerCreateData;
}

const answerPatchData = {
    select: { text: true },
} satisfies Prisma.AnswerArgs;

export type AnswerPatchData = Prisma.AnswerGetPayload<typeof answerPatchData>;

export interface PatchAnswerReq {
    answer: AnswerPatchData;
}

export type PostAnswerResp = Awaited<ReturnType<typeof postAnswer>>;

export type { Answer, Question } from '@prisma/client';
