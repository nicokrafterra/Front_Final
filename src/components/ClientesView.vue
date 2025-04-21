<template>
  <div class="contpri">
    <div class="users-container">
      <div class="header-section">
        <h2>Usuarios Registrados</h2>
        <button @click="abrirFormulario(null, 'crear')" class="add-button">
          <i class="fas fa-plus"></i>
          <span>Nuevo Usuario</span>
        </button>
      </div>
      
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="loading-message">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Cargando usuarios...</span>
              </td>
            </tr>
            <tr v-else-if="users.length === 0">
              <td colspan="6" class="empty-message">
                <i class="far fa-folder-open"></i>
                <p>No hay usuarios registrados</p>
              </td>
            </tr>
            <tr v-for="user in users" :key="user.id">
              <td data-label="ID">{{ user.id }}</td>
              <td data-label="Nombre">{{ user.nombre }}</td>
              <td data-label="Email">{{ user.correoElectronico }}</td>
              <td data-label="Teléfono">{{ user.numeroCelular || 'N/A' }}</td>
              <td data-label="Rol">
                <span :class="['role-badge', {'admin': user.esAdmin, 'user': !user.esAdmin}]">
                  {{ user.esAdmin ? 'Admin' : 'Usuario' }}
                </span>
              </td>
              <td data-label="Acciones">
                <div class="action-buttons">
                  <button @click="abrirFormulario(user, 'editar')" class="action-button edit">
                    <i class="fas fa-edit"></i>
                    <span>Editar</span>
                  </button>
                  <button @click="confirmarEliminacion(user)" class="action-button delete">
                    <i class="fas fa-trash-alt"></i>
                    <span>Eliminar</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <UserForm 
        v-if="mostrarFormulario" 
        :usuario="usuarioSeleccionado" 
        :modo="modoFormulario"
        @cerrar="cerrarFormulario" 
        @actualizado="cargarUsuarios"
      />
    </div>
  </div>
</template>

<script>
import UserForm from './UserForm.vue';
import api from '@/axiosConfig';
import Swal from 'sweetalert2';

// Importar Font Awesome (debes tenerlo configurado en tu proyecto)
import '@fortawesome/fontawesome-free/css/all.min.css';

export default {
  components: { UserForm },
  data() {
    return {
      users: [],
      loading: true,
      mostrarFormulario: false,
      usuarioSeleccionado: null,
      modoFormulario: 'editar'
    };
  },
  methods: {
    async cargarUsuarios() {
      this.loading = true;
      try {
        const response = await api.get("https://backfinal-production-c704.up.railway.app/usuarios/");
        this.users = response.data;
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los usuarios',
          timer: 3000
        });
      } finally {
        this.loading = false;
      }
    },
    abrirFormulario(usuario, modo) {
      this.usuarioSeleccionado = usuario ? {...usuario} : null;
      this.modoFormulario = modo;
      this.mostrarFormulario = true;
    },
    cerrarFormulario() {
      this.mostrarFormulario = false;
      this.usuarioSeleccionado = null;
    },
    async confirmarEliminacion(user) {
      const result = await Swal.fire({
        title: '¿Eliminar usuario?',
        text: `¿Estás seguro de eliminar a ${user.nombre}? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef233c',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      });
      
      if (result.isConfirmed) {
        try {
          await api.delete(`/usuarios/${user.id}`);
          this.cargarUsuarios();
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El usuario ha sido eliminado',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el usuario',
            timer: 3000
          });
        }
      }
    },
    volver() {
      this.$router.back();
    }
  },
  mounted() {
    this.cargarUsuarios();
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
  padding: 8px 12px;
  background-color: var(--dark);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.back-button:hover {
  background-color: var(--darker);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.users-container {
  width: 95%;
  max-width: 1200px;
  margin: 70px auto 30px;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

h2 {
  color: var(--dark);
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 22px;
  position: relative;
  margin: 0;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, var(--primary), var(--accent));
  border-radius: 2px;
}

.add-button {
  padding: 8px 12px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.add-button:hover {
  background-color: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.table-responsive {
  overflow-x: auto;
  margin-top: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
  font-size: 14px;
}

th, td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--light-gray);
}

th {
  background-color: var(--dark);
  color: white;
  font-weight: 500;
  font-size: 13px;
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
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.loading-message i {
  font-size: 24px;
  color: var(--primary);
}

.empty-message {
  text-align: center;
  padding: 30px 15px;
  color: var(--gray);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-message i {
  font-size: 36px;
  opacity: 0.7;
}

.empty-message p {
  font-size: 14px;
  margin-top: 8px;
}

.action-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.action-button {
  padding: 6px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
}

.edit {
  background-color: rgb(87, 255, 154);
  color: #333;
}

.edit:hover {
  background-color: #3ab7d8;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.delete {
  background-color: rgb(241, 165, 0);
  color: #333;
}

.delete:hover {
  background-color: #d91e37;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.action-button i {
  font-size: 12px;
}

.role-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.role-badge.admin {
  background-color: rgba(76, 201, 240, 0.1);
  color: var(--success);
}

.role-badge.user {
  background-color: rgba(108, 117, 125, 0.1);
  color: var(--gray);
}

/* Responsive Styles */
@media (max-width: 992px) {
  .users-container {
    padding: 18px;
  }
  
  th, td {
    padding: 8px 10px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .contpri {
    padding: 15px;
  }
  
  .back-button {
    top: 15px;
    left: 15px;
    padding: 6px 10px;
    font-size: 13px;
  }
  
  .users-container {
    margin-top: 60px;
    width: 100%;
    padding: 15px;
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
      margin-bottom: 12px;
      border: 1px solid var(--light-gray);
      border-radius: 8px;
      padding: 8px;
      position: relative;
    }
    
    td {
      border: none;
      border-bottom: 1px solid #eee;
      position: relative;
      padding-left: 45%;
      text-align: right;
      font-size: 12px;
    }
    
    td:before {
      position: absolute;
      left: 12px;
      width: 40%;
      padding-right: 8px;
      white-space: nowrap;
      text-align: left;
      font-weight: 600;
      font-size: 12px;
      content: attr(data-label);
    }
    
    td:last-child {
      border-bottom: 0;
      text-align: center;
      padding-left: 12px;
    }
    
    .action-buttons {
      justify-content: center;
    }
  }
}

@media (max-width: 480px) {
  .back-button span,
  .add-button span,
  .action-button span {
    display: none;
  }
  
  .back-button,
  .add-button {
    padding: 6px;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    justify-content: center;
  }
  
  .action-button {
    padding: 5px;
    border-radius: 50%;
    width: 28px;
    height: 28px;
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