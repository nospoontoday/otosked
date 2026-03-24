import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
});

let _fingerprint = null;
export const setFingerprint = fp => (_fingerprint = fp);
export const getFingerprint = () => _fingerprint;

api.interceptors.request.use(config => {
  if (_fingerprint) {
    config.headers['x-fingerprint'] = _fingerprint;
  }
  return config;
});

export default api;