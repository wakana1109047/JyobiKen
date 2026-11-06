# ===== build stage =====
FROM eclipse-temurin:17-jdk AS build
WORKDIR /workspace

# Maven Wrapper と設定ファイルをコピー
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# ソースコードだけコピー（巨大フォルダを避ける）
COPY src ./src

RUN chmod +x mvnw
RUN ./mvnw -B clean package

# ===== run stage =====
FROM eclipse-temurin:17-jre-jammy
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system app \
    && useradd --system --gid app --no-create-home --shell /usr/sbin/nologin app

WORKDIR /app

COPY --from=build --chown=app:app /workspace/target/*.jar /app/app.jar

USER app:app
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=45s --retries=3 \
    CMD curl --fail --silent http://127.0.0.1:8080/actuator/health/readiness || exit 1

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.jar"]
