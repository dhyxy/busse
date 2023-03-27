import './profileStyle.css';

import type { Question } from '@backend/core/types';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';

import { useUser } from '../../contexts/user';
import http from '../../http';
const QuestionCard = ({ question }: { question: Question }) => {
  const navigate = useNavigate();

  const createdAt = new Date(question.createdAt).toLocaleDateString();
  return (
    <Card
      onClick={() => navigate(`/q/${question.id}`)}
      style={{ cursor: 'pointer' }}
      className="question-card"
    >
      <Card.Body>
        <Card.Title>{question.title}</Card.Title>
        <Card.Subtitle>asked on {createdAt}</Card.Subtitle>
        <Card.Text>{question.body}</Card.Text>
      </Card.Body>
    </Card>
  );
};
const Profile = () => {
  const navigate = useNavigate();
  const user = useUser();
  const userId = user?.id;
  const [questions, setQuestions] = useState<Question[]>([]);
  if (!user) {
    navigate('/');
  }
  const createdDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : 'N/A';

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const resp = await http.public.get<Question[]>(
          `/api/questions?userId=${userId}`,
        );
        const userQuestions = resp.data.filter((q) => q.authorId === userId);
        setQuestions(userQuestions);
      } catch (err) {
        setQuestions([]);
      }
    };
    fetchQuestions();
  }, [userId]);
  return (
    <Container>
      <Row className="my-3">
        <h1
          className="text-white"
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            position: 'relative',
          }}
        >
          hey {user?.name}! <strong className="glowing">﹝{user?.id}﹞</strong>
        </h1>
      </Row>
      <Row className="my-3">
        <div className="d-flex align-items-center">
          <div className="rounded-pill bg-white text-purple px-3 py-1 me-3">
            your email:
          </div>
          <div className="text-white">{user?.email}</div>
        </div>
      </Row>

      <Row className="my-3">
        <div className="d-flex align-items-center">
          <div className="rounded-pill bg-white text-purple px-3 py-1 me-3">
            you joined on:
          </div>
          <div className="text-white">{createdDate}</div>
        </div>
      </Row>
      <div className="background">
        <p
          className="text-white text-center"
          style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            position: 'relative',
          }}
        >
          {' '}
          your questions:
        </p>
        <Container>
          <div className="d-grid gap-3">
            {questions.map((q) => (
              <div key={q.id}>
                <QuestionCard question={q} />
              </div>
            ))}
          </div>
        </Container>
      </div>
    </Container>
  );
};

export default Profile;
