<template>
	<button class="back-button" @click="volver">
		<img src="../assets/IMG/arrow-left.svg" alt="Volver" />
	</button>
	<div class="update-form">
		<h2>Actualizar Correo Electrónico</h2>
		<form @submit.prevent="updateEmail">
			<div>
				<label for="newEmail">Nuevo Correo Electrónico:</label>
				<input type="email" v-model="newEmail" required />
			</div>
			<button class="btn" type="submit">Actualizar Correo</button>
		</form>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'vue-router';
import api from '@/axiosConfig';

const newEmail = ref('');
const userId = ref(null);
const router = useRouter(); // Necesario para navegar en <script setup>

// Método para extraer el user_id del token
function obtenerUserId() {
	const token = localStorage.getItem('token');
	if (token) {
		try {
			const decodedToken = jwtDecode(token);
			userId.value = decodedToken.sub; // "sub" es el ID del usuario en JWT
		} catch (error) {
			console.error('Error al decodificar el token:', error);
			userId.value = null;
		}
	}
}

// Método para actualizar el correo electrónico
async function updateEmail() {
	if (!userId.value) {
		Swal.fire({
			title: 'Error',
			text: 'No se pudo obtener la información del usuario.',
			icon: 'error',
			confirmButtonText: 'Aceptar',
		});
		return;
	}

	try {
		await api.put(
			`/usuarios/${userId.value}/correo`,
			{ nuevo_correo: newEmail.value },
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		);

		Swal.fire({
			title: '¡Éxito!',
			text: 'Correo electrónico actualizado exitosamente',
			icon: 'success',
			confirmButtonText: 'Aceptar',
		});
	} catch (error) {
		console.error(error);
		Swal.fire({
			title: 'Error',
			text: error.response?.data?.detail || 'Error al actualizar el correo electrónico',
			icon: 'error',
			confirmButtonText: 'Aceptar',
		});
	}
}

// Método para volver a la página anterior
function volver() {
	router.back(); // Ahora usa `router` en lugar de `this.$router`
}

// Llamar a obtenerUserId cuando el componente se monte
onMounted(() => {
	obtenerUserId();
});
</script>


<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');

:root {
  --primary: #4361ee;
  --primary-light: #4895ef;
  --accent: #f72585;
  --dark: #1b263b;
  --darker: #0d1b2a;
  --light: #f8f9fa;
  --danger: #ef233c;
  --success: #4cc9f0;
  --warning: #f8961e;
  --gray: #adb5bd;
  --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(67, 97, 238, 0.1);
  border: 1px solid rgba(67, 97, 238, 0.3);
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 30px;
  font-family: 'Quicksand', sans-serif;
}

.back-button:hover {
  background: rgba(67, 97, 238, 0.3);
  transform: translateX(-5px);
}

.update-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  background: linear-gradient(135deg, #1b263b 0%, #0d1b2a 100%);
  padding: 40px;
}

.update-form {
  width: 100%;
  max-width: 500px;
  padding: 40px;
  background: rgba(13, 27, 42, 0.9);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.6s ease-out;
	margin-left: auto;
	margin-right: auto;
}

h2 {
  text-align: center;
  color: white;
  margin-bottom: 30px;
  font-weight: 600;
  font-size: 24px;
  position: relative;
  padding-bottom: 15px;
  font-family: 'Quicksand', sans-serif;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(to right, var(--primary), var(--accent));
  border-radius: 2px;
}

.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 10px;
  color: var(--gray);
  font-size: 14px;
  font-weight: 500;
  font-family: 'Quicksand', sans-serif;
}

input {
  width: 100%;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 14px;
  transition: var(--transition);
  font-family: 'Quicksand', sans-serif;
}

input:focus {
  border-color: var(--primary);
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 15px;
}

.btn {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: var(--transition);
  font-family: 'Quicksand', sans-serif;
}

button[type="submit"] {
  background: var(--primary);
  color: white;
}

button[type="button"] {
  background: rgba(239, 35, 60, 0.2);
  color: var(--danger);
  border: 1px solid var(--danger);
}

button[type="submit"]:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
}

button[type="button"]:hover {
  background: rgba(239, 35, 60, 0.3);
  transform: translateY(-2px);
}

p {
  text-align: center;
  color: var(--gray);
  margin-bottom: 20px;
  font-size: 14px;
  font-family: 'Quicksand', sans-serif;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .update-container {
    padding: 20px;
  }
  
  .update-form {
    padding: 30px 20px;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style>