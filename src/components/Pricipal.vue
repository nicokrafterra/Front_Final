<script setup>
//-------------------------------------------------------------------------------------------------------------
// Se realizan todas las importaciones correspondientes
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'; // Importaciones de Vue
import { useStore } from 'vuex'; // Para manejar el estado global
import { useRouter } from 'vue-router'; // Para manejar la navegación
import { jwtDecode } from 'jwt-decode'; // Para decodificar tokens JWT
import { watch } from 'vue'; // Para observar cambios en las propiedades reactivas
//--------------------------------------------------------------------------------------------------------------

// Definición de variables reactivas
const isHidden = ref(true); // Controla la visibilidad del menú desplegable
const isFading = ref(false); // Controla la animación de desvanecimiento del menú
const Menu = ref(null); // Referencia al menú desplegable

const store = useStore(); // Acceso al store de Vuex
const router = useRouter(); // Acceso al router de Vue
const token = ref(localStorage.getItem("token")); // Obtiene el token del localStorage
const usuario = computed(() => store.state.usuario); // Obtiene el usuario del store
const imagenPorDefecto = ref("../assets/IMG/foto.png"); // Ruta de la imagen de perfil por defecto
//---------------------------------------------------------------------------------------------------------------
// Propiedad computada para obtener la URL de la imagen del store

watch(() => store.state.usuario?.imagen, (nuevaImagen, imagenAnterior) => {
	if (nuevaImagen !== imagenAnterior) {
		console.log("Nueva imagen detectada:", nuevaImagen);
	}
});

const imagenPerfil = computed(() => {
  const imagen = store.state.usuario?.imagen;
  
  if (!imagen) return imagenPorDefecto.value;
  
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  return `${baseUrl}/${imagen}?t=${Date.now()}`;
});

// Observar cambios en el store para la imagen del usuario
watch(() => store.state.usuario?.imagen, (nuevaImagen) => {
	console.log("Nueva imagen en el store222:", nuevaImagen); // Depuración
});

// Función para alternar la visibilidad del menú desplegable
const toggleDropdown = () => {
	isHidden.value = !isHidden.value;
	isFading.value = !isHidden.value;
};

// Función para cerrar el menú desplegable al hacer clic fuera de él
const handleClickOutside = (event) => {
	if (Menu.value && !Menu.value.contains(event.target) && !event.target.classList.contains('perfil')) {
		isHidden.value = true;
		isFading.value = true;
	}
};

// Función para redirigir al inicio de sesión
const redirigirALogin = () => {
	router.push("/Iniciar");
};

// Función para cerrar sesión
const cerrarSesion = () => {
	localStorage.removeItem("token"); // Elimina el token del localStorage
	token.value = null; // Actualiza el estado del token
	store.commit("setUsuario", null); // Limpia el usuario en el store
	window.location.reload(); // Recarga la página
};

// Intersection Observer para animaciones al scrollear
const initScrollAnimations = () => {
	const observerOptions = {
		root: null,
		rootMargin: '0px',
		threshold: 0.1
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('animate-in');
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	// Observar todos los elementos con la clase 'scroll-animate'
	document.querySelectorAll('.scroll-animate').forEach(el => {
		observer.observe(el);
	});

	// Observar elementos específicos con diferentes delays
	document.querySelectorAll('.scroll-delay-1').forEach(el => {
		observer.observe(el);
	});
	document.querySelectorAll('.scroll-delay-2').forEach(el => {
		observer.observe(el);
	});
	document.querySelectorAll('.scroll-delay-3').forEach(el => {
		observer.observe(el);
	});
};

// Hook de ciclo de vida: cuando el componente se monta
onMounted(() => {
	document.addEventListener('click', handleClickOutside); // Escucha clics fuera del menú
	if (token.value) {
		try {
			const decoded = jwtDecode(token.value); // Decodifica el token JWT
			store.commit("setUsuario", decoded); // Guarda el usuario decodificado en el store
		} catch (error) {
			console.error("Error al decodificar el token:", error);
			localStorage.removeItem("token"); // Elimina el token corrupto
			token.value = null; // Actualiza el estado del token
			router.push("/Iniciar"); // Redirige al login si hay un error
		}
	}

	// Inicializar animaciones al scrollear
	setTimeout(initScrollAnimations, 500);
});

// Hook de ciclo de vida: antes de que el componente se desmonte
onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside); // Elimina el listener de clics
});
</script>

