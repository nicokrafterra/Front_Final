<template>
  <div class="contpri">
    <button class="back-button" @click="volver">
      <font-awesome-icon icon="fa-solid fa-arrow-left" />
    </button>
    
    <div class="reserva-form">
      <div class="form">
        <form @submit.prevent="hacerReserva">
          <div class="form-header">
            <h1 class="h21">Formulario de Reserva</h1>
            <h2 class="h22">¡Haz tu reserva ya!</h2>
          </div>

          <div class="form-group">
            <RouterLink class="reserva-button" to="tpPlan">
              <font-awesome-icon icon="fa-solid fa-calendar-check" />
              <span>Selecciona el Tipo de Plan</span>
            </RouterLink>
          </div>
          
          <div class="form-group">
            <label for="fecha">
              <font-awesome-icon icon="fa-solid fa-calendar-days" />
              <span>Fecha de Reserva:</span>
            </label>
            <input type="datetime-local" id="fecha" v-model="fecha" :min="minFecha" required />
          </div>
          
          <div class="form-group">
            <label for="tipo_Reserva">
              <font-awesome-icon icon="fa-solid fa-tag" />
              <span>Tipo de Reserva:</span>
            </label>
            <select id="tipo_Reserva" v-model="tipo_Reserva" required>
              <option disabled value="">Selecciona un tipo de reserva</option>
              <option value="basica">Reserva Básica</option>
              <option value="premium">Reserva Premium</option>
            </select>
          </div>

          <div v-if="descripcionReserva" class="texto-descriptivo">
            <font-awesome-icon icon="fa-solid fa-circle-info" />
            <p>{{ descripcionReserva }}</p>
          </div>

          <div class="form-actions">
            <button type="submit" class="reserva-button" :disabled="isLoading">
              <font-awesome-icon v-if="isLoading" icon="fa-solid fa-spinner" spin />
              <template v-else>
                <font-awesome-icon icon="fa-solid fa-bookmark" />
                <span>Hacer Reserva</span>
              </template>
            </button>
            
            <button type="button" class="ver-reservas-button" @click="verReservas">
              <font-awesome-icon icon="fa-solid fa-list" />
              <span>Ver mis reservas</span>
            </button>
          </div>
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
import api from '@/axiosConfig';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faArrowLeft, 
  faCalendarCheck, 
  faCalendarDays, 
  faTag, 
  faCircleInfo, 
  faBookmark, 
  faList,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Añadir iconos a la librería
library.add(
  faArrowLeft, 
  faCalendarCheck, 
  faCalendarDays, 
  faTag, 
  faCircleInfo, 
  faBookmark, 
  faList,
  faSpinner
);

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
    
    // Verificación más precisa del éxito
    if (response.status >= 200 && response.status < 300) {
      await Swal.fire({
        icon: 'success',
        title: '¡Reserva exitosa!',
        text: 'Tu reserva se ha realizado correctamente',
        showConfirmButton: false,
        timer: 1500
      });
      
      resetearFormulario();
      router.push('/ResVer');
    } else {
      // Manejar códigos de error específicos
      const errorMsg = response.data?.message || 'Error desconocido al realizar la reserva';
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('Error en reserva:', error);
    
    // Mensaje de error mejorado
    let errorMessage = 'No se pudo completar la reserva';
    
    if (error.response) {
      // Error de la API
      errorMessage = error.response.data?.message || errorMessage;
    } else if (error.request) {
      // Error de conexión
      errorMessage = 'No se recibió respuesta del servidor';
    } else {
      // Error en el código
      errorMessage = error.message || errorMessage;
    }
    
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonText: 'Entendido'
    });
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

const volver = () => {
  router.push('/index');
};
// 🔹 Inicialización
onMounted(() => {
  obtenerUsuarioDesdeJWT();
  obtenerTipoPlan();
});
</script>





<style scoped>
/* Variables de colores */
:root {
  --verde-oliva: #6B8E23;
  --marron-tierra: #8B5A2B;
  --beige-arena: #F0E2C9;
  --rojo-terracota: #C1440E;
  --amarillo-mostaza: #D4A017;
  --blanco: #FFFFFF;
  --texto-oscuro: #212121;
  --sombra: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transicion: all 0.3s ease;
}

/* Estilos base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.contpri {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: var(--beige-arena);
  position: relative;
}

.back-button {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: #6B8E23;
  color: var(--blanco);
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow:  0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 10;
}

.back-button:hover {
  background: #8B5A2B;
  color: #6B8E23;
  transform: translateY(-2px);
}

.reserva-form {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.form {
  background-color: #F0E2C9;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--sombra);
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.h21 {
  font-family: 'Courier New', Courier, monospace;
  font-size: 2rem;
  color: var(--marron-tierra);
  margin-bottom: 0.5rem;
}

.h22 {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.5rem;
  color: var(--verde-oliva);
  font-weight: normal;
}

.form-group {
  margin-bottom: 1.5rem;
  width: 100%;
}

label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: var(--marron-tierra);
  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
}

input, select {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid var(--marron-tierra);
  border-radius: 0.5rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
  transition: var(--transicion);
}

input:focus, select:focus {
  border-color: var(--amarillo-mostaza);
  outline: none;
  box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.2);
}

.texto-descriptivo {
  background-color: rgba(107, 142, 35, 0.1);
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.texto-descriptivo p {
  color: var(--verde-oliva);
  font-size: 0.9rem;
  line-height: 1.4;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.reserva-button, .ver-reservas-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: none;
  border-radius: 0.5rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.reserva-button {
  background-color: #6B8E23;
  color: var(--blanco);
}

.reserva-button:hover {
  background-color: #8B5A2B;
  color: #6B8E23;
  transform: translateY(-2px);
}

.ver-reservas-button {
  background-color: #D4A017;
  color: var(--blanco);
}

.ver-reservas-button:hover {
  background-color: #C1440E;
  color: #D4A017;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .contpri {
    padding: 1rem;
  }
  
  .form {
    padding: 1.5rem;
  }
  
  .h21 {
    font-size: 1.5rem;
  }
  
  .h22 {
    font-size: 1.2rem;
  }
  
  .back-button {
    top: 1rem;
    left: 1rem;
    width: 2.5rem;
    height: 2.5rem;
  }
}

@media (max-width: 480px) {
  .form {
    padding: 1rem;
  }
  
  .h21 {
    font-size: 1.3rem;
  }
  
  .h22 {
    font-size: 1rem;
  }
  
  label, input, select, .reserva-button, .ver-reservas-button {
    font-size: 0.9rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .texto-descriptivo p {
    font-size: 0.8rem;
  }
}

/* Estado de carga */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>