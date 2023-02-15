import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import http from '../../http';
import { LoginUserReq, TokenResp } from '@backend/auth/types';
import { useContext, useState } from 'react';
import { UserContext, withUser } from '../../contexts/user';
import StatusCode from 'status-code-enum';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type LoginFormData = LoginUserReq;

const required = true;

const LoginPage = () => {
  const navigate = useNavigate();
  const user = withUser();
  if (user) {
    navigate('/');
  }

  const { setUser } = useContext(UserContext);

  const [httpErrors, setHttpErrors] = useState<{
    [k in keyof LoginFormData]?: boolean;
  }>({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setHttpErrors({});
    try {
      const response = await http.public.post<TokenResp>(
        '/api/auth/login',
        data,
      );
      // if (response.status == StatusCode.SuccessOK) {
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status == StatusCode.ClientErrorNotFound) {
          setHttpErrors({ email: true });
        } else if (err.response?.status == StatusCode.ClientErrorUnauthorized) {
          setHttpErrors({ password: true });
        }
      } else {
        throw err;
      }
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit((data) => onSubmit(data))} noValidate>
        <Form.Group className="mb-3">
          <Form.Label>email</Form.Label>
          <Form.Control
            type="email"
            placeholder="xyz@xyz.com"
            {...register('email', {
              required,
              validate: (value) => isEmail(value),
            })}
            isInvalid={'email' in errors || 'email' in httpErrors}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email && 'email is invalid'}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>password</Form.Label>
          <Form.Control
            type="password"
            placeholder="password"
            {...register('password', { required, minLength: 6 })}
            isInvalid={'password' in errors || 'password' in httpErrors}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password && 'password is invalid'}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">
          submit
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