<template>
	<header>
		<div class="A-logo scroll-animate">
			<img src="../assets/IMG/LogoFinal.png" alt="">
		</div>
		<span class="navegar__Usuario">
			<router-link class="icon-p scroll-animate scroll-delay-1" :to="token ? '/pqr' : '/Iniciar'">
				<img class="icon" src="../assets/IMG/message.svg" alt="Mensaje" />
			</router-link>
			<router-link class="icon-p scroll-animate scroll-delay-2" :to="token ? '/TablaPqrRes' : '/Iniciar'">
				<img class="icon" src="../assets/IMG/notification.svg" alt="Notificación" />
			</router-link>

			<!-- Botón de Iniciar sesión si no hay token -->
			<router-link v-if="!token" to="/Iniciar" class="login-button scroll-animate scroll-delay-3">
				Iniciar sesión
			</router-link>

			<!-- Menú desplegable si hay token -->
			<template v-else>
				<div :key="componentKey" class="scroll-animate scroll-delay-3">
					<img class="perfil" :src="imagenPerfil" :key="imagenPerfil" alt="Imagen de perfil"
						@click="toggleDropdown" />
				</div>
			</template>
		</span>

		<!-- Menú desplegable (solo visible si hay token) -->
		<div v-if="token" class="Menu-desple" :class="{ hide: isHidden, 'Menu-desple-gable': isFading }" ref="Menu">
			<div class="Menu__group">
				<div class="nombre-usuario">{{ usuario?.nombre }}</div>
				<div class="email">{{ usuario?.correoElectronico }}</div>
			</div>
			<hr class="divider" />
			<nav>
				<ul>
					<router-link class="ramdon" to="/conf">
						<img src="..//assets/IMG/settings.svg" alt="Ajustes" /> Ajustes
					</router-link>
				</ul>
				<hr class="divider" />
				<ul>
					<router-link class="ramdon" to="/Reservas">
						<img src="../assets/IMG/tutorials.svg" alt="Reservas" /> Mis reservas
					</router-link>
				</ul>
				<hr class="divider" />
				<ul>
					<router-link class="ramdon" to="/Iniciar" @click="cerrarSesion">
						<img src="../assets/IMG/logout.svg" alt="Log Out" /> Salir
					</router-link>
				</ul>
			</nav>
		</div>
	</header>

	<section class="banner scroll-animate">
		<div class="content-banner">
			<p class="scroll-animate scroll-delay-1">Lugares Hermosos</p>
			<h2 class="scroll-animate scroll-delay-2">Comida deliciosa <br />Ingredientes 100% Naturales</h2>
			<!-- Botón de "Reserva ahora" -->
			<router-link v-if="token" to="/Reservas" class="scroll-animate scroll-delay-3">Reserva ahora</router-link>
			<button v-else class="login-button scroll-animate scroll-delay-3" @click="redirigirALogin">Inicia sesión
				para
				reservar</button>
		</div>
	</section>

	<main class="main-content">
		<section class="container top-categories">
			<h1 class="heading-1 scroll-animate">Nuestras Experiencias</h1>
			<div class="container-categories">
				<!-- Tarjeta 1: Camping -->
				<div class="card-category category-moca scroll-animate scroll-delay-1">
					<img class="Img-PrimerCard" src="../assets/IMG/campfire-896196_1280.jpg" alt="">
					<p>Camping a campo abierto</p>
					<router-link v-if="token" to="Camping"><span>Ver más</span></router-link>
					<button v-else class="login-button" @click="redirigirALogin">Inicia sesión para ver más</button>
				</div>

				<!-- Tarjeta 2: Recorrido guiado -->
				<div class="card-category category-moca scroll-animate scroll-delay-2">
					<img class="Img-PrimerCard" src="..\assets\IMG\bike-2388449_1280.jpg" alt="">
					<p>Recorrido guiado</p>
					<router-link v-if="token" to="Recorrido"><span>Ver más</span></router-link>
					<button v-else class="login-button" @click="redirigirALogin">Inicia sesión para ver más</button>
				</div>

				<!-- Tarjeta 3: Reserva lugares para eventos -->
				<div class="card-category category-moca scroll-animate scroll-delay-3">
					<img class="Img-PrimerCard" src="..\assets/IMG/Eventossss.jpg" alt="">
					<p>Reserva lugares para eventos</p>
					<router-link v-if="token" to="/Eventos"><span>Ver más</span></router-link>
					<button v-else class="login-button" @click="redirigirALogin">Inicia sesión para ver más</button>
				</div>

				<!-- Tarjeta 4: Reserva de Mesas -->
				<div class="card-category category-moca scroll-animate scroll-delay-4">
					<img class="Img-PrimerCard" src="..\assets\IMG\event-6927353_1280.jpg" alt="">
					<p>Reserva de Mesas</p>
					<router-link v-if="token" to="/Mesas"><span>Ver más</span></router-link>
					<button v-else class="login-button" @click="redirigirALogin">Inicia sesión para ver más</button>
				</div>
			</div>
		</section>

		<section class="container top-products">
			<h1 class="heading-1 scroll-animate">Mejores Platos</h1>

			<div class="container-products">
				<!-- Producto 1 -->
				<div class="card-product scroll-animate scroll-delay-1">
					<div class="container-img">
						<img class="IMG-Platos" src="../assets/IMG/Currasco.png" alt="">
						<div class="button-group">
						</div>
					</div>
					<div class="content-card-product">
						<h3>Churrasco</h3>
						<p class="price">$29.600 <span>$5.30</span></p>
						<router-link class="redirect-button" to="/Platos">Ver Plato</router-link>
					</div>
				</div>
				<!-- Producto 2 -->
				<div class="card-product scroll-animate scroll-delay-2">
					<div class="container-img">
						<img class="IMG-Platos" src="../assets/IMG/Pechuga.jpg" alt="">
						<div class="button-group">
						</div>
					</div>
					<div class="content-card-product">
						<h3>Pechuga gratinada</h3>

						<p class="price">$22.700 <span>$7.30</span></p>
						<router-link class="redirect-button" to="/Platos">Ver Plato</router-link>
					</div>
				</div>
				<!-- Producto 3 -->
				<div class="card-product scroll-animate scroll-delay-3">
					<div class="container-img">
						<img class="IMG-Platos" src="../assets/IMG/Fetuchino.jpg" alt="">
						<div class="button-group">
						</div>
					</div>
					<div class="content-card-product">
						<h3>Fetuccini</h3>
						<p class="price">$20.900</p>
						<router-link class="redirect-button" to="/Platos">Ver Plato</router-link>
					</div>
				</div>
				<!-- Producto 4 -->
				<div class="card-product scroll-animate scroll-delay-4">
					<div class="container-img">
						<img class="IMG-Platos" src="../assets/IMG/Picada.jpg" alt="">
						<div class="button-group">
						</div>
					</div>
					<div class="content-card-product">
						<h3>Picadas</h3>
						<p class="price">$45.500</p>
						<router-link class="redirect-button" to="/Platos">Ver Plato</router-link>
					</div>
				</div>
			</div>
		</section>
		<section class="container specials">
			<h1 class="heading-1 scroll-animate">Especiales</h1>

			<div class="container-products">
				<!-- Producto 1 -->
				<div class="card-product scroll-animate scroll-delay-1">
					<div class="container-img">
						<img class="IMG-Platos" src="../assets/IMG/Bagre.jpg" alt="">
						<div class="button-group">
						</div>
					</div>
					<div class="content-card-product">
						<h3>Bagre frito</h3>
						<p class="price">$4.60 <span>$5.30</span></p>
						<router-link class="redirect-button" to="/Platos">Ver Plato</router-link>
					</div>
				</div>
				<!-- Producto 2 -->
				<div class="card-product scroll-animate scroll-delay-2">
					<div class="container-img">
						<img class="IMG-Platos" src="../assets/IMG/Lengua.jpg" alt="">
						<div class="button-group">
						</div>
					</div>
					<div class="content-card-product">
						<h3>Lengua en salsa criolla</h3>
						<p class="price">$5.70 <span>$7.30</span></p>
						<router-link class="redirect-button" to="/Platos">Ver Plato</router-link>
					</div>
				</div>
				<!--  -->
				<div class="card-product scroll-animate scroll-delay-3">
					<div class="container-img">
						<img class="IMG-Platos" src="../assets/IMG/PuntaAnca.jpg" alt="">
						<div class="button-group">
						</div>
					</div>
					<div class="content-card-product">
						<h3>Punta de anca</h3>
						<p class="price">$3.85 <span>$5.50</span></p>
						<router-link class="redirect-button" to="/Platos">Ver Plato</router-link>
					</div>
				</div>
				<!--  -->
				<div class="card-product scroll-animate scroll-delay-4">
					<div class="container-img">
						<img class="IMG-Platos" src="../assets/IMG/MOjarraDiabla.jpg" alt="">
						<div class="button-group">
						</div>
					</div>
					<div class="content-card-product">
						<h3>Mojarra a la diabla</h3>
						<p class="price">$5.60</p>
						<router-link class="redirect-button" to="/Platos">Ver Plato</router-link>
					</div>
				</div>
			</div>
		</section>

		<!-- Sección de Testimonios -->
		<section class="testimonials-section">
			<div class="container">
				<h1 class="heading-1 scroll-animate">Lo que dicen nuestros clientes</h1>
				<div class="testimonials-container">
					<!-- Testimonio 1 -->
					<div class="testimonial-card scroll-animate scroll-delay-1">
						<div class="testimonial-rating">
							<span class="star">★</span>
							<span class="star">★</span>
							<span class="star">★</span>
							<span class="star">★</span>
							<span class="star">★</span>
						</div>
						<p class="testimonial-text">"La mejor experiencia gastronómica que he tenido. El servicio
							impecable
							y los sabores extraordinarios."</p>
						<div class="testimonial-author">
							<img src="../assets/IMG/profile.svg" alt="Cliente 1" class="testimonial-img">
							<div>
								<h4>Ana Martínez</h4>
								<p class="testimonial-location">Bogotá, Colombia</p>
							</div>
						</div>
					</div>

					<!-- Testimonio 2 -->
					<div class="testimonial-card scroll-animate scroll-delay-2">
						<div class="testimonial-rating">
							<span class="star">★</span>
							<span class="star">★</span>
							<span class="star">★</span>
							<span class="star">★</span>
							<span class="star">★</span>
						</div>
						<p class="testimonial-text">"Celebramos nuestro aniversario aquí y fue mágico. El ambiente, la
							comida y la atención perfectos."</p>
						<div class="testimonial-author">
							<img src="../assets/IMG/profile.svg" alt="Cliente 2" class="testimonial-img">
							<div>
								<h4>Juan Rodríguez</h4>
								<p class="testimonial-location">Medellín, Colombia</p>
							</div>
						</div>
					</div>

					<!-- Testimonio 3 -->
					<div class="testimonial-card scroll-animate scroll-delay-3">
						<div class="testimonial-rating">
							<span class="star">★</span>
							<span class="star">★</span>
							<span class="star">★</span>
							<span class="star">★</span>
							<span class="star">★</span>
						</div>
						<p class="testimonial-text">"El camping con vista al amanecer es una experiencia que todos
							deberían
							vivir al menos una vez."</p>
						<div class="testimonial-author">
							<img src="../assets/IMG/profile.svg" alt="Cliente 3" class="testimonial-img">
							<div>
								<h4>Laura Gómez</h4>
								<p class="testimonial-location">Cali, Colombia</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Sección de Instagram -->
		<section class="instagram-gallery">
			<div class="container">
				<h1 class="heading-1 scroll-animate">Síguenos en Instagram</h1>
				<p class="instagram-subtitle scroll-animate scroll-delay-1">@RestauranteNombre</p>
				<div class="gallery-grid">
					<div class="gallery-item scroll-animate scroll-delay-1">
						<img src="../assets/IMG/profile.svg" alt="Instagram 1">
						<div class="gallery-overlay">
							<span class="instagram-icon">📷</span>
						</div>
					</div>
					<div class="gallery-item scroll-animate scroll-delay-2">
						<img src="../assets/IMG/profile.svg" alt="Instagram 2">
						<div class="gallery-overlay">
							<span class="instagram-icon">📷</span>
						</div>
					</div>
					<div class="gallery-item scroll-animate scroll-delay-3">
						<img src="../assets/IMG/profile.svg" alt="Instagram 3">
						<div class="gallery-overlay">
							<span class="instagram-icon">📷</span>
						</div>
					</div>
					<div class="gallery-item scroll-animate scroll-delay-1">
						<img src="../assets/IMG/profile.svg" alt="Instagram 4">
						<div class="gallery-overlay">
							<span class="instagram-icon">📷</span>
						</div>
					</div>
					<div class="gallery-item scroll-animate scroll-delay-2">
						<img src="../assets/IMG/profile.svg" alt="Instagram 5">
						<div class="gallery-overlay">
							<span class="instagram-icon">📷</span>
						</div>
					</div>
					<div class="gallery-item scroll-animate scroll-delay-3">
						<img src="../assets/IMG/profile.svg" alt="Instagram 6">
						<div class="gallery-overlay">
							<span class="instagram-icon">📷</span>
						</div>
					</div>
				</div>
				<a href="https://instagram.com" class="instagram-button scroll-animate scroll-delay-4">Ver más en
					Instagram</a>
			</div>
		</section>

		<!-- Sección de Eventos -->
		<section class="events-section">
			<div class="container">
				<h1 class="heading-1 scroll-animate">Próximos Eventos</h1>
				<div class="events-container">
					<!-- Evento 1 -->
					<div class="event-card scroll-animate scroll-delay-1">
						<div class="event-date">
							<span class="event-day">15</span>
							<span class="event-month">JUN</span>
						</div>
						<div class="event-info">
							<h3 class="event-title">Noche de Vinos</h3>
							<p class="event-description">Degustación de los mejores vinos nacionales acompañados de
								platillos especiales.</p>
							<div class="event-meta">
								<span class="event-time">⏰ 7:00 PM - 11:00 PM</span>
								<span class="event-price">💲 $120.000 por persona</span>
							</div>
							<router-link v-if="token" to="/Eventos" class="event-button">Reservar</router-link>
							<button v-else class="event-button" @click="redirigirALogin">Inicia sesión</button>
						</div>
					</div>

					<!-- Evento 2 -->
					<div class="event-card scroll-animate scroll-delay-2">
						<div class="event-date">
							<span class="event-day">22</span>
							<span class="event-month">JUN</span>
						</div>
						<div class="event-info">
							<h3 class="event-title">Taller de Cocina</h3>
							<p class="event-description">Aprende las técnicas básicas de cocina con nuestro chef
								ejecutivo.
							</p>
							<div class="event-meta">
								<span class="event-time">⏰ 10:00 AM - 2:00 PM</span>
								<span class="event-price">💲 $80.000 por persona</span>
							</div>
							<router-link v-if="token" to="/Eventos" class="event-button">Reservar</router-link>
							<button v-else class="event-button" @click="redirigirALogin">Inicia sesión</button>
						</div>
					</div>

					<!-- Evento 3 -->
					<div class="event-card scroll-animate scroll-delay-3">
						<div class="event-date">
							<span class="event-day">30</span>
							<span class="event-month">JUN</span>
						</div>
						<div class="event-info">
							<h3 class="event-title">Cena Romántica</h3>
							<p class="event-description">Menú especial para parejas con música en vivo y ambiente
								íntimo.
							</p>
							<div class="event-meta">
								<span class="event-time">⏰ 6:00 PM - 12:00 AM</span>
								<span class="event-price">💲 $150.000 por pareja</span>
							</div>
							<router-link v-if="token" to="/Eventos" class="event-button">Reservar</router-link>
							<button v-else class="event-button" @click="redirigirALogin">Inicia sesión</button>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Sección de Blog -->
		<section class="blog-section">
			<div class="container">
				<h1 class="heading-1 scroll-animate">Blog Gastronómico</h1>
				<p class="blog-subtitle scroll-animate scroll-delay-1">Consejos, recetas y noticias del mundo culinario
				</p>

				<div class="blog-container">
					<!-- Artículo 1 -->
					<article class="blog-card scroll-animate scroll-delay-1">
						<div class="blog-img-container">
							<img src="../assets/IMG/call-of-sea-game.jpg" alt="Blog 1" class="blog-img">
							<div class="blog-date">
								<span>12</span>
								<span>MAY</span>
							</div>
						</div>
						<div class="blog-content">
							<h3 class="blog-title">Los secretos de un buen marinado</h3>
							<p class="blog-excerpt">Aprende las técnicas profesionales para marinar carnes y obtener los
								mejores sabores.</p>
							<router-link to="/Blog" class="blog-link">Leer más →</router-link>
						</div>
					</article>

					<!-- Artículo 2 -->
					<article class="blog-card scroll-animate scroll-delay-2">
						<div class="blog-img-container">
							<img src="../assets/IMG/call-of-sea-game.jpg" alt="Blog 2" class="blog-img">
							<div class="blog-date">
								<span>28</span>
								<span>ABR</span>
							</div>
						</div>
						<div class="blog-content">
							<h3 class="blog-title">Vinos colombianos que debes probar</h3>
							<p class="blog-excerpt">Descubre las mejores bodegas y etiquetas de vino producidas en
								Colombia.
							</p>
							<router-link to="/Blog" class="blog-link">Leer más →</router-link>
						</div>
					</article>

					<!-- Artículo 3 -->
					<article class="blog-card scroll-animate scroll-delay-3">
						<div class="blog-img-container">
							<img src="../assets/IMG/call-of-sea-game.jpg" alt="Blog 3" class="blog-img">
							<div class="blog-date">
								<span>15</span>
								<span>ABR</span>
							</div>
						</div>
						<div class="blog-content">
							<h3 class="blog-title">Cocina sostenible: del campo a la mesa</h3>
							<p class="blog-excerpt">Cómo implementar prácticas sostenibles en tu cocina diaria y reducir
								el
								desperdicio.</p>
							<router-link to="/Blog" class="blog-link">Leer más →</router-link>
						</div>
					</article>
				</div>

				<router-link to="/Blog" class="blog-button scroll-animate scroll-delay-4">Ver todos los
					artículos</router-link>
			</div>
		</section>
	</main>

	<!-- Sección de Destacados -->
	<section class="featured-section">
		<div class="featured-container">
			<!-- Destacado principal -->
			<div class="featured-card main-featured scroll-animate">
				<div class="featured-overlay"></div>
				<div class="featured-content">
					<h2 class="scroll-animate scroll-delay-1">Experiencia Gastronómica Única</h2>
					<p class="scroll-animate scroll-delay-2">Disfruta de nuestros platos estrella preparados con
						ingredientes 100% naturales y técnicas tradicionales</p>
					<router-link v-if="token" to="/Reservas"
						class="featured-button scroll-animate scroll-delay-3">RESERVAR
						AHORA <i class="fas fa-chevron-right"></i></router-link>
					<button v-else class="featured-button scroll-animate scroll-delay-3" @click="redirigirALogin">INICIA
						SESIÓN PARA RESERVAR</button>
				</div>
			</div>

			<!-- Destacado secundario 1 -->
			<div class="featured-card secondary-featured scroll-animate scroll-delay-1">
				<img src="../assets/IMG/Picada.jpg" alt="Especial del Chef" class="featured-image">
				<div class="featured-content">
					<h3 class="scroll-animate scroll-delay-2">Especial del Chef</h3>
					<p class="scroll-animate scroll-delay-3">Descubre nuestra selección exclusiva creada por nuestro
						chef
						ejecutivo</p>
					<router-link to="/Platos" class="featured-button-small scroll-animate scroll-delay-4">VER DETALLES
						<i class="fas fa-chevron-right"></i></router-link>
				</div>
			</div>

			<!-- Destacado secundario 2 -->
			<div class="featured-card secondary-featured scroll-animate scroll-delay-2">
				<div class="featured-content">
					<h3 class="scroll-animate scroll-delay-1">Eventos Especiales</h3>
					<p class="scroll-animate scroll-delay-2">Celebra tus momentos importantes en nuestros espacios
						diseñados
						para crear memorias</p>
					<router-link v-if="token" to="/Eventos"
						class="featured-button-small scroll-animate scroll-delay-3">MÁS
						INFORMACIÓN <i class="fas fa-chevron-right"></i></router-link>
					<button v-else class="featured-button-small scroll-animate scroll-delay-3"
						@click="redirigirALogin">INICIA SESIÓN</button>
				</div>
				<img src="../assets/IMG/Eventossss.jpg" alt="Eventos Especiales" class="featured-image">
			</div>

			<!-- Destacado terciario -->
			<div class="featured-card tertiary-featured scroll-animate scroll-delay-1">
				<div class="featured-overlay"></div>
				<div class="featured-content">
					<h2 class="scroll-animate scroll-delay-2">Ingredientes de Origen Local</h2>
					<p class="scroll-animate scroll-delay-3">Apoyamos a productores locales para ofrecerte la máxima
						frescura y calidad en cada plato</p>
					<router-link to="/Platos" class="featured-button-dark scroll-animate scroll-delay-4">CONOCE NUESTROS
						PLATOS <i class="fas fa-chevron-right"></i></router-link>
				</div>
			</div>
		</div>
	</section>

	<footer class="footer scroll-animate">
		<div class="container container-footer">
			<div class="footer-grid">
				<!-- Información de contacto -->
				<div class="footer-col scroll-animate scroll-delay-1">
					<h3 class="footer-title">Contacto</h3>
					<ul class="footer-list">
						<li>
							<img src="../assets/IMG/help.svg" alt="Ubicación" class="footer-icon">
							Kilómetro 12 Vía a La Mesa, Cundinamarca
						</li>
						<li>
							<img src="../assets/IMG/message.svg" alt="Teléfono" class="footer-icon">
							+57 313-430-9651
						</li>
						<li>
							<img src="../assets/IMG/message.svg" alt="Email" class="footer-icon">
							Reservas@support.com
						</li>
						<li>
							<img src="../assets/IMG/logout.svg" alt="Horario" class="footer-icon">
							Lunes a Domingo: 11:00 AM - 10:00 PM
						</li>
					</ul>
				</div>

				<!-- Enlaces rápidos -->
				<div class="footer-col scroll-animate scroll-delay-2">
					<h3 class="footer-title">Enlaces Rápidos</h3>
					<ul class="footer-list">
						<li><router-link to="/">Inicio</router-link></li>
						<li><router-link to="/Platos">Menú</router-link></li>
						<li><router-link to="/Eventos">Eventos</router-link></li>
						<li><router-link to="/Camping">Camping</router-link></li>
						<li><router-link to="/Recorrido">Recorridos</router-link></li>
						<li><router-link to="/pqr">Contáctanos</router-link></li>
					</ul>
				</div>

				<!-- Boletín informativo -->
				<div class="footer-col scroll-animate scroll-delay-3">
					<h3 class="footer-title">Newsletter</h3>
					<p class="footer-text">Suscríbete para recibir ofertas especiales y eventos exclusivos.</p>
					<form class="newsletter-form">
						<input type="email" placeholder="Tu correo electrónico" required>
						<button type="submit">Suscribirse</button>
					</form>
					<div class="social-links">
						<a href="#"><img src="../assets/IMG/icons8-facebook.svg" alt="Facebook"></a>
						<a href="#"><img src="../assets/IMG/icons8-instagram.svg" alt="Instagram"></a>
						<a href="#"><img src="../assets/IMG/icons8-twitterx.svg" alt="Twitter"></a>
						<a href="#"><img src="../assets/IMG/icons8-whatsapp.svg" alt="TripAdvisor"></a>
					</div>
				</div>
			</div>

			<!-- Derechos de autor -->
			<div class="footer-bottom scroll-animate scroll-delay-4">
				<p>&copy; 2023 Nombre del Restaurante. Todos los derechos reservados.</p>
				<div class="footer-legal">
					<router-link to="/politicas">Políticas de Privacidad</router-link>
					<router-link to="/terminos">Términos y Condiciones</router-link>
				</div>
			</div>
		</div>
	</footer>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

