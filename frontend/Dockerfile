# Stage 1: Build
FROM node:22 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
# Копіюємо конфіг Nginx (який ми створимо нижче)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
