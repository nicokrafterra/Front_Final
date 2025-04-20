<template>
	<div class="contpri">
	<button class="back-button" @click="volver">
		<img src="../assets/IMG/arrow-left.svg" alt="Volver" />
	</button>
	<div class="tabla-pqrs">
		<h2>PQRS Recibidos</h2>
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Correo</th>
					<th>Descripción</th>
					<th>Respuesta</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="pqr in pqrs" :key="pqr.id">
					<td>{{ pqr.id }}</td>
					<td>{{ pqr.correo }}</td>
					<td>{{ pqr.descripcion }}</td>
					<td>{{ pqr.respuesta || 'Pendiente' }}</td>
					<td>
						<button @click="responderPqr(pqr)" v-if="!pqr.respuesta">
							✏️ Responder
						</button>
					</td>
				</tr>
			</tbody>
		</table>
		<formRespuestaPqr v-if="pqrSeleccionado" :pqr="pqrSeleccionado" @close="pqrSeleccionado = null" />
	</div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import formRespuestaPqr from './formRespuestaPqr.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const pqrs = ref([]);
const pqrSeleccionado = ref(null);


const volver = () => {
	router.back();
};


const obtenerPqrs = async () => {
	try {
		const response = await fetch("http://localhost:8000/pqrs/");
		pqrs.value = await response.json();
	} catch (error) {
		console.error("Error al obtener PQRS:", error);
	}
};

const responderPqr = (pqr) => {
	pqrSeleccionado.value = pqr;
};

onMounted(obtenerPqrs);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');

.contpri {
    height: 100vh;
    font-family: 'Poppins', sans-serif;
    background-color: var(--light);
    padding: 30px;
    position: relative;
}

.back-button {
    position: absolute;
    top: 30px;
    left: 30px;
    padding: 12px 20px;
    background-color: var(--dark);
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
    z-index: 10;
}

.back-button:hover {
    background-color: var(--darker);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.back-button img {
    width: 20px;
    height: 20px;
    transition: var(--transition);
}

.tabla-pqrs {
    width: 90%;
    max-width: 1000px;
    margin: 60px auto 30px;
    background-color: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.tabla-pqrs h2 {
    text-align: center;
    color: var(--dark);
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    margin-bottom: 30px;
    font-size: 28px;
    position: relative;
}

.tabla-pqrs h2::after {
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

.tabla-pqrs table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    overflow: hidden;
    border-radius: 8px;
}

.tabla-pqrs th,
.tabla-pqrs td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
	color: #333;
}

.tabla-pqrs th {
    background-color: var(--dark);
    color: #333;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 0.5px;
}

.tabla-pqrs tr:hover {
    background-color: rgba(67, 97, 238, 0.05);
}

.tabla-pqrs button {
    padding: 10px 18px;
    background-color: var(--success);
    color: #333;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tabla-pqrs button:hover {
    background-color: #3ab7d8;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
    .tabla-pqrs {
        width: 95%;
        padding: 20px 15px;
    }
    
    .tabla-pqrs th,
    .tabla-pqrs td {
        padding: 10px 8px;
    }
    
    .tabla-pqrs button {
        padding: 8px 12px;
        font-size: 13px;
    }
}
</style>
