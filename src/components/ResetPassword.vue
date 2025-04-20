<template>
  <div class="reset-container">
    <h2>Restablecer contraseña</h2>
    <form @submit.prevent="resetPassword" class="reset-form">
      <label>Nueva contraseña:</label>
      <input type="password" v-model="newPassword" required class="reset-input" />
      <button type="submit" class="reset-button">Restablecer</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue"; // Importa ref para manejar el estado
import api from "@/axiosConfig";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const token = route.query.token;
    const newPassword = ref(""); // Usa ref para manejar newPassword

    const resetPassword = async () => {
  try {
    const datos = {
      token: token,
      nueva_contraseña: newPassword.value,
    };

    console.log("Datos enviados:", datos); // Verifica los datos antes de enviar

    const response = await api.post("/reset-password", datos);
	Swal.fire({
      icon: "success",
      title: "¡Contraseña restablecida!",
      text: "Tu contraseña ha sido restablecida correctamente.",
      confirmButtonText: "OK",
    });
    router.push("/Iniciar");
  } catch (error) {
    console.error("Error en la solicitud:", error.response?.data); // Muestra el error del backend
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un problema al restablecer la contraseña.",
      confirmButtonText: "Intentar de nuevo",
    });
	
	// Manejo de errores específico
	if (error.response && error.response.status === 400) {
	  Swal.fire({
		icon: "error",
		title: "Error",
		text: "El token es inválido o ha expirado.",
		confirmButtonText: "Entendido",
	  });
	} else if (error.response && error.response.status === 500) {
	  Swal.fire({
		icon: "error",
		title: "Error del servidor",
		text: "Por favor, intenta más tarde.",
		confirmButtonText: "Entendido",
	  });
	} else {
	  Swal.fire({
		icon: "error",
		title: "Error desconocido",
		text: "Por favor, intenta más tarde.",
		confirmButtonText: "Entendido",
	  });
	}
  }
};

    return { newPassword, resetPassword }; // Expone newPassword y resetPassword al template
  },
};
</script>

<style scoped>
.reset-container {
  max-width: 450px;
  margin: 40px auto;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.reset-container h2 {
  text-align: center;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 30px;
  font-size: 1.8rem;
  position: relative;
}

.reset-container h2::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #4CAF50, #2ecc71);
  margin: 10px auto 0;
  border-radius: 3px;
}

.reset-form label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.reset-input {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: #fdfdfd;
}

.reset-input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  outline: none;
}

.reset-button {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #4CAF50 0%, #2ecc71 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}

.reset-button:hover {
  background: linear-gradient(135deg, #45a049 0%, #27ae60 100%);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.reset-button:active {
  transform: translateY(0);
}

/* Efecto de carga */
.reset-button.loading {
  position: relative;
  color: transparent;
}

.reset-button.loading::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>