import pandas as pd


def transform_daily_weather_response(weather_data: dict, location_id: int) -> pd.DataFrame:
    daily_data = weather_data.get("daily", {})

    dates = daily_data.get("time", [])
    temperature_max = daily_data.get("temperature_2m_max", [])
    temperature_min = daily_data.get("temperature_2m_min", [])
    temperature_mean = daily_data.get("temperature_2m_mean", [])
    precipitation_sum = daily_data.get("precipitation_sum", [])
    wind_speed_max = daily_data.get("wind_speed_10m_max", [])

    records = []

    for index, date in enumerate(dates):
        records.append(
            {
                "location_id": location_id,
                "date": date,
                "date_id": int(date.replace("-", "")),
                "temperature_max_celsius": temperature_max[index],
                "temperature_min_celsius": temperature_min[index],
                "temperature_mean_celsius": temperature_mean[index],
                "precipitation_sum_mm": precipitation_sum[index],
                "wind_speed_max_kmh": wind_speed_max[index],
            }
        )

    return pd.DataFrame(records)
