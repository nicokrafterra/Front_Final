<template>
	<button class="back-button" @click="volver">
		<img src="../assets/IMG/arrow-left.svg" alt="Volver" />
	</button>
	<div class="recuperar-container">
		<h2>Recuperar Contraseña</h2>
		<form @submit.prevent="solicitarRecuperacion" class="form-recuperar">
			<label for="email">Ingresa tu correo electrónico:</label>
			<input type="email" id="email" v-model="email" required />
			<button type="submit" class="boton-enviar">Enviar</button>
		</form>
		<p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
	</div>
</template>

<script>
import api from '@/axiosConfig';
import axios from 'axios';

export default {
	data() {
		return {
			email: '',
			mensaje: ''
		};
	},
	methods: {
		async solicitarRecuperacion() {
			try {
				const response = await api.post('/recuperarpassword', { email: this.email });
				this.mensaje = response.data.message;
			} catch (error) {
				this.mensaje = error.response?.data?.detail || "Error al enviar el correo";
			}
		},
		volver() {
			this.$router.back();
		}
	}
};
</script>

<style scoped>
.back-button {
	padding: 10px 15px;
	background-color: #6a8e2300; /* Verde Oliva */
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-weight: bold;
	transition: background-color 0.3s;
}

.back-button:hover {
	background-color: #8B5A2B; /* Marrón Tierra */
}

.recuperar-container {
    max-width: 450px;
    margin: 40px auto;
    text-align: center;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
    animation: fadeIn 0.6s cubic-bezier(0.39, 0.575, 0.565, 1);
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.recuperar-container h2 {
    color: #2c3e50;
    font-weight: 600;
    margin-bottom: 25px;
    font-size: 1.8rem;
    position: relative;
    display: inline-block;
}

.recuperar-container h2::after {
    content: '';
    position: absolute;
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #3498db, #2ecc71);
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 3px;
}

.form-recuperar {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-recuperar label {
    font-size: 14px;
    color: #7f8c8d;
    text-align: left;
    font-weight: 500;
    margin-bottom: -10px;
}

.form-recuperar input {
    padding: 12px 15px;
    font-size: 15px;
    border: 1px solid #dfe6e9;
    border-radius: 8px;
    transition: all 0.3s ease;
    background-color: #fdfdfd;
}

.form-recuperar input:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    outline: none;
}

.boton-enviar {
    padding: 13px;
    font-size: 16px;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
}

.boton-enviar:hover {
    background: linear-gradient(135deg, #2980b9 0%, #27ae60 100%);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}

.boton-enviar:active {
    transform: translateY(0);
}

.mensaje {
    margin-top: 20px;
    padding: 12px;
    font-size: 14px;
    color: #27ae60;
    background-color: rgba(39, 174, 96, 0.1);
    border-radius: 8px;
    border-left: 4px solid #27ae60;
    animation: slideDown 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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

@keyframes slideDown {
    from {
        transform: translateY(-15px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Efecto de carga para el botón */
.boton-cargando {
    position: relative;
    color: transparent !important;
}

.boton-cargando::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    top: 50%;
    left: 50%;
    margin: -10px 0 0 -10px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>