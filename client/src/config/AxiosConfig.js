import axios from 'axios';

export const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL||"http://localhost:8081",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for cookies/auth headers in CORS
});

export const baseURL = import.meta.env.VITE_API_URL;