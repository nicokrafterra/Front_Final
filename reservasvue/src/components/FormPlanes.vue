<template>
	<div class="contpri">
		<button class="back-button" @click="volver">
			<img src="@/assets/IMG/arrow-left.svg" alt="Volver" />
		</button>
		<div class="form">
			<h2>Añadir Plan</h2>
			<form @submit.prevent="agregarPlan">
				<div class="form-group">
					<label for="nombre">Nombre:</label>
					<input v-model="nombre" type="text" id="nombre" required maxlength="50" placeholder="Nombre del plan" />
				</div>
				<div class="form-group">
					<label for="cantidad_m">Cantidad Máxima:</label>
					<input
						v-model.number="cantidad_maxima"
						type="number"
						id="cantidad_m"
						required
						min="1"
						max="1000"
						placeholder="Cantidad máxima de participantes"
					/>
				</div>
				<div class="form-group">
					<label for="tipo_Plan">Tipo Plan:</label>
					<select v-model="tipo_Plan" id="tipo_Plan" required>
						<option disabled value="">Seleccione un tipo</option>
						<option value="Recorrido">Recorrido</option>
						<option value="Mesa">Mesa</option>
						<option value="Camping">Camping</option>
						<option value="Evento">Evento</option>
					</select>
				</div>
				<div class="form-group">
					<label for="descripcion">Descripción:</label>
					<textarea
						v-model="descripcion"
						id="descripcion"
						required
						maxlength="500"
						placeholder="Descripción del plan"
					></textarea>
				</div>
				<button type="submit" :disabled="loading" class="reserva-button">
					{{ loading ? "Guardando..." : "Agregar Plan" }}
				</button>
				<button @click="verPlanes" class="reserva-button">Ver Planes</button>
			</form>
			
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

const nombre = ref("");
const cantidad_maxima = ref(null);
const tipo_Plan = ref("");
const descripcion = ref("");
const loading = ref(false);

const router = useRouter();

const volver = () => {
	router.back();
};

const agregarPlan = async () => {
	const planData = {
		nombre: nombre.value,
		descripcion: descripcion.value,
		tipo: tipo_Plan.value,
		cantidad_maxima: cantidad_maxima.value,
	};

	loading.value = true;

	try {
		const response = await axios.post("http://localhost:8000/planes", planData);

		if (!response.ok) {
			throw new Error("Error al agregar el plan");
		} else {
			Swal.fire({
				icon: "success",
				title: "¡Plan añadido con éxito!",
				text: "El plan ha sido registrado correctamente.",
				confirmButtonText: "Aceptar",
			});
			limpiarFormulario();
		}
	} catch (error) {
		Swal.fire({
			icon: "error",
			title: "Error",
			text: "Ocurrió un error al añadir el plan. Por favor, inténtalo de nuevo.",
			confirmButtonText: "Aceptar",
		});
		console.error(error);
	} finally {
		loading.value = false;
	}
};

const limpiarFormulario = () => {
	nombre.value = "";
	cantidad_maxima.value = null;
	tipo_Plan.value = "";
	descripcion.value = "";
};

const verPlanes = () => {
	router.push("/planVer");
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');

.contpri {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Poppins', sans-serif;
    background-color: var(--light);
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

.form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.form::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 8px;
    background: linear-gradient(to right, var(--primary), var(--accent));
}

.form-group {
    margin-bottom: 25px;
    position: relative;
}

label {
    display: block;
    margin-bottom: 8px;
    color: var(--dark);
    font-weight: 500;
    font-size: 14px;
}

input, textarea, select {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 15px;
    transition: var(--transition);
    background-color: white;
    color: var(--dark);
}

input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--primary-light);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
}

.reserva-button {
    width: 100%;
    padding: 16px;
    background: linear-gradient(to right, var(--primary), var(--secondary));
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    margin-top: 10px;
    box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
}

.reserva-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(67, 97, 238, 0.4);
    background: linear-gradient(to right, var(--primary-light), var(--primary));
}

@media (max-width: 600px) {
    .form {
        padding: 30px 20px;
        margin: 20px;
    }
    
    .back-button {
        top: 15px;
        left: 15px;
    }
}
</style>
