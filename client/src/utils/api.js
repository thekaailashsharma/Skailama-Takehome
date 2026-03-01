const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const fetchProfiles = () => request('/profiles');

export const createProfile = (name) =>
  request('/profiles', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });

export const fetchEvents = (profileId) =>
  request(`/events?profileId=${profileId}`);

export const createEvent = (data) =>
  request('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateEvent = (id, data) =>
  request(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const fetchEventLogs = (id) => request(`/events/${id}/logs`);
