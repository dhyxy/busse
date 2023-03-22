import './feedstyle.css';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';

import { useUser } from '../../contexts/user';
import Feed from './Feed';

const Homepage = () => {
  const user = useUser();
  const navigate = useNavigate();

  return (
    <Container>
      {user && (
        <Row>
          <Col>
            <div> ‎</div>
            <Button className="btnAsk" onClick={() => navigate('/ask')}>
              ask a question
            </Button>
            <div> ‎</div>
          </Col>
        </Row>
      )}
      <Feed />
    </Container>
  );
};

export default Homepage;
