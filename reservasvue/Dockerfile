FROM node:23-alpine
RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm run dev
EXPOSE 5777
CMD ["npm", "run", "dev"] 