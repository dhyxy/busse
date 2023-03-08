import type { UserResp } from '@backend/auth/types';
import type { AxiosError } from 'axios';
import { HttpStatusCode } from 'axios';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';

import { LocalStorageKey } from '../constants';
import http from '../http';
import { isEmpty } from '../util';

export type User = UserResp | null;
type SetUserAction = Dispatch<SetStateAction<User>>;

interface UserContextType {
  user: User;
  setUser: SetUserAction;
}

export const UserContext = createContext<UserContextType>(
  {} as UserContextType,
);

/** Returns current user, prefer this over `useContext(...)` */
export const useUser = () => {
  const { user } = useContext(UserContext);
  return user;
};

const useAuthHeaders = () => {
  const [authKey, setAuthKey] = useLocalStorage(LocalStorageKey.AUTH, '');
  http.private.interceptors.response.clear();
  http.private.interceptors.response.use(
    (_) => _,
    (err: AxiosError) => {
      if (
        err.status === HttpStatusCode.Unauthorized ||
        err.response?.status === HttpStatusCode.Unauthorized
      ) {
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
  const authKey = useReadLocalStorage<string>(LocalStorageKey.AUTH);

  useEffect(() => {
    const refetchUser = async () => {
      try {
        const userResp = await http.private.get<UserResp>('/api/auth/whoAmI');
        if (!isEmpty(userResp.data)) {
          setUser(userResp.data);
        }
      } catch (err) {
        setUser(null);
      }
    };

    if (!authKey || (user && isEmpty(user))) {
      setUser(null);
    } else if (authKey && !user) {
      refetchUser();
    }
  }, [authKey, user, setUser]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