:root {
  /* Colores */
  --primary: #C1440E;
  --primary-light: #e05e28;
  --primary-dark: #8a3008;
  --secondary: #6B8E23;
  --secondary-light: #85ad2c;
  --secondary-dark: #526e1a;
  --accent: #D4A017;
  --accent-light: #f0b82e;
  --accent-dark: #b8860b;
  --neutral: #F5DEB3;
  --neutral-light: #fff9e6;
  --neutral-dark: #e6d1a0;
  --text: #8B5A2B;
  --text-light: #a87c52;
  --text-gray: #5A678C;
  --error: #E3452F;
  --success: #4CAF50;
  --warning: #FFC107;
  --info: #2196F3;
  
  /* Espaciados */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-xxl: 3rem;
  
  /* Tipografía */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-md: 1.125rem;
  --text-lg: 1.25rem;
  --text-xl: 1.5rem;
  --text-xxl: 2rem;
  --text-xxxl: 2.5rem;
  
  /* Sombras */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.15);
  --shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  
  /* Transiciones */
  --transition-fast: all 0.15s ease-in-out;
  --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  --transition-slow: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  /* Bordes */
  --border-radius-sm: 4px;
  --border-radius: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;
  --border-radius-xl: 24px;
  --border-radius-full: 9999px;
  
  /* Breakpoints */
  --screen-xs: 480px;
  --screen-sm: 640px;
  --screen-md: 768px;
  --screen-lg: 1024px;
  --screen-xl: 1280px;
  --screen-xxl: 1536px;
}

