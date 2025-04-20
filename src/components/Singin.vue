<template>
	<div class="container">
		<div class="form">
			<div class="form_front">
				<h2 class="form_details"><i class="fas fa-lock"></i> Inicia Sesión</h2>
				<input class="input" type="email" v-model="email" placeholder="Email" required />
				<div v-if="loginError" style="color: red">{{ loginError }}</div>

				<input class="input" type="password" v-model="password" placeholder="Password" required />
				<div v-if="loginPasswordError" style="color: red">{{ loginPasswordError }}</div>

				<button class="btn" type="submit" @click.prevent="handleLogin">Inicia Sesión</button>
				<p class="switch">
					¿Aún no tienes cuenta?
					<RouterLink to="/Registrar" class="signup_tog">Regístrate</RouterLink>
				</p>
				<p class="switch">
					¿No recuerdas tu contraseña?
					<RouterLink to="/RecuperarPasword" class="singup_top">Recuperar</RouterLink>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { mapActions } from "vuex";
import { jwtDecode } from "jwt-decode";
import api from "@/axiosConfig";

export default {
	data() {
		return {
			email: "",
			password: "",
			loginError: "",
			loginPasswordError: "",
		};
	},
	methods: {
		clearErrors() {
			this.loginError = "";
			this.loginPasswordError = "";
		},
		...mapActions(["loginUsuario"]),

		async handleLogin() {
			this.clearErrors();

			if (!this.email) {
				this.loginError = "El email es obligatorio.";
				return;
			}
			if (!this.password) {
				this.loginPasswordError = "La contraseña es obligatoria.";
				return;
			}

			try {
				const response = await api.post("/login", {
					nombre_usuario: this.email,
					password: this.password,
				});

				if (response.status === 200) {
					const token = response.data.access_token;

					if (typeof token === "string" && token.trim().length > 0) {
						localStorage.setItem("token", token);
						this.loginUsuario(token);

						// 🔹 Nueva solicitud a /protegido después del login exitoso
						this.verificarAccesoProtegido();

						Swal.fire({
							icon: "success",
							title: "¡Bienvenido!",
							text: "Tu inicio de sesión ha sido exitoso. Redirigiendo...",
							background: "#e0f7fa",
							color: "#004d40",
							showConfirmButton: false,
							timer: 3000,
						});

						setTimeout(() => {
							if (this.email.endsWith(".ad")) {
								this.$router.push("/VistaAd");
							} else {
								this.$router.push("/index");
							}
						}, 1000);
					} else {
						this.loginError = "El token proporcionado no es válido.";
					}
				}
			} catch (error) {
				if (error.response) {
					if (error.response.status === 401) {
						this.loginError = "Credenciales incorrectas. Intenta de nuevo.";
					} else if (error.response.status === 400) {
						this.loginError = "Solicitud incorrecta. Verifica los datos.";
					} else {
						this.loginError = "Error al iniciar sesión. Inténtalo más tarde.";
					}
				} else {
					this.loginError = "No se pudo conectar con el servidor.", error;
				}

				Swal.fire({
					icon: "error",
					title: "Error al iniciar sesión",
					text: this.loginError,
					background: "#ffebee",
					color: "#b71c1c",
				});
			}
		},

		// 🔹 Nueva función para verificar acceso a ruta protegida
		async verificarAccesoProtegido() {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					console.warn("⚠️ No hay token disponible.");
					return;
				}

				const response = await api.get("/protegido", {
					headers: {
						"Authorization": `Bearer ${token}`,
					},
				});

				console.log("✅ Acceso a datos protegidos:", response.data);
			} catch (error) {
				console.error("❌ Error al acceder a la ruta protegida:", error);
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

* {
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--marron-tierra);
  padding: 20px;
  margin-left: auto;
  margin-right: auto;
}

.form {
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
  transition: all 1s ease;
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
  box-shadow: inset 2px 2px 10px rgba(0, 0, 0, 0.5),
              inset -1px -1px 5px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  animation: slideUp 0.8s ease-out;
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
  transition: all 0.35s ease;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.3),
              1px 1px 8px rgba(255, 255, 255, 0.1);
	margin-bottom: 10px;
}

.input::placeholder {
  color: var(--amarillo-mostaza);
  opacity: 0.7;
}

.input:focus {
  outline: none;
  transform: scale(1.02);
  border-color: var(--amarillo-mostaza);
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.3),
              1px 1px 8px rgba(255, 255, 255, 0.1),
              inset 2px 2px 5px rgba(0, 0, 0, 0.2),
              inset -1px -1px 5px rgba(255, 255, 255, 0.1);
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
  transition: all 0.35s ease;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.3),
              1px 1px 8px rgba(255, 255, 255, 0.1);
}

.btn-reg:hover {
  background-color: #a53a0c;
  transform: scale(1.02);
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.3),
              1px 1px 8px rgba(255, 255, 255, 0.1),
              inset 2px 2px 5px rgba(0, 0, 0, 0.2),
              inset -1px -1px 5px rgba(255, 255, 255, 0.1);
}

.btn{
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

.btn:hover {
	background-color: #a53a0c;
	transform: scale(1.02);
	box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.3),
							1px 1px 8px rgba(255, 255, 255, 0.1),
							inset 2px 2px 5px rgba(0, 0, 0, 0.2),
							inset -1px -1px 5px rgba(255, 255, 255, 0.1);
}

.switch {
  margin-top: 25px;
  color: var(--beige-arena);
  text-align: center;
  font-size: 14px;
}

.signup_tog {
  color: var(--rojo-terracota);
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.signup_tog:hover {
  text-decoration: underline;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
}
</style>