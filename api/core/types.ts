import type { getQuestion } from './service';

export interface PostQuestionReq {
    question: { title: string; body: string };
}

export type GetQuestionResp = Awaited<ReturnType<typeof getQuestion>>;
