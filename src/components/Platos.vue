<template>
  <div class="platos-container">
    <!-- Botón de volver -->
    <button class="back-button" @click="volver">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Volver
    </button>

    <!-- Encabezado con efecto especial -->
    <div class="section-header">
      <div class="header-decoration">
        <div class="decoration-line"></div>
        <div class="decoration-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
        <div class="decoration-line"></div>
      </div>
      <h2 class="section-title">Sabores <span>Auténticos</span> de Colombia</h2>
      <p class="section-subtitle">Delicias tradicionales preparadas con ingredientes frescos y recetas ancestrales</p>
    </div>

    <!-- Filtros interactivos -->
    <div class="filters-container">
      <div class="filters-scroll">
        <button 
          v-for="(category, index) in categories" 
          :key="index"
          :class="['filter-btn', { active: activeFilter === category.value }]"
          @click="filterPlatos(category.value)"
        >
          {{ category.label }}
          <span class="filter-count">{{ category.count }}</span>
        </button>
      </div>
    </div>

    <!-- Barra de búsqueda -->
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Buscar platos típicos..." 
        class="search-input"
        @input="handleSearch"
      >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>

    <!-- Grid de platos -->
    <div class="platos-grid">
      <!-- Plato destacado (Bandeja Paisa) -->
      <div class="plato-card featured">
        <div class="plato-image-container">
          <img src="../assets/IMG/BandejaPaisa.jpeg" alt="Bandeja Paisa" class="plato-image" />
          <div class="plato-badge chef">Especialidad</div>
        </div>
        <div class="plato-content">
          <div class="plato-header">
            <h3 class="plato-title">Bandeja Paisa</h3>
            <div class="plato-rating">
              <span>★★★★★</span>
              <span class="rating-count">(128)</span>
            </div>
          </div>
          <p class="plato-description">El plato insignia de Antioquia con frijoles, arroz, chicharrón, carne molida, chorizo, huevo frito, aguacate y arepa.</p>
          <div class="plato-details">
            <span class="plato-time">⏱ 40 min</span>
            <span class="plato-calories">🔥 1200 kcal</span>
          </div>
          <div class="plato-footer">
            <div class="price-container">
              <span class="plato-price">{{ formatPrice(35000) }}</span>
              <span class="plato-original-price">{{ formatPrice(42000) }}</span>
            </div>
            <button class="details-btn" @click="showDetails(getPlatoById('bandeja-paisa'))">
              Ver detalles
            </button>
          </div>
        </div>
      </div>

      <!-- Platos normales -->
      <div 
        v-for="(plato, index) in filteredPlatos" 
        :key="index"
        class="plato-card"
        :class="{ 'new-item': plato.isNew, 'seasonal-item': plato.isSeasonal, 'regional-item': plato.isRegional }"
      >
        <div class="plato-image-container">
          <img :src="plato.image" :alt="plato.nombre" class="plato-image" />
          <div v-if="plato.badge" class="plato-badge" :class="plato.badge.type">
            {{ plato.badge.text }}
          </div>
        </div>
        <div class="plato-content">
          <div class="plato-header">
            <h3 class="plato-title">{{ plato.nombre }}</h3>
            <div class="plato-rating">
              <span>{{ plato.ratingStars }}</span>
              <span class="rating-count">({{ plato.ratingCount }})</span>
            </div>
          </div>
          <p class="plato-description">{{ plato.descripcion }}</p>
          <div class="plato-details">
            <span class="plato-time">⏱ {{ plato.tiempoPreparacion }}</span>
            <span v-if="plato.region" class="plato-region">📍 {{ plato.region }}</span>
          </div>
          <div class="plato-footer">
            <div class="price-container">
              <span class="plato-price">{{ formatPrice(plato.precio) }}</span>
              <span v-if="plato.precioOriginal" class="plato-original-price">{{ formatPrice(plato.precioOriginal) }}</span>
            </div>
            <button class="details-btn" @click="showDetails(plato)">
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del plato -->
    <div v-if="selectedPlato" class="plato-modal" :class="{ active: showModal }">
      <div class="modal-content">
        <button class="close-modal" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="modal-image-container">
          <img :src="selectedPlato.image" :alt="selectedPlato.nombre" class="modal-image" />
          <div v-if="selectedPlato.region" class="modal-region-badge">
            {{ selectedPlato.region }}
          </div>
        </div>
        <div class="modal-details">
          <h3>{{ selectedPlato.nombre }}</h3>
          <div class="modal-rating">
            <span>{{ selectedPlato.ratingStars }}</span>
            <span class="rating-count">({{ selectedPlato.ratingCount }} reseñas)</span>
          </div>
          <p class="modal-description">{{ selectedPlato.descripcion }}</p>
          
          <div class="modal-section">
            <h4>Ingredientes:</h4>
            <ul class="modal-ingredients">
              <li v-for="(ingrediente, idx) in selectedPlato.ingredientes" :key="idx">
                {{ ingrediente }}
              </li>
            </ul>
          </div>
          
          <div v-if="selectedPlato.historia" class="modal-section">
            <h4>Historia:</h4>
            <p class="modal-history">{{ selectedPlato.historia }}</p>
          </div>
          
          <div class="modal-footer">
            <div class="modal-price">
              <span>{{ formatPrice(selectedPlato.precio) }}</span>
              <span v-if="selectedPlato.precioOriginal" class="original-price">
                {{ formatPrice(selectedPlato.precioOriginal) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Función para formatear precios en pesos colombianos
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Datos de platos típicos colombianos
const platos = ref([
  {
    id: 'bandeja-paisa',
    nombre: 'Bandeja Paisa',
    descripcion: 'El plato insignia de Antioquia con frijoles, arroz, chicharrón, carne molida, chorizo, huevo frito, aguacate y arepa.',
    precio: 35000,
    precioOriginal: 42000,
    image: new URL('../assets/IMG/BandejaPaisa.jpeg' , import.meta.url).href,
    ratingStars: '★★★★★',
    ratingCount: 128,
    tiempoPreparacion: '40 min',
    region: 'Antioquia',
    categoria: 'plato-fuerte',
    badge: { type: 'chef', text: 'Especialidad' },
    ingredientes: [
      'Frijoles antioqueños',
      'Arroz blanco',
      'Carne molida',
      'Chicharrón',
      'Chorizo',
      'Huevo frito',
      'Aguacate',
      'Arepa',
      'Plátano maduro'
    ],
    historia: 'Este icónico plato representa la abundancia de la región paisa. Surgió como una combinación de los alimentos que los campesinos necesitaban para aguantar largas jornadas de trabajo en el campo.'
  },
  {
    id: 'ajiaco',
    nombre: 'Ajiaco Santafereño',
    descripcion: 'Sopa espesa de pollo con tres tipos de papa, guascas, crema de leche y alcaparras.',
    precio: 28000,
    image: new URL('../assets/IMG/Ajiaco.jpeg' , import.meta.url).href,
    ratingStars: '★★★★☆',
    ratingCount: 95,
    tiempoPreparacion: '1 hora 30 min',
    region: 'Bogotá',
    categoria: 'sopas',
    isRegional: true,
    badge: { type: 'seasonal', text: 'Tradicional' },
    ingredientes: [
      'Pollo desmenuzado',
      'Papa criolla',
      'Papa pastusa',
      'Papa sabanera',
      'Guascas',
      'Crema de leche',
      'Alcaparras',
      'Aguacate'
    ],
    historia: 'El ajiaco es un plato típico de Bogotá que tiene sus raíces en la época precolombina. Las guascas, hierba esencial en su preparación, le dan su sabor característico.'
  },
  {
    id: 'churrasco',
    nombre: 'Churrasco Colombiano',
    descripcion: 'Corte de carne asado a la parrilla, servido con chimichurri, yuca frita y ensalada.',
    precio: 32000,
    precioOriginal: 38000,
    image: new URL('../assets/IMG/Currasco.png' , import.meta.url).href,
    ratingStars: '★★★★★',
    ratingCount: 87,
    tiempoPreparacion: '30 min',
    categoria: 'carnes',
    ingredientes: [
      'Carne de res (lomo o entraña)',
      'Chimichurri',
      'Yuca frita',
      'Ensalada fresca',
      'Patacones',
      'Salsa criolla'
    ]
  },
  {
    id: 'pechuga-gratinada',
    nombre: 'Pechuga Gratinada',
    descripcion: 'Pechuga de pollo gratinada con queso mozzarella y salsa de champiñones, acompañada de puré de papa.',
    precio: 29000,
    image: new URL('../assets/IMG/Pechuga.jpg' , import.meta.url).href,
    ratingStars: '★★★★☆',
    ratingCount: 64,
    tiempoPreparacion: '35 min',
    categoria: 'aves',
    ingredientes: [
      'Pechuga de pollo',
      'Queso mozzarella',
      'Champiñones',
      'Crema de leche',
      'Puré de papa',
      'Verduras al vapor'
    ]
  },
  {
    id: 'fetuchini',
    nombre: 'Fetuchini a la Colombiana',
    descripcion: 'Pasta fetuchini con salsa de crema, champiñones y pollo, adaptada al gusto colombiano.',
    precio: 27000,
    image: new URL('../assets/IMG/Fetuchino.jpg' , import.meta.url).href,
    ratingStars: '★★★☆☆',
    ratingCount: 42,
    tiempoPreparacion: '25 min',
    categoria: 'pastas',
    isNew: true,
    badge: { type: 'new', text: 'Nuevo' },
    ingredientes: [
      'Pasta fetuchini',
      'Pechuga de pollo',
      'Champiñones',
      'Crema de leche',
      'Queso parmesano',
      'Ajo',
      'Hierbas aromáticas'
    ]
  },
  {
    id: 'picadas',
    nombre: 'Picada Colombiana',
    descripcion: 'Variedad de carnes, embutidos, papas, yuca y plátano para compartir.',
    precio: 45000,
    image: new URL('../assets/IMG/Picada.jpg' , import.meta.url).href,
    ratingStars: '★★★★☆',
    ratingCount: 73,
    tiempoPreparacion: '40 min',
    categoria: 'compartir',
    ingredientes: [
      'Carne de res',
      'Pollo',
      'Chorizo',
      'Morcilla',
      'Chicharrón',
      'Yuca',
      'Papa criolla',
      'Plátano maduro',
      'Aguacate'
    ]
  },
  {
    id: 'bagre-frito',
    nombre: 'Bagre Frito',
    descripcion: 'Bagre fresco frito acompañado de patacones, arroz con coco y ensalada.',
    precio: 31000,
    image: new URL('../assets/IMG/BagreFrito.jpeg' , import.meta.url).href,
    ratingStars: '★★★★☆',
    ratingCount: 58,
    tiempoPreparacion: '30 min',
    region: 'Costa Caribe',
    categoria: 'pescados',
    isRegional: true,
    ingredientes: [
      'Bagre fresco',
      'Patacones',
      'Arroz con coco',
      'Ensalada',
      'Limón',
      'Salsa de ajo'
    ],
    historia: 'Típico de la región Caribe, el bagre frito se prepara con pescados de río y se acompaña con los sabores únicos de la costa.'
  },
  {
    id: 'lengua-salsa',
    nombre: 'Lengua en Salsa Criolla',
    descripcion: 'Lengua de res cocinada a la perfección en una salsa criolla con vino y especias.',
    precio: 34000,
    image: new URL('../assets/IMG/Lengua.jpg' , import.meta.url).href,
    ratingStars: '★★★☆☆',
    ratingCount: 39,
    tiempoPreparacion: '2 horas',
    categoria: 'plato-fuerte',
    ingredientes: [
      'Lengua de res',
      'Cebolla',
      'Tomate',
      'Ajo',
      'Vino tinto',
      'Hierbas aromáticas',
      'Papa salada'
    ]
  },
  {
    id: 'punta-anca',
    nombre: 'Punta de Anca',
    descripcion: 'Corte premium de res a la parrilla con chimichurri y papas chorreadas.',
    precio: 38000,
    precioOriginal: 45000,
    image: new URL('../assets/IMG/PuntaAnca.jpg' , import.meta.url).href,
    ratingStars: '★★★★★',
    ratingCount: 92,
    tiempoPreparacion: '35 min',
    categoria: 'carnes',
    badge: { type: 'recommended', text: 'Recomendado' },
    ingredientes: [
      'Punta de anca',
      'Chimichurri',
      'Papas chorreadas',
      'Verduras al vapor',
      'Salsa criolla'
    ]
  },
  {
    id: 'mojarra-diabla',
    nombre: 'Mojarra a la Diabla',
    descripcion: 'Mojarra frita bañada en salsa picante con ajíes colombianos.',
    precio: 33000,
    image: new URL('../assets/IMG/MOjarraDiabla.jpg' , import.meta.url).href,
    ratingStars: '★★★★☆',
    ratingCount: 67,
    tiempoPreparacion: '30 min',
    region: 'Tolima',
    categoria: 'pescados',
    isSpicy: true,
    isRegional: true,
    badge: { type: 'spicy', text: 'Picante' },
    ingredientes: [
      'Mojarra fresca',
      'Ají colombiano',
      'Cebolla',
      'Tomate',
      'Ajo',
      'Limón',
      'Cilantro'
    ]
  },
  {
    id: 'casuela-mariscos',
    nombre: 'Casuela de Mariscos',
    descripcion: 'Mezcla de mariscos en salsa de coco con arroz con coco y patacones.',
    precio: 42000,
    image: new URL('../assets/IMG/CasuelaMariscos.jpeg' , import.meta.url).href,
    ratingStars: '★★★★★',
    ratingCount: 104,
    tiempoPreparacion: '45 min',
    region: 'Pacífico',
    categoria: 'mariscos',
    isRegional: true,
    ingredientes: [
      'Camarones',
      'Calamares',
      'Mejillones',
      'Pescado',
      'Leche de coco',
      'Ají dulce',
      'Cilantro',
      'Arroz con coco'
    ],
    historia: 'Este plato representa la riqueza del Pacífico colombiano, donde los mariscos se combinan con el sabor único del coco.'
  },
  {
    id: 'chicharron-carnudo',
    nombre: 'Chicharrón Carnudo',
    descripcion: 'Trozos de cerdo fritos crujientes por fuera y jugosos por dentro, con yuca y ají.',
    precio: 26000,
    image: new URL('../assets/IMG/ChicharronCarnudo.jpeg' , import.meta.url).href,
    ratingStars: '★★★★☆',
    ratingCount: 81,
    tiempoPreparacion: '50 min',
    region: 'Santander',
    categoria: 'plato-fuerte',
    isRegional: true,
    ingredientes: [
      'Carne de cerdo con grasa',
      'Yuca',
      'Ají',
      'Limón',
      'Cilantro'
    ],
    historia: 'Originario de Santander, este chicharrón se diferencia por incluir buena cantidad de carne junto a la grasa, dándole un sabor incomparable.'
  },
  {
    id: 'sancocho',
    nombre: 'Sancocho de Gallina',
    descripcion: 'Sopa espesa de gallina criolla con papa, yuca, plátano y maíz.',
    precio: 25000,
    image: new URL('../assets/IMG/Sancocho.jpeg' , import.meta.url).href,
    ratingStars: '★★★★★',
    ratingCount: 112,
    tiempoPreparacion: '2 horas',
    categoria: 'sopas',
    ingredientes: [
      'Gallina criolla',
      'Papa',
      'Yuca',
      'Plátano verde',
      'Maíz',
      'Cilantro',
      'Aguacate'
    ],
    historia: 'El sancocho es posiblemente el plato más representativo de Colombia, con variaciones regionales. Este de gallina es el más tradicional.'
  },
  {
    id: 'lechona',
    nombre: 'Lechona Tolimense',
    descripcion: 'Cerdo relleno de arroz, carne y especias, cocinado por 12 horas.',
    precio: 30000,
    image: new URL('../assets/IMG/Lechona.jpeg' , import.meta.url).href,
    ratingStars: '★★★★☆',
    ratingCount: 76,
    tiempoPreparacion: '12 horas',
    region: 'Tolima',
    categoria: 'plato-fuerte',
    isRegional: true,
    ingredientes: [
      'Cerdo entero',
      'Arroz',
      'Carne molida',
      'Arvejas',
      'Cebolla',
      'Ajo',
      'Hierbas aromáticas'
    ],
    historia: 'La lechona es una tradición del Tolima y Huila, donde se prepara para fiestas y celebraciones. La cocción lenta le da su textura única.'
  }
]);

// Estado del componente
const activeFilter = ref('all');
const searchQuery = ref('');
const showModal = ref(false);
const selectedPlato = ref(null);
const favorites = ref([]);

// Categorías para los filtros
const categories = computed(() => {
  const counts = platos.value.reduce((acc, plato) => {
    acc.all++;
    acc[plato.categoria] = (acc[plato.categoria] || 0) + 1;
    return acc;
  }, { all: 0 });

  return [
    { value: 'all', label: 'Todos', count: counts.all },
    { value: 'plato-fuerte', label: 'Platos Fuertes', count: counts['plato-fuerte'] || 0 },
    { value: 'sopas', label: 'Sopas', count: counts.sopas || 0 },
    { value: 'carnes', label: 'Carnes', count: counts.carnes || 0 },
    { value: 'aves', label: 'Aves', count: counts.aves || 0 },
    { value: 'pescados', label: 'Pescados', count: counts.pescados || 0 },
    { value: 'mariscos', label: 'Mariscos', count: counts.mariscos || 0 },
    { value: 'pastas', label: 'Pastas', count: counts.pastas || 0 },
    { value: 'compartir', label: 'Para Compartir', count: counts.compartir || 0 }
  ];
});

// Plato destacado (Bandeja Paisa)
const featuredPlato = computed(() => {
  return platos.value.find(p => p.id === 'bandeja-paisa');
});

// Platos filtrados (excluyendo el destacado)
const filteredPlatos = computed(() => {
  let result = platos.value.filter(p => p.id !== 'bandeja-paisa');
  
  // Filtrar por categoría
  if (activeFilter.value !== 'all') {
    result = result.filter(plato => plato.categoria === activeFilter.value);
  }
  
  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(plato => 
      plato.nombre.toLowerCase().includes(query) || 
      plato.descripcion.toLowerCase().includes(query) ||
      (plato.region && plato.region.toLowerCase().includes(query)))
  }
  
  return result;
});

// Funciones de utilidad
const getPlatoById = (id) => {
  return platos.value.find(p => p.id === id);
};

const isFavorite = (id) => {
  return favorites.value.some(p => p.id === id);
};

// Funciones principales
const volver = () => {
  router.back();
};

const filterPlatos = (category) => {
  activeFilter.value = category;
};

const handleSearch = () => {
  // La reactividad de computed se encarga del filtrado
};

const toggleFavorite = (platoId) => {
  const plato = getPlatoById(platoId);
  if (plato) {
    if (isFavorite(platoId)) {
      favorites.value = favorites.value.filter(p => p.id !== platoId);
    } else {
      favorites.value.push(plato);
    }
  }
};

const showDetails = (plato) => {
  selectedPlato.value = plato;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedPlato.value = null;
};

const addToCart = (platoId) => {
  // Lógica para añadir al carrito
  console.log(`Añadiendo plato ${platoId} al carrito`);
  if (showModal.value) {
    closeModal();
  }
};

// Cargar favoritos al montar el componente
onMounted(() => {
  // Simular carga de favoritos
  favorites.value = platos.value.filter(p => p.isFavorite);
});
</script>

<style scoped>
/* Estilos base */
.platos-container {
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px 60px;
  margin-top: 90px;
  position: relative;
  background-color: var(--neutral);
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
}

/* Botón de volver */
.back-button {
  position: absolute;
  top: 25px;
  left: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  z-index: 10;
}

.back-button svg {
  width: 18px;
  height: 18px;
}

.back-button:hover {
  background-color: #a53a0c;
  transform: translateX(-5px);
}

/* Encabezado de sección */
.section-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.header-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.decoration-line {
  height: 2px;
  width: 80px;
  background-color: var(--accent);
  opacity: 0.6;
}

.decoration-icon {
  margin: 0 15px;
}

.decoration-icon svg {
  width: 24px;
  height: 24px;
  color: var(--accent);
}

.section-title {
  font-size: 2.8rem;
  color: var(--text);
  margin-bottom: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.section-title span {
  color: var(--primary);
  font-weight: 800;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-gray);
  max-width: 600px;
  margin: 0 auto;
}

/* Filtros */
.filters-container {
  margin-bottom: 30px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.filters-scroll {
  display: flex;
  gap: 12px;
  padding: 5px;
  width: max-content;
  margin: 0 auto;
}

.filter-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  background-color: #e0d5c0;
  color: var(--text);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-btn.active {
  background-color: var(--primary);
  color: white;
}

.filter-btn:hover:not(.active) {
  background-color: #d4c9b5;
}

.filter-count {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

/* Barra de búsqueda */
.search-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto 30px;
}

.search-input {
  width: 100%;
  padding: 12px 20px 12px 45px;
  border-radius: 30px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 5px 20px rgba(210, 164, 23, 0.2);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-gray);
}

/* Grid de platos */
.platos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 20px;
}

