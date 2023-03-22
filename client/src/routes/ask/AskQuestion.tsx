import './styles.css';

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
    <Container className="py-3">
      <h2 className="text-center mb-4 move-header">Ask a Question</h2>
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
          <Form.Control.Feedback type="invalid">
            {errors.question?.title?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>body</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="extra information :)"
            {...register('question.body', {
              required: true,
              minLength: { value: 1, message: 'Question must have a body' },
            })}
            isInvalid={'body' in (errors.question ?? {})}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.question?.body?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <div className="text-center">
          <Button variant="outline-primary" type="submit" className="mt-4">
            Ask!
          </Button>
          <div className="think"></div>
        </div>
      </Form>
    </Container>
  );
};

export default AskQuestion;
