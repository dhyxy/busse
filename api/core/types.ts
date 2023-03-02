import { Prisma } from '@prisma/client';

import type { getQuestion, postAnswer } from './service';

export interface PostQuestionReq {
    question: { title: string; body: string };
}

export type GetQuestionResp = Awaited<ReturnType<typeof getQuestion>>;

const answerCreateData = Prisma.validator<Prisma.AnswerArgs>()({
    select: { text: true },
});

export type AnswerCreateData = Prisma.AnswerGetPayload<typeof answerCreateData>;

export interface PostAnswerReq {
    answer: AnswerCreateData;
}

const answerPatchData = Prisma.validator<Prisma.AnswerArgs>()({
    select: { text: true },
});

export type AnswerPatchData = Prisma.AnswerGetPayload<typeof answerPatchData>;

export interface PatchAnswerReq {
    answer: AnswerPatchData;
}

export type PostAnswerResp = Awaited<ReturnType<typeof postAnswer>>;

export type { Question } from '@prisma/client';
