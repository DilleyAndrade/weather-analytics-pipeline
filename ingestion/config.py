import os

from dotenv import load_dotenv


load_dotenv()


def get_postgres_db() -> str:
    return os.getenv("POSTGRES_DB", "weather_db")


def get_postgres_user() -> str:
    return os.getenv("POSTGRES_USER", "weather_user")


def get_postgres_password() -> str:
    return os.getenv("POSTGRES_PASSWORD", "weather_password")


def get_postgres_host() -> str:
    return os.getenv("POSTGRES_HOST", "localhost")


def get_postgres_port() -> str:
    return os.getenv("POSTGRES_PORT", "5432")


def get_open_meteo_base_url() -> str:
    return os.getenv(
        "OPEN_METEO_BASE_URL",
        "https://api.open-meteo.com/v1/forecast",
    )


def get_database_url() -> str:
    user = get_postgres_user()
    password = get_postgres_password()
    host = get_postgres_host()
    port = get_postgres_port()
    db_name = get_postgres_db()

    return f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db_name}"