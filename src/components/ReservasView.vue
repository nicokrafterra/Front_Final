<template>
  <div class="contpri">
    <nav class="reservas-container">
      <h2>Reservas de Usuarios</h2>
      <div class="user-table">
        <table>
          <thead>
            <tr>
              <th>ID Reservas</th>
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
              <td colspan="7" class="loading-message">Cargando reservas...</td>
            </tr>
            <tr v-else-if="reservas.length === 0">
              <td colspan="7" class="empty-message">No hay reservas disponibles</td>
            </tr>
            <tr v-for="reserva in reservas" :key="reserva.id">
              <td>{{ reserva.id }}</td>
              <td>{{ reserva.usuario_id }}</td>
              <td>{{ formatDate(reserva.fecha) }}</td>
              <td>{{ reserva.tipo_Plan }}</td>
              <td>{{ reserva.Detalle }}</td>
              <td :class="{'estado-pagado': reserva.pagada, 'estado-pendiente': !reserva.pagada}">
                {{ reserva.pagada ? '✔️ Pagada' : '❌ Pendiente' }}
              </td>
              <td>
                <button @click="confirmarEliminar(reserva.id)" class="action-button delete">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </nav>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      reservas: [],
      loading: true,
      error: null
    };
  },
  methods: {
    async obtenerReservas() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch('/reservas/'); // Asegúrate de la ruta correcta
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
        month: 'long',
        day: 'numeric'
      });
    },
    confirmarEliminar(id) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
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
          text: 'La reserva ha sido eliminada.',
          timer: 2000,
          showConfirmButton: false
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
  --transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.contpri {
  height: 100vh;
  font-family: 'Poppins', sans-serif;
  background-color: var(--light);
  padding: 30px;
}

.reservas-container {
  width: 90%;
  max-width: 1200px;
  margin: 30px auto;
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  color: var(--dark);
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  margin-bottom: 30px;
  font-size: 28px;
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
  background: linear-gradient(to right, var(--primary), var(--accent));
  border-radius: 2px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  overflow: hidden;
  border-radius: 8px;
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

th {
  background-color: var(--dark);
  color: #333;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0.5px;
}

tr:hover {
  background-color: rgba(67, 97, 238, 0.05);
}

.loading-message, .empty-message {
  text-align: center;
  padding: 20px;
  color: var(--dark);
  font-style: italic;
}

.action-button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.delete {
  background-color: var(--danger);
  color: white;
}

.delete:hover {
  background-color: #d91e37;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.estado-pagado {
  color: var(--success);
  font-weight: 600;
}

.estado-pendiente {
  color: var(--warning);
  font-weight: 600;
}

@media (max-width: 768px) {
  .reservas-container {
    width: 95%;
    padding: 20px 15px;
  }
  
  th, td {
    padding: 10px 8px;
    font-size: 14px;
  }
  
  .action-button {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  h2 {
    font-size: 24px;
  }
}
</style>