import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_API_URL, withCredentials: true });

let _fingerprint = null;
export function setFingerprint(fp) { _fingerprint = fp; }
export function getFingerprint() { return _fingerprint; }

api.interceptors.request.use(config => {
  if (_fingerprint) {
    config.headers['x-fingerprint'] = _fingerprint;
  }
  return config;
});

export const createProject = async (templateKey, engineType) => {
    try {
        const response = await api.post('/projects', { templateKey, engineType });
        return response.data;
    } catch (err) {
        // TODO: transform error
        throw err.response?.data || err;
    }
};