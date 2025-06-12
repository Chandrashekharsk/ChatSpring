# ---- Build stage ----
FROM maven:3.8.5-openjdk-17 AS build

WORKDIR /app

# Copy all files to the container
COPY . .

# Build the app without running tests
RUN mvn clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim

WORKDIR /app

COPY --from=build /app/target/chat_app-0.0.1-SNAPSHOT.jar chat-app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "chat-app.jar"]
