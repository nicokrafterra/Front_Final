<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <div>
      <!-- Overlay para móviles -->
      <div v-if="showMobileOverlay" class="mobile-overlay" @click="toggleSidebar"></div>

      <!-- Botón de hamburguesa para móviles -->
      <button class="mobile-menu-btn" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
      </button>

      <nav :class="{ 'collapsed': sidebarCollapsed, 'mobile-open': !sidebarCollapsed && isMobile }" class="admin-sidebar">
        <div class="sidebar-top">
          <div class="logo-wrapper" @click="toggleCollapse">
            <i class="fas fa-user-shield logo-icon"></i>
            <h1 v-if="!sidebarCollapsed">Administrador</h1>
            <div class="expand-btn">
              <i class="fas fa-chevron-left"></i>
            </div>
          </div>
        </div>

        <div class="sidebar-content">
          <ul class="nav-menu">
            <li v-for="(item, index) in menuItems" :key="item.component" :style="{'--i': index}">
              <a href="#" class="nav-link" :class="{ 'active': activeComponent === item.component }"
                @click.prevent="setActiveComponent(item.component)">
                <div class="nav-icon">
                  <i :class="item.icon"></i>
                </div>
                <span class="nav-text">{{ item.title }}</span>
                <span class="nav-tooltip">{{ item.title }}</span>
              </a>
            </li>
          </ul>

          <div class="sidebar-bottom">
            <ul class="nav-menu">
              <li>
                <a href="#" class="nav-link" :class="{ 'active': activeComponent === 'Configuracion' }"
                  @click.prevent="setActiveComponent('Configuracion')">
                  <div class="nav-icon">
                    <i class="fas fa-cog"></i>
                  </div>
                  <span class="nav-text">Ajustes</span>
                  <span class="nav-tooltip">Ajustes</span>
                </a>
              </li>
              <li>
                <a href="#" class="nav-link" @click.prevent="logout">
                  <div class="nav-icon">
                    <i class="fas fa-sign-out-alt"></i>
                  </div>
                  <span class="nav-text">Salir</span>
                  <span class="nav-tooltip">Salir</span>
                </a>
              </li>
            </ul>

            <div class="user-profile">
              <div class="avatar-wrapper">
                <img :src="imagenPerfil" alt="Profile" class="avatar">
                <div class="online-status"></div>
              </div>
              <div v-if="!sidebarCollapsed" class="user-info">
                <div class="user-name">{{ usuario.nombre }}</div>
                <div class="user-email">{{ usuario.correoElectronico }}</div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Área de contenido -->
    <main class="content-area">
      <div class="content-container">
        <component :is="activeComponent" />
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ClientesView from './ClientesView.vue';
import ReservasView from './ReservasView.vue';
import tablaPqrs from './tablaPqrs.vue';
import FormPlanes from './FormPlanes.vue';
import Configuracion from './Configuracion.vue';

// Importar Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

export default {
  name: 'AdminLayout',
  components: {
    ClientesView,
    ReservasView,
    tablaPqrs,
    FormPlanes,
    Configuracion
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const sidebarCollapsed = ref(false);
    const isMobile = ref(false);
    const showMobileOverlay = ref(false);
    const activeComponent = ref('ClientesView');

    const menuItems = [
      {
        component: 'ClientesView',
        title: 'Clientes',
        icon: 'fas fa-users'
      },
      {
        component: 'ReservasView',
        title: 'Historial Reservas',
        icon: 'fas fa-calendar-check'
      },
      {
        component: 'tablaPqrs',
        title: 'NOVEDADES',
        icon: 'fas fa-exclamation-circle'
      },
      {
        component: 'FormPlanes',
        title: 'Planes',
        icon: 'fas fa-clipboard-list'
      }
    ];

    const setActiveComponent = (component) => {
      activeComponent.value = component;
      if (isMobile.value) {
        toggleSidebar();
      }
    };

    const toggleCollapse = () => {
      if (!isMobile.value) {
        sidebarCollapsed.value = !sidebarCollapsed.value;
      }
    };

    const toggleSidebar = () => {
      if (isMobile.value) {
        sidebarCollapsed.value = !sidebarCollapsed.value;
        showMobileOverlay.value = !sidebarCollapsed.value;
      }
    };

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth < 992;
      if (!isMobile.value) {
        sidebarCollapsed.value = false;
        showMobileOverlay.value = false;
      } else {
        sidebarCollapsed.value = true;
      }
    };

    const logout = async () => {
      try {
        await store.dispatch('logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/Iniciar');

        store.commit('setAlert', {
          type: 'success',
          message: 'Sesión cerrada correctamente'
        });
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        store.commit('setAlert', {
          type: 'error',
          message: 'Error al cerrar sesión'
        });
      }
    };

    onMounted(() => {
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkScreenSize);
    });

    const getImageUrl = (name) => {
      return new URL(`../assets/${name}`, import.meta.url).href;
    };

    const usuario = computed(() => store.state.usuario || {
      nombre: 'Usuario',
      correoElectronico: 'usuario@ejemplo.com',
      imgen: null
    });

    const imagenPerfil = computed(() => {
      return usuario.value.imagen
        ? `http://localhost:8000/${usuario.value.imagen}`
        : getImageUrl('default-avatar.jpg');
    });

    return {
      sidebarCollapsed,
      isMobile,
      showMobileOverlay,
      activeComponent,
      menuItems,
      setActiveComponent,
      toggleCollapse,
      toggleSidebar,
      getImageUrl,
      imagenPerfil,
      usuario,
      logout
    };
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
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 80px;
}

