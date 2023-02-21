import { DBTypes } from '@backend/types';
import http from '../http';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { LocalStorageKey } from '../constants';
import { AxiosError, HttpStatusCode } from 'axios';

type User = Partial<DBTypes.User> | null;
type SetUserAction = Dispatch<SetStateAction<User>>;

interface UserContextType {
  user: User;
  setUser: SetUserAction;
}

export const UserContext = createContext<UserContextType>(
  {} as UserContextType,
);

/** Returns current user, prefer this over `useContext(...)` */
export const withUser = () => {
  const { user } = useContext(UserContext);
  return user;
};

const useAuthHeaders = () => {
  const [authKey, setAuthKey] = useLocalStorage(LocalStorageKey.AUTH, '');
  http.private.interceptors.response.clear();
  http.private.interceptors.response.use(
    (_) => _,
    (err: AxiosError) => {
      if (err.status == HttpStatusCode.Unauthorized) {
        setAuthKey('');
      }
      return Promise.reject(err.message);
    },
  );

  http.private.interceptors.request.clear();
  http.private.interceptors.request.use((config) => {
    if (authKey) {
      config.headers.Authorization = `Bearer ${authKey}`;
    } else if (config.headers.Authorization != null) {
      delete config.headers.Authorization;
    }
    return config;
  });
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  useAuthHeaders();

  const authKey = useReadLocalStorage(LocalStorageKey.AUTH);

  useEffect(() => {
    if (!authKey) {
      setUser(null);
    }
  }, [authKey]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
