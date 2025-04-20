<template>
	<div class="settings-container">
		<!-- Sección izquierda - Información del usuario -->
		<div class="user-info-section">
			<button class="back-button" @click="volver">
				<i class="fas fa-arrow-left"></i>
				<span>Volver</span>
			</button>

			<div class="profile-card">
				<div class="profile-avatar">
					<img v-if="typeof imagenPerfil === 'string' && !imagenPerfil.includes('fa-user-circle')"
						:src="imagenPerfil" alt="Foto de perfil" class="profile-image">
					<i v-else class="fas fa-user-circle circulo"></i>
					<button class="edit-photo-btn" @click="seleccionarImagen">
						<i class="fas fa-camera"></i>
					</button>
					<input type="file" ref="imagenInput" @change="cambiarFoto" style="display: none;"
						accept="image/*" />
				</div>

				<div class="profile-details">
					<h2>{{ usuario.nombre }}</h2>

					<div class="detail-item">
						<div class="detail-icon">
							<i class="fas fa-user-tag"></i>
						</div>
						<div class="detail-content">
							<span class="detail-label">Rol</span>
							<span class="detail-value">{{ usuario.esAdmin ? "Administrador" : "Usuario" }}</span>
						</div>
					</div>

					<div class="detail-item">
						<div class="detail-icon">
							<i class="fas fa-envelope"></i>
						</div>
						<div class="detail-content">
							<span class="detail-label">Correo</span>
							<span class="detail-value">{{ usuario.correoElectronico }}</span>
						</div>
					</div>

					<div class="detail-item">
						<div class="detail-icon">
							<i class="fas fa-phone"></i>
						</div>
						<div class="detail-content">
							<span class="detail-label">Teléfono</span>
							<span class="detail-value">{{ usuario.numeroCelular || 'No especificado' }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Sección derecha - Opciones de configuración (25% del ancho) -->
		<div class="settings-options-section">
			<div class="options-container">
				<h3 class="options-title">Opciones de Configuración</h3>

				<div class="options-list">
					<router-link class="option-item" to="/updateCorreo">
						<div class="option-icon">
							<i class="fas fa-envelope"></i>
						</div>
						<div class="option-content">
							<h4>Actualizar Correo</h4>
							<p>Cambia tu dirección de correo electrónico</p>
						</div>
						<i class="fas fa-chevron-right option-arrow"></i>
					</router-link>

					<router-link class="option-item" to="/updateContra">
						<div class="option-icon">
							<i class="fas fa-lock"></i>
						</div>
						<div class="option-content">
							<h4>Actualizar Contraseña</h4>
							<p>Establece una nueva contraseña segura</p>
						</div>
						<i class="fas fa-chevron-right option-arrow"></i>
					</router-link>

					<div class="option-item delete-option" @click="eliminarCuenta">
						<div class="option-icon">
							<i class="fas fa-trash-alt"></i>
						</div>
						<div class="option-content">
							<h4>Eliminar Cuenta</h4>
							<p>Elimina tu cuenta permanentemente</p>
						</div>
						<i class="fas fa-chevron-right option-arrow"></i>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import api from '@/axiosConfig';

const router = useRouter();
const store = useStore();
const imagenInput = ref(null);
const userId = ref(null);
const imagenPorDefecto = ref('fas fa-user-circle');

const usuario = computed(() => {
	return store.state.usuario || {
		nombre: 'Usuario',
		esAdmin: false,
		correoElectronico: 'No especificado',
		numeroCelular: 'No especificado'
	};
});

const imagenPerfil = computed(() => {
  const imagen = store.state.usuario?.imagen;
  
  console.log('Imagen del store:', imagen); // Debug
  
  if (!imagen) return imagenPorDefecto.value;
  
  // Si ya es una URL completa o una imagen en base64
  if (imagen.startsWith('http') || imagen.startsWith('data:image')) {
    return imagen;
  }
  
  // Construir la URL correctamente
  const baseUrl = import.meta.env.VITE_API_URL;
  
  // Eliminar barras duplicadas
  const rutaImagen = imagen.startsWith('/') ? imagen.substring(1) : imagen;
  const urlFinal = `${baseUrl}/${rutaImagen}?t=${Date.now()}`;
  
  console.log('URL construida:', urlFinal); // Debug
  
  return urlFinal;
});

function obtenerUserId() {
	const token = localStorage.getItem('token');
	if (token) {
		try {
			const decodedToken = jwtDecode(token);
			userId.value = decodedToken.sub;
		} catch (error) {
			console.error('Error al decodificar el token:', error);
			userId.value = null;
		}
	}
}

const volver = () => {
	router.go(-1);
};

const seleccionarImagen = () => {
	imagenInput.value.click();
};

const cambiarFoto = async (event) => {
	const archivo = event.target.files[0];
	if (!archivo) return;

	const formData = new FormData();
	formData.append("file", archivo);

	try {
		const response = await api.put(
			`/usuarios/${userId.value}/actualizar-foto`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}
		);

		await store.dispatch("actualizarFoto", response);

		Swal.fire({
			icon: 'success',
			title: 'Imagen actualizada',
			text: 'Tu foto de perfil se ha actualizado correctamente.',
		});
	} catch (error) {
		console.error("Error al subir la imagen:", error);
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: error.response?.data?.detail || 'No se pudo actualizar la foto de perfil.',
		});
	}
};

