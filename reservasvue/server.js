// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5173; // Railway asigna el puerto via variable de entorno

// Sirve archivos estáticos (Vue build)
app.use(express.static(path.join(__dirname, 'dist')));

// Maneja todas las rutas para Vue Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});