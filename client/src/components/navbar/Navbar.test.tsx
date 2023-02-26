import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { UserContext } from '../../contexts/user';
import Navbar from '.';

const wrapper = BrowserRouter;

test('app renders', () => {
  render(<Navbar />, { wrapper });
});

test('app shows login button', () => {
  render(<Navbar />, { wrapper });

  const loginButton = screen.getByText('login');
  const logoutButton = screen.queryByText('logout');

  expect(loginButton).toBeVisible();
  expect(logoutButton).not.toBeInTheDocument();
});

test('app shows logout button', () => {
  render(
    <UserContext.Provider
      value={{ user: { email: 'test@test.com' }, setUser: (_) => _ }}
    >
      <Navbar />
    </UserContext.Provider>,
    { wrapper },
  );

  const logoutButton = screen.getByText('logout');
  const loginButton = screen.queryByText('login');

  expect(logoutButton).toBeVisible();
  expect(loginButton).not.toBeInTheDocument();
});
