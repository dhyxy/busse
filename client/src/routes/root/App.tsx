import './App.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, Outlet } from 'react-router-dom';

import { useUser } from '../../contexts/user';

const App = () => {
  const user = useUser();

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
