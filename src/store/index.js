import { createStore } from "vuex";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";

const storedToken = localStorage.getItem("token");

export default createStore({
  state: {
    usuario: null,
    token: storedToken || null,
    tipoPlan: null,
    loading: false
  },
  mutations: {
    SET_USUARIO(state, usuario) {
      state.usuario = usuario;
    },
    SET_IMAGEN(state, imagen) {
      if (state.usuario) {
        // Forzar reactividad creando nuevo objeto
        state.usuario = { ...state.usuario, imagen };
      }
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    CLEAR_AUTH(state) {
      state.usuario = null;
      state.token = null;
    },
    SET_TIPO_PLAN(state, plan) {
      state.tipoPlan = plan;
    },
    RESET_TIPO_PLAN(state) {
      state.tipoPlan = null;
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    }
  },
  actions: {
    async fetchUsuario({ commit, state }) {
      commit('SET_LOADING', true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/usuarios/perfil`, 
          {
            headers: {
              Authorization: `Bearer ${state.token}`
            }
          }
        );
        commit('SET_USUARIO', response.data);
        return response.data;
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        if (error.response?.status === 401) {
          commit('CLEAR_AUTH');
          localStorage.removeItem("token");
        }
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async loginUsuario({ commit, dispatch }, { token, redirect = true }) {
      commit('SET_TOKEN', token);
      localStorage.setItem("token", token);
      
      try {
        await dispatch('fetchUsuario');
        if (redirect) {
          router.push('/dashboard');
        }
      } catch (error) {
        commit('CLEAR_AUTH');
        localStorage.removeItem("token");
        throw error;
      }
    },

    async cargarToken({ commit, dispatch }) {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const payload = jwtDecode(token);
        if (payload.exp * 1000 < Date.now()) {
          throw new Error('Token expirado');
        }
        commit('SET_TOKEN', token);
        await dispatch('fetchUsuario');
      } catch (error) {
        console.error("Error al cargar token:", error);
        commit('CLEAR_AUTH');
        localStorage.removeItem("token");
      }
    },

    async logoutUsuario({ commit }) {
      commit('CLEAR_AUTH');
      localStorage.removeItem("token");
      router.push('/login');
    },

    async actualizarFoto({ commit, state }, file) {
      commit('SET_LOADING', true);
      const formData = new FormData();
      formData.append('imagen', file);

      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/usuarios/${state.usuario.id}/foto-perfil`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${state.token}`
            }
          }
        );

        commit('SET_IMAGEN', response.data.imagenUrl);
        Swal.fire('Éxito', 'Foto de perfil actualizada', 'success');
        return response.data;
      } catch (error) {
        console.error('Error al actualizar foto:', error);
        Swal.fire('Error', 'No se pudo actualizar la foto', 'error');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async eliminarFoto({ commit, state }) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/usuarios/${state.usuario.id}/foto-perfil`,
          {
            headers: {
              Authorization: `Bearer ${state.token}`
            }
          }
        );
        commit('SET_IMAGEN', null);
        Swal.fire('Éxito', 'Foto eliminada', 'success');
      } catch (error) {
        console.error('Error al eliminar foto:', error);
        Swal.fire('Error', 'No se pudo eliminar la foto', 'error');
      }
    },

    async actualizarPerfil({ commit, state }, datosActualizados) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/usuarios/${state.usuario.id}`,
          datosActualizados,
          {
            headers: {
              Authorization: `Bearer ${state.token}`
            }
          }
        );
        commit('SET_USUARIO', response.data);
        Swal.fire('Éxito', 'Perfil actualizado', 'success');
        return response.data;
      } catch (error) {
        console.error('Error al actualizar perfil:', error);
        Swal.fire('Error', error.response?.data?.message || 'Error al actualizar', 'error');
        throw error;
      }
    },

    guardarTipoPlan({ commit }, plan) {
      commit('SET_TIPO_PLAN', plan);
    },

    resetTipoPlan({ commit }) {
      commit('RESET_TIPO_PLAN');
    }
  },
  getters: {
    usuario: (state) => state.usuario,
    token: (state) => state.token,
    isAuthenticated: (state) => !!state.token,
    isLoading: (state) => state.loading,
    tipoPlan: (state) => state.tipoPlan,
    esAdmin: (state) => state.usuario?.esAdmin || false,

    imagenPerfil: (state) => {
      if (!state.usuario?.imagen) {
        return {
          tipo: 'icono',
          valor: 'fas fa-user-circle'
        };
      }

      // Si es una URL completa o imagen base64
      if (typeof state.usuario.imagen === 'string' && 
          (state.usuario.imagen.startsWith('http') || 
           state.usuario.imagen.startsWith('data:image'))) {
        return {
          tipo: 'imagen',
          valor: state.usuario.imagen
        };
      }

      // Construir URL completa para imagen relativa
      return {
        tipo: 'imagen',
        valor: `${import.meta.env.VITE_API_URL}/${state.usuario.imagen.replace(/^\/+/, '')}?t=${Date.now()}`
      };
    }
  }
});