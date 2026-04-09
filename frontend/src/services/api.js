export const getServices = () => API.get('/services/');
export const createRequest = (data) => API.post('/requests/create/', data);
export const getRequests = (role, user_id) =>
  API.get(`/requests/?role=${role}&user_id=${user_id}`);
export const updateStatus = (requestId, data) =>
  API.patch(`/requests/${requestId}/status/`, data);