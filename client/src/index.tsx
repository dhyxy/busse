import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { UserProvider } from './contexts/user';
import LoginPage from './routes/login/LoginPage';
import Logout from './routes/logout/Logout';
import QuestionPage from './routes/q/QuestionPage';
import App from './routes/root/App';
import Feed from './routes/root/Feed';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/logout', element: <Logout /> },
      { path: '/', element: <Feed /> },
      { path: '/q/:id', element: <QuestionPage /> },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>,
);
