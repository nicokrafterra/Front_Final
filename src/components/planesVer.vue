<template>
  <div class="plan-container">
    <button class="back-button" @click="volver">
      <i class="fas fa-arrow-left"></i>
      <span class="button-text">Volver</span>
    </button>
    
    <div class="planes-container">
      <div class="header-section">
        <h2>Gestión de Planes</h2>
        <button @click="abrirFormularioCreacion" class="add-button">
          <i class="fas fa-plus"></i>
          <span class="button-text">Nuevo Plan</span>
        </button>
      </div>
      
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID Plan</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Cantidad Máxima</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="5" class="loading-message">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Cargando planes...</span>
              </td>
            </tr>
            <tr v-else-if="planes.length === 0">
              <td colspan="5" class="empty-message">
                <i class="fas fa-clipboard-list"></i>
                <p>No hay planes registrados</p>
              </td>
            </tr>
            <tr v-for="plan in planes" :key="plan.id">
              <td data-label="ID Plan">{{ plan.id }}</td>
              <td data-label="Nombre">{{ plan.nombre }}</td>
              <td data-label="Tipo">{{ plan.tipo }}</td>
              <td data-label="Cantidad Máxima">{{ plan.cantidad_maxima }}</td>
              <td data-label="Acciones">
                <div class="action-buttons">
                  <button @click="eliminarPlan(plan.id)" class="action-button delete">
                    <i class="fas fa-trash-alt"></i>
                    <span>Eliminar</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/axiosConfig';
import Swal from 'sweetalert2';

// Importar Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

export default {
  data() {
    return {
      planes: [],
      isLoading: false,
      error: null
    };
  },

  methods: {
    async obtenerPlanes() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.get('/planes/');
        
        if (response.status === 200) {
          this.planes = response.data;
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error al obtener los planes:', error);
        this.error = 'No se pudieron cargar los planes. Por favor, intente nuevamente.';
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.error,
          confirmButtonText: 'Entendido'
        });
      } finally {
        this.isLoading = false;
      }
    },

    async eliminarPlan(id) {
      try {
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción eliminará permanentemente el plan.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
          focusCancel: true
        });

        if (!result.isConfirmed) return;

        const response = await api.delete(`/planes/${id}`);
        
        if (response.status === 200 || response.status === 204) {
          this.planes = this.planes.filter(plan => plan.id !== id);
          
          await Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El plan ha sido eliminado correctamente.',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error al eliminar el plan:', error);
        
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el plan. Por favor, intente nuevamente.',
          confirmButtonText: 'Entendido'
        });
      }
    },

    abrirFormularioCreacion() {
      // Implementar lógica para abrir formulario de creación
      console.log("Abrir formulario de creación");
    },

    editarPlan(plan) {
      // Implementar lógica para editar plan
      console.log("Editar plan:", plan);
    },

    volver() {
      this.$router.go(-1);
    }
  },

  mounted() {
    this.obtenerPlanes();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

:root {
  --primary: #4361ee;
  --primary-light: #4895ef;
  --secondary: #3f37c9;
  --dark: #1b263b;
  --light: #f8f9fa;
  --success: #4cc9f0;
  --warning: #f8961e;
  --danger: #ef233c;
  --gray: #6c757d;
  --transition: all 0.3s ease;
}

.plan-container {
  font-family: 'Poppins', sans-serif;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.back-button {
  padding: 10px 15px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.back-button:hover {
  background-color: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.back-button i {
  font-size: 16px;
}

.planes-container {
  background-color: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

h2 {
  color: var(--dark);
  font-weight: 600;
  font-size: 24px;
  margin: 0;
  position: relative;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, var(--primary), var(--accent));
  border-radius: 2px;
}

.add-button {
  padding: 10px 15px;
  background-color: var(--success);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-button:hover {
  background-color: #3ab7d8;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
  border-bottom: 1px solid #e9ecef;
}

th {
  background-color: var(--dark);
  color: white;
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  color: var(--gray);
}

.loading-message i {
  font-size: 24px;
  color: var(--primary);
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

.empty-message i {
  font-size: 36px;
  opacity: 0.7;
}

.empty-message p {
  font-size: 16px;
  margin-top: 10px;
}

.action-buttons {
  display: flex;
  gap: 8px;
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

.edit {
  background-color: #4cc9f0;
  color: white;
}

.edit:hover {
  background-color: #ace619;
  transform: translateY(-2px);
}

.delete {
  background-color: #d97b1e;
  color: white;
}

.delete:hover {
  background-color: #d91e37;
  transform: translateY(-2px);
}

/* Responsive Styles */
@media (max-width: 992px) {
  .planes-container {
    padding: 20px;
  }
  
  th, td {
    padding: 10px 12px;
  }
}

@media (max-width: 768px) {
  .plan-container {
    padding: 15px;
  }
  
  .header-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  h2 {
    font-size: 20px;
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
      border: 1px solid #e9ecef;
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
    
    .action-buttons {
      justify-content: center;
    }
  }
}

@media (max-width: 480px) {
  .back-button .button-text,
  .add-button .button-text,
  .action-button span {
    display: none;
  }
  
  .back-button,
  .add-button,
  .action-button {
    padding: 8px;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    justify-content: center;
  }
  
  .empty-message i {
    font-size: 30px;
  }
  
  h2 {
    font-size: 18px;
  }
  
  h2::after {
    width: 40px;
    height: 2px;
    bottom: -5px;
  }
}
</style>