/* Reset y estilos base */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: var(--text);
  background-color: #f9f5f0;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
  height: auto;
}

input,
button,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
  background: none;
  border: none;
}

a {
  text-decoration: none;
  color: inherit;
}

ul,
ol {
  list-style: none;
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* Utilidades */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.text-center {
  text-align: center;
}

/* Scroll animations */
.scroll-animate {
  opacity: 0;
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.scroll-animate.animate-in {
  opacity: 1;
  animation: fadeInUp 0.6s forwards;
}

.scroll-delay-1 { transition-delay: 0.1s; animation-delay: 0.1s; }
.scroll-delay-2 { transition-delay: 0.2s; animation-delay: 0.2s; }
.scroll-delay-3 { transition-delay: 0.3s; animation-delay: 0.3s; }
.scroll-delay-4 { transition-delay: 0.4s; animation-delay: 0.4s; }
.scroll-delay-5 { transition-delay: 0.5s; animation-delay: 0.5s; }

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(193, 68, 14, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1000;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
  padding: 0 var(--space-md);
}

.header:hover {
  background-color: rgba(193, 68, 14, 0.98);
}

.header__logo {
  height: 50px;
  transition: var(--transition);
  display: flex;
  align-items: center;
}

.header__logo img {
  height: 100%;
  width: auto;
  transition: var(--transition);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.header__logo:hover img {
  transform: scale(1.05) rotate(-2deg);
}

.header__nav {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.header__icon {
  width: 24px;
  height: 24px;
  transition: var(--transition);
  filter: brightness(0) invert(1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__icon:hover {
  transform: scale(1.2) rotate(10deg);
  filter: brightness(0) invert(0.8) sepia(1) hue-rotate(10deg) saturate(5);
}

.header__profile {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  border: 2px solid white;
  object-fit: cover;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.header__profile:hover {
  transform: scale(1.1);
  border-color: var(--accent);
  box-shadow: var(--shadow-md);
}

.header__login {
  padding: var(--space-sm) var(--space-md);
  background-color: var(--secondary);
  color: white;
  border-radius: var(--border-radius-full);
  font-weight: 500;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  box-shadow: var(--shadow-sm);
  font-size: var(--text-sm);
}

.header__login:hover {
  background-color: var(--secondary-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.header__dropdown {
  position: absolute;
  top: calc(100% + var(--space-xs));
  right: var(--space-md);
  width: 280px;
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-xl);
  z-index: 1001;
  overflow: hidden;
  transform-origin: top right;
  opacity: 0;
  transform: scale(0.95);
  transition: var(--transition);
  visibility: hidden;
}

.header__dropdown.show {
  opacity: 1;
  transform: scale(1);
  visibility: visible;
}

.dropdown__header {
  padding: var(--space-md);
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
}

.dropdown__username {
  font-size: var(--text-md);
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.dropdown__email {
  font-size: var(--text-sm);
  opacity: 0.9;
}

.dropdown__divider {
  border: none;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0;
}

.dropdown__item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  color: var(--text);
  transition: var(--transition-fast);
}

.dropdown__item:hover {
  background-color: rgba(212, 160, 23, 0.1);
  padding-left: var(--space-lg);
}

.dropdown__item img {
  width: 20px;
  height: 20px;
  transition: var(--transition-fast);
}

.dropdown__item:hover img {
  transform: scale(1.15) rotate(5deg);
}

/* Banner */
.banner {
  position: relative;
  padding: 180px 0 120px;
  color: white;
  text-align: center;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
}

.banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(193, 68, 14, 0.3), rgba(212, 160, 23, 0.3));
  z-index: 0;
}

.banner__content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.banner__subtitle {
  font-size: var(--text-xl);
  margin-bottom: var(--space-md);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 500;
}

.banner__title {
  font-size: var(--text-xxxl);
  line-height: 1.2;
  margin-bottom: var(--space-lg);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 700;
}

.banner__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md) var(--space-xl);
  background-color: var(--accent);
  color: white;
  border-radius: var(--border-radius-full);
  font-weight: 600;
  transition: var(--transition);
  box-shadow: 0 4px 15px rgba(212, 160, 23, 0.4);
  border: none;
  cursor: pointer;
  font-size: var(--text-md);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  gap: var(--space-xs);
}

.banner__button:hover {
  background-color: var(--accent-light);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(212, 160, 23, 0.6);
}

.banner__button:active {
  transform: translateY(-1px);
}

/* Secciones */
.section {
  padding: var(--space-xxl) 0;
  position: relative;
}

.section__header {
  margin-bottom: var(--space-xxl);
  text-align: center;
}

.section__title {
  font-size: var(--text-xxl);
  font-weight: 700;
  color: var(--text);
  position: relative;
  display: inline-block;
  padding-bottom: var(--space-sm);
}

.section__title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, var(--primary), var(--accent));
  border-radius: 2px;
}

.section__subtitle {
  font-size: var(--text-lg);
  color: var(--text-gray);
  margin-top: var(--space-md);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

/* Grid responsive */
.grid {
  display: grid;
  gap: var(--space-lg);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Cards */
.card {
  background-color: white;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
  position: relative;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: var(--transition-slow);
}

.card:hover .card__image {
  transform: scale(1.05);
}

.card__content {
  padding: var(--space-md);
}

.card__title {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--space-sm);
  color: var(--text);
}

.card__text {
  color: var(--text-gray);
  font-size: var(--text-sm);
  margin-bottom: var(--space-md);
}

.card__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-md);
  background-color: var(--primary);
  color: white;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  transition: var(--transition);
  font-size: var(--text-sm);
  gap: var(--space-xs);
}

.card__button:hover {
  background-color: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Categories */
.categories__grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.category-card {
  text-align: center;
}

.category-card:hover {
  transform: translateY(-8px) rotate(1deg);
}

.category-card__title {
  font-size: var(--text-md);
  margin: var(--space-md) 0;
}

/* Products */
.products__grid {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.product-card__price {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-weight: 700;
  color: var(--primary);
  margin: var(--space-md) 0;
}

.product-card__price--old {
  font-size: var(--text-sm);
  color: var(--text-gray);
  text-decoration: line-through;
}

/* Testimonials */
.testimonials {
  background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85));
  color: white;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}

.testimonials .section__title {
  color: white;
}

.testimonials .section__title::after {
  background: linear-gradient(to right, var(--accent), var(--neutral));
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: var(--space-lg);
}

.testimonial-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-5px);
}

