import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './routes/root/App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './contexts/user';
import LoginPage from './routes/login/LoginPage';
import Logout from './routes/logout/Logout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/logout', element: <Logout /> },
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
