import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import http from '../../http';
import { LoginUserReq, TokenResp } from '@backend/auth/types';
import { useContext } from 'react';
import { UserContext, withUser } from '../../contexts/user';
import StatusCode from 'status-code-enum';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LocalStorageKey } from '../../constants';
import { useLocalStorage } from 'usehooks-ts';

type LoginFormData = LoginUserReq;

const required = 'this field is required';

const LoginPage = () => {
  const navigate = useNavigate();
  const user = withUser();
  if (user) {
    navigate('/');
  }
  const [_, setAuthKey] = useLocalStorage(LocalStorageKey.AUTH, '');

  const { setUser } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await http.public.post<TokenResp>(
        '/api/auth/login',
        data,
      );
      setUser(response.data.user);
      setAuthKey(response.data.accessToken);
      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === StatusCode.ClientErrorNotFound) {
          setError('email', {
            type: 'custom',
            message: 'email is not registered',
          });
        } else if (
          err.response?.status === StatusCode.ClientErrorUnauthorized
        ) {
          setError('password', {
            type: 'custom',
            message: 'incorrect password',
          });
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
              validate: (value) =>
                isEmail(value) ? true : 'a valid email is required',
            })}
            isInvalid={'email' in errors}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>password</Form.Label>
          <Form.Control
            type="password"
            placeholder="password"
            {...register('password', {
              required,
              minLength: {
                value: 6,
                message: 'password must have 6 characters',
              },
            })}
            isInvalid={'password' in errors}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password?.message}
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
