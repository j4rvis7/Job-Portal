/**
 * src/api/axios.js
 * Pre-configured Axios instance.
 * withCredentials: true ensures cookies/sessions are sent with every request.
 */

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Send session cookie with every request
});

export default API;
