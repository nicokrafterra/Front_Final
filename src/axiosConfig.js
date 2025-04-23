import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // Cambia a true si usas cookies
  timeout: 30000, // 30 segundos timeout
});

// Interceptor de solicitudes MEJORADO
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    // Configuración dinámica de headers
    config.headers = {
      ...config.headers,
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined,
      // No establecemos Content-Type por defecto para permitir FormData
    };

    // Elimina headers undefined
    Object.keys(config.headers).forEach(key => {
      if (config.headers[key] === undefined) {
        delete config.headers[key];
      }
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas MEJORADO
api.interceptors.response.use(
  response => response,
  error => {
    // Manejo detallado de errores CORS
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      console.error('🚨 Error CORS detectado:', {
        message: error.message,
        config: error.config,
        response: error.response
      });
      
      // Mensaje amigable para el usuario
      if (typeof window !== 'undefined') {
        alert('Error de conexión con el servidor. Por favor verifica:\n1. Que el servidor esté en línea\n2. Que tengas conexión a internet\n3. Si el problema persiste, contacta al administrador');
      }
    }

    return Promise.reject(error);
  }
);

export default api;