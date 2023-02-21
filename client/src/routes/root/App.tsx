import './App.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { withUser } from '../../contexts/user';
import { Link, Outlet } from 'react-router-dom';

const App = () => {
  const user = withUser();

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            home
          </Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to="/">
              profile
            </Nav.Link>
            {user != null ? (
              <Nav.Link as={Link} to="/logout">
                logout
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login">
                login
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default App;
