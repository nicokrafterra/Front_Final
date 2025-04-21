<template>
  <div class="contpri">
    <button class="back-button" @click="volver">
      <i class="fas fa-arrow-left"></i>
      <span class="button-text">Volver</span>
    </button>
    
    <div class="reservas-container">
      <h2>Mis Reservas</h2>
      
      <div class="table-responsive" v-if="reservas > 0">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo de Paquete</th>
              <th>Detalle</th>
              <th>Tipo de Plan</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reserva in reservas" :key="reserva.id">
              <td data-label="Fecha">{{ reserva.fecha }}</td>
              <td data-label="Tipo de Paquete">{{ reserva.tipo_Reserva }}</td>
              <td data-label="Detalle">{{ reserva.Detalle }}</td>
              <td data-label="Tipo de Plan">{{ reserva.tipo_Plan }}</td>
              <td data-label="Estado">
                <div class="status-actions">
                  <router-link v-if="!reserva.pagada" to="/Pasarelas" @click="pagarReserva(reserva.id)" class="action-button pagar">
                    <i class="fas fa-credit-card"></i>
                    <span>Pagar</span>
                  </router-link>
                  <span v-else class="estado-pagado">
                    <i class="fas fa-check-circle"></i>
                    <span>Pagada</span>
                  </span>
                  <button @click="eliminarReserva(reserva.id)" class="action-button delete">
                    <i class="fas fa-trash-alt"></i>
                    <span>Eliminar</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-else class="empty-message">
        <i class="far fa-calendar-times"></i>
        <p>No tienes reservas registradas.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import api from '@/axiosConfig';

const store = useStore();
const router = useRouter();
const reservas = ref([]);

// Computed que obtiene el ID del usuario:
// Primero, intenta usar el usuario almacenado en Vuex.
// Si no existe, intenta decodificar el token JWT y usa el campo "sub".
const usuarioId = computed(() => {
  if (store.state.usuario && store.state.usuario.id) {
    return store.state.usuario.id;
  } else {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.sub; // Asegúrate de que en el token se usa "sub" para el id
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }
});

const volver = () => {
	router.back();
};

const obtenerReservas = async () => {
	try {
		const token = localStorage.getItem('token');
		if (!token) {
			throw new Error("No hay token disponible, inicia sesión.");
		}
		if (!usuarioId.value) {
			throw new Error("No se pudo obtener el ID del usuario.");
		}

		const response = await api.get(`/reservas/${usuarioId.value}/user`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		reservas.value = response.data;
	} catch (error) {
		console.error("Error al obtener las reservas:", error.response ? error.response.data : error.message);
	}
};

const pagarReserva = async (id) => {

		const token = localStorage.getItem('token');
		if (!token) throw new Error("No hay token disponible, inicia sesión.");
		const response = await api.post(`/reservas/${id}/pagar`, null, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		if (response.status === 200) {
			const updatedReserva = response.data;
			const index = reservas.value.findIndex(reserva => reserva.id === id);
			if (index !== -1) {
				reservas.value[index] = updatedReserva;
			}
			
		}

};

const eliminarReserva = async (id) => {
	try {
		const token = localStorage.getItem('token');
		if (!token) throw new Error("No hay token disponible, inicia sesión.");
		const response = await api.delete(`/reservas/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		if (response.status === 200) {
			reservas.value = reservas.value.filter(reserva => reserva.id !== id);
			Swal.fire({
				icon: 'success',
				title: 'Reserva eliminada',
				text: 'Tu reserva ha sido eliminada exitosamente.',
				confirmButtonText: 'Aceptar'
			});
		}
	} catch (error) {
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: 'Hubo un problema al intentar eliminar la reserva.',
			confirmButtonText: 'Aceptar'
		});
		console.error("Error al eliminar la reserva:", error.response ? error.response.data : error.message);
	}
};

onMounted(obtenerReservas);
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
/* Importar Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

:root {
  --verde-oliva: #6B8E23;
  --marron-tierra: #8B5A2B;
  --beige-arena: #F5DEB3;
  --rojo-terracota: #C1440E;
  --amarillo-mostaza: #D4A017;
  --texto: #fff;
  --transition: all 0.3s ease;
}

.contpri {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  background-color: var(--fondo);
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 15px;
  background-color: var(--marron-tierra);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.back-button:hover {
  background-color: var(--rojo-terracota);
  transform: translateY(-2px);
}

.reservas-container {
  width: 95%;
  max-width: 1200px;
  margin: 60px auto 30px;
  padding: 25px;
  background-color: #F5DEB3;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  color: var(--verde-oliva);
  font-size: 2rem;
  margin-bottom: 30px;
  position: relative;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, var(--verde-oliva), var(--amarillo-mostaza));
  border-radius: 2px;
}

.table-responsive {
  overflow-x: auto;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--marron-tierra);
}

th {
  background-color: var(--verde-oliva);
  color: var(--texto);
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

tr:hover {
  background-color: rgba(107, 142, 35, 0.1);
}

.status-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.pagar {
  background-color: var(--verde-oliva);
  color: white;
  text-decoration: none;
}

.pagar:hover {
  background-color: #5a7a28;
  transform: translateY(-2px);
}

.delete {
  background-color: var(--rojo-terracota);
  color: white;
}

.delete:hover {
  background-color: #a8380b;
  transform: translateY(-2px);
}

.estado-pagado {
  color: var(--verde-oliva);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.empty-message {
  text-align: center;
  padding: 40px 20px;
  color: var(--marron-tierra);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.empty-message i {
  font-size: 48px;
  opacity: 0.7;
}

.empty-message p {
  font-size: 18px;
  margin-top: 10px;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .reservas-container {
    padding: 20px;
  }
  
  th, td {
    padding: 10px 12px;
  }
}

@media (max-width: 768px) {
  .contpri {
    padding: 15px;
  }
  
  .back-button {
    top: 15px;
    left: 15px;
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .reservas-container {
    margin-top: 60px;
    width: 100%;
    padding: 15px;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  table {
    min-width: 100%;
  }
  
  /* Stacked table for mobile */
  @media (max-width: 576px) {
    table, thead, tbody, th, td, tr {
      display: block;
    }
    
    thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }
    
    tr {
      margin-bottom: 15px;
      border: 1px solid var(--marron-tierra);
      border-radius: 8px;
      padding: 10px;
      position: relative;
    }
    
    td {
      border: none;
      border-bottom: 1px solid rgba(139, 90, 43, 0.2);
      position: relative;
      padding-left: 50%;
      text-align: right;
    }
    
    td:before {
      position: absolute;
      left: 15px;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
      text-align: left;
      font-weight: 600;
      content: attr(data-label);
    }
    
    td:last-child {
      border-bottom: 0;
      text-align: center;
      padding-left: 15px;
    }
    
    .status-actions {
      justify-content: center;
    }
  }
}

@media (max-width: 480px) {
  .back-button .button-text,
  .action-button span {
    display: none;
  }
  
  .back-button {
    padding: 8px;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    justify-content: center;
  }
  
  .empty-message i {
    font-size: 36px;
  }
  
  h2 {
    font-size: 1.3rem;
  }
  
  h2::after {
    width: 60px;
    height: 3px;
    bottom: -8px;
  }
}
</style>