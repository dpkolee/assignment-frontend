import axios from "axios";
import { helperUtils } from "./helpers";

export const api = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : "http://44.214.58.67/api",
  headers: {
    "Content-Type": "application/json",
    //uncomment for ngrok if needed
    // "ngrok-skip-browser-warning": true,
  },
});

api.interceptors.request.use(
  (config) => {
    const token = helperUtils.getAuthorizationToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
