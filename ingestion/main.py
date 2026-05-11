from ingestion.api.open_meteo_client import fetch_daily_weather


def main() -> None:
    weather_data = fetch_daily_weather(
        latitude=-8.047600,
        longitude=-34.877000,
        start_date="2025-01-01",
        end_date="2025-01-07",
        timezone="America/Recife",
    )

    daily_data = weather_data.get("daily", {})

    print("Weather data fetched successfully.")
    print("Dates:", daily_data.get("time"))
    print("Max temperatures:", daily_data.get("temperature_2m_max"))
    print("Min temperatures:", daily_data.get("temperature_2m_min"))
    print("Mean temperatures:", daily_data.get("temperature_2m_mean"))
    print("Precipitation:", daily_data.get("precipitation_sum"))
    print("Max wind speed:", daily_data.get("wind_speed_10m_max"))


if __name__ == "__main__":
    main()