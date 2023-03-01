import type { GetQuestionResp, Question } from '@backend/core/types';
import axios, { HttpStatusCode } from 'axios';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffectOnce } from 'usehooks-ts';

import http from '../../http';

const QuestionPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const id: Question['id'] = Number(params.id);
  const [question, setQuestion] = useState<GetQuestionResp>(null);

  useEffectOnce(() => {
    const fetchQuestion = async () => {
      try {
        const res = await http.public.get<GetQuestionResp>(
          `/api/questions/${id}`,
        );
        setQuestion(res.data);
      } catch (err) {
        if (
          axios.isAxiosError(err) &&
          err?.response?.status === HttpStatusCode.UnprocessableEntity
        ) {
          navigate('/');
        }
      }
    };
    fetchQuestion();
  });

  return question ? (
    <Container>
      <h1>{question.title}</h1>
      <p>{question.body}</p>
    </Container>
  ) : (
    <p>wait lol</p>
  );
};
export default QuestionPage;
