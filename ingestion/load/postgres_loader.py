import pandas as pd
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


def load_dim_date(weather_df: pd.DataFrame) -> None:
    engine = get_database_engine()

    date_df = weather_df[["date", "date_id"]].drop_duplicates().copy()
    date_df["date"] = pd.to_datetime(date_df["date"])

    date_df["year"] = date_df["date"].dt.year
    date_df["month"] = date_df["date"].dt.month
    date_df["day"] = date_df["date"].dt.day
    date_df["day_of_week"] = date_df["date"].dt.dayofweek + 1
    date_df["day_name"] = date_df["date"].dt.day_name()
    date_df["month_name"] = date_df["date"].dt.month_name()
    date_df["quarter"] = date_df["date"].dt.quarter

    records = date_df.to_dict(orient="records")

    query = text(
        """
        INSERT INTO dim_date (
            date_id,
            date,
            year,
            month,
            day,
            day_of_week,
            day_name,
            month_name,
            quarter
        )
        VALUES (
            :date_id,
            :date,
            :year,
            :month,
            :day,
            :day_of_week,
            :day_name,
            :month_name,
            :quarter
        )
        ON CONFLICT (date) DO NOTHING;
        """
    )

    with engine.begin() as connection:
        connection.execute(query, records)


def load_fact_weather_daily(weather_df: pd.DataFrame) -> None:
    engine = get_database_engine()

    records = weather_df.to_dict(orient="records")

    query = text(
        """
        INSERT INTO fact_weather_daily (
            location_id,
            date_id,
            temperature_max_celsius,
            temperature_min_celsius,
            temperature_mean_celsius,
            precipitation_sum_mm,
            wind_speed_max_kmh
        )
        VALUES (
            :location_id,
            :date_id,
            :temperature_max_celsius,
            :temperature_min_celsius,
            :temperature_mean_celsius,
            :precipitation_sum_mm,
            :wind_speed_max_kmh
        )
        ON CONFLICT (location_id, date_id)
        DO UPDATE SET
            temperature_max_celsius = EXCLUDED.temperature_max_celsius,
            temperature_min_celsius = EXCLUDED.temperature_min_celsius,
            temperature_mean_celsius = EXCLUDED.temperature_mean_celsius,
            precipitation_sum_mm = EXCLUDED.precipitation_sum_mm,
            wind_speed_max_kmh = EXCLUDED.wind_speed_max_kmh,
            updated_at = CURRENT_TIMESTAMP;
        """
    )

    with engine.begin() as connection:
        connection.execute(query, records)


def load_weather_data(weather_df: pd.DataFrame) -> None:
    load_dim_date(weather_df)
    load_fact_weather_daily(weather_df)
    