import type {
  GetQuestionResp as Question,
  PostAnswerReq,
  PostAnswerResp,
} from '@backend/core/types';
import axios, { HttpStatusCode } from 'axios';
import { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce } from 'usehooks-ts';

import { useUser } from '../../contexts/user';
import http from '../../http';

type WriteAnswerFormData = PostAnswerReq;
type Answer = Question['answers'][number];

const QuestionPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const id: Question['id'] = Number(params.id);
  const [question, setQuestion] = useState<Question | null>(null);

  const fetchQuestion = useCallback(async () => {
    try {
      const res = await http.public.get<Question>(`/api/questions/${id}`);
      setQuestion(res.data);
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err?.response?.status === HttpStatusCode.UnprocessableEntity
      ) {
        navigate('/');
      }
    }
  }, [id, navigate]);

  useEffectOnce(() => {
    fetchQuestion();
  });

  return question ? (
    <Container>
      <h1>{question.title}</h1>
      <p>{question.body}</p>
      <Container>
        <AddAnswer question={question} fetchQuestion={fetchQuestion} />
      </Container>
      <Container>
        {question.answers.map((answer) => (
          <AnswerComponent
            answer={answer}
            key={answer.id}
            isSelectedAnswer={question.selectedAnswerId === answer.id}
          />
        ))}
      </Container>
    </Container>
  ) : (
    <p>wait lol</p>
  );
};

const AddAnswer = ({
  question,
  fetchQuestion,
}: {
  question: Question;
  fetchQuestion: () => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WriteAnswerFormData>();
  const user = useUser();

  const userAnswer = question?.answers.find(
    (a) => user?.id && a.authorId === user.id,
  );
  const hasUserAnswered = !!userAnswer;

  const onSubmit = async (data: WriteAnswerFormData) => {
    if (!user || !question) {
      return;
    }

    if (hasUserAnswered) {
      await http.private.patch(`/api/answers/${userAnswer.id}`, data);
    } else {
      await http.private.post<PostAnswerResp>(
        `/api/questions/${question.id}/answers`,
        data,
      );
    }
    fetchQuestion();
  };

  return (
    <Form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <Row>
        <Col>
          <Form.Group>
            <Form.Control
              as="textarea"
              placeholder={
                hasUserAnswered ? 'update your answer' : 'add an answer'
              }
              {...register('answer.text', {
                required: true,
                minLength: {
                  value: 6,
                  message: 'answer needs to be meaningful',
                },
              })}
              isInvalid={'text' in (errors?.answer ?? {})}
            />
            <Form.Control.Feedback type="invalid">
              {errors.answer?.text?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Button variant="primary" type="submit" disabled={!user}>
            {hasUserAnswered ? 'update' : 'submit'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const AnswerComponent = ({
  answer,
  isSelectedAnswer,
}: {
  answer: Answer;
  isSelectedAnswer?: boolean;
}) => {
  return (
    <Row className={isSelectedAnswer ? 'bg-primary' : undefined}>
      <Col>
        <h3>{answer.text}</h3>
        <p>posted by {answer.author.email}</p>
      </Col>
    </Row>
  );
};

export default QuestionPage;