.testimonial__rating {
  color: var(--accent);
  font-size: var(--text-lg);
  margin-bottom: var(--space-md);
}

.testimonial__text {
  font-style: italic;
  position: relative;
  padding-left: var(--space-md);
  margin-bottom: var(--space-lg);
}

.testimonial__text::before {
  content: '"';
  position: absolute;
  left: 0;
  top: -10px;
  font-size: 3rem;
  opacity: 0.2;
  line-height: 1;
}

.testimonial__author {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.testimonial__avatar {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-full);
  border: 2px solid var(--accent);
  object-fit: cover;
}

.testimonial__info h4 {
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.testimonial__location {
  font-size: var(--text-xs);
  opacity: 0.8;
}

/* Gallery */
.gallery__grid {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
}

.gallery__item {
  aspect-ratio: 1;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  position: relative;
}

.gallery__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-slow);
}

.gallery__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(193, 68, 14, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}

.gallery__item:hover .gallery__overlay {
  opacity: 1;
}

.gallery__item:hover .gallery__image {
  transform: scale(1.1);
}

/* Events */
.event-card {
  display: flex;
  flex-direction: column;
}

.event-card__date {
  background: linear-gradient(to right, var(--primary), var(--accent));
  color: white;
  padding: var(--space-sm);
  text-align: center;
  display: flex;
  flex-direction: column;
}

