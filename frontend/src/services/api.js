import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Centralized Axios Instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Token
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

// Response Interceptor: Handle Global Errors & Formatting
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

// ================= API SERVICE MODULES =================

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

export const visitsAPI = {
  getAll: (params) => apiClient.get('/visits', { params }),
  create: (data) => apiClient.post('/visits', data),
  updateStatus: (id, status) => apiClient.patch(`/visits/${id}/status`, { status }),
};

export const outbreaksAPI = {
  getAll: () => apiClient.get('/outbreaks'),
  getProvinces: () => apiClient.get('/outbreaks/provinces'),
  getTrends: () => apiClient.get('/outbreaks/trends'),
  exportData: () => apiClient.get('/outbreaks/export'),
};

export const weatherAPI = {
  getCurrent: (location) => apiClient.get('/weather/current', { params: { location } }),
  getForecast: () => apiClient.get('/weather/forecast'),
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

// ================= BACKWARD-COMPATIBLE ADAPTER =================
export const api = {
  getCases: (params) => casesAPI.getAll(params).then(res => res.data || res),
  getCaseById: (id) => casesAPI.getById(id).then(res => res.data || res),
  getStats: (role) => adminAPI.getStats(role).then(res => res.data || res),
  getOutbreaks: () => outbreaksAPI.getAll().then(res => res.data || res),
  getWeather: (loc) => weatherAPI.getCurrent(loc).then(res => res.data || res),
  getOfficers: () => apiClient.get('/officers').then(res => res.data || res),
  getUsers: (params) => adminAPI.getUsers(params).then(res => res.data || res),
  getFieldVisits: (params) => visitsAPI.getAll(params).then(res => res.data || res),
  submitCase: (data) => casesAPI.create(data).then(res => res.data || res),
  updateCaseStatus: (id, status) => casesAPI.escalate(id, status).then(res => res.data || res),
};

export default api;
