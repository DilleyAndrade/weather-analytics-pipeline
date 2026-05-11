from ingestion.api.open_meteo_client import fetch_daily_weather
from ingestion.load.postgres_loader import get_locations, load_weather_data
from ingestion.transform.weather_transformer import transform_daily_weather_response


START_DATE = "2025-01-01"
END_DATE = "2025-01-07"


def main() -> None:
    locations_df = get_locations()

    total_rows_loaded = 0

    for _, location in locations_df.iterrows():
        print(f"Fetching weather data for {location['city']}...")

        weather_data = fetch_daily_weather(
            latitude=float(location["latitude"]),
            longitude=float(location["longitude"]),
            start_date=START_DATE,
            end_date=END_DATE,
            timezone=location["timezone"],
        )

        weather_df = transform_daily_weather_response(
            weather_data=weather_data,
            location_id=int(location["location_id"]),
        )

        load_weather_data(weather_df)

        rows_loaded = len(weather_df)
        total_rows_loaded += rows_loaded

        print(f"Loaded {rows_loaded} rows for {location['city']}.")

    print("Weather pipeline finished successfully.")
    print(f"Total rows loaded: {total_rows_loaded}")


if __name__ == "__main__":
    main()
    