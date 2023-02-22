import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/user';

const wrapper = BrowserRouter;

test('app renders', () => {
  render(<App />, { wrapper });
});

test('app shows login button', () => {
  render(<App />, { wrapper });

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
      <App />
    </UserContext.Provider>,
    { wrapper },
  );

  const logoutButton = screen.getByText('logout');
  const loginButton = screen.queryByText('login');

  expect(logoutButton).toBeVisible();
  expect(loginButton).not.toBeInTheDocument();
});
