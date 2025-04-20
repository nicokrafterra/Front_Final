<template>
	<div class="contpri">
		<button class="back-button" @click="volver">
			<img src="../assets/IMG/arrow-left.svg" alt="Volver" />
		</button>
		<div class="reserva-form">
			<div class="form">
				<form @submit.prevent="hacerReserva">
					<h2 class="h21">Formulario de Reserva</h2>
					<h2 class="h22">¡has tu reserva ya!</h2>

					<div class="form-group">
						<RouterLink class="reserva-button Text" to="tpPlan">Selecciona el Tipo de Plan</RouterLink>
					</div>
					<label class="Text" for="fecha">Fecha de Reserva: </label>
					<div class="form-group">
						<input type="datetime-local" id="fecha" v-model="fecha" :min="minFecha"
						required />
					</div>
					<label for="tipo_Reserva" class="Text">Tipo de Reserva: </label>
					<div class="form-group">
						<select id="tipo_Reserva" v-model="tipo_Reserva" required>
							<option disabled value="" class="Text">Selecciona un tipo de reserva</option>
							<option value="basica" class="Text">Reserva Básica</option>
							<option value="premium" class="Text">Reserva Premium</option>
						</select>
					</div>

					<div v-if="descripcionReserva" class="texto-descriptivo">
						<p>{{ descripcionReserva }}</p>
					</div>


					<button type="submit" class="reserva-button Text">Hacer Reserva</button>
					<button class="ver-reservas-button Text" @click="verReservas">Ver todas mis reservas</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import api from '@/axiosConfig'; // Usar axios configurado en lugar de fetch

const router = useRouter();

// 🔹 Estados reactivos
const fecha = ref('');
const tipo_Reserva = ref('');
const minFecha = ref(getMinFecha());
const usuarioId = ref(null);
const tipoPlan = ref(null);
const isLoading = ref(false);

// 🔹 Obtener fecha mínima (10:00 AM del día actual)
function getMinFecha() {
  const ahora = new Date();
  const fechaMinima = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate(),
    10, 0, 0
  );
  return fechaMinima.toISOString().slice(0, 16);
}

// 🔹 Obtener ID de usuario desde JWT
const obtenerUsuarioDesdeJWT = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No hay token disponible');
    
    const decodedToken = jwtDecode(token);
    usuarioId.value = decodedToken.sub;
    
    if (!usuarioId.value) {
      throw new Error('El token no contiene "sub"');
    }
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    usuarioId.value = null;
    mostrarErrorSesion();
  }
};

// 🔹 Obtener tipo de plan desde localStorage
const obtenerTipoPlan = () => {
  try {
    const planGuardado = localStorage.getItem('tipoPlan');
    if (planGuardado) {
      tipoPlan.value = JSON.parse(planGuardado);
    }
  } catch (error) {
    console.error('Error al parsear tipoPlan:', error);
    tipoPlan.value = null;
  }
};

// 🔹 Computed para descripción de reserva
const descripcionReserva = computed(() => {
  const descripciones = {
    basica: "La reserva básica ofrece acceso estándar a nuestras instalaciones con un costo más económico.",
    premium: "La reserva premium incluye servicios exclusivos como acceso VIP y opciones personalizadas."
  };
  return descripciones[tipo_Reserva.value] || "";
});

// 🔹 Validación del formulario
const formularioValido = computed(() => {
  return (
    usuarioId.value &&
    tipoPlan.value?.id &&
    fecha.value &&
    tipo_Reserva.value
  );
});

// 🔹 Hacer reserva
const hacerReserva = async () => {
  if (!formularioValido.value) {
    mostrarErrorValidacion();
    return;
  }

  isLoading.value = true;

  const reservaData = {
    usuario_id: usuarioId.value,
    plan_id: tipoPlan.value.id,
    fecha: fecha.value,
    tipo_Reserva: tipo_Reserva.value,
    tipo_Plan: tipoPlan.value.tipo,
    Detalle: tipoPlan.value.nombre,
    pagada: false,
  };

  try {
    const response = await api.post('/reservas/', reservaData);
    
    if (response.status === 201) {
      await mostrarExitoReserva();
      resetearFormulario();
      router.push('/ResVer');
    } else {
      throw new Error(`Error ${response.status}`);
    }
  } catch (error) {
    console.error('Error en reserva:', error);
    mostrarErrorReserva(error);
  } finally {
    isLoading.value = false;
  }
};

// 🔹 Helpers para mensajes y acciones
const mostrarErrorSesion = () => {
  Swal.fire({
    icon: 'warning',
    title: 'Sesión no válida',
    text: 'Debes iniciar sesión para realizar una reserva.',
    confirmButtonColor: '#d33',
  });
};

const mostrarErrorValidacion = () => {
  Swal.fire({
    icon: 'warning',
    title: 'Datos incompletos',
    text: 'Por favor completa todos los campos requeridos.',
    confirmButtonColor: '#d33',
  });
};

const mostrarExitoReserva = async () => {
  await Swal.fire({
    icon: 'success',
    title: 'Reserva exitosa',
    text: 'Tu reserva ha sido realizada con éxito.',
    confirmButtonColor: '#3085d6',
    timer: 2000,
    timerProgressBar: true,
  });
};

const mostrarErrorReserva = (error) => {
  Swal.fire({
    icon: 'error',
    title: 'Error en reserva',
    text: error.response?.data?.message || 'No se pudo realizar la reserva. Intenta nuevamente.',
    confirmButtonColor: '#d33',
  });
};

