import axios, { AxiosInstance } from 'axios';

interface BusseAxios {
  /** Public endpoints (/register, /login, etc.) */
  public: AxiosInstance;
  /** Private endpoints for post-login (when refresh token is available) */
  private: AxiosInstance;
}

const public_ = axios.create();
const private_ = axios.create();

const instances: BusseAxios = { public: public_, private: private_ };

export default instances;
