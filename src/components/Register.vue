<template>
  <div class="container">
    <div class="form">
      <form @submit.prevent="handleRegister" class="form_front">
        <h2 class="form_title">Regístrate</h2>

        <div class="form_group">
          <input type="text" v-model="nombre" placeholder="Nombre *" required class="input" />
          <transition name="fade">
            <div v-if="nombreError" class="error-message">{{ nombreError }}</div>
          </transition>
        </div>

        <div class="form_group">
          <input type="text" v-model="apellido" placeholder="Apellido *" required class="input" />
          <transition name="fade">
            <div v-if="apellidoError" class="error-message">{{ apellidoError }}</div>
          </transition>
        </div>

        <div class="form_group">
          <input type="email" v-model="email" placeholder="Email *" required class="input" />
          <transition name="fade">
            <div v-if="emailError" class="error-message">{{ emailError }}</div>
          </transition>
        </div>

        <div class="form_group">
          <div style="position: relative; display: flex; align-items: center;">
            <input
              :type="mostrarPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Password *"
              required
              class="input"
              style="padding-right: 40px;"
            />
            <span @click="mostrarPassword = !mostrarPassword"
              style="position: absolute; right: 10px; cursor: pointer; color: var(--amarillo-mostaza);">
              {{ mostrarPassword ? '👁️' : '🙈' }}
            </span>
          </div>
          <transition name="fade">
            <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
          </transition>
        </div>

        <div class="form_group">
          <div style="position: relative; display: flex; align-items: center;">
            <input
              :type="mostrarVPassword ? 'text' : 'password'"
              v-model="vpassword"
              placeholder="Verificar Password *"
              required
              class="input"
              style="padding-right: 40px;"
            />
            <span @click="mostrarVPassword = !mostrarVPassword"
              style="position: absolute; right: 10px; cursor: pointer; color: var(--amarillo-mostaza);">
              {{ mostrarVPassword ? '👁️' : '🙈' }}
            </span>
          </div>
          <transition name="fade">
            <div v-if="vpasswordError" class="error-message">{{ vpasswordError }}</div>
          </transition>
        </div>

        <div class="form_group">
          <input type="text" v-model="numeroCelular" placeholder="Número de Celular *" required class="input" />
          <transition name="fade">
            <div v-if="celularError" class="error-message">{{ celularError }}</div>
          </transition>
        </div>

        <div class="btn-container">
          <button type="submit" class="btn-reg">Crear</button>
        </div>

        <p class="switch">
          ¿Ya tienes una cuenta?
          <RouterLink to="/Iniciar" class="signup_tog">Inicia Sesión</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import api from "@/axiosConfig";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      vpassword: "",
      numeroCelular: "",
      nombreError: "",
      apellidoError: "",
      emailError: "",
      passwordError: "",
      vpasswordError: "",
      celularError: "",
      mostrarPassword: false,
      mostrarVPassword: false,
    };
  },
  methods: {
    clearErrors() {
      this.nombreError = "";
      this.apellidoError = "";
      this.emailError = "";
      this.passwordError = "";
      this.vpasswordError = "";
      this.celularError = "";
    },
    validateNombre(nombre) {
      const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
      return nombreRegex.test(nombre);
    },
    validateEmail(email) {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailPattern.test(email);
    },
    validatePassword(password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{3,})(?=.*[!@#$%^&*_-])[A-Za-z\d!@#$%^&*_-]{8,}$/;
      return passwordRegex.test(password);
    },
    validateNumeroCelular(numero) {
      const numeroRegex = /^[0-9]{10,}$/;
      return numeroRegex.test(numero);
    },
    async handleRegister() {
      this.clearErrors();

      let valid = true;

      // Validaciones
      if (!this.nombre) {
        this.nombreError = "El nombre es requerido";
        valid = false;
      } else if (!this.validateNombre(this.nombre)) {
        this.nombreError = "Debe contener solo letras (mínimo 2)";
        valid = false;
      }

      if (!this.apellido) {
        this.apellidoError = "El apellido es requerido";
        valid = false;
      } else if (!this.validateNombre(this.apellido)) {
        this.apellidoError = "Debe contener solo letras (mínimo 2)";
        valid = false;
      }

      if (!this.email) {
        this.emailError = "El email es requerido";
        valid = false;
      } else if (!this.validateEmail(this.email)) {
        this.emailError = "Ingrese un email válido";
        valid = false;
      }

      if (!this.password) {
        this.passwordError = "La contraseña es requerida";
        valid = false;
      } else if (!this.validatePassword(this.password)) {
        this.passwordError = "Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 3 números y 1 carácter especial";
        valid = false;
      }

      if (!this.vpassword) {
        this.vpasswordError = "Verifique su contraseña";
        valid = false;
      } else if (this.password !== this.vpassword) {
        this.vpasswordError = "Las contraseñas no coinciden";
        valid = false;
      }

      if (!this.numeroCelular) {
        this.celularError = "El número de celular es requerido";
        valid = false;
      } else if (!this.validateNumeroCelular(this.numeroCelular)) {
        this.celularError = "Mínimo 10 dígitos numéricos";
        valid = false;
      }

      if (!valid) {
        return;
      }

      try {
        const response = await api.post("/usuarios/", {
          nombre: this.nombre,
          apellido: this.apellido,
          correoElectronico: this.email,
          contraseñaUsuario: this.password,
          numeroCelular: this.numeroCelular,
        });

        const token = response.data.access_token;
        localStorage.setItem("token", token);

        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "Te has registrado correctamente. Redirigiendo...",
          background: "#e0f7fa",
          color: "#004d40",
          showConfirmButton: false,
          timer: 3000,
        });

        setTimeout(() => {
          this.$router.push("/index");
        }, 1000);
      } catch (error) {
        let errorMessage = "Ocurrió un error al registrar";
        
        if (error.response && error.response.data) {
          if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data.correoElectronico) {
            this.emailError = error.response.data.correoElectronico[0];
          } else if (error.response.data.numeroCelular) {
            this.celularError = error.response.data.numeroCelular[0];
          }
        }

        if (errorMessage !== "Ocurrió un error al registrar") {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
            background: "#ffebee",
            color: "#b71c1c",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

:root {
  --verde-oliva: #6B8E23;
  --marron-tierra: #8B5A2B;
  --beige-arena: #F5DEB3;
  --rojo-terracota: #C1440E;
  --amarillo-mostaza: #D4A017;
  --texto: #fff;
  --fondo: #212121;
  --error: #ff4444;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--marron-tierra);
  padding: 20px;
  font-family: 'Poppins', sans-serif;
}

.form {
  width: 100%;
  max-width: 400px;
  display: flex;
}

.form_front {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 40px 30px;
  border-radius: 15px;
  background-color: #3e3e3e;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.form_title {
  color: var(--amarillo-mostaza);
  margin-bottom: 25px;
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
}

.form_group {
  width: 100%;
  margin-bottom: 20px;
}

.input {
  width: 100%;
  height: 50px;
  padding: 0 15px;
  font-size: 16px;
  color: var(--texto);
  background-color: var(--fondo);
  border: 2px solid var(--rojo-terracota);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.input::placeholder {
  color: var(--amarillo-mostaza);
  opacity: 0.7;
}

.input:focus {
  outline: none;
  border-color: var(--amarillo-mostaza);
  box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.3);
}

.error-message {
  color: var(--error);
  font-size: 0.85rem;
  margin-top: 5px;
  padding: 2px 8px;
  animation: shake 0.5s ease-in-out;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.btn-container {
  width: 100%;
  margin-top: 20px;
}

.btn-reg {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--texto);
  background-color: var(--rojo-terracota);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reg:hover {
  background-color: #a53a0c;
  transform: translateY(-2px);
}

.btn-reg:active {
  transform: translateY(0);
}

.switch {
  margin-top: 25px;
  color: var(--beige-arena);
  text-align: center;
  font-size: 0.9rem;
}

.signup_tog {
  color: var(--amarillo-mostaza);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.signup_tog:hover {
  text-decoration: underline;
  color: var(--rojo-terracota);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

/* Responsive */
@media (max-width: 480px) {
  .form_front {
    padding: 30px 20px;
  }
  
  .form_title {
    font-size: 1.5rem;
  }
  
  .input {
    height: 45px;
    font-size: 15px;
  }
  
  .btn-reg {
    padding: 10px;
    font-size: 15px;
  }
  
  .error-message {
    font-size: 0.75rem;
  }
}
</style>