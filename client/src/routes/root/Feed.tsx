import type { Question } from '@backend/core/types';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';

import http from '../../http';

const QuestionCard = ({ question }: { question: Question }) => {
  const navigate = useNavigate();

  const createdAt = new Date(question.createdAt).toLocaleDateString();
  return (
    <Card
      onClick={() => navigate(`/q/${question.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <Card.Body>
        <Card.Title>{question.title}</Card.Title>
        <Card.Subtitle>asked on {createdAt}</Card.Subtitle>
        <Card.Text>{question.body}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const Feed = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const resp = await http.public.get<Question[]>('/api/questions');
        setQuestions(resp.data);
      } catch (err) {
        setQuestions([]);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <Container>
      {questions.map((q) => (
        <Row key={q.id}>
          <QuestionCard question={q} />
        </Row>
      ))}
    </Container>
  );
};

export default Feed;
