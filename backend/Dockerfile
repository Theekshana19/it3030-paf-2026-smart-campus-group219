# ---- Stage 1: Build with Maven ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# cache dependencies first
COPY pom.xml .
RUN mvn dependency:go-offline -B

# copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---- Stage 2: Run with lightweight JRE ----
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
