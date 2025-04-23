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

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  if (imagen) {
	return `${baseUrl}/${imagen}`;
  } else {
	return imagenPorDefecto.value; // Retorna la imagen por defecto si no hay imagen en el store
  }

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
				<img class="icon" src="../assets/IMG/message.svg" alt="Mensaje" title="Crear Pqr" />
			</router-link>
			<router-link class="icon-p scroll-animate scroll-delay-2" :to="token ? '/TablaPqrRes' : '/Iniciar'">
				<img class="icon" src="../assets/IMG/notification.svg" alt="Notificación" title="Pqrs Respondidos"/>
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
						<p class="price">$29.600 <span>$25.800</span></p>
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

						<p class="price">$22.700 <span>$20.000</span></p>
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
						<p class="price">$24.600 <span>$20.000</span></p>
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
						<p class="price">$25.700 <span>$23.000</span></p>
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
						<p class="price">$23.700 <span>$22.500</span></p>
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
						<p class="price">$25.600</p>
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
						<img src="../assets/IMG/RestauranteInsta.jpg" alt="Instagram 1">
						<div class="gallery-overlay">
							<span class="instagram-icon">📷</span>
						</div>
					</div>
					<div class="gallery-item scroll-animate scroll-delay-2">
						<img src="../assets/IMG/FotoPlatoInsta.jpg" alt="Instagram 2">
						<div class="gallery-overlay">
							<span class="instagram-icon">📷</span>
						</div>
					</div>
					<div class="gallery-item scroll-animate scroll-delay-3">
						<img src="../assets/IMG/GenteCampingInsta.jpg" alt="Instagram 3">
						<div class="gallery-overlay">
							<span class="instagram-icon">📷</span>
						</div>
					</div>
					<div class="gallery-item scroll-animate scroll-delay-1">
						<img src="../assets/IMG/GenteInsta.jpg" alt="Instagram 4">
						<div class="gallery-overlay">
							<span class="instagram-icon">📷</span>
						</div>
					</div>
					<div class="gallery-item scroll-animate scroll-delay-2">
						<img src="../assets/IMG/GenteSenderoInsta.jpg" alt="Instagram 5">
						<div class="gallery-overlay">
							<span class="instagram-icon">📷</span>
						</div>
					</div>
					<div class="gallery-item scroll-animate scroll-delay-3">
						<img src="../assets/IMG/SalonInsta.jpg" alt="Instagram 6">
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
            <p class="event-description">Degustación de los mejores vinos nacionales acompañados de platillos especiales.</p>
            <div class="event-meta">
              <span class="event-time">
                <font-awesome-icon icon="fa-solid fa-clock" />
                <span>7:00 PM - 11:00 PM</span>
              </span>
              <span class="event-price">
                <font-awesome-icon icon="fa-solid fa-tag" />
                <span>$120.000 por persona</span>
              </span>
            </div>
            <router-link v-if="token" to="/Eventos" class="event-button">
              <font-awesome-icon icon="fa-solid fa-calendar-check" />
              <span>Reservar</span>
            </router-link>
            <button v-else class="event-button" @click="redirigirALogin">
              <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
              <span>Inicia sesión</span>
            </button>
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
            <p class="event-description">Aprende las técnicas básicas de cocina con nuestro chef ejecutivo.</p>
            <div class="event-meta">
              <span class="event-time">
                <font-awesome-icon icon="fa-solid fa-clock" />
                <span>10:00 AM - 2:00 PM</span>
              </span>
              <span class="event-price">
                <font-awesome-icon icon="fa-solid fa-tag" />
                <span>$80.000 por persona</span>
              </span>
            </div>
            <router-link v-if="token" to="/Eventos" class="event-button">
              <font-awesome-icon icon="fa-solid fa-calendar-check" />
              <span>Reservar</span>
            </router-link>
            <button v-else class="event-button" @click="redirigirALogin">
              <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
              <span>Inicia sesión</span>
            </button>
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
            <p class="event-description">Menú especial para parejas con música en vivo y ambiente íntimo.</p>
            <div class="event-meta">
              <span class="event-time">
                <font-awesome-icon icon="fa-solid fa-clock" />
                <span>6:00 PM - 12:00 AM</span>
              </span>
              <span class="event-price">
                <font-awesome-icon icon="fa-solid fa-tag" />
                <span>$150.000 por pareja</span>
              </span>
            </div>
            <router-link v-if="token" to="/Eventos" class="event-button">
              <font-awesome-icon icon="fa-solid fa-calendar-check" />
              <span>Reservar</span>
            </router-link>
            <button v-else class="event-button" @click="redirigirALogin">
              <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
              <span>Inicia sesión</span>
            </button>
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
							<img src="../assets/IMG/Marinado.jpg" alt="Blog 1" class="blog-img">
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
							<img src="../assets/IMG/Vinos.jpg" alt="Blog 2" class="blog-img">
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
							<img src="../assets/IMG/Sostenible.jpg" alt="Blog 3" class="blog-img">
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
	--primary: #C1440E;
	/* Rojo Terracota */
	--secondary: #6B8E23;
	/* Verde Oliva */
	--accent: #D4A017;
	/* Amarillo Mostaza */
	--neutral: #F5DEB3;
	/* Beige Arena */
	--text: #8B5A2B;
	/* Marrón Tierra */
	--text-gray: #5A678C;
	--error: #E3452F;

	/* Nuevas variables para el diseño moderno */
	--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
	--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
	--shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
	--transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
	--transition-fast: all 0.15s ease-in-out;
	--border-radius: 12px;
	--border-radius-sm: 8px;
}

