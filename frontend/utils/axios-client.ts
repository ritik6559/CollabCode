import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const axiosClient = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;