/* Tarjeta de plato */
.plato-card {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
}

.plato-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.plato-card.featured {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.plato-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.plato-card.featured .plato-image-container {
  height: 100%;
}

.plato-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.plato-card:hover .plato-image {
  transform: scale(1.05);
}

.plato-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  background-color: var(--primary);
  z-index: 2;
}

.plato-badge.chef {
  background-color: var(--accent);
}

.plato-badge.new {
  background-color: var(--secondary);
}

.plato-badge.seasonal {
  background-color: #8B5A2B;
}

.plato-badge.recommended {
  background-color: #5A678C;
}

.plato-badge.spicy {
  background-color: #E3452F;
}

.favorite-btn {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
}

.favorite-btn svg {
  width: 20px;
  height: 20px;
  color: var(--text-gray);
  transition: all 0.3s ease;
}

.favorite-btn:hover, .favorite-btn.active {
  background: rgba(210, 164, 23, 0.2);
}

.favorite-btn:hover svg, .favorite-btn.active svg {
  color: var(--accent);
  fill: var(--accent);
}

.plato-content {
  padding: 20px;
}

.plato-card.featured .plato-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.plato-header {
  margin-bottom: 12px;
}

.plato-title {
  font-size: 1.3rem;
  color: var(--text);
  margin-bottom: 5px;
  font-weight: 700;
}

