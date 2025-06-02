# Use the official Eclipse Temurin JDK 21 Alpine base image (lightweight)
FROM eclipse-temurin:21-jdk-alpine

# Set working directory inside container
WORKDIR /

# Copy only mvnw and .mvn folder and pom.xml first to leverage Docker cache for dependencies
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable to fix permission issues
RUN chmod +x mvnw

# Download all dependencies (go offline mode) to cache them
RUN ./mvnw dependency:go-offline -B

# Copy your source code
COPY src src

# Build the application, skipping tests for faster build
RUN ./mvnw package -DskipTests

# Expose the port Spring Boot uses (default 8080)
EXPOSE 8080

# Run the packaged jar
CMD ["sh", "-c", "java -jar $(ls target/*.jar)"]
