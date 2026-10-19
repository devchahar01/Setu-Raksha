from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    TIMEZONE: str = "Asia/Kolkata"
    APP_NAME: str = "Setu Raksha - National Bridge Safety Grid"
    API_V1_STR: str = "/api/v1"

    # Security
    JWT_SECRET: str = "super_secret_jwt_signing_key_change_in_production_min_32_chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Database
    DATABASE_URL: str = (
        "postgresql+asyncpg://setu_user:setu_secure_password_123@localhost:5432/setu_raksha"
    )

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # MinIO
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ROOT_USER: str = "minioadmin"
    MINIO_ROOT_PASSWORD: str = "minioadminsecure"
    MINIO_USE_SSL: bool = False
    MINIO_BUCKET_EVIDENCE: str = "setu-evidence"

    # Notifications
    SMTP_HOST: str = "localhost"
    SMTP_PORT: int = 1025
    SMTP_FROM: str = "alerts@seturaksha.gov.in"


settings = Settings()
