import argparse

from ingestion.api.open_meteo_client import fetch_daily_weather
from ingestion.load.postgres_loader import get_locations, load_weather_data
from ingestion.transform.weather_transformer import transform_daily_weather_response


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run weather data ingestion pipeline."
    )

    parser.add_argument(
        "--start-date",
        required=True,
        help="Start date for weather data extraction in YYYY-MM-DD format.",
    )

    parser.add_argument(
        "--end-date",
        required=True,
        help="End date for weather data extraction in YYYY-MM-DD format.",
    )

    return parser.parse_args()


def run_pipeline(start_date: str, end_date: str) -> None:
    locations_df = get_locations()

    total_rows_loaded = 0

    for _, location in locations_df.iterrows():
        print(f"Fetching weather data for {location['city']}...")

        weather_data = fetch_daily_weather(
            latitude=float(location["latitude"]),
            longitude=float(location["longitude"]),
            start_date=start_date,
            end_date=end_date,
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


def main() -> None:
    args = parse_arguments()

    run_pipeline(
        start_date=args.start_date,
        end_date=args.end_date,
    )


if __name__ == "__main__":
    main()
    