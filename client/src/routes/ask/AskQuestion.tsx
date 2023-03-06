import type { PostQuestionReq } from '@backend/core/types';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'usehooks-ts';

import { useUser } from '../../contexts/user';
import http from '../../http';

type QuestionFormData = PostQuestionReq;

const AskQuestion = () => {
  const user = useUser();
  const navigate = useNavigate();

  useEffectOnce(() => {
    if (!user) {
      navigate('/');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionFormData>();

  const onSubmit = async (data: QuestionFormData) => {
    await http.private.post('/api/questions', data);
    navigate('/');
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <Form.Group>
          <Form.Label>title</Form.Label>
          <Form.Control
            type="text"
            placeholder="the question title"
            {...register('question.title', {
              required: true,
              minLength: { value: 3, message: 'title must have 3 letters' },
            })}
            isInvalid={'title' in (errors.question ?? {})}
          ></Form.Control>
          <Form.Control.Feedback>
            {errors.question?.title?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>body</Form.Label>
          <Form.Control
            type="text"
            placeholder="extra information :)"
            {...register('question.body', {
              required: true,
              minLength: { value: 1, message: 'question must have a body' },
            })}
            isInvalid={'body' in (errors.question ?? {})}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.question?.body?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">
          ask!
        </Button>
      </Form>
    </Container>
  );
};

export default AskQuestion;
