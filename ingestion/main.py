from ingestion.api.open_meteo_client import fetch_daily_weather
from ingestion.load.postgres_loader import load_weather_data
from ingestion.transform.weather_transformer import transform_daily_weather_response


def main() -> None:
    location_id = 1

    weather_data = fetch_daily_weather(
        latitude=-8.047600,
        longitude=-34.877000,
        start_date="2025-01-01",
        end_date="2025-01-07",
        timezone="America/Recife",
    )

    weather_df = transform_daily_weather_response(
        weather_data=weather_data,
        location_id=location_id,
    )

    load_weather_data(weather_df)

    print("Weather data loaded successfully.")
    print(f"Rows loaded: {len(weather_df)}")


if __name__ == "__main__":
    main()
