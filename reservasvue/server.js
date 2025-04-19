import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5173;

// Configuración segura para rutas:
app.use(express.static(path.join(__dirname, 'dist'), {
  index: false, // Evita conflicto con index.html
  redirect: false // Desactiva redirecciones automáticas
}));

// Ruta universal SIN parámetros dinámicos
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`✅ Servidor en http://localhost:${port}`);
});