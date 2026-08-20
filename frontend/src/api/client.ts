import axios from 'axios';
import { getToken } from '../utils/token';

// eslint-disable-next-line import/no-named-as-default-member
const client = axios.create({
  // for expo go use this command to find your local IP address: ipconfig getifaddr en0
  //baseURL: 'http://192.168.0.219:8090',
  baseURL: 'http://172.20.10.4:8090',
  //baseURL: 'http://172.20.10.10:8090',
  //baseURL: 'http://192.168.68.109:8090',
  //baseURL: 'http://192.168.68.104:8090',
  //baseURL: 'http://192.168.111.23:8090',
  //baseURL: 'http://localhost:8080', r// for simulator
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('JWT attached to request:', config.url);
    } else {
      console.warn('No JWT token found in SecureStore for:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('403 Forbidden - JWT may be invalid or missing:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default client;
