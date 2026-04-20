import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const registerUser = (data) => API.post('/register/', data);
export const loginUser = (data) => API.post('/login/', data);
export const getServices = () => API.get('/services/');
export const createRequest = (data) => API.post('/requests/create/', data);
export const getRequests = (role, user_id) =>
  API.get(`/requests/?role=${role}&user_id=${user_id}`);
export const updateStatus = (requestId, data) =>
  API.patch(`/requests/${requestId}/status/`, data);
export const getMasters = () => API.get('/masters/');
export const assignMaster = (requestId, data) =>
  API.patch(`/requests/${requestId}/assign/`, data);
export const getAvailability = () => API.get('/availability/');
export const updateAvailability = (data) => API.post('/availability/update/', data);
export const getMasterJobs = (masterId) =>
  API.get(`/requests/master/${masterId}/`);
export const updateProgress = (requestId, data) =>
  API.patch(`/requests/${requestId}/progress/`, data);
export const getHistory = (params) =>
  API.get('/requests/history/', { params });
export const getStats = () => API.get('/stats/');
export const getReports = (params) => API.get('/reports/', { params });
export const getNotifications = (userId) =>
  API.get(`/notifications/?user_id=${userId}`);
export const markRead = (notificationId) =>
  API.patch(`/notifications/read/${notificationId}/`);
export const markAllRead = (userId) =>
  API.patch('/notifications/read-all/', { user_id: userId });