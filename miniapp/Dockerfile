FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000

# Применяем миграции к БД на смонтированном volume при каждом старте, затем поднимаем сервер.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