const resetearFormulario = () => {
  fecha.value = '';
  tipo_Reserva.value = '';
  localStorage.removeItem('tipoPlan');
};

const verReservas = () => {
  router.push('/ResVer');
};

// 🔹 Inicialización
onMounted(() => {
  obtenerUsuarioDesdeJWT();
  obtenerTipoPlan();
});
</script>





<style scoped>

.Text{
	font-family: 'Courier New', Courier, monospace;
	font-size: 30px;
}

.h21{
	font-family: 'Courier New', Courier, monospace;
	font-size: 40px;
}
.h22{
	font-family:'Courier New', Courier, monospace;
	font-size: 35px;
}
.contpri {
	height: 100vh;
	display: flex;
	justify-content: end;
	align-items: center; /* Centrar verticalmente */
	width: 100%;
}

.back-button {
	position: absolute;
	top: 20px;
	left: 20px;
	background: none;
	border: none;
	cursor: pointer;
	transition: 0.35s;
	height: 40px;
	width: 60px;
}

.back-button:hover {
	transform: scale(1.05);
	box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.3),
		1px 1px 10px rgba(255, 255, 255, 0.6),
		inset 2px 2px 10px rgba(0, 0, 0, 0.3),
		inset -1px -1px 5px rgba(255, 255, 255, 0.6);
	background-color: #6B8E23; /* Verde Oliva al hacer hover */
	border-radius: 6px;
}

.back-button img {
	width: 24px;
	height: 24px;
	transition: transform 0.2s ease;
}

.reserva-message {
	margin-top: 20px;
	color: #707070;
	font-size: 14px;
	text-align: center; /* Centrar el mensaje */
}

.reserva-button {
	padding: 10px 35px;
	cursor: pointer;
	background-color: #6B8E23; /* Verde Oliva */
	border-radius: 6px;
	border: 2px solid #6B8E23;
	box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.1),
		1px 1px 10px rgba(255, 255, 255, 0.6);
	color: #fff;
	font-size: 15px;
	font-weight: bold;
	transition: 0.35s;
	text-decoration: none;
	width: 100%;
}

.reserva-button:hover {
	transform: scale(1.01);
	box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.2),
		1px 1px 10px rgba(255, 255, 255, 0.6),
		inset 2px 2px 10px rgba(0, 0, 0, 0.2),
		inset -1px -1px 5px rgba(255, 255, 255, 0.6);
	background-color: #8B5A2B; /* Marrón Tierra al hacer hover */
}

.reserva-form {
	width: 100%;
	max-width: 800px;
	height: 100%; /* Ancho máximo del formulario */
	display: flex;
	justify-content: center;
	align-items: center;
}

.form {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	backface-visibility: hidden;
	padding: 40px 30px; /* Padding ajustado */
	border-radius: 15px;
	background-color: #f0e2c9; /* Beige Arena como fondo principal */
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* Sombra suave */
	width: 100%;
	height: 100%;
}

.form input,
.form select {
	width: 100%;
	min-height: 45px;
	color: #212121; /* Texto oscuro */
	outline: none;
	transition: 0.35s;
	padding: 0px 10px;
	background-color: #FFFFFF; /* Fondo blanco */
	border-radius: 6px;
	border: 2px solid #8B5A2B; /* Marrón Tierra */
	box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.1),
		1px 1px 10px rgba(255, 255, 255, 0.6);
	margin-bottom: 15px; /* Espaciado entre inputs */
}

.form input:focus,
.form select:focus {
	border-color: #D4A017; /* Amarillo Mostaza al enfocar */
	transform: scale(1.02);
}

.form .ver-reservas-button {
	padding: 10px 35px;
	cursor: pointer;
	background-color: #D4A017; /* Amarillo Mostaza */
	border-radius: 6px;
	border: 2px solid #D4A017;
	box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.1),
		1px 1px 10px rgba(255, 255, 255, 0.6);
	color: #fff;
	font-size: 15px;
	font-weight: bold;
	transition: 0.35s;
	width: 100%;
	margin-top: 10px; /* Espaciado superior */
}

.form .ver-reservas-button:hover {
	transform: scale(1.01);
	box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.2),
		1px 1px 10px rgba(255, 255, 255, 0.6),
		inset 2px 2px 10px rgba(0, 0, 0, 0.2),
		inset -1px -1px 5px rgba(255, 255, 255, 0.6);
	background-color: #C1440E; /* Rojo Terracota al hacer hover */
}

.form-group {
	margin: 20px 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.texto-descriptivo {
	margin: 20px 0;
	text-align: center;
	color: #6B8E23; /* Verde Oliva */
	font-size: 14px;
	width: 100%;
}

#tipo_Reserva,
#fecha {
	width: 100%;
}

@media (max-width: 768px) {
	.form {
		padding: 20px;
	}

	.form input,
	.form select {
		width: 100%;
	}

	.reserva-button,
	.ver-reservas-button {
		width: 100%;
	}
}

@media (max-width: 480px) {
	.form {
		padding: 15px;
	}

	.form input,
	.form select {
		font-size: 14px;
		padding: 5px;
	}

	.reserva-button,
	.ver-reservas-button {
		font-size: 14px;
		padding: 8px 20px;
	}

	.texto-descriptivo {
		font-size: 12px;
	}
}
</style>