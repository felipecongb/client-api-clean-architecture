FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Estágio de produção
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

# Copiar o diretório dist para o estágio de produção
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main/server.js"]
