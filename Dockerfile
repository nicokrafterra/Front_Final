# Usa la imagen oficial de Node.js
FROM node:18-alpine3.18

# Establece el directorio de trabajo
WORKDIR /app

# Instala las dependencias de producción primero (maneja el conflicto de path-to-regexp)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copia el resto de los archivos
COPY . .

# Construye la aplicación
RUN npm run build

# Instala express explícitamente si es necesario
RUN npm install express --omit=dev --legacy-peer-deps

# Puerto expuesto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]