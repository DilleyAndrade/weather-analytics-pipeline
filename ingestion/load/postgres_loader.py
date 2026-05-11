from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine

from ingestion.config import get_database_url


def get_database_engine() -> Engine:
    database_url = get_database_url()
    return create_engine(database_url)


def test_database_connection() -> bool:
    engine = get_database_engine()

    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return result.scalar() == 1