.plato-card.featured .plato-title {
  font-size: 1.8rem;
}

.plato-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--accent);
  font-size: 0.9rem;
}

.rating-count {
  color: var(--text-gray);
  font-size: 0.8rem;
}

.plato-description {
  color: var(--text-gray);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.plato-card.featured .plato-description {
  font-size: 1.05rem;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

.plato-details {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 0.85rem;
  color: var(--text-gray);
}

.plato-time, .plato-spicy {
  display: flex;
  align-items: center;
  gap: 3px;
}

.plato-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-container {
  display: flex;
  flex-direction: column;
}

.plato-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary);
}

.plato-card.featured .plato-price {
  font-size: 1.6rem;
}

.plato-original-price {
  font-size: 0.9rem;
  color: var(--text-gray);
  text-decoration: line-through;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.add-to-cart-btn, .details-btn {
  border: none;
  border-radius: 30px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
}

.plato-card.featured .add-to-cart-btn {
  padding: 10px 20px;
  font-size: 1rem;
}

.add-to-cart-btn {
  background-color: var(--primary);
  color: white;
}

.add-to-cart-btn:hover {
  background-color: #a53a0c;
}

.details-btn {
  background-color: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
}

.details-btn:hover {
  background-color: rgba(193, 68, 14, 0.1);
}

/* Modal de detalles */
.plato-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.plato-modal.active {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background-color: white;
  border-radius: 20px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(0, 0, 0, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
}

.close-modal:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.close-modal svg {
  width: 20px;
  height: 20px;
  color: white;
}

.modal-image-container {
  height: 100%;
  min-height: 400px;
  position: relative;
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-details {
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.modal-details h3 {
  font-size: 2rem;
  color: var(--text);
  margin-bottom: 10px;
}

.modal-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: var(--accent);
}

.modal-description {
  color: var(--text-gray);
  line-height: 1.6;
  margin-bottom: 25px;
}

.modal-ingredients {
  margin-bottom: 30px;
}

.modal-ingredients h4 {
  font-size: 1.2rem;
  color: var(--text);
  margin-bottom: 10px;
}

.modal-ingredients ul {
  list-style-type: none;
  padding-left: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.modal-ingredients li {
  position: relative;
  padding-left: 20px;
  color: var(--text-gray);
}

.modal-ingredients li:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background-color: var(--accent);
  border-radius: 50%;
}

.modal-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-price {
  display: flex;
  flex-direction: column;
}

.modal-price span {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
}

.original-price {
  font-size: 1.2rem;
  color: var(--text-gray);
  text-decoration: line-through;
}

.modal-add-btn {
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-add-btn:hover {
  background-color: #a53a0c;
}

/* Efectos especiales para nuevos y de temporada */
.new-item {
  border: 2px solid var(--secondary);
}

.seasonal-item {
  position: relative;
  overflow: hidden;
}

.seasonal-item:after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(210, 164, 23, 0.1),
    rgba(210, 164, 23, 0),
    rgba(210, 164, 23, 0.1)
  );
  transform: rotate(30deg);
  z-index: 1;
}

/* Responsive */
@media (max-width: 1200px) {
  .platos-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 992px) {
  .plato-card.featured {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    grid-template-columns: 1fr;
    max-height: 80vh;
  }
  
  .modal-image-container {
    min-height: 300px;
  }
}

@media (max-width: 768px) {
  .platos-container {
    width: 95%;
    padding: 30px 15px 50px;
  }
  
  .section-title {
    font-size: 2.2rem;
  }
  
  .platos-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }
  
  .modal-details {
    padding: 25px;
  }
  
  .modal-ingredients ul {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .platos-container {
    padding: 25px 10px 40px;
    margin-top: 80px;
  }
  
  .back-button {
    top: 15px;
    left: 15px;
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .platos-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
  }
  
  .modal-details h3 {
    font-size: 1.5rem;
  }
  
  .modal-price span {
    font-size: 1.4rem;
  }
  
  .original-price {
    font-size: 1rem;
  }
  
  .modal-add-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>