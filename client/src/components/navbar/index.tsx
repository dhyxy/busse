import './Navbar.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import BSNavbar from 'react-bootstrap/Navbar';
import { Link, Outlet } from 'react-router-dom';

import { useUser } from '../../contexts/user';

const Navbar = () => {
  const user = useUser();

  return (
    <>
      <BSNavbar bg="none" variant="dark">
        <Container>
          <BSNavbar.Brand as={Link} to="/">
            <img src="logo.png" alt="logo" className="logo" />
            bussé
          </BSNavbar.Brand>
          <Nav>
            {user != null ? (
              <Nav.Link as={Link} to="/profile">
                profile
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/register">
                register
              </Nav.Link>
            )}
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
      </BSNavbar>
      <Outlet />
    </>
  );
};

export default Navbar;
