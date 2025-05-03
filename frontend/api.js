import axios from 'axios';

const BASE = 'http://localhost:3000';  // your middleware

// SOAP Login
export function login(username, password) {
  return axios.post(`${BASE}/api/login`, { username, password });
}

// Create a booking
export function createBooking(data) {
  return axios.post(`${BASE}/api/book`, data);
}

// Check for conflicts
export function checkConflict(data) {
  return axios.post(`${BASE}/api/checkConflict`, data);
}

// Fetch room status
export function fetchStatus() {
  return axios.get(`${BASE}/api/status`);
}
