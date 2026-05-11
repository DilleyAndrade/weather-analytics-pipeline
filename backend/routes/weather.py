from fastapi import APIRouter, Query
from sqlalchemy import text

from backend.database import get_database_engine


router = APIRouter(
    prefix="/weather",
    tags=["weather"],
)


@router.get("/locations")
def get_locations() -> list[dict]:
    engine = get_database_engine()

    query = text(
        """
        SELECT
            location_id,
            city,
            state,
            country,
            latitude,
            longitude,
            timezone
        FROM dim_location
        ORDER BY city;
        """
    )

    with engine.connect() as connection:
        result = connection.execute(query)
        return [dict(row._mapping) for row in result]


@router.get("/daily")
def get_daily_weather(
    location_id: int | None = Query(default=None),
    start_date: str | None = Query(default=None),
    end_date: str | None = Query(default=None),
) -> list[dict]:
    engine = get_database_engine()

    conditions = []
    params = {}

    if location_id is not None:
        conditions.append("location_id = :location_id")
        params["location_id"] = location_id

    if start_date is not None:
        conditions.append("date >= :start_date")
        params["start_date"] = start_date

    if end_date is not None:
        conditions.append("date <= :end_date")
        params["end_date"] = end_date

    where_clause = ""
    if conditions:
        where_clause = "WHERE " + " AND ".join(conditions)

    query = text(
        f"""
        SELECT
            weather_daily_id,
            location_id,
            city,
            state,
            country,
            date,
            temperature_max_celsius,
            temperature_min_celsius,
            temperature_mean_celsius,
            precipitation_sum_mm,
            wind_speed_max_kmh
        FROM vw_weather_daily
        {where_clause}
        ORDER BY date, city;
        """
    )

    with engine.connect() as connection:
        result = connection.execute(query, params)
        return [dict(row._mapping) for row in result]


@router.get("/summary")
def get_weather_summary() -> list[dict]:
    engine = get_database_engine()

    query = text(
        """
        SELECT
            location_id,
            city,
            state,
            country,
            total_days,
            start_date,
            end_date,
            avg_temperature_mean_celsius,
            avg_temperature_max_celsius,
            avg_temperature_min_celsius,
            total_precipitation_mm,
            avg_wind_speed_max_kmh
        FROM vw_weather_summary_by_location
        ORDER BY city;
        """
    )

    with engine.connect() as connection:
        result = connection.execute(query)
        return [dict(row._mapping) for row in result]
