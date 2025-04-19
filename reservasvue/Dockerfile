# Usa Node.js 18 (LTS - más estable)
FROM node:18-alpine3.18

# Directorio de trabajo
WORKDIR /app

# Copia archivos de dependencias e instálalos
COPY package*.json ./
RUN npm install

# Copia todo el proyecto
COPY . .

# Build de producción de Vite
RUN npm run build

# Instala Express (si no está en package.json)
RUN npm install express

# Puerto (debe coincidir con server.js)
EXPOSE 5173

# Comando de inicio (usa node server.js)
CMD ["node", "server.js"]