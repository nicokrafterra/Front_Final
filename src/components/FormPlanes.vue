<template>
  <div class="contpri">
    <div class="form">
      <h2>Añadir Plan</h2>
      <form @submit.prevent="agregarPlan" enctype="multipart/form-data">
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
            placeholder="Cantidad máxima disponible"
          />
        </div>
        
        <div class="form-group">
          <label for="precio">Precio:</label>
          <input
            v-model.number="precio"
            type="number"
            id="precio"
            required
            min="0"
            placeholder="Precio del plan"
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
        
        <div class="form-group">
          <label for="imagen">Imagen del Plan:</label>
          <div class="image-upload-container">
            <div v-if="previewImage" class="image-preview">
              <img :src="previewImage" alt="Vista previa de la imagen" class="preview-image">
              <button type="button" class="remove-image-btn" @click="removeImage">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div v-else class="upload-area" @click="triggerFileInput">
              <i class="fas fa-cloud-upload-alt upload-icon"></i>
              <p>Haz clic para seleccionar una imagen</p>
            </div>
            <input
              type="file"
              id="imagen"
              ref="fileInput"
              accept="image/*"
              @change="handleImageUpload"
              style="display: none;"
            />
          </div>
        </div>
        
        <button type="submit" :disabled="loading" class="reserva-button">
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          {{ loading ? "Guardando..." : "Agregar Plan" }}
        </button>
        <button type="button" @click="verPlanes" class="reserva-button secondary">
          <i class="fas fa-list"></i> Ver Planes
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Swal from "sweetalert2";
import api from "@/axiosConfig";
import { jwtDecode } from "jwt-decode";

const router = useRouter();
const store = useStore();
const fileInput = ref(null);

// Datos del formulario
const nombre = ref("");
const cantidad_maxima = ref(null);
const precio = ref(null);
const tipo_Plan = ref("");
const descripcion = ref("");
const imagen = ref(null);
const previewImage = ref(null);
const loading = ref(false);

// Obtener userId del token
const userId = computed(() => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.sub;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
  return null;
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validar tipo de archivo
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    Swal.fire({
      icon: 'error',
      title: 'Formato no válido',
      text: 'Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)',
    });
    return;
  }

  // Validar tamaño (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    Swal.fire({
      icon: 'error',
      title: 'Imagen demasiado grande',
      text: 'El tamaño máximo permitido es 5MB',
    });
    return;
  }

  imagen.value = file;
  
  // Crear vista previa
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  imagen.value = null;
  previewImage.value = null;
  fileInput.value.value = '';
};

const agregarPlan = async () => {
  // Validación básica
  if (!nombre.value || !cantidad_maxima.value || !tipo_Plan.value || !descripcion.value || !precio.value) {
    Swal.fire({
      icon: "error",
      title: "Campos requeridos",
      text: "Todos los campos son obligatorios",
      confirmButtonText: "Aceptar",
    });
    return;
  }

  if (!imagen.value) {
    Swal.fire({
      icon: "warning",
      title: "Imagen requerida",
      text: "Por favor selecciona una imagen para el plan",
      confirmButtonText: "Aceptar",
    });
    return;
  }

  loading.value = true;

  try {
    // Crear FormData para enviar la imagen
    const formData = new FormData();
    formData.append("nombre", nombre.value);
    formData.append("descripcion", descripcion.value);
    formData.append("tipo", tipo_Plan.value);
    formData.append("cantidad_maxima", cantidad_maxima.value);
    formData.append("precio", precio.value);
    formData.append("imagen", imagen.value);

    // Configurar headers con el token de autenticación
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const response = await api.post("/planes", formData, config);

    if ([200, 201].includes(response.status)) {
      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Plan creado correctamente",
        confirmButtonText: "Aceptar",
      });
      
      limpiarFormulario();
      router.push("/planVer");
    }
  } catch (error) {
    console.error("Error al crear el plan:", error);
    
    let errorMessage = "Ocurrió un error al crear el plan";
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = error.response.data.detail || "Datos inválidos";
          break;
        case 401:
          errorMessage = "No autorizado. Por favor inicie sesión nuevamente";
          store.dispatch('logout');
          router.push("/login");
          break;
        case 403:
          errorMessage = "No tienes permisos para realizar esta acción";
          break;
        case 409:
          errorMessage = "Ya existe un plan con ese nombre";
          break;
        case 422:
          errorMessage = "Error de validación en los datos";
          break;
        case 500:
          errorMessage = "Error en el servidor. Intente más tarde";
          break;
      }
    }

    await Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMessage,
      confirmButtonText: "Aceptar",
    });
  } finally {
    loading.value = false;
  }
};

const limpiarFormulario = () => {
  nombre.value = "";
  cantidad_maxima.value = null;
  precio.value = null;
  tipo_Plan.value = "";
  descripcion.value = "";
  imagen.value = null;
  previewImage.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const verPlanes = () => {
  router.push("/planVer");
};
</script>

<style scoped>
.contpri {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #4CAF50;
  outline: none;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

/* Estilos para la subida de imágenes */
.image-upload-container {
  margin-top: 0.5rem;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 4px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #4CAF50;
  background-color: #f8f8f8;
}

.upload-icon {
  font-size: 2rem;
  color: #4CAF50;
  margin-bottom: 0.5rem;
}

.upload-area p {
  margin: 0;
  color: #666;
}

.image-preview {
  position: relative;
  width: 100%;
  max-height: 200px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.preview-image {
  width: 100%;
  height: auto;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.remove-image-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

/* Estilos para botones */
.reserva-button {
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  margin-right: 0.5rem;
  transition: background-color 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.reserva-button:hover {
  background-color: #45a049;
}

.reserva-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.reserva-button i {
  margin-right: 8px;
}

.reserva-button.secondary {
  background-color: #6c757d;
}

.reserva-button.secondary:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .form {
    padding: 1.5rem;
  }
  
  .reserva-button {
    width: 100%;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
</style>