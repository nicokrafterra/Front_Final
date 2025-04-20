import axios from "axios";

// Usamos la variable de entorno para la URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para incluir el token en todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;