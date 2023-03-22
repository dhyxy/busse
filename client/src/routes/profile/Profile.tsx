import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';

import { useUser } from '../../contexts/user';

export default () => {
  const navigate = useNavigate();
  const user = useUser();

  if (!user) {
    navigate('/');
  }

  return (
    <Container>
      <Row>
        <h1>
          {user?.name} <strong>({user?.id})</strong>
        </h1>
      </Row>
      <Row>
        <p>{user?.email}</p>
      </Row>
      <Row>created at: {user?.createdAt.toLocaleDateString()}</Row>
    </Container>
  );
};
