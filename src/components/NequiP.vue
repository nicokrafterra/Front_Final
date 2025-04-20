<template>
    <div class="qr-container">
      <h2 class="title">Escanea el código QR para pagar con <span class="highlight">Nequi</span></h2>
      
      <div class="qr-box">
        <img src="../assets/IMG/QRCO.jpg" alt="Código QR" class="qr-image" />
      </div>
      
      <p class="scan-text">Apunta la cámara de tu celular al QR y sigue los pasos.</p>
      
      <button class="discover-btn" @click="descubrir">Descubre más</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      descubrir() {
        alert("Descubre más sobre el servicio");
      }
    }
  }
  </script>
  
  <style scoped>
  .qr-container {
    text-align: center;
    padding: 2rem;
    background: linear-gradient(135deg, #5f259f, #00d1b2);
    color: white;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    margin: auto;
  }
  
  .title {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  .highlight {
    color: #ffea00;
  }
  
  .qr-box {
    background: white;
    border-radius: 10px;
    padding: 1rem;
    margin: 1rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 250px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
  
  .qr-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .scan-text {
    margin-top: 1rem;
    font-size: 1rem;
  }
  
  .discover-btn {
    background-color: #ffea00;
    color: #5f259f;
    border: none;
    padding: 0.6rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
    margin-top: 1rem;
  }
  
  .discover-btn:hover {
    background-color: #ffd700;
  }
  </style>