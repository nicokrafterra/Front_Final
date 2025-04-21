<template>
	<div class="contpri">
	  <button class="back-button" @click="volver">
		<i class="fas fa-arrow-left"></i>
		<span>Volver</span>
	  </button>
	  
	  <div class="reservas-container">
		<h2>Reservas de Usuarios</h2>
		
		<div class="table-responsive">
		  <table>
			<thead>
			  <tr>
				<th>ID Reserva</th>
				<th>Cliente</th>
				<th>Fecha</th>
				<th>Tipo Plan</th>
				<th>Nombre Plan</th>
				<th>Estado</th>
				<th>Acciones</th>
			  </tr>
			</thead>
			<tbody>
			  <tr v-if="loading">
				<td colspan="7" class="loading-message">
				  <i class="fas fa-spinner fa-spin"></i>
				  <span>Cargando reservas...</span>
				</td>
			  </tr>
			  <tr v-else-if="reservas.length === 0">
				<td colspan="7" class="empty-message">
				  <i class="far fa-calendar-times"></i>
				  <p>No hay reservas disponibles</p>
				</td>
			  </tr>
			  <tr v-for="reserva in reservas" :key="reserva.id">
				<td data-label="ID Reserva">{{ reserva.id }}</td>
				<td data-label="Cliente">{{ reserva.usuario_id }}</td>
				<td data-label="Fecha">{{ formatDate(reserva.fecha) }}</td>
				<td data-label="Tipo Plan">{{ reserva.tipo_Plan }}</td>
				<td data-label="Nombre Plan">{{ reserva.Detalle }}</td>
				<td data-label="Estado">
				  <span :class="['status-badge', {'pagado': reserva.pagada, 'pendiente': !reserva.pagada}]">
					<i :class="reserva.pagada ? 'fas fa-check-circle' : 'fas fa-clock'"></i>
					{{ reserva.pagada ? 'Pagada' : 'Pendiente' }}
				  </span>
				</td>
				<td data-label="Acciones">
				  <button @click="confirmarEliminar(reserva.id)" class="action-button delete">
					<i class="fas fa-trash-alt"></i>
					<span>Eliminar</span>
				  </button>
				</td>
			  </tr>
			</tbody>
		  </table>
		</div>
	  </div>
	</div>
  </template>

<script>
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

import '@fortawesome/fontawesome-free/css/all.min.css';

export default {
  data() {
    return {
      reservas: [],
      loading: true,
      error: null
    };
  },
  setup() {
    const router = useRouter();
    
    const volver = () => {
      router.back();
    };
    
    return {
      volver
    };
  },
  methods: {
    async obtenerReservas() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch('/reservas/');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        this.reservas = data;
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
        this.error = error.message;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las reservas. Por favor, intente más tarde.',
        });
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    confirmarEliminar(id) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef233c',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.eliminarReserva(id);
        }
      });
    },
    async eliminarReserva(id) {
      try {
        const response = await fetch(`/reservas/${id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        this.reservas = this.reservas.filter((reserva) => reserva.id !== id);
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'La reserva ha sido eliminada correctamente.',
          timer: 2000,
          showConfirmButton: false,
          background: '#f8f9fa',
          position: 'top-end',
          toast: true
        });
      } catch (error) {
        console.error('Error al eliminar la reserva:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la reserva. Por favor, intente nuevamente.',
        });
      }
    }
  },
  mounted() {
    this.obtenerReservas();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');

:root {
  --primary: #4361ee;
  --primary-light: #4895ef;
  --secondary: #3f37c9;
  --dark: #1b263b;
  --darker: #0d1b2a;
  --light: #f8f9fa;
  --accent: #f72585;
  --success: #4cc9f0;
  --warning: #f8961e;
  --danger: #ef233c;
  --gray: #6c757d;
  --light-gray: #e9ecef;
  --transition: all 0.3s ease;
}

.contpri {
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  background-color: var(--light);
  padding: 20px;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 15px;
  background-color: var(--dark);
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
  background-color: var(--darker);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.back-button img {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}

.reservas-container {
  width: 95%;
  max-width: 1200px;
  margin: 70px auto 30px;
  background-color: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.reservas-container h2 {
  text-align: center;
  color: var(--dark);
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  margin-bottom: 25px;
  font-size: 24px;
  position: relative;
}

.reservas-container h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, var(--primary), var(--accent));
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
  border-bottom: 1px solid var(--light-gray);
}

th {
  background-color: var(--dark);
  color: white;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

tr:not(:last-child) {
  border-bottom: 1px solid var(--light-gray);
}

tr:hover {
  background-color: rgba(67, 97, 238, 0.03);
}

.loading-message {
  text-align: center;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(67, 97, 238, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-message {
  text-align: center;
  padding: 40px 20px;
  color: var(--gray);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.empty-message img {
  width: 100px;
  height: 100px;
  opacity: 0.7;
}

.empty-message p {
  font-size: 16px;
  margin-top: 10px;
}

.action-button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.delete {
  background-color: var(--danger);
  color: white;
}

.delete:hover {
  background-color: #d91e37;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 14px;
  height: 14px;
  filter: brightness(0) invert(1);
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.estado-pagado .status-badge {
  background-color: rgba(76, 201, 240, 0.1);
  color: var(--success);
}

.estado-pendiente .status-badge {
  background-color: rgba(248, 150, 30, 0.1);
  color: var(--warning);
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
  
  .reservas-container h2 {
    font-size: 20px;
    margin-bottom: 20px;
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
      border: 1px solid var(--light-gray);
      border-radius: 8px;
      padding: 10px;
      position: relative;
    }
    
    td {
      border: none;
      border-bottom: 1px solid #eee;
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
    
    .action-button {
      margin: 0 auto;
    }
  }
}

@media (max-width: 480px) {
  .back-button span {
    display: none;
  }
  
  .back-button {
    padding: 8px;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    justify-content: center;
  }
  
  .empty-message img {
    width: 80px;
    height: 80px;
  }
  
  .loading-spinner {
    width: 30px;
    height: 30px;
  }
}
</style>