<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Headerr from './components/Headerr.vue';

const route = useRoute();
</script>



<template>
	<Headerr v-if="route.meta.showHeader"/>
	<RouterView />
</template>

<style>
body {
    background-image: url("./assets/IMG/BackgraudPagina12345.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed; /* Opcional: fija la imagen al desplazarse */
    margin: 0;
    min-height: 100vh;
}

</style>
