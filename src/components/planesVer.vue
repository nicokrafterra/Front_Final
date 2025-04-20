<template>
	<button class="back-button" @click="volver">
		<img src="../assets/IMG/arrow-left.svg" alt="Volver" />
	</button>
	<nav class="planes-container">
		<h2>Gestión de Planes</h2>
		<div class="plan-table">
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
					<tr v-for="plan in planes" :key="plan.id">
						<td>{{ plan.id }}</td>
						<td>{{ plan.nombre }}</td>
						<td>{{ plan.tipo }}</td>
						<td>{{ plan.cantidad_maxima }}</td>
						<td>
							<button @click="eliminarPlan(plan.id)" class="action-button delete">🗑️</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</nav>
</template>

<script>
import api from '@/axiosConfig';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      planes: [],
      isLoading: false,
      error: null
    };
  },

  methods: {
    // Método mejorado para obtener los planes
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

    // Método mejorado para eliminar un plan
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
.planes-container {
	width: 80%;
	margin: auto;
	margin-top: 20px;
	background-color: #f8f9fa;
	padding: 20px;
	border-radius: 10px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h2 {
	text-align: center;
	color: #234666;
}

table {
	width: 100%;
	border-collapse: collapse;
	margin-top: 20px;
}

th,
td {
	padding: 10px;
	text-align: left;
	border-bottom: 1px solid #ddd;
}

th {
	background-color: #234666;
	color: #fff;
}

tr:hover {
	background-color: #f1f1f1;
}

button {
	padding: 10px 15px;
	background-color: #4caf50;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-weight: bold;
	transition: background-color 0.3s;
}

button:hover {
	background-color: #ff9800;
}

.action-button {
	padding: 8px 12px;
	font-size: 14px;
	margin: 5px;
	cursor: pointer;
}

.delete {
	background-color: #f44336;
}

.delete:hover {
	background-color: #e53935;
}

.back-button {
	padding: 10px 15px;
	background-color: #4caf50;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-weight: bold;
	transition: background-color 0.3s;
}

.back-button:hover {
	background-color: #ff9800;
}
</style>
