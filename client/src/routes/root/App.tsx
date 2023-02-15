import './App.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { withUser } from '../../contexts/user';
import { Outlet } from 'react-router-dom';

const App = () => {
  const user = withUser();

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">home</Navbar.Brand>
          <Nav>
            <Nav.Link href="/profile">profile</Nav.Link>
            {user != null ? (
              <Nav.Link href="/logout">logout</Nav.Link>
            ) : (
              <Nav.Link href="/login">login</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default App;
