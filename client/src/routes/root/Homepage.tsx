import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Feed from './Feed';

const Homepage = () => {
  return (
    <Container>
      <Row>
        <Col>
          <Button>ask a question</Button>
        </Col>
      </Row>
      <Feed />
    </Container>
  );
};

export default Homepage;