const eliminarCuenta = async () => {
	Swal.fire({
		title: '¿Estás seguro?',
		text: 'Esta acción no se puede deshacer.',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#d33',
		cancelButtonColor: '#3085d6',
		confirmButtonText: 'Sí, eliminar',
		cancelButtonText: 'Cancelar',
	}).then(async (result) => {
		if (result.isConfirmed) {
			try {
				await api.delete(`/usuarios/${userId.value}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});

				localStorage.removeItem('token');
				store.commit('setUsuario', null);
				store.commit('setToken', null);

				Swal.fire({
					icon: 'success',
					title: 'Cuenta eliminada',
					text: 'Tu cuenta ha sido eliminada con éxito.',
					timer: 2000,
					showConfirmButton: false,
				}).then(() => {
					router.push('/index');
				});

			} catch (error) {
				console.error("Error al eliminar la cuenta:", error);
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: error.response?.data?.detail || 'No se pudo eliminar la cuenta.',
				});
			}
		}
	});
};

onMounted(() => {
	obtenerUserId();
	if (!store.state.usuario) {
		store.dispatch('fetchUsuario');
	}
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
	--gray-dark: #495057;
	--transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}


.settings-container {
	display: flex;
	min-height: 100vh;
	font-family: 'Quicksand', sans-serif;
	background: linear-gradient(135deg, #1b263b 0%, #0d1b2a 100%);
}

/* Sección izquierda - Información del usuario (75% del ancho) */
.user-info-section {
	width: 75%;
	padding: 40px;
	display: flex;
	flex-direction: column;
	background: rgba(13, 27, 42, 0.8);
	backdrop-filter: blur(10px);
	border-right: 1px solid rgba(255, 255, 255, 0.1);
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
	align-self: flex-start;
}

.back-button:hover {
	background: rgba(67, 97, 238, 0.3);
	transform: translateX(-5px);
}

.profile-card {
	background: rgba(255, 255, 255, 0.03);
	border-radius: 20px;
	padding: 40px;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: white;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.05);
	max-width: 800px;
	margin: 0 auto;
	width: 100%;
}

.profile-avatar {
	position: relative;
	margin-bottom: 30px;
}

.profile-avatar i {
	font-size: 120px;
	color: rgba(255, 255, 255, 0.8);
	transition: var(--transition);
}

.profile-image {
	width: 120px;
	height: 120px;
	border-radius: 50%;
	object-fit: cover;
	border: 3px solid rgba(255, 255, 255, 0.2);
	transition: var(--transition);
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
	display: block;
}

.profile-avatar:hover .profile-image,
.profile-avatar:hover i {
	transform: scale(1.05);
	border-color: var(--primary-light);
}

.edit-photo-btn {
	position: absolute;
	bottom: 10px;
	right: 10px;
	width: 10px;
	height: 10px;
	background: var(--primary);
	border: none;
	border-radius: 50%;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: var(--transition);
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.edit-photo-btn:hover {
	background: var(--primary-light);
	transform: scale(1.1);
}

.edit-photo-btn i {
	font-size: 46px;
	/* Tamaño reducido del ícono */
}

.profile-details {
	width: 100%;
	max-width: 500px;
}

.profile-details h2 {
	font-weight: 600;
	font-size: 28px;
	margin-bottom: 30px;
	color: white;
	text-align: center;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.detail-item {
	display: flex;
	align-items: flex-start;
	gap: 15px;
	margin-bottom: 20px;
	padding: 15px;
	background: rgba(255, 255, 255, 0.03);
	border-radius: 12px;
	text-align: left;
	transition: var(--transition);
	border: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-item:hover {
	background: rgba(255, 255, 255, 0.07);
	transform: translateY(-3px);
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.detail-icon {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: rgba(67, 97, 238, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.detail-icon i {
	color: var(--primary-light);
	font-size: 18px;
}

.detail-content {
	flex: 1;
}

.detail-label {
	display: block;
	font-size: 12px;
	color: var(--gray);
	margin-bottom: 5px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.detail-value {
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: white;
}

/* Sección derecha - Opciones de configuración (25% del ancho) */
.settings-options-section {
	width: 25%;
	padding: 40px;
	background: rgba(11, 22, 34, 0.9);
	backdrop-filter: blur(10px);
	border-left: 1px solid rgba(255, 255, 255, 0.05);
}

.options-container {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.options-title {
	font-weight: 600;
	font-size: 24px;
	color: white;
	margin-bottom: 30px;
	position: relative;
	padding-bottom: 15px;
}

.options-title::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	width: 60px;
	height: 4px;
	background: linear-gradient(to right, var(--primary), var(--accent));
	border-radius: 2px;
}

.options-list {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.option-item {
	display: flex;
	align-items: center;
	gap: 15px;
	padding: 18px;
	background: rgba(255, 255, 255, 0.03);
	border-radius: 12px;
	cursor: pointer;
	transition: var(--transition);
	text-decoration: none;
	color: inherit;
	position: relative;
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.05);
}

.option-item::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 4px;
	height: 100%;
	background: var(--primary);
	transition: var(--transition);
}

.option-item:hover {
	background: rgba(255, 255, 255, 0.07);
	transform: translateY(-3px);
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.option-item:hover::before {
	width: 6px;
	background: var(--accent);
}

.option-icon {
	width: 45px;
	height: 45px;
	border-radius: 12px;
	background: rgba(67, 97, 238, 0.1);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	transition: var(--transition);
}

.option-item:hover .option-icon {
	background: var(--primary);
}

.option-icon i {
	font-size: 18px;
	color: var(--primary);
	transition: var(--transition);
}

.option-item:hover .option-icon i {
	color: white;
}

.option-content {
	flex: 1;
}

.option-content h4 {
	font-weight: 600;
	margin-bottom: 5px;
	color: white;
	font-size: 15px;
}

.option-content p {
	font-size: 12px;
	color: var(--gray);
	line-height: 1.5;
}

.option-arrow {
	color: var(--gray);
	font-size: 14px;
	transition: var(--transition);
}

.option-item:hover .option-arrow {
	color: var(--primary);
	transform: translateX(5px);
}

/* Opción de eliminar */
.delete-option:hover::before {
	background: var(--danger);
}

.delete-option .option-icon {
	background: rgba(239, 35, 60, 0.1);
}

.delete-option .option-icon i {
	color: var(--danger);
}

.delete-option:hover .option-icon {
	background: var(--danger);
}

.delete-option:hover .option-icon i {
	color: white;
}

.delete-option:hover .option-arrow {
	color: var(--danger);
}

/* Responsive */
@media (max-width: 1024px) {
	.settings-container {
		flex-direction: column;
	}

	.user-info-section,
	.settings-options-section {
		width: 100%;
		padding: 30px;
	}

	.settings-options-section {
		border-left: none;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}
}

@media (max-width: 768px) {
	.profile-card {
		padding: 30px 20px;
	}

	.profile-details h2 {
		font-size: 24px;
	}

	.options-title {
		font-size: 20px;
	}

	.option-item {
		padding: 15px;
	}
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

.profile-card,
.options-container {
	animation: fadeIn 0.6s ease-out;
}
</style>