/* Layout Base */
.admin-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
  font-family: 'Poppins', sans-serif;
}

/* Sidebar Styles */
.admin-sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: #0d1b2a;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.admin-sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

.admin-sidebar.mobile-open {
  transform: translateX(0);
  box-shadow: 5px 0 25px rgba(0, 0, 0, 0.3);
}

.sidebar-top {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  background: var(--darker);
  z-index: 1;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: var(--transition);
}

.logo-icon {
  font-size: 24px;
  color: var(--primary-light);
  transition: var(--transition);
}

.logo-wrapper:hover .logo-icon {
  transform: rotate(15deg);
  color: white;
}

.logo-wrapper h1 {
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  transition: var(--transition);
  background: linear-gradient(to right, #fff 0%, var(--primary-light) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.admin-sidebar.collapsed .logo-wrapper h1 {
  opacity: 0;
  width: 0;
}

.expand-btn {
  margin-left: auto;
  transition: var(--transition);
  opacity: 1;
  color: rgba(255, 255, 255, 0.7);
}

.admin-sidebar.collapsed .expand-btn {
  transform: rotate(180deg);
}

/* Sidebar Content */
.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px 0;
  overflow-y: auto;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  margin: 5px 10px;
  border-radius: 8px;
  transition: var(--transition);
  font-size: 14px;
  position: relative;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.nav-link.active {
  background: linear-gradient(90deg, rgba(67, 97, 238, 0.2) 0%, transparent 100%);
  color: white;
  font-weight: 500;
}

.nav-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon i {
  font-size: 16px;
  transition: var(--transition);
}

.nav-link:hover .nav-icon i {
  transform: scale(1.1);
}

.nav-link.active .nav-icon i {
  color: var(--primary-light);
}

.nav-text {
  margin-left: 12px;
  white-space: nowrap;
  transition: var(--transition);
}

.admin-sidebar.collapsed .nav-text {
  opacity: 0;
  width: 0;
}

.nav-tooltip {
  position: absolute;
  left: calc(100% + 15px);
  top: 50%;
  transform: translateY(-50%);
  background: var(--dark);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition);
  pointer-events: none;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  z-index: 1001;
}

.admin-sidebar.collapsed .nav-link:hover .nav-tooltip {
  opacity: 1;
  visibility: visible;
}

/* Sidebar Bottom */
.sidebar-bottom {
  margin-top: auto;
  padding: 15px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  bottom: 0;
  background: var(--darker);
}

.user-profile {
  display: flex;
  align-items: center;
  padding: 15px;
  gap: 12px;
  transition: var(--transition);
  cursor: pointer;
}

.avatar-wrapper {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.online-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: var(--success);
  border-radius: 50%;
  border: 2px solid var(--dark);
}

.user-info {
  transition: var(--transition);
  overflow: hidden;
}

.user-name {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 2px;
}

.user-email {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.admin-sidebar.collapsed .user-info {
  opacity: 0;
  width: 0;
}

/* Content Area */
.content-area {
  flex: 1;
  padding: 20px;
  margin-left: var(--sidebar-width);
  transition: var(--transition);
  min-height: 100vh;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.admin-sidebar.collapsed~.content-area {
  margin-left: var(--sidebar-collapsed-width);
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition);
}

.mobile-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  position: fixed;
  top: 15px;
  left: 15px;
  width: 40px;
  height: 40px;
  background: var(--primary);
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 998;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.mobile-menu-btn i {
  color: white;
  font-size: 18px;
}

.mobile-menu-btn:hover {
  background: var(--primary-light);
  transform: scale(1.05);
}

/* Responsive Styles */
@media (max-width: 1199px) {
  :root {
    --sidebar-width: 240px;
  }

  .content-area {
    padding: 15px;
  }
}

@media (max-width: 991px) {
  .admin-sidebar {
    transform: translateX(-100%);
    width: 280px;
  }

  .admin-sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .admin-sidebar.collapsed {
    width: 0;
  }

  .content-area {
    margin-left: 0;
    width: 100%;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .admin-sidebar:not(.collapsed)~.content-area {
    opacity: 0.3;
    pointer-events: none;
  }
}

@media (max-width: 767px) {
  .content-area {
    padding: 15px 10px;
  }

  .mobile-menu-btn {
    top: 10px;
    left: 10px;
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 575px) {
  .content-area {
    padding: 15px 8px;
  }

  .nav-link {
    padding: 12px 15px;
  }

  .user-profile {
    padding: 12px 10px;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.nav-link {
  animation: slideIn 0.3s ease forwards;
  animation-delay: calc(var(--i) * 0.1s);
}

.user-profile {
  animation: fadeIn 0.4s ease forwards;
}
</style>