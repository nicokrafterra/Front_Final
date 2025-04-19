<template>
	<div class="contp">
		<button class="back-button" @click="volver">
			<i class="fas fa-arrow-left"></i> <!-- Icono de FontAwesome -->
		</button>
		<div class="card-container">
			<div class="profile-card">
				<div class="profile-header">
					<i class="fas fa-user-circle"></i> <!-- Icono de usuario -->
					<h1>{{ usuario.nombre }}</h1>
				</div>
				<div class="profile-info">
					<p><i class="fas fa-user-tag"></i> Rol: {{ usuario.esAdmin ? "Administrador" : "Usuario" }}</p>
					<p><i class="fas fa-envelope"></i> Correo: {{ usuario.correoElectronico }}</p>
					<p><i class="fas fa-phone"></i> Teléfono: {{ usuario.numeroCelular }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	computed: {
		...mapState(['usuario']),
	},
	methods: {
		volver() {
			this.$router.back();
		},
	},
};
</script>

<style scoped>
/* Importar FontAwesome y fuente moderna */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');

* {
	font-family: 'Quicksand', sans-serif;
}

.contp {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background: none; /* El fondo lo manejas desde el body o app */
}

.back-button {
	position: absolute;
	top: 20px;
	left: 20px;
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(5px);
	border: none;
	padding: 10px 15px;
	border-radius: 10px;
	color: #fff;
	font-size: 20px;
	transition: 0.3s ease;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	cursor: pointer;
}

.back-button:hover {
	transform: scale(1.05);
	background-color: rgba(255, 255, 255, 0.25);
}

.card-container {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
}

.profile-card {
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border-radius: 20px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.2);
	padding: 30px;
	width: 320px;
	text-align: center;
	animation: fadeInUp 0.8s ease-out;
}

.profile-header {
	margin-bottom: 20px;
}

.profile-header i {
	font-size: 60px;
	color: #ffffff;
}

.profile-header h1 {
	margin: 10px 0;
	font-size: 24px;
	color: #ffffff;
}

.profile-info p {
	font-size: 17px;
	color: #ffffff;
	margin: 15px 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.profile-info i {
	margin-right: 10px;
	color: #f4d35e;
}

/* Animaciones */
@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>