.event-card__day {
  font-size: var(--text-xxl);
  font-weight: 700;
  line-height: 1;
}

.event-card__month {
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.event-card__content {
  padding: var(--space-md);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.event-card__meta {
  display: flex;
  gap: var(--space-md);
  margin-top: auto;
  font-size: var(--text-xs);
  color: var(--primary);
}

/* Blog */
.blog-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.blog-card__header {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.blog-card__date {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  background-color: var(--accent);
  color: white;
  padding: var(--space-sm);
  border-radius: var(--border-radius-sm);
  text-align: center;
  z-index: 1;
}

.blog-card__day {
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1;
}

.blog-card__month {
  font-size: var(--text-xs);
  text-transform: uppercase;
}

.blog-card__content {
  padding: var(--space-md);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.blog-card__readmore {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--primary);
  font-weight: 600;
  transition: var(--transition-fast);
}

.blog-card__readmore:hover {
  color: var(--accent);
  gap: var(--space-sm);
}

/* Featured */
.featured {
  padding: 0;
}

.featured__grid {
  grid-template-columns: 1fr;
  gap: 0;
}

.featured__main {
  height: 500px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: var(--space-xxl);
  position: relative;
}

.featured__main::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.featured__content {
  position: relative;
  z-index: 1;
  color: white;
  max-width: 600px;
}

.featured__title {
  font-size: var(--text-xxl);
  margin-bottom: var(--space-md);
}

.featured__text {
  margin-bottom: var(--space-lg);
}

.featured__button {
  display: inline-flex;
  align-items: center;
  padding: var(--space-md) var(--space-xl);
  background-color: var(--accent);
  color: white;
  border-radius: var(--border-radius-full);
  font-weight: 600;
  transition: var(--transition);
  gap: var(--space-sm);
  text-transform: uppercase;
}

.featured__button:hover {
  background-color: var(--accent-light);
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.featured__secondary {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.featured__secondary-content {
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featured__secondary-title {
  font-size: var(--text-xl);
  color: var(--primary);
  margin-bottom: var(--space-md);
}

.featured__secondary-image {
  height: 100%;
  min-height: 300px;
  object-fit: cover;
  transition: var(--transition-slow);
}

.featured__secondary:hover .featured__secondary-image {
  transform: scale(1.05);
}

.featured__tertiary {
  height: 400px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}

.featured__tertiary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.featured__tertiary-content {
  position: relative;
  z-index: 1;
  color: white;
  max-width: 600px;
  padding: var(--space-md);
}

/* Footer */
.footer {
  background: linear-gradient(135deg, var(--text), #5a3e2b);
  color: var(--neutral);
  padding: var(--space-xxl) 0 0;
  position: relative;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A017' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.1;
  z-index: 0;
}

.footer__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-xxl);
  position: relative;
  z-index: 1;
}

.footer__col-title {
  font-size: var(--text-lg);
  color: var(--accent);
  margin-bottom: var(--space-lg);
  position: relative;
  padding-bottom: var(--space-sm);
}

.footer__col-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: var(--accent);
}

.footer__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer__list-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
}

.footer__icon {
  width: 16px;
  height: 16px;
  margin-top: 3px;
  filter: brightness(0) invert(1) opacity(0.8);
}

.footer__link {
  transition: var(--transition-fast);
  color: rgba(255, 255, 255, 0.8);
}

.footer__link:hover {
  color: var(--accent);
  padding-left: var(--space-xs);
}

.footer__newsletter {
  margin-top: var(--space-md);
}

.footer__input {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: none;
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--space-sm);
  font-size: var(--text-sm);
}

.footer__social {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.footer__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-full);
  transition: var(--transition);
}

.footer__social-link:hover {
  background-color: var(--accent);
  transform: translateY(-3px);
}

.footer__social-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

.footer__bottom {
  padding: var(--space-lg) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  position: relative;
  z-index: 1;
}

.footer__copyright {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: var(--space-md);
}

.footer__legal {
  display: flex;
  justify-content: center;
  gap: var(--space-lg);
}

.footer__legal-link {
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.6);
  transition: var(--transition-fast);
}

