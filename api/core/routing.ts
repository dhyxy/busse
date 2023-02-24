import express from 'express';
import { body, param } from 'express-validator';
import createHttpError from 'http-errors';

import { jwtGuard, validate } from '../middleware';
import * as service from './service';
import type { PostQuestionReq } from './types';

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
            const email = req.auth?.email;
            if (!email) {
                throw new createHttpError.Unauthorized('invalid auth');
            }
            const { question } = req.body as PostQuestionReq;
            const user = await service.getUser(email);
            const savedQuestion = await service.createQuestion(
                question,
                user.id,
            );

            return res.status(200).json(savedQuestion);
        } catch (err) {
            next(err);
        }
    },
);

export default router;
