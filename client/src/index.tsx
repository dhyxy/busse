import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Navbar from './components/navbar';
import { UserProvider } from './contexts/user';
import AskQuestion from './routes/ask/AskQuestion';
import LoginPage from './routes/login/LoginPage';
import Logout from './routes/logout/Logout';
import QuestionPage from './routes/q/QuestionPage';
import Homepage from './routes/root/Homepage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/logout', element: <Logout /> },
      { path: '/', element: <Homepage /> },
      { path: '/ask', element: <AskQuestion /> },
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
