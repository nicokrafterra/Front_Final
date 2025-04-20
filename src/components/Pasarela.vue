<template>
    <div class="container">
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <!-- Info Cliente -->
          <div class="column">
            <h3 class="title">Información Cliente</h3>
  
            <div class="input-box" :class="{ error: errores.nombreCompleto }">
              <span>Nombre Completo:</span>
              <input type="text" v-model="form.nombreCompleto" placeholder="Ej: Juan Pérez" />
            </div>
  
            <div class="input-box" :class="{ error: errores.correo }">
              <span>Correo:</span>
              <input type="email" v-model="form.correo" placeholder="example@correo.com" />
            </div>
  
            <div class="input-box" :class="{ error: errores.telefono }">
              <span>Teléfono del Titular:</span>
              <input type="text" v-model="form.telefono" placeholder="3001234567" />
            </div>
  
            <div class="flex">
              <div class="input-box" :class="{ error: errores.cuotas }">
                <span>Número de Cuotas</span>
                <input type="number" v-model="form.cuotas" placeholder="Ej: 6" />
              </div>
            </div>
          </div>
  
          <!-- Métodos de pago -->
          <div class="column">
            <h3 class="title">Métodos de Pago</h3>
            
            <div class="input-box">
              <span>Entidades Asociadas :</span>
              <img src="../assets/IMG/imgcards.jpg" alt="Entidades asociadas" />
            </div>
  
            <div class="input-box" :class="{ error: errores.titular }">
              <span>Nombre del titular :</span>
              <input type="text" v-model="form.titular" placeholder="Ej: Mr. Jacob Aiden" />
            </div>
  
            <div class="input-box" :class="{ error: errores.numeroTarjeta }">
              <span>Número de Tarjeta :</span>
              <input type="text" v-model="form.numeroTarjeta" placeholder="1111 2222 3333 4444" />
            </div>
  
            <div class="flex">
              <div class="input-box" :class="{ error: errores.expiracion }">
                <span>Fecha Expiración:</span>
                <input type="text" v-model="form.expiracion" placeholder="MM/AA" />
              </div>
  
              <div class="input-box" :class="{ error: errores.cvv }">
                <span>CVV :</span>
                <input type="text" v-model="form.cvv" placeholder="123" />
              </div>
            </div>
          </div>
        </div>
  
        <button type="submit" class="btn">Enviar</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  import Swal from 'sweetalert2'
  
  const form = reactive({
    nombreCompleto: '',
    correo: '',
    telefono: '',
    cuotas: '',
    titular: '',
    numeroTarjeta: '',
    expiracion: '',
    cvv: ''
  })
  
  const errores = reactive({
    nombreCompleto: false,
    correo: false,
    telefono: false,
    cuotas: false,
    titular: false,
    numeroTarjeta: false,
    expiracion: false,
    cvv: false
  })
  
  const handleSubmit = () => {
    let error = false
  
    // Reset errores
    for (const key in errores) errores[key] = false
  
    // Validaciones básicas
    for (const key in form) {
      if (form[key] === '') {
        errores[key] = true
        error = true
      }
    }
  
    // Validación extra para campos específicos
    if (!/^\S+@\S+\.\S+$/.test(form.correo)) {
      errores.correo = true
      error = true
    }
  
    if (!/^\d{16}$/.test(form.numeroTarjeta.replace(/\s/g, ''))) {
      errores.numeroTarjeta = true
      error = true
    }
  
    if (!/^\d{2}\/\d{2}$/.test(form.expiracion)) {
      errores.expiracion = true
      error = true
    }
  
    if (!/^\d{3}$/.test(form.cvv)) {
      errores.cvv = true
      error = true
    }
  
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        text: 'Por favor revisa los campos marcados.',
        confirmButtonText: 'Entendido'
      })
      return
    }
  
    // Simulación de envío
    console.log('Formulario enviado:', form)
  
    Swal.fire({
      icon: 'success',
      title: 'Pago exitoso',
      text: 'Tu pago ha sido procesado correctamente.',
      confirmButtonText: 'Perfecto'
    })
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }
  
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #1f242d;
    padding: 25px;
  }
  
  form {
    width: 700px;
    padding: 40px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    transition: 0.3s ease-in-out;
  }
  
  form:hover {
    transform: translateY(-3px);
  }
  
  .row {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }
  
  .column {
    flex: 1 1 250px;
  }
  
  .title {
    font-size: 20px;
    color: #333;
    text-transform: uppercase;
    margin-bottom: 10px;
    border-left: 4px solid #8175d3;
    padding-left: 10px;
  }
  
  .input-box {
    margin: 15px 0;
  }
  
  .input-box span {
    display: block;
    margin-bottom: 10px;
    font-weight: 500;
  }
  
  .input-box input {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 15px;
    transition: 0.3s ease;
  }
  
  .input-box input:focus {
    border-color: #6a5acd;
    box-shadow: 0 0 5px rgba(106, 90, 205, 0.4);
  }
  
  .input-box img {
    height: 34px;
    margin-top: 5px;
    filter: drop-shadow(0 0 1px #000);
  }
  
  .flex {
    display: flex;
    gap: 15px;
  }
  
  form .btn {
    width: 100%;
    padding: 12px;
    background: #8175d3;
    border: none;
    border-radius: 6px;
    font-size: 17px;
    color: #fff;
    margin-top: 10px;
    cursor: pointer;
    transition: 0.3s ease;
  }
  
  form .btn:hover {
    background: #6a5acd;
  }
  
  .error input {
    border-color: red;
    background-color: #ffeaea;
  }
  </style>