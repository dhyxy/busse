import './profileStyle.css';

import type { Question } from '@backend/core/types';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';

import { useUser } from '../../contexts/user';

const Profile = () => {
  const navigate = useNavigate();
  const user = useUser();
  if (!user) {
    navigate('/');
  }
  const createdDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : 'N/A';

  return (
    <Container>
      <Row className="my-3">
        <h1
          className="text-white"
          style={{
            fontSize: '4rem',
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
    </Container>
  );
};

export default Profile;
