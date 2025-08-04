from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import computed_field, PostgresDsn

class Settings(BaseSettings):

    # settings for db
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    SECRET_KEY:str
    ALGORITHM:str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    remaining_annual_leave_days: int = 12

    @computed_field
    @property
    def SYNC_SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return PostgresDsn.build(
            scheme="postgresql+psycopg2",
            username=self.DB_USER,
            password=self.DB_PASSWORD,
            host=self.DB_HOST,
            port=self.DB_PORT,
            path=self.DB_NAME,
        )

    @computed_field
    @property
    def ASYNC_SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=self.DB_USER,
            password=self.DB_PASSWORD,
            host=self.DB_HOST,
            port=self.DB_PORT,
            path=self.DB_NAME,
        )

    model_config = SettingsConfigDict(
            env_file=".env",
            env_ignore_empty=True,
            extra="ignore"
        )


settings = Settings()