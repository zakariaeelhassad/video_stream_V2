FROM eclipse-temurin:17-jdk-jammy
VOLUME /tmp
ARG JAR_FILE=target/video-service-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","/app.jar"]
