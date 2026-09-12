import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agroguard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export const authAPI = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (data) => apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};

export const casesAPI = {
  getAll: (params) => apiClient.get('/cases', { params }),
  getById: (id) => apiClient.get(`/cases/${id}`),
  create: (data) => apiClient.post('/cases', data),
  escalate: (id, reason) => apiClient.patch(`/cases/${id}/escalate`, { reason }),
  review: (id, data) => apiClient.patch(`/cases/${id}/review`, data),
};

export const farmsAPI = {
  getAll: (params) => apiClient.get('/farms', { params }),
  getById: (id) => apiClient.get(`/farms/${id}`),
  create: (data) => apiClient.post('/farms', data),
};

export const visitsAPI = {
  getAll: (params) => apiClient.get('/visits', { params }),
  create: (data) => apiClient.post('/visits', data),
  updateStatus: (id, status, findings) =>
    apiClient.patch(`/visits/${id}/status`, { status, ...(findings || {}) }),
};

export const outbreaksAPI = {
  getAll: () => apiClient.get('/outbreaks'),
  getProvinces: () => apiClient.get('/outbreaks/provinces'),
  getTrends: () => apiClient.get('/outbreaks/trends'),
  confirm: (id, radiusKm) => apiClient.post(`/outbreaks/${id}/confirm`, { radiusKm }),
  exportData: () => apiClient.get('/outbreaks/export'),
};

export const weatherAPI = {
  getCurrent: (location, lat, lng) =>
    apiClient.get('/weather/current', { params: { location, lat, lng } }),
  getForecast: (lat, lng) =>
    apiClient.get('/weather/forecast', { params: { lat, lng } }),
};

export const alertsAPI = {
  getActive: () => apiClient.get('/alerts/active'),
  broadcast: (data) => apiClient.post('/alerts/broadcast', data),
};

export const notificationsAPI = {
  getAll: () => apiClient.get('/notifications'),
  getUnread: () => apiClient.get('/notifications/unread'),
  markRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  markAllRead: () => apiClient.patch('/notifications/read-all'),
};

export const adminAPI = {
  getUsers: (params) => apiClient.get('/admin/users', { params }),
  updateUserStatus: (id, status) => apiClient.patch(`/admin/users/${id}/status`, { status }),
  getSystemHealth: () => apiClient.get('/admin/system-health'),
  getStats: (role) => apiClient.get('/dashboard/stats', { params: { role } }),
};

export const api = {
  getCases: (params) => casesAPI.getAll(params).then((res) => res.data || res),
  getCaseById: (id) => casesAPI.getById(id).then((res) => res.data || res),
  getFarms: (params) => farmsAPI.getAll(params).then((res) => res.data || res),
  createFarm: (data) => farmsAPI.create(data).then((res) => res.data || res),
  getStats: (role) => adminAPI.getStats(role).then((res) => res.data || res),
  getOutbreaks: () => outbreaksAPI.getAll().then((res) => res.data || res),
  confirmOutbreak: (id, radiusKm) => outbreaksAPI.confirm(id, radiusKm).then((res) => res.data || res),
  getWeather: (loc, lat, lng) => weatherAPI.getCurrent(loc, lat, lng).then((res) => res.data || res),
  getOfficers: () => apiClient.get('/officers').then((res) => res.data || res),
  getUsers: (params) => adminAPI.getUsers(params).then((res) => res.data || res),
  getFieldVisits: (params) => visitsAPI.getAll(params).then((res) => res.data || res),
  updateVisitStatus: (id, status, findings) => visitsAPI.updateStatus(id, status, findings).then((res) => res.data || res),
  submitCase: (data) => casesAPI.create(data).then((res) => res.data || res),
  updateCaseStatus: (id, status) => casesAPI.escalate(id, status).then((res) => res.data || res),
};

export default api;
