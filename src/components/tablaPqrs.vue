<template>
  <div class="contpri">
    <div class="tabla-pqrs">
      <h2>PQRS Recibidos</h2>
      
      <div class="table-responsive">
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
            <tr v-if="loading">
              <td colspan="5" class="loading-message">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Cargando PQRS...</span>
              </td>
            </tr>
            <tr v-else-if="pqrs.length === 0">
              <td colspan="5" class="empty-message">
                <i class="far fa-folder-open"></i>
                <p>No hay PQRS pendientes</p>
              </td>
            </tr>
            <tr v-for="pqr in pqrs" :key="pqr.id">
              <td data-label="ID">{{ pqr.id }}</td>
              <td data-label="Correo">{{ pqr.correo }}</td>
              <td data-label="Descripción">{{ pqr.descripcion }}</td>
              <td data-label="Respuesta">
                <span v-if="pqr.respuesta" class="status-respondido">
                  <i class="fas fa-check-circle"></i> Respondido
                </span>
                <span v-else class="status-pendiente">
                  <i class="fas fa-clock"></i> Pendiente
                </span>
              </td>
              <td data-label="Acciones">
                <button @click="responderPqr(pqr)" v-if="!pqr.respuesta" class="btn-responder">
                  <i class="fas fa-reply"></i>
                  <span>Responder</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <formRespuestaPqr 
        v-if="pqrSeleccionado" 
        :pqr="pqrSeleccionado" 
        @close="pqrSeleccionado = null"
        @respuesta-enviada="actualizarLista"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import formRespuestaPqr from './formRespuestaPqr.vue';
import { useRouter } from 'vue-router';

// Importar Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

const router = useRouter();
const pqrs = ref([]);
const pqrSeleccionado = ref(null);
const loading = ref(true);

const volver = () => {
  router.back();
};

const obtenerPqrs = async () => {
  loading.value = true;
  try {
    const response = await fetch("/pqrs/");
    pqrs.value = await response.json();
  } catch (error) {
    console.error("Error al obtener PQRS:", error);
  } finally {
    loading.value = false;
  }
};

const responderPqr = (pqr) => {
  pqrSeleccionado.value = pqr;
};

const actualizarLista = () => {
  obtenerPqrs();
  pqrSeleccionado.value = null;
};

onMounted(obtenerPqrs);
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

.tabla-pqrs {
  width: 95%;
  max-width: 1200px;
  margin: 70px auto 30px;
  background-color: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.tabla-pqrs h2 {
  text-align: center;
  color: var(--dark);
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  margin-bottom: 25px;
  font-size: 24px;
  position: relative;
}

.tabla-pqrs h2::after {
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

.btn-responder {
  padding: 8px 12px;
  background-color: var(--success);
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
}

.btn-responder:hover {
  background-color: #3ab7d8;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.icon {
  width: 14px;
  height: 14px;
  filter: brightness(0) invert(1);
}

.respondido {
  color: var(--gray);
  font-size: 14px;
  font-style: italic;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: var(--gray);
}

.no-results img {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  opacity: 0.7;
}

.no-results p {
  font-size: 16px;
  margin-top: 10px;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .tabla-pqrs {
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
  
  .tabla-pqrs {
    margin-top: 60px;
    width: 100%;
    padding: 15px;
  }
  
  .tabla-pqrs h2 {
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
    
    .btn-responder {
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
  
  .no-results img {
    width: 80px;
    height: 80px;
  }
}
</style>