/* Reset y estilos base */
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	font-family: 'Montserrat', sans-serif;
	background-color: #f9f5f0;
	color: var(--text);
	line-height: 1.6;
	scroll-behavior: smooth;
}

/* Animaciones globales */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes slideInLeft {
	from {
		opacity: 0;
		transform: translateX(-50px);
	}

	to {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes slideInRight {
	from {
		opacity: 0;
		transform: translateX(50px);
	}

	to {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes float {

	0%,
	100% {
		transform: translateY(0);
	}

	50% {
		transform: translateY(-10px);
	}
}

@keyframes pulse {
	0% {
		transform: scale(1);
	}

	50% {
		transform: scale(1.05);
	}

	100% {
		transform: scale(1);
	}
}

@keyframes scaleIn {
	from {
		opacity: 0;
		transform: scale(0.8);
	}

	to {
		opacity: 1;
		transform: scale(1);
	}
}

/* Clases para animaciones al scrollear */
.scroll-animate {
	opacity: 0;
	transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.scroll-animate.animate-in {
	opacity: 1;
	animation: fadeIn 0.6s forwards;
}

.scroll-delay-1.animate-in {
	animation-delay: 0.2s;
}

.scroll-delay-2.animate-in {
	animation-delay: 0.4s;
}

.scroll-delay-3.animate-in {
	animation-delay: 0.6s;
}

.scroll-delay-4.animate-in {
	animation-delay: 0.8s;
}

/* Animaciones específicas para elementos */
.banner.scroll-animate.animate-in,
.featured-card.scroll-animate.animate-in {
	animation: scaleIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.card-category.scroll-animate.animate-in:nth-child(odd),
.card-product.scroll-animate.animate-in:nth-child(odd) {
	animation: slideInLeft 0.6s ease-out forwards;
}

.card-category.scroll-animate.animate-in:nth-child(even),
.card-product.scroll-animate.animate-in:nth-child(even) {
	animation: slideInRight 0.6s ease-out forwards;
}

.featured-card.secondary-featured.scroll-animate.animate-in:nth-child(odd) {
	animation: slideInLeft 0.6s ease-out forwards;
}

.featured-card.secondary-featured.scroll-animate.animate-in:nth-child(even) {
	animation: slideInRight 0.6s ease-out forwards;
}

/* Header modernizado */
header {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 80px;
	padding: 0 2rem;
	width: 100%;
	display: flex;
	align-items: center;
	background-color: rgba(193, 68, 14, 0.95);
	justify-content: space-between;
	z-index: 1000;
	backdrop-filter: blur(10px);
	box-shadow: var(--shadow-md);
	transition: var(--transition);
}

header:hover {
	background-color: rgba(193, 68, 14, 0.98);
}



.A-logo img {
	height: 100%;
	width: 100%;
	transition: var(--transition);
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.A-logo img:hover {
	transform: scale(1.05) rotate(-2deg);
}

.navegar__Usuario {
	display: flex;
	gap: 1.5rem;
	align-items: center;
}

/* Iconos modernizados */
.icon {
	width: 24px;
	height: 24px;
	transition: var(--transition);
	filter: brightness(0) invert(1);
}

.icon:hover {
	transform: scale(1.2) rotate(10deg);
	filter: brightness(0) invert(0.8) sepia(1) hue-rotate(10deg) saturate(5);
}

/* Perfil con efecto 3D */
.perfil {
	display: block;
	object-fit: cover;
	width: 50px;
	height: 50px;
	cursor: pointer;
	border: 2px solid #ffffff;
	border-radius: 50%;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	transition: var(--transition);
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.perfil:hover {
	transform: scale(1.1) rotate(5deg);
	border: 3px solid var(--accent);
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

/* Menú desplegable moderno */
.Menu-desple {
	width: 280px;
	top: 88px;
	right: 16px;
	position: absolute;
	border-radius: var(--border-radius);
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	background-color: white;
	box-shadow: var(--shadow-lg);
	transform-origin: top right;
	z-index: 1001;
	overflow: hidden;
	transition: var(--transition);
}

.Menu-desple-gable {
	animation: fadeIn 0.3s ease-out forwards;
}

.hide {
	animation: fadeOut 0.3s ease-out forwards;
}

@keyframes fadeOut {
	from {
		opacity: 1;
		transform: scale(1);
	}

	to {
		opacity: 0;
		transform: scale(0.95);
	}
}

.Menu__group {
	padding: 1.2rem;
	background: linear-gradient(135deg, var(--primary), #a53a0c);
	color: white;
}

.nombre-usuario {
	font-size: 1.1rem;
	font-weight: 600;
	margin-bottom: 0.3rem;
}

.email {
	font-size: 0.85rem;
	opacity: 0.8;
}

.divider {
	border: none;
	height: 1px;
	background-color: rgba(0, 0, 0, 0.1);
	margin: 0;
}

nav ul {
	list-style: none;
	padding: 0.5rem 0;
}

.ramdon {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.8rem 1.2rem;
	color: var(--text);
	text-decoration: none;
	transition: var(--transition-fast);
}

.ramdon img {
	width: 20px;
	height: 20px;
	transition: var(--transition-fast);
}

.ramdon:hover {
	background-color: rgba(212, 160, 23, 0.1);
	padding-left: 1.5rem;
}

.ramdon:hover img {
	transform: scale(1.2) rotate(10deg);
}

/* Banner con efecto parallax */
.banner {
	background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4));
	background-size: cover;
	background-attachment: fixed;
	background-position: center;
	padding: 180px 0 120px;
	color: white;
	text-align: center;
	position: relative;
	overflow: hidden;
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

.content-banner {
	position: relative;
	z-index: 1;
	max-width: 800px;
	margin: 0 auto;
	padding: 0 1rem;
}

.content-banner p {
	font-size: 1.5rem;
	margin-bottom: 1.5rem;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.content-banner h2 {
	font-size: 3rem;
	line-height: 1.2;
	margin-bottom: 2rem;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.content-banner a,
.content-banner button {
	display: inline-block;
	padding: 1rem 2.5rem;
	background-color: var(--accent);
	color: white;
	text-decoration: none;
	border-radius: 50px;
	font-weight: 600;
	transition: var(--transition);
	box-shadow: 0 4px 15px rgba(212, 160, 23, 0.4);
	border: none;
	cursor: pointer;
	font-size: 1rem;
	text-transform: uppercase;
	letter-spacing: 1px;
}

.content-banner a:hover,
.content-banner button:hover {
	background-color: #e6b422;
	transform: translateY(-3px);
	box-shadow: 0 6px 20px rgba(212, 160, 23, 0.6);
}

/* Contenido principal modernizado */
.main-content {
	padding: 4rem 0;
	background-color: #fef7eabf;
}

.container {
	margin: 0 auto;
	padding: 14px;
	width: 100%;
}


.heading-1 {
	font-size: 2.5rem;
	text-align: center;
	margin-bottom: 2rem;
	color: var(--text);
	position: relative;
}

.heading-1::after {
	content: '';
	position: absolute;
	width: 50px;
	height: 4px;
	background-color: var(--accent);
	bottom: -10px;
	left: 50%;
	transform: translateX(-50%);
	border-radius: 2px;
	transition: var(--transition);
}

/* Estilos para la sección de equipo */
.our-team {
	padding: 4rem 0;
	background-color: #fff;
}

.team-container {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2rem;
}

.team-card {
	background: white;
	border-radius: var(--border-radius);
	overflow: hidden;
	box-shadow: var(--shadow-sm);
	transition: var(--transition);
}

.team-card:hover {
	transform: translateY(-10px);
	box-shadow: var(--shadow-lg);
}

.team-img-container {
	position: relative;
	height: 300px;
	overflow: hidden;
}

.team-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.5s ease;
}

.team-card:hover .team-img {
	transform: scale(1.05);
}

.team-social {
	position: absolute;
	bottom: 20px;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	gap: 1rem;
	opacity: 0;
	transition: var(--transition);
}

.team-card:hover .team-social {
	opacity: 1;
}

.team-social a {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	background-color: rgba(255, 255, 255, 0.9);
	border-radius: 50%;
	transition: var(--transition);
}

.team-social a:hover {
	background-color: var(--accent);
	transform: translateY(-3px);
}

.team-social img {
	width: 20px;
	height: 20px;
}

.team-info {
	padding: 1.5rem;
	text-align: center;
}

.team-position {
	color: var(--primary);
	font-weight: 600;
	margin: 0.5rem 0;
}

.team-bio {
	color: var(--text-gray);
	font-size: 0.9rem;
	line-height: 1.6;
}

/* Estilos para la sección de testimonios */
.testimonials-section {
	padding: 5rem 0;
	background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8));
	background-size: cover;
	background-attachment: fixed;
	color: white;
}

.testimonials-container {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2rem;
	margin-top: 3rem;
}

.testimonial-card {
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
	border-radius: var(--border-radius);
	padding: 2rem;
	transition: var(--transition);
	border: 1px solid rgba(255, 255, 255, 0.2);
}

.testimonial-card:hover {
	transform: translateY(-10px);
	background: rgba(255, 255, 255, 0.15);
}

.testimonial-rating {
	color: var(--accent);
	font-size: 1.2rem;
	margin-bottom: 1rem;
}

.testimonial-text {
	font-style: italic;
	line-height: 1.8;
	margin-bottom: 1.5rem;
	position: relative;
}

.testimonial-text::before {
	content: '"';
	font-size: 4rem;
	position: absolute;
	top: -20px;
	left: -15px;
	opacity: 0.2;
	line-height: 1;
}

.testimonial-author {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.testimonial-img {
	width: 60px;
	height: 60px;
	border-radius: 50%;
	object-fit: cover;
	border: 2px solid var(--accent);
}

.testimonial-location {
	font-size: 0.8rem;
	opacity: 0.8;
}

/* Estilos para la galería de Instagram */
.instagram-gallery {
	padding: 4rem 0;
	background-color: #f9f5f0;
}

.instagram-subtitle {
	text-align: center;
	font-size: 1.2rem;
	color: var(--text);
	margin-bottom: 2rem;
}

.gallery-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
	margin-bottom: 2rem;
}

.gallery-item {
	position: relative;
	border-radius: var(--border-radius-sm);
	overflow: hidden;
	aspect-ratio: 1/1;
}

.gallery-item img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.5s ease;
}

.gallery-overlay {
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

.gallery-item:hover .gallery-overlay {
	opacity: 1;
}

.gallery-item:hover img {
	transform: scale(1.1);
}

.instagram-icon {
	font-size: 2rem;
	color: white;
}

.instagram-button {
	display: block;
	width: fit-content;
	margin: 0 auto;
	padding: 0.8rem 2rem;
	background: linear-gradient(to right, var(--primary), var(--accent));
	color: white;
	border-radius: 50px;
	text-decoration: none;
	font-weight: 600;
	transition: var(--transition);
	box-shadow: 0 4px 15px rgba(193, 68, 14, 0.3);
}

.instagram-button:hover {
	transform: translateY(-3px);
	box-shadow: 0 6px 20px rgba(193, 68, 14, 0.4);
}

/* Estilos para la sección de eventos */
.events-section {
  padding: 4rem 1rem;
  background-color: #f9f5f0;
}

.events-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.event-card {
  display: flex;
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  flex-direction: column;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Fecha del evento */
.event-date {
  background: linear-gradient(to bottom, var(--primary), var(--accent));
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
}

.event-day {
	font-size: 2rem;
	font-weight: 700;
	line-height: 1;
}

.event-month {
	font-size: 1rem;
	text-transform: uppercase;
	letter-spacing: 1px;
}

.event-info {
	padding: 1.5rem;
	flex-grow: 1;
}

.event-title {
	color: var(--text);
	margin-bottom: 0.5rem;
}

.event-description {
	color: var(--text-gray);
	font-size: 0.9rem;
	margin-bottom: 1rem;
}

.event-meta {
	display: flex;
	gap: 1rem;
	font-size: 0.8rem;
	color: var(--primary);
	margin-bottom: 1rem;
}

.event-button {
	display: inline-block;
	padding: 0.5rem 1.5rem;
	background-color: var(--primary);
	color: white;
	border-radius: 50px;
	text-decoration: none;
	font-size: 0.8rem;
	font-weight: 600;
	transition: var(--transition);
	border: none;
	cursor: pointer;
}

.event-button:hover {
	background-color: var(--accent);
	transform: translateY(-2px);
}

/* Estilos para la sección del blog */
.blog-section {
	padding: 4rem 0;
	background-color: #f9f5f0;
}

.blog-subtitle {
	text-align: center;
	font-size: 1.1rem;
	color: var(--text-gray);
	margin-bottom: 3rem;
}

.blog-container {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2rem;
	margin-bottom: 3rem;
}

.blog-card {
	background: white;
	border-radius: var(--border-radius);
	overflow: hidden;
	box-shadow: var(--shadow-sm);
	transition: var(--transition);
}

.blog-card:hover {
	transform: translateY(-5px);
	box-shadow: var(--shadow-lg);
}

.blog-img-container {
	position: relative;
	height: 200px;
	overflow: hidden;
}

.blog-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.5s ease;
}

.blog-card:hover .blog-img {
	transform: scale(1.1);
}

.blog-date {
	position: absolute;
	top: 20px;
	right: 20px;
	background: var(--accent);
	color: white;
	padding: 0.5rem 0.8rem;
	border-radius: var(--border-radius-sm);
	text-align: center;
	line-height: 1;
}

.blog-date span:first-child {
	font-size: 1.5rem;
	font-weight: 700;
	display: block;
}

.blog-date span:last-child {
	font-size: 0.8rem;
	text-transform: uppercase;
}

.blog-content {
	padding: 1.5rem;
}

.blog-title {
	font-size: 1.2rem;
	margin-bottom: 0.8rem;
	color: var(--text);
}

.blog-excerpt {
	color: var(--text-gray);
	font-size: 0.9rem;
	line-height: 1.6;
	margin-bottom: 1rem;
}

.blog-link {
	color: var(--primary);
	font-weight: 600;
	text-decoration: none;
	transition: var(--transition-fast);
}

.blog-link:hover {
	color: var(--accent);
	text-decoration: underline;
}

.blog-button {
	display: block;
	width: fit-content;
	margin: 0 auto;
	padding: 0.8rem 2rem;
	background-color: var(--primary);
	color: white;
	border-radius: 50px;
	text-decoration: none;
	font-weight: 600;
	transition: var(--transition);
	box-shadow: 0 4px 15px rgba(193, 68, 14, 0.3);
}

.blog-button:hover {
	background-color: var(--accent);
	transform: translateY(-3px);
	box-shadow: 0 6px 20px rgba(212, 160, 23, 0.4);
}

/* Tarjetas de categorías modernas */



.container-categories {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 2rem;
	margin-bottom: 3rem;
}

.card-category {
	background-color: white;
	border-radius: var(--border-radius);
	overflow: hidden;
	text-align: center;
	transition: var(--transition);
	box-shadow: var(--shadow-sm);
	position: relative;
}

.card-category:hover {
	transform: translateY(-10px);
	box-shadow: var(--shadow-lg);
}

.Img-PrimerCard {
	width: 100%;
	height: 200px;
	object-fit: cover;
	transition: var(--transition);
}

.card-category:hover .Img-PrimerCard {
	transform: scale(1.05);
}

.card-category p {
	font-size: 1.2rem;
	margin: 1.2rem 0;
	color: var(--text);
	font-weight: 600;
}

.card-category a,
.card-category button {
	display: inline-block;
	padding: 0.6rem 1.5rem;
	background-color: var(--accent);
	color: white;
	border-radius: 50px;
	text-decoration: none;
	margin-bottom: 1.5rem;
	font-weight: 500;
	transition: var(--transition);
	border: none;
	cursor: pointer;
}

.card-category a:hover,
.card-category button:hover {
	background-color: var(--primary);
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(193, 68, 14, 0.3);
}

/* Productos con efecto 3D */
.container-products {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 2rem;
}

.card-product {
	background-color: white;
	border-radius: var(--border-radius);
	overflow: hidden;
	transition: var(--transition);
	box-shadow: var(--shadow-sm);
	position: relative;
}

.card-product:hover {
	transform: translateY(-5px) rotate(1deg);
	box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.container-img {
	height: 200px;
	overflow: hidden;
}

.IMG-Platos {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: var(--transition);
}

.card-product:hover .IMG-Platos {
	transform: scale(1.1);
}

.content-card-product {
	padding: 1.2rem;
	text-align: center;
}

.content-card-product h3 {
	font-size: 1.2rem;
	margin-bottom: 0.5rem;
	color: var(--text);
}

.price {
	font-size: 1.1rem;
	font-weight: 600;
	color: var(--primary);
	margin: 0.8rem 0;
}

.price span {
	font-size: 0.9rem;
	color: var(--text-gray);
	text-decoration: line-through;
	margin-left: 0.5rem;
}

.redirect-button {
	display: inline-block;
	padding: 0.6rem 1.5rem;
	background-color: var(--primary);
	color: white;
	border-radius: 50px;
	text-decoration: none;
	font-weight: 500;
	transition: var(--transition);
	border: none;
	cursor: pointer;
	margin-top: 0.5rem;
}

.redirect-button:hover {
	background-color: var(--accent);
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(212, 160, 23, 0.3);
}

/* Sección de destacados mejorada */
.featured-section {
	padding: 5rem 0;
}

.featured-container {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: auto auto;
	gap: 1.5rem;
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1.5rem;
}

.featured-card {
	position: relative;
	border-radius: var(--border-radius);
	overflow: hidden;
	box-shadow: var(--shadow-md);
	transition: var(--transition);
}

.featured-card:hover {
	transform: translateY(-5px);
	box-shadow: var(--shadow-lg);
}

.main-featured {
	grid-column: 1 / span 2;
	height: 400px;
	background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4));
	background-size: cover;
	background-position: center;
	display: flex;
	align-items: flex-end;
	animation: pulse 8s infinite ease-in-out;
}

.secondary-featured {
	height: 300px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	background-color: white;
}

.tertiary-featured {
	grid-column: 1 / span 2;
	height: 250px;
	background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
	background-size: cover;
	background-position: center;
	display: flex;
	align-items: center;
	justify-content: center;
}

.featured-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(to top, rgba(193, 68, 14, 0.4), transparent);
}

.featured-content {
	position: relative;
	z-index: 2;
	padding: 2rem;
	color: white;
}

.secondary-featured .featured-content {
	color: var(--text);
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.featured-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.5s ease;
}

.secondary-featured:hover .featured-image {
	transform: scale(1.05);
}

.featured-card h2 {
	font-size: 2.2rem;
	margin-bottom: 1rem;
	font-weight: 700;
	line-height: 1.2;
}

.featured-card h3 {
	font-size: 1.5rem;
	margin-bottom: 0.8rem;
	color: var(--primary);
}

.featured-card p {
	font-size: 1rem;
	margin-bottom: 1.5rem;
	max-width: 90%;
}

.featured-button,
.featured-button-dark,
.featured-button-small {
	display: inline-flex;
	align-items: center;
	padding: 0.8rem 1.8rem;
	border-radius: 50px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 1px;
	text-decoration: none;
	transition: var(--transition);
	border: none;
	cursor: pointer;
	font-size: 0.9rem;
}

.featured-button {
	background-color: var(--accent);
	color: white;
}

.featured-button:hover {
	background-color: #e6b422;
	transform: translateY(-3px);
	box-shadow: 0 4px 12px rgba(212, 160, 23, 0.4);
}

.featured-button-dark {
	background-color: var(--secondary);
	color: white;
}

.featured-button-dark:hover {
	background-color: #5a7d1a;
	transform: translateY(-3px);
}

.featured-button-small {
	padding: 0.6rem 1.2rem;
	font-size: 0.8rem;
	background-color: var(--primary);
	color: white;
}

.featured-button-small:hover {
	background-color: #a53a0c;
	transform: translateY(-2px);
}

.featured-button i,
.featured-button-dark i,
.featured-button-small i {
	margin-left: 0.5rem;
	transition: transform 0.3s ease;
}

.featured-button:hover i,
.featured-button-dark:hover i,
.featured-button-small:hover i {
	transform: translateX(3px);
}

/* Footer moderno */
.footer {
	background: linear-gradient(135deg, var(--text), #5a3e2b);
	color: var(--neutral);
	padding: 4rem 0 2rem;
	position: relative;
	overflow: hidden;
}

.footer::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0.05;
	z-index: 0;
}

.container-footer {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1.5rem;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 2rem;
	position: relative;
	z-index: 1;
}

.footer-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 3rem;
	margin-bottom: 3rem;
}

.footer-col {
	margin-bottom: 2rem;
}

.footer-title {
	font-size: 1.2rem;
	margin-bottom: 1.5rem;
	color: var(--accent);
	position: relative;
	padding-bottom: 0.8rem;
}

.footer-title::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	width: 40px;
	height: 2px;
	background-color: var(--accent);
}

.footer-list {
	list-style: none;
}

.footer-list li {
	margin-bottom: 1rem;
	display: flex;
	align-items: flex-start;
	gap: 0.8rem;
}

.footer-icon {
	width: 16px;
	height: 16px;
	margin-top: 3px;
	filter: brightness(0) invert(1) opacity(0.8);
}

.footer-list a {
	color: rgba(255, 255, 255, 0.8);
	text-decoration: none;
	transition: var(--transition-fast);
}

.footer-list a:hover {
	color: var(--accent);
	padding-left: 5px;
}

.footer-text {
	color: rgba(255, 255, 255, 0.7);
	font-size: 0.9rem;
	margin-bottom: 1.5rem;
	line-height: 1.6;
}

.newsletter-form {
	display: flex;
	margin-bottom: 1.5rem;
}

.newsletter-form input {
	flex-grow: 1;
	padding: 0.8rem 1rem;
	border: none;
	border-radius: var(--border-radius-sm) 0 0 var(--border-radius-sm);
	font-size: 0.9rem;
}

.newsletter-form button {
	padding: 0 1.5rem;
	background-color: var(--accent);
	color: white;
	border: none;
	border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
	font-weight: 600;
	cursor: pointer;
	transition: var(--transition-fast);
}

.newsletter-form button:hover {
	background-color: #e6b422;
}

.social-links {
	display: flex;
	gap: 1rem;
}

.social-links a {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 50%;
	transition: var(--transition);
}

.social-links a:hover {
	background-color: var(--accent);
	transform: translateY(-3px);
}

.social-links img {
	width: 20px;
	height: 20px;
	filter: brightness(0) invert(1);
}

.footer-bottom {
	padding: 1.5rem 0;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: 1rem;
}

.footer-bottom p {
	font-size: 0.8rem;
	color: rgba(255, 255, 255, 0.6);
}

.footer-legal {
	display: flex;
	gap: 1.5rem;
}

.footer-legal a {
	color: rgba(255, 255, 255, 0.6);
	font-size: 0.8rem;
	text-decoration: none;
	transition: var(--transition-fast);
}

.footer-legal a:hover {
	color: var(--accent);
}

/* Botones modernos */
.login-button {
	padding: 0.7rem 1.5rem;
	background-color: var(--secondary);
	color: white;
	border-radius: 50px;
	border: none;
	cursor: pointer;
	text-decoration: none;
	display: inline-block;
	font-weight: 500;
	transition: var(--transition);
	box-shadow: 0 2px 8px rgba(107, 142, 35, 0.3);
}

.login-button:hover {
	background-color: #5a7d1a;
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(107, 142, 35, 0.4);
}

/* Responsive Design */
@media (max-width: 1024px) {
	.featured-card h2 {
		font-size: 1.8rem;
	}

	.featured-container {
		grid-template-columns: 1fr;
	}

	.main-featured,
	.tertiary-featured {
		grid-column: 1;
	}

	.secondary-featured {
		grid-template-columns: 1fr;
		height: auto;
	}

	.featured-image {
		height: 250px;
	}
}

@media (max-width: 768px) {
	header {
		padding: 0 1rem;
		height: 70px;
	}

	.navegar__Usuario {
		gap: 1rem;
	}

	.perfil {
		width: 40px;
		height: 40px;
	}

	.Menu-desple {
		width: 240px;
		top: 78px;
	}

	.banner {
		padding: 150px 0 100px;
	}

	.content-banner h2 {
		font-size: 2.2rem;
	}

	.content-banner p {
		font-size: 1.2rem;
	}

	.heading-1 {
		font-size: 2rem;
		margin-bottom: 2rem;
	}

	.team-container,
	.testimonials-container,
	.blog-container {
		grid-template-columns: 1fr;
	}

	.gallery-grid {
		grid-template-columns: repeat(2, 1fr);
	}

	.events-container {
    grid-template-columns: 1fr;
  }
  
  .event-card {
    flex-direction: row;
    align-items: center;
  }
  
  .event-date {
    min-width: 80px;
    height: 100%;
    padding: 1rem 0.5rem;
  }
  
  .event-info {
    padding: 1rem;
  }
  
  .heading-1 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
	.featured-card h2 {
		font-size: 1.5rem;
	}

	.featured-card p {
		font-size: 0.9rem;
	}

	.featured-button,
	.featured-button-dark {
		padding: 0.7rem 1.2rem;
		font-size: 0.8rem;
	}

	.content-banner h2 {
		font-size: 1.8rem;
	}

	.content-banner a,
	.content-banner button {
		padding: 0.8rem 1.5rem;
		font-size: 0.9rem;
	}

	.container-products {
		grid-template-columns: 1fr;
	}

	.gallery-grid {
		grid-template-columns: 1fr;
	}

	.team-img-container {
		height: 250px;
	}

	.blog-img-container {
		height: 180px;
	}

	.footer-grid {
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	.footer-bottom {
		flex-direction: column;
		gap: 0.5rem;
	}

	.footer-legal {
		flex-direction: column;
		gap: 0.5rem;
	
	}

	.events-section {
    padding: 3rem 0.5rem;
  }
  
  .event-card {
    flex-direction: column;
  }
  
  .event-date {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    padding: 0.5rem;
  }
  
  .event-day,
  .event-month {
    display: inline-block;
  }
  
  .event-day {
    font-size: 1.5rem;
  }
  
  .event-button {
    width: 100%;
    padding: 0.7rem;
  }
  
  .heading-1 {
    font-size: 1.8rem;
  }

}

@media (max-width: 465px) {
  /* 1. Ajustes generales */
  body {
    font-size: 14px;
    line-height: 1.4;
  }
  
  /* 2. Header/Navegación */
  header {
    height: 60px;
    padding: 0 0.5rem;
  }
  
  .navegar__Usuario {
    gap: 0.5rem;
  }
  
  .perfil {
    width: 32px;
    height: 32px;
  }
  
  .Menu-desple {
    width: 100%;
    top: 60px;
    left: 0;
    right: 0;
  }
  
  /* 3. Banner principal */
  .banner {
    padding: 100px 0 60px;
  }

  .login-button{
		font-size: 10px;
  }
  
  .content-banner h2 {
    font-size: 1.8rem;
    line-height: 1.2;
  }
  
  .content-banner p {
    font-size: 1rem;
  }
  
  /* 4. Títulos */
  .heading-1 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  /* 5. Grids y layouts */
  .team-container,
  .testimonials-container,
  .blog-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .gallery-grid {
    grid-template-columns: 1fr;
  }
  
  .event-date {
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.3rem;
    font-size: 0.9rem;
  }
  
  /* 7. Botones */
  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  /* 8. Ajustes adicionales para móviles pequeños */
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
		
  }
  
  /* 9. Ocultar elementos no esenciales en móvil */
  .desktop-only {
    display: none !important;
  }
  
  /* 10. Menús hamburguesa (si aplica) */
  .menu-toggle {
    display: block;
  }
  
  .nav-links {
    display: none;
  }
}
</style>