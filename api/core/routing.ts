import express from 'express';
import { body, param } from 'express-validator';
import createHttpError from 'http-errors';
import multer from 'multer';

import { assertUserEmail } from '../auth/util';
import { jwtGuard, validate } from '../middleware';
import * as service from './service';
import type { PatchAnswerReq, PostAnswerReq, PostQuestionReq } from './types';

const upload = multer();
const router = express.Router();

router.get('/questions', async (req, res, next) => {
    try {
        if (
            'cursorId' in req.query &&
            Number.isNaN(Number(req.query['cursorId']))
        ) {
            throw new createHttpError.NotAcceptable(
                'cursorId must be a number',
            );
        }

        const cursorId =
            'cursorId' in req.query ? Number(req.query['cursorId']) : undefined;
        const questions = await service.getQuestions(cursorId);
        res.status(200).json(questions);
    } catch (err) {
        next(err);
    }
});

router.get(
    '/questions/:questionId',
    param('questionId').exists().isInt(),
    validate,
    async (req, res, next) => {
        try {
            const questionId = Number(req.params['questionId']);
            const question = await service.getQuestion(questionId);
            res.status(200).json(question);
        } catch (err) {
            next(err);
        }
    },
);

router.post(
    '/questions',
    jwtGuard(),
    body('question').exists().isObject(),
    body('question.title').exists().isString(),
    body('question.body').exists().isString(),
    validate,
    async (req, res, next) => {
        try {
            const email = assertUserEmail(req.auth?.email);
            const { question } = req.body as PostQuestionReq;

            const user = await service.getUser(email);
            const savedQuestion = await service.createQuestion({
                ...question,
                author: { connect: { id: user.id } },
            });

            return res.status(200).json(savedQuestion);
        } catch (err) {
            next(err);
        }
    },
);

router.post(
    '/questions/:questionId/answers',
    jwtGuard(),
    param('questionId').exists().isInt(),
    body('answer').exists().isObject(),
    body('answer.text').exists().isString(),
    validate,
    async (req, res, next) => {
        try {
            const questionId = Number(req.params['questionId']);
            const email = assertUserEmail(req.auth?.email);
            const { answer } = req.body as PostAnswerReq;

            const user = await service.getUser(email);
            const savedAnswer = await service.postAnswer(
                user.id,
                questionId,
                answer,
            );

            return res.status(200).json(savedAnswer);
        } catch (err) {
            next(err);
        }
    },
);

router.patch(
    '/answers/:answerId',
    jwtGuard(),
    param('questionId').exists().isInt(),
    param('answerId').exists().isInt(),
    body('answer').exists().isObject(),
    body('answer.text').exists().isString(),
    upload.single('file'),
    async (req, res, next) => {
        try {
            const answerId = Number(req.params['answerId']);
            const email = assertUserEmail(req.auth?.email);
            const { answer: answerData } = req.body as PatchAnswerReq;
            answerData.file = req.file?.buffer ?? null;

            const user = await service.getUser(email);
            const updatedAnswer = await service.patchAnswer(
                user.id,
                answerId,
                answerData,
            );

            return res.status(200).json(updatedAnswer);
        } catch (err) {
            next(err);
        }
    },
);

router.delete(
    '/answers/:answerId',
    jwtGuard(),
    param('questionId').exists().isInt(),
    async (req, res, next) => {
        try {
            const answerId = Number(req.params['answerId']);
            const email = assertUserEmail(req.auth?.email);

            const user = await service.getUser(email);
            await service.deleteAnswer(user.id, answerId);
            return res.status(204).json();
        } catch (err) {
            next(err);
        }
    },
);

export default router;
