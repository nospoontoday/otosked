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

export function createProject(templateKey, engineType) {
    return api.post('/projects', { templateKey, engineType }).then(r => r.data);
}