<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <div>
      <!-- Overlay para móviles -->
      <div v-if="!sidebarCollapsed && isMobile" class="mobile-overlay" @click="sidebarCollapsed = true"></div>

      <nav :class="{ 'collapsed': sidebarCollapsed }" class="admin-sidebar">
        <div class="sidebar-top">
          <div class="logo-wrapper" @click="toggleCollapse">
            <img :src="getImageUrl('admin.svg')" alt="Logo" class="logo">
            <h1 v-if="!sidebarCollapsed">Administrador</h1>
            <div class="expand-btn">
              <img :src="getImageUrl('chevron.svg')" alt="Expand/Collapse">
            </div>
          </div>
        </div>

        <div class="sidebar-content">
          <ul class="nav-menu">
            <li v-for="item in menuItems" :key="item.component">
              <a href="#" class="nav-link" :class="{ 'active': activeComponent === item.component }"
                @click.prevent="setActiveComponent(item.component)">
                <div class="nav-icon">
                  <img :src="getImageUrl(item.icon)" :alt="item.title">
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
                    <img :src="getImageUrl('settings.svg')" alt="Ajustes">
                  </div>
                  <span class="nav-text">Ajustes</span>
                  <span class="nav-tooltip">Ajustes</span>
                </a>
              </li>
              <li>
                <a href="#" class="nav-link" @click.prevent="logout">
                  <div class="nav-icon">
                    <img :src="getImageUrl('logout-svgrepo-com.svg')" alt="Salir">
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
      <component :is="activeComponent" />
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ClientesView from './ClientesView.vue';
import ReservasView from './ReservasView.vue';
import tablaPqrs from './tablaPqrs.vue';
import FormPlanes from './FormPlanes.vue';
import Configuracion from './Configuracion.vue';

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
    const isMobile = ref(window.innerWidth <= 768);
    const activeComponent = ref('ClientesView');

    const menuItems = [
      {
        component: 'ClientesView',
        title: 'Clientes',
        icon: 'customer-service-information-svgrepo-com.svg'
      },
      {
        component: 'ReservasView',
        title: 'Historial Reservas',
        icon: 'reservation-smartphone-svgrepo-com.svg'
      },
      {
        component: 'tablaPqrs',
        title: 'NOVEDADES',
        icon: 'help.svg'
      },
      {
        component: 'FormPlanes',
        title: 'Planes',
        icon: 'help.svg'
      }
    ];

    const setActiveComponent = (component) => {
      activeComponent.value = component;
      if (isMobile.value) {
        sidebarCollapsed.value = true;
      }
    };

    const toggleCollapse = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    };

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768;
      if (isMobile.value) {
        sidebarCollapsed.value = true;
      }
    };

    const logout = async () => {
      try {
        // Limpiar el estado de autenticación
        await store.dispatch('logout');
        
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirigir a la página de inicio de sesión
        router.push('/Iniciar');
        
        // Opcional: Mostrar mensaje de éxito
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
      window.addEventListener('resize', checkMobile);
      checkMobile();
    });

    const getImageUrl = (name) => {
      return new URL(`@/assets/${name}`, import.meta.url).href;
    };

    const usuario = computed(() => store.state.usuario || {
      nombre: 'Usuario',
      correoElectronico: 'usuario@ejemplo.com',
      imagen: null
    });

    const imagenPerfil = computed(() => {
      return usuario.value.imagen
        ? `http://localhost:8000/${usuario.value.imagen}`
        : getImageUrl('default-avatar.jpg');
    });

    return {
      sidebarCollapsed,
      isMobile,
      activeComponent,
      menuItems,
      setActiveComponent,
      toggleCollapse,
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
  --transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.admin-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
  font-family: 'Poppins', sans-serif;
}

/* Modern Sidebar */
.admin-sidebar {
  width: 300px;
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
  box-shadow: 5px 0 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.admin-sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 50%, rgba(67, 97, 238, 0.15) 0%, transparent 50%);
  opacity: 0;
  transition: var(--transition);
}

.admin-sidebar:hover::before {
  opacity: 1;
}

.admin-sidebar.collapsed {
  width: 90px;
}

.sidebar-top {
  padding: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.logo-wrapper::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--primary-light);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s ease;
}

.logo-wrapper:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.logo {
  width: 32px;
  height: 32px;
  transition: var(--transition);
  filter: drop-shadow(0 0 5px rgba(72, 149, 239, 0.5));
}

.logo-wrapper:hover .logo {
  transform: rotate(15deg);
  filter: drop-shadow(0 0 8px rgba(72, 149, 239, 0.8));
}

.logo-wrapper h1 {
  font-family: 'Montserrat', sans-serif;
  font-size: 20px;
  font-weight: 700;
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
  overflow: hidden;
}

.expand-btn {
  margin-left: auto;
  transform: rotate(0deg);
  transition: var(--transition);
  background: rgba(255, 255, 255, 0.1);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(0deg) scale(1.1);
}

