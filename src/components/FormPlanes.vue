<template>
	<div class="contpri">
		<div class="form">
			<h2>Añadir Plan</h2>
			<form @submit.prevent="agregarPlan">
				<!-- Sección de imagen -->
				<div class="form-group image-uploader">
					<label>Imagen del Plan:</label>
					<div class="image-preview-container">
						<div class="image-preview">
							<img v-if="imagePreview" :src="imagePreview" alt="Vista previa de la imagen" class="preview-image">
							<i v-else class="fas fa-image placeholder-icon"></i>
							<button type="button" class="upload-btn" @click="triggerFileInput">
								<i class="fas fa-camera"></i>
							</button>
							<input 
								type="file" 
								ref="fileInput"
								@change="handleImageUpload" 
								accept="image/*"
								style="display: none;"
							/>
						</div>
						<button v-if="imagePreview" type="button" class="remove-btn" @click="removeImage">
							<i class="fas fa-times"></i> Eliminar
						</button>
					</div>
				</div>

				<div class="form-group">
					<label for="nombre">Nombre:</label>
					<input v-model="planData.nombre" type="text" id="nombre" required maxlength="50" placeholder="Nombre del plan" />
				</div>
				
				<div class="form-group">
					<label for="cantidad_maxima">Cantidad Máxima:</label>
					<input
						v-model.number="planData.cantidad_maxima"
						type="number"
						id="cantidad_maxima"
						required
						min="1"
						max="1000"
						placeholder="Cantidad máxima disponible"
					/>
				</div>
				
				<div class="form-group">
					<label for="precio">Precio:</label>
					<input
						v-model.number="planData.precio"
						type="number"
						id="precio"
						required
						min="0"
						step="0.01"
						placeholder="Precio del plan"
					/>
				</div>
				
				<div class="form-group">
					<label for="tipo">Tipo de Plan:</label>
					<select v-model="planData.tipo" id="tipo" required>
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
						v-model="planData.descripcion"
						id="descripcion"
						required
						maxlength="500"
						placeholder="Descripción del plan"
					></textarea>
				</div>
				
				<div class="button-group">
					<button type="submit" :disabled="loading" class="reserva-button">
						{{ loading ? "Guardando..." : "Agregar Plan" }}
					</button>
					<button @click="verPlanes" type="button" class="reserva-button secondary">
						Ver Planes
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import api from "@/axiosConfig";
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

// Añadir iconos necesarios
library.add(fas);

const router = useRouter();
const fileInput = ref(null);
const imagePreview = ref(null);

// Objeto único para los datos del plan
const planData = ref({
	nombre: "",
	descripcion: "",
	tipo: "",
	cantidad_maxima: null,
	precio: 0,
	imagen: null
});

const loading = ref(false);

const triggerFileInput = () => {
	fileInput.value.click();
};

const handleImageUpload = (event) => {
	const file = event.target.files[0];
	if (!file) return;

	// Crear vista previa
	const reader = new FileReader();
	reader.onload = (e) => {
		imagePreview.value = e.target.result;
		planData.value.imagen = file; // Guardar el archivo directamente para FormData
	};
	reader.readAsDataURL(file);
};

const removeImage = () => {
	imagePreview.value = null;
	planData.value.imagen = null;
	fileInput.value.value = ''; // Resetear el input file
};

const agregarPlan = async () => {
	loading.value = true;
	
	try {
		// Validación básica del cliente
		if (!planData.value.nombre || !planData.value.descripcion || !planData.value.tipo || 
			!planData.value.cantidad_maxima || planData.value.precio === null) {
			throw new Error("Por favor complete todos los campos requeridos");
		}
		
		const formData = new FormData();
		Object.entries(planData.value).forEach(([key, value]) => {
			if (value !== null) {
				// Para la imagen, usamos el archivo directamente
				if (key === 'imagen' && value instanceof File) {
					formData.append('imagen', value);
				} else {
					formData.append(key, value);
				}
			}
		});
		
		const response = await api.post("/planes", formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
		
		handleResponse(response.status);
		
	} catch (error) {
		console.error("Error al agregar plan:", error);
		
		if (error.response) {
			// Error de la API
			handleResponse(error.response.status, error.response.data?.message);
		} else {
			// Error de validación del cliente
			Swal.fire({
				icon: "error",
				title: "Error de Validación",
				text: error.message || "Por favor verifique los datos ingresados",
				confirmButtonText: "Aceptar",
			});
		}
	} finally {
		loading.value = false;
	}
};

const handleResponse = (status, customMessage = null) => {
	const messages = {
		200: { icon: "success", title: "Plan Actualizado", text: "El plan ha sido actualizado exitosamente." },
		201: { icon: "success", title: "Plan Creado", text: "El plan ha sido creado exitosamente." },
		400: { icon: "error", title: "Error", text: customMessage || "Datos inválidos enviados al servidor." },
		401: { icon: "error", title: "No Autorizado", text: "Por favor inicie sesión nuevamente." },
		403: { icon: "error", title: "Prohibido", text: "No tiene permisos para realizar esta acción." },
		404: { icon: "error", title: "No Encontrado", text: "El recurso solicitado no existe." },
		409: { icon: "error", title: "Conflicto", text: customMessage || "El plan ya existe." },
		422: { icon: "error", title: "Error de Validación", text: customMessage || "Por favor verifique los datos ingresados." },
		500: { icon: "error", title: "Error del Servidor", text: "Ocurrió un error en el servidor. Por favor intente más tarde." }
	};
	
	const response = messages[status] || { 
		icon: "error", 
		title: "Error", 
		text: customMessage || "Ocurrió un error inesperado." 
	};
	
	Swal.fire({
		icon: response.icon,
		title: response.title,
		text: response.text,
		confirmButtonText: "Aceptar",
	});
	
	if (status === 200 || status === 201) {
		limpiarFormulario();
	}
};

const limpiarFormulario = () => {
	planData.value = {
		nombre: "",
		descripcion: "",
		tipo: "",
		cantidad_maxima: null,
		precio: 0,
		imagen: null
	};
	imagePreview.value = null;
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
