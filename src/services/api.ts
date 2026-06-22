import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:5254/api",
  baseURL: `http://${window.location.hostname}:5254/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("scholaai_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Only set JSON content-type for plain object/JSON bodies.
  // For FormData, let the browser/axios set multipart/form-data + boundary automatically.
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default api;