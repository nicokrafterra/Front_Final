<template>
	<div class="contpri">
		<nav class="reservas-container">
			<h2>Usuarios</h2>
			<div class="user-table">
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
						<tr v-for="user in users" :key="user.id">
							<td>{{ user.id }}</td>
							<td>{{ user.nombre }}</td>
							<td>{{ user.correoElectronico }}</td>
							<td>{{ user.numeroCelular }}</td>
							<td>{{ user.esAdmin ? 'Admin' : 'Usuario' }}</td>
							<td>
								<button @click="abrirFormulario(user, 'editar')" class="action-button edit">✏️</button>
								<button @click="abrirFormulario(user, 'eliminar')"
									class="action-button delete">🗑️</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<UserForm v-if="mostrarFormulario" :usuario="usuarioSeleccionado" :modo="modoFormulario"
				@cerrar="cerrarFormulario" @actualizado="cargarUsuarios" @eliminado="cargarUsuarios" />
		</nav>
	</div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');

.contpri {
    height: 100vh;
    font-family: 'Poppins', sans-serif;
    background-color: var(--light);
    padding: 30px;
}

.back-button {
    padding: 12px 20px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
    background-color: var(--primary-light);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
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
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 0.5px;
}

tr:hover {
    background-color: rgba(67, 97, 238, 0.05);
    transform: scale(1.005);
    transition: var(--transition);
}

button {
    padding: 10px 18px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: var(--transition);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button:hover {
    background-color: var(--primary-light);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.action-button {
    padding: 8px 16px;
    font-size: 14px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 6px;
    transition: var(--transition);
}

.edit {
    background-color: var(--success);
}

.edit:hover {
    background-color: #3ab7d8;
    transform: translateY(-2px);
}

.delete {
    background-color: var(--danger);
}

.delete:hover {
    background-color: #d91e37;
    transform: translateY(-2px);
}

.status-active {
    color: var(--success);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;
}

.status-active::before {
    content: '';
    width: 8px;
    height: 8px;
    background-color: var(--success);
    border-radius: 50%;
    display: inline-block;
}

.status-inactive {
    color: var(--danger);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;
}

.status-inactive::before {
    content: '';
    width: 8px;
    height: 8px;
    background-color: var(--danger);
    border-radius: 50%;
    display: inline-block;
}

@media (max-width: 768px) {
    .reservas-container {
        width: 95%;
        padding: 20px 15px;
    }
    
    th, td {
        padding: 10px 8px;
    }
    
    .action-button {
        margin: 2px;
        padding: 6px 10px;
    }
}
</style>

<script>
import axios from 'axios';
import UserForm from './UserForm.vue';
import api from '@/axiosConfig';


export default {
	components: { UserForm },
	data() {
		return {
			users: [],
			mostrarFormulario: false,
			usuarioSeleccionado: null,
			modoFormulario: 'editar' 
		};
	},
	methods: {
		async cargarUsuarios() {
			try {
				const response = await api.get("/usuarios");
				console.log(response.data)
				this.users = response.data;
			} catch (error) {
				console.error("Error al obtener la lista de usuarios:", error);
			}
		},
		abrirFormulario(usuario, modo) {
			this.usuarioSeleccionado = { ...usuario };
			this.modoFormulario = modo;
			this.mostrarFormulario = true;
		},
		cerrarFormulario() {
			this.mostrarFormulario = false;
			this.usuarioSeleccionado = null;
		},
		volver() {
			this.$router.back();
		},
	},
	mounted() {
		this.cargarUsuarios(); // Cargar los usuarios cuando se monte el componente
	}
};
</script>