import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import { LocalStorageKey } from '../../constants';
import { UserContext } from '../../contexts/user';
import http from '../../http';

const Logout = () => {
  const [authKey, setAuthKey] = useLocalStorage(LocalStorageKey.AUTH, '');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authKey) {
      http.private.post('api/auth/logout');
      setAuthKey('');
    }
    setUser(null);
    navigate('/');
  }, [authKey, navigate, setAuthKey, setUser]);

  return <></>;
};

export default Logout;
