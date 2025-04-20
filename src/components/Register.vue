<template>
	<div class="container">
		<div class="form">
			<form @submit.prevent="handleRegister" class="form_front">
				<h2 class="form_details">Regístrate</h2>

				<input type="text" v-model="nombre" placeholder="Nombre *" required class="input" />
				<div v-if="nombreError" style="color: red">{{ nombreError }}</div>

				<input type="text" v-model="apellido" placeholder="Apellido *" required class="input" />
				<div v-if="apellidoError" style="color: red">{{ apellidoError }}</div>

				<input type="email" v-model="email" placeholder="Email *" required class="input" />
				<div v-if="emailError" style="color: red">{{ emailError }}</div>

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

				<div style="position: relative; display: flex; align-items: center;">
					<input
						:type=" mostrarVPassword ? 'text' : 'password'"
						v-model="vpassword"
						placeholder="Password *"
						required
						class="input"
						style="padding-right: 40px;"
					/>
					<span @click="mostrarVPassword= !mostrarVPassword"
						style="position: absolute; right: 10px; cursor: pointer; color: var(--amarillo-mostaza);">
						{{ mostrarVPassword ? '👁️' : '🙈' }}
					</span>
				</div>

				<input type="text" v-model="numeroCelular" placeholder="Número de Celular *" required class="input" />
				<div v-if="celularError" style="color: red">{{ celularError }}</div>

				<button type="submit" class="btn-reg">Crear</button>
				<p class="switch">
					¿Ya tienes una cuenta?
					<RouterLink to="/Iniciar" class="signup_tog">Inicia Sesión</RouterLink>
				</p>
			</form>
		</div>
	</div>
</template>

<script>
import axios from "axios";
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
			mostrarPassword: false,
			mostrarVPassword: false,
			celularError: "",
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
			const nombreRegex = /^[a-zA-Z\s]+$/;
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
			const numeroRegex = /^[0-9]+$/;
			return numeroRegex.test(numero) && numero.length >= 10;
		},
		async handleRegister() {
			this.clearErrors();

			let valid = true;

			// Validaciones
			if (!this.nombre || !this.validateNombre(this.nombre)) {
				this.nombreError = "El nombre debe contener al menos 2 letras.";
				valid = false;
			}
			if (!this.apellido || !this.validateNombre(this.apellido)) {
				this.apellidoError = "El apellido debe contener al menos 2 letras.";
				valid = false;
			}
			if (!this.email || !this.validateEmail(this.email)) {
				this.emailError = "Por favor, introduce un correo electrónico válido.";
				valid = false;
			}
			if (!this.password || !this.validatePassword(this.password)) {
				this.passwordError =
					"La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, 3 números y un carácter especial.";
				valid = false;
			}
			if (this.password !== this.vpassword) {
				this.vpasswordError = "Las contraseñas no coinciden.";
				valid = false;
			}
			if (!this.numeroCelular || !this.validateNumeroCelular(this.numeroCelular)) {
				this.celularError = "Número de celular inválido (mínimo 10 dígitos).";
				valid = false;
			}

			if (valid) {
				try {
					const response = await axios.post("/usuarios/", {
						nombre: this.nombre,
						apellido: this.apellido,
						correoElectronico: this.email,
						contraseñaUsuario: this.password,
						numeroCelular: this.numeroCelular,
					});

					// Guardar el token en localStorage
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
						this.$router.push("/index"); // Redirigir al usuario
					}, 1000);
				} catch (error) {
					if (error.response && error.response.data) {
						this.emailError = error.response.data.detail || "Error al registrar usuario.";
					}
					Swal.fire({
						icon: "error",
						title: "Error al registrar",
						text: "Ocurrió un error al intentar registrar el usuario",
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
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--marron-tierra);
  padding: 20px;
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
  padding: 40px 30px;
  border-radius: 15px;
  background-color: #3e3e3e;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.form_title {
  color: var(--rojo-terracota);
  margin-bottom: 25px;
  font-size: 1.8rem;
  font-weight: 600;
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
}

.switch {
  margin-top: 25px;
  color: var(--marron-tierra);
  text-align: center;
}

.signup_tog {
  color: var(--rojo-terracota);
  font-weight: 600;
  text-decoration: none;
}

.signup_tog:hover {
  text-decoration: underline;
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
		width: 100%;
  }
  
  .btn-reg {
    padding: 10px;
    font-size: 15px;
  }
}
</style>