.admin-sidebar.collapsed .expand-btn {
  transform: rotate(180deg);
}

.expand-btn img {
  width: 16px;
  height: 16px;
  transition: var(--transition);
}

.expand-btn:hover img {
  transform: scale(1.2);
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 15px 0;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 16px 25px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 0 12px 12px 0;
  margin: 8px 15px;
  position: relative;
  transition: var(--transition);
  font-weight: 500;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--primary);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: var(--transition);
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

.nav-link:hover::before {
  transform: scaleY(1);
}

.nav-link.active {
  background: linear-gradient(90deg, rgba(67, 97, 238, 0.2) 0%, transparent 100%);
  color: white;
  font-weight: 600;
}

.nav-link.active::before {
  transform: scaleY(1);
  background: var(--accent);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent);
}

.nav-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.nav-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0.8);
  transition: var(--transition);
}

.nav-link:hover .nav-icon img {
  filter: brightness(1.2) drop-shadow(0 0 4px rgba(255, 255, 255, 0.3));
  transform: scale(1.1);
}

.nav-link.active .nav-icon img {
  filter: brightness(1.5) drop-shadow(0 0 6px var(--primary-light));
}

.nav-text {
  margin-left: 18px;
  white-space: nowrap;
  transition: var(--transition);
  position: relative;
}

.nav-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-light);
  transition: var(--transition);
}

.nav-link:hover .nav-text::after {
  width: 100%;
}

.admin-sidebar.collapsed .nav-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.nav-tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(10px);
  background: var(--dark);
  color: white;
  padding: 8px 15px;
  border-radius: 8px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition);
  margin-left: 25px;
  pointer-events: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  border-left: 3px solid var(--accent);
}

.nav-tooltip::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid var(--dark);
}

.admin-sidebar.collapsed .nav-link:hover .nav-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
}

.sidebar-bottom {
  margin-top: auto;
  padding: 15px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.user-profile {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 15px;
  transition: var(--transition);
  border-radius: 12px;
  margin: 0 15px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.user-profile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(67, 97, 238, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: var(--transition);
}

.user-profile:hover::before {
  opacity: 1;
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.05);
}

.avatar-wrapper {
  position: relative;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: var(--transition);
  flex-shrink: 0;
}

.user-profile:hover .avatar-wrapper {
  transform: scale(1.1);
  border-color: rgba(72, 149, 239, 0.5);
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  transition: var(--transition);
  filter: grayscale(20%);
}

.user-profile:hover .avatar {
  filter: grayscale(0%) brightness(1.1);
}

.online-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: var(--success);
  border-radius: 50%;
  border: 2px solid var(--dark);
  transition: var(--transition);
}

.user-profile:hover .online-status {
  transform: scale(1.2);
  box-shadow: 0 0 10px var(--success);
}

.user-info {
  transition: var(--transition);
  overflow: hidden;
}

.user-name {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 3px;
  background: linear-gradient(to right, #fff 0%, var(--primary-light) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: var(--transition);
}

.user-profile:hover .user-name {
  text-shadow: 0 0 10px rgba(72, 149, 239, 0.5);
}

.user-email {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  transition: var(--transition);
}

.user-profile:hover .user-email {
  color: rgba(255, 255, 255, 0.9);
}

.admin-sidebar.collapsed .user-info {
  opacity: 0;
  width: 0;
  height: 0;
}

/* Modern Content Area */
.content-area {
  flex: 1;
  padding: 30px;
  margin-left: 300px;
  transition: var(--transition);
  min-height: 100vh;
}

.admin-sidebar.collapsed~.content-area {
  margin-left: 90px;
}

/* Glassmorphism Effect for Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(13, 27, 42, 0.7);
  backdrop-filter: blur(5px);
  z-index: 999;
  display: none;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.mobile-overlay.active {
  opacity: 1;
}

/* Modern Responsive Styles */
@media (max-width: 992px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }

  .admin-sidebar:not(.collapsed) {
    transform: translateX(0);
    width: 280px;
    box-shadow: 5px 0 30px rgba(0, 0, 0, 0.3);
  }

  .admin-sidebar.collapsed {
    width: 0;
    overflow: hidden;
  }

  .content-area {
    margin-left: 0;
    width: 100%;
  }

  .admin-sidebar:not(.collapsed)~.content-area {
    opacity: 0.3;
    pointer-events: none;
    filter: blur(2px);
    transition: var(--transition);
  }

  .mobile-overlay {
    display: block;
  }

  .admin-sidebar.collapsed~.mobile-overlay {
    display: none;
  }
}

/* Animation Keyframes */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Adding some subtle animations */
.logo {
  animation: float 4s ease-in-out infinite;
}

.nav-link:hover .nav-icon {
  animation: pulse 1.5s ease infinite;
}

.user-profile:hover .avatar-wrapper {
  animation: float 2s ease infinite;
}
</style>