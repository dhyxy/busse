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
import { AxiosError } from 'axios';

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

const useUserInterceptor = (setUser: Dispatch<SetStateAction<User>>) => {
  useEffect(() => {
    http.private.interceptors.response.clear();
    http.private.interceptors.response.use(
      (req) => req,
      (err: AxiosError) => {
        if (err.status == 401) {
          setUser({});
        }
        return Promise.reject(err.message);
      },
    );
  }, [setUser]);
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  useUserInterceptor(setUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
