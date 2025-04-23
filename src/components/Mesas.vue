<template>
	<div class="contpri">
		<button class="back-button" @click="volver">
			<img src="../assets/IMG/arrow-left.svg" alt="Volver" />
		</button>
		<section class="mesas-section">
			<div class="section-header">
				<h1 class="section-title">Explora Nuestras Mesas</h1>
				<p class="section-description">
					Encuentra la mesa perfecta para tus eventos, reuniones o cenas especiales.
				</p>
			</div>

			<div class="mesas-container">
				<div class="mesa-card" v-for="(mesa, index) in Mesas" :key="index">
					<div class="mesa-image-container">
						<img :src="mesa.imagen" :alt="'Imagen de ' + mesa.nombre" class="mesa-image" />
					</div>
					<div class="mesa-info">
						<h2 class="mesa-name">{{ mesa.nombre }}</h2>
						<p class="mesa-description">{{ mesa.descripcion }}</p>
						<div v-if="mesa.disponible">
							<p class="available-info">
								Quedan {{ mesa.cantidad_maxima - mesa.cantidad_actual }} disponibles
							</p>
							<button class="select-button" @click="seleccionarMesa(mesa)">
								Reservar
							</button>
						</div>
						<div v-else>
							<p class="unavailable-info">No disponible</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import api from '@/axiosConfig';
import mesa1 from '@/assets/IMG/mesa1.jpg';
import mesa2 from '@/assets/IMG/mesa2.jpg';
import mesa3 from '@/assets/IMG/mesa3.jpg';	

const router = useRouter();

// Obtenemos el usuario decodificando el token almacenado en localStorage
const usuario = computed(() => {
	const token = localStorage.getItem('token');
	if (token) {
		try {
			return jwtDecode(token);
		} catch (error) {
			console.error("Error al decodificar el token:", error);
			return null;
		}
	}
	return null;
});

const userId = computed(() => usuario.value ? usuario.value.sub : null);
const tipoPlan = ref(null);
const Mesas = ref([]);

// Imágenes locales para las mesas
const mesaImages = [
	mesa1,
	mesa2,
	mesa3,
	// Agrega más imágenes según necesites
];

const obtenerTipoPlan = () => {
	const planGuardado = localStorage.getItem('tipoPlan');
	if (planGuardado) {
		tipoPlan.value = JSON.parse(planGuardado);
	}
};

const obtenerMesas = async () => {
	try {
		const response = await api.get("/planes/Mesa/tipo");
		// Asignar imágenes a cada mesa
		Mesas.value = response.data.map((mesa, index) => ({
			...mesa,
			imagen: mesaImages[index % mesaImages.length] // Usa módulo para ciclar imágenes
		}));
	} catch (error) {
		console.error("Error al obtener los lugares:", error);
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: 'No se pudieron cargar los lugares. Intenta nuevamente más tarde.',
		});
	}
};

const seleccionarMesa = (mesa) => {
	if (!userId.value) {
		Swal.fire({
			icon: 'warning',
			title: 'Inicia sesión',
			text: 'Debes iniciar sesión para reservar un lugar.',
		});
		return;
	}

	localStorage.setItem("tipoPlan", JSON.stringify(mesa));
	router.push("/reservas");

	Swal.fire({
		icon: 'success',
		title: 'Se guardó tu selección, completa el formulario',
		text: `Has reservado el lugar "${mesa.nombre}" para tu evento.`,
	});
};

const volver = () => {
	router.back();
};

onMounted(() => {
	obtenerMesas();
	obtenerTipoPlan();
});
</script>

<style scoped>
.contpri {
	padding: 20px;
	background-color: #FFFFFF;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.back-button {
	background: none;
	border: none;
	cursor: pointer;
	margin-bottom: 20px;
	transition: transform 0.2s ease-in-out;
}

.back-button img {
	width: 35px;
	height: 35px;
	filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2));
}

.back-button:hover {
	transform: scale(1.1);
}

.mesas-section {
	background: linear-gradient(135deg, #F5DEB3, #D4A017);
	padding: 40px 30px;
	border-radius: 15px;
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
	width: 100%;
	max-width: 1200px;
}

.section-header {
	text-align: center;
	margin-bottom: 50px;
}

.section-title {
	font-size: 2.8em;
	margin-bottom: 15px;
	color: #6B8E23;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 1px;
}

.section-description {
	font-size: 1.2em;
	color: #8B5A2B;
	line-height: 1.5;
}

.mesas-container {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 25px;
}

.mesa-card {
	background: #FFFFFF;
	border-radius: 15px;
	overflow: hidden;
	box-shadow: 40px 10px 20px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	display: flex;
	flex-direction: column;
}

.mesa-card:hover {
	transform: translateY(-8px);
	box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.2);
}

.mesa-image-container {
	width: 100%;
	height: 200px;
	overflow: hidden;
}

.mesa-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.5s ease;
}

.mesa-card:hover .mesa-image {
	transform: scale(1.05);
}

.mesa-info {
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	flex-grow: 1;
	color: #2c3e50;
}

.mesa-name {
	font-size: 1.8em;
	margin-bottom: 10px;
	font-weight: bold;
	color: #6B8E23;
}

.mesa-description {
	font-size: 1.1em;
	color: #8B5A2B;
	margin-bottom: 20px;
	line-height: 1.6;
}

.available-info {
	font-size: 1em;
	font-weight: bold;
	color: #4CAF50;
	margin-bottom: 10px;
}

.unavailable-info {
	font-size: 1em;
	font-weight: bold;
	color: #C1440E;
}

.select-button {
	background: linear-gradient(135deg, #6B8E23, #8B5A2B);
	color: #FFFFFF;
	border: none;
	padding: 12px 20px;
	border-radius: 8px;
	font-size: 1em;
	font-weight: bold;
	cursor: pointer;
	transition: background 0.3s ease, transform 0.2s ease;
}

.select-button:hover {
	background: linear-gradient(135deg, #8B5A2B, #6B8E23);
	transform: translateY(-2px);
}

@media (max-width: 768px) {
	.mesas-container {
		grid-template-columns: 1fr;
	}

	.section-title {
		font-size: 2.2em;
	}

	.section-description {
		font-size: 1em;
	}

	.select-button {
		font-size: 0.9em;
	}

	.mesa-image-container {
		height: 150px;
	}
}
</style>