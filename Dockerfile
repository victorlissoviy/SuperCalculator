# Stage 1: Build
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY . .
RUN ./gradlew backend:bootJar

# Stage 2: Run
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/backend/build/libs/backend-1.0.jar app.jar
COPY --from=builder /app/Calculator/build/libs/Calculator.jar lib.jar
COPY lib lib
EXPOSE 8080
ENTRYPOINT ["java" ,"-cp", "app.jar:lib.jar", "org.springframework.boot.loader.launch.JarLauncher"]