.footer__legal-link:hover {
  color: var(--accent);
}

/* ---------------------------- */
/* Media Queries Responsive */
/* ---------------------------- */

/* Pantallas grandes (xl) */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
  
  .header {
    padding: 0 var(--space-lg);
  }
  
  .section__title {
    font-size: var(--text-xxxl);
  }
  
  .featured__secondary {
    grid-template-columns: 1fr 1fr;
  }
}

/* Tablets en horizontal y laptops (lg) */
@media (min-width: 1024px) and (max-width: 1279px) {
  .container {
    max-width: 1000px;
  }
  
  .header__nav {
    gap: var(--space-md);
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .featured__secondary {
    grid-template-columns: 1fr 1fr;
  }
}

/* Tablets (md) */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    max-width: 90%;
  }
  
  .header {
    height: 70px;
  }
  
  .header__logo {
    height: 40px;
  }
  
  .header__profile {
    width: 36px;
    height: 36px;
  }
  
  .header__login {
    padding: var(--space-xs) var(--space-md);
    font-size: var(--text-xs);
  }
  
  .banner {
    padding: 140px 0 80px;
  }
  
  .banner__title {
    font-size: var(--text-xxl);
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section {
    padding: var(--space-xl) 0;
  }
  
  .section__title {
    font-size: var(--text-xl);
  }
  
  .featured__main {
    height: 400px;
    padding: var(--space-xl);
  }
  
  .featured__secondary {
    grid-template-columns: 1fr;
  }
  
  .featured__secondary-image {
    order: -1;
    height: 300px;
  }
  
  .footer__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Móviles grandes (sm) */
@media (min-width: 640px) and (max-width: 767px) {
  .container {
    max-width: 95%;
  }
  
  .header {
    height: 65px;
    padding: 0 var(--space-md);
  }
  
  .header__logo {
    height: 35px;
  }
  
  .header__nav {
    gap: var(--space-sm);
  }
  
  .header__icon {
    width: 20px;
    height: 20px;
  }
  
  .header__profile {
    width: 32px;
    height: 32px;
  }
  
  .header__login {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-xs);
  }
  
  .header__dropdown {
    width: 260px;
  }
  
  .banner {
    padding: 120px 0 60px;
  }
  
  .banner__title {
    font-size: var(--text-xl);
  }
  
  .banner__subtitle {
    font-size: var(--text-lg);
  }
  
  .banner__button {
    padding: var(--space-sm) var(--space-lg);
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section {
    padding: var(--space-lg) 0;
  }
  
  .section__title {
    font-size: var(--text-lg);
  }
  
  .card__title {
    font-size: var(--text-md);
  }
  
  .featured__main {
    height: 350px;
    padding: var(--space-lg);
  }
  
  .featured__title {
    font-size: var(--text-xl);
  }
  
  .featured__button {
    padding: var(--space-sm) var(--space-md);
  }
  
  .footer__grid {
    grid-template-columns: 1fr;
  }
  
  .footer__col {
    margin-bottom: var(--space-xl);
  }
}

/* Móviles pequeños (xs) */
@media (max-width: 639px) {
  .container {
    max-width: 95%;
  }
  
  .header {
    height: 60px;
    padding: 0 var(--space-sm);
  }
  
  .header__logo {
    height: 30px;
  }
  
  .header__nav {
    gap: var(--space-xs);
  }
  
  .header__icon {
    width: 18px;
    height: 18px;
  }
  
  .header__profile {
    width: 30px;
    height: 30px;
  }
  
  .header__login {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-xs);
    display: none;
  }
  
  .header__dropdown {
    width: 240px;
    right: var(--space-sm);
  }
  
  .banner {
    padding: 100px 0 var(--space-xl);
    background-attachment: scroll;
  }
  
  .banner__title {
    font-size: var(--text-lg);
    margin-bottom: var(--space-md);
  }
  
  .banner__subtitle {
    font-size: var(--text-md);
    margin-bottom: var(--space-md);
  }
  
  .banner__button {
    width: 100%;
    padding: var(--space-md);
    font-size: var(--text-sm);
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
  
  .section {
    padding: var(--space-xl) 0;
  }
  
  .section__title {
    font-size: var(--text-xl);
    padding-bottom: var(--space-xs);
  }
  
  .section__title::after {
    width: 60px;
    height: 3px;
  }
  
  .section__subtitle {
    font-size: var(--text-md);
  }
  
  .card {
    max-width: 320px;
    margin: 0 auto;
  }
  
  .featured__main {
    height: 300px;
    padding: var(--space-lg);
  }
  
  .featured__title {
    font-size: var(--text-lg);
  }
  
  .featured__text {
    font-size: var(--text-sm);
  }
  
  .featured__button {
    width: 100%;
    justify-content: center;
  }
  
  .featured__secondary {
    grid-template-columns: 1fr;
  }
  
  .featured__secondary-image {
    order: -1;
    height: 250px;
  }
  
  .featured__secondary-title {
    font-size: var(--text-lg);
  }
  
  .featured__tertiary {
    height: 300px;
  }
  
  .footer {
    padding: var(--space-xl) 0 0;
  }
  
  .footer__grid {
    grid-template-columns: 1fr;
  }
  
  .footer__col {
    margin-bottom: var(--space-xl);
  }
  
  .footer__legal {
    flex-direction: column;
    gap: var(--space-sm);
  }
}

/* Móviles muy pequeños (xxs) */
@media (max-width: 374px) {
  .header {
    padding: 0 var(--space-sm);
  }
  
  .header__logo {
    height: 28px;
  }
  
  .header__nav {
    gap: var(--space-xs);
  }
  
  .header__icon {
    width: 16px;
    height: 16px;
  }
  
  .header__profile {
    width: 28px;
    height: 28px;
  }
  
  .banner__title {
    font-size: var(--text-md);
  }
  
  .banner__subtitle {
    font-size: var(--text-sm);
  }
  
  .section__title {
    font-size: var(--text-lg);
  }
  
  .section__subtitle {
    font-size: var(--text-sm);
  }
  
  .card__title {
    font-size: var(--text-md);
  }
  
  .card__button {
    width: 100%;
  }
  
  .featured__main {
    padding: var(--space-md);
  }
  
  .featured__title {
    font-size: var(--text-md);
  }
}
</style>