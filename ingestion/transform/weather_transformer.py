import pandas as pd


REQUIRED_DAILY_FIELDS = [
    "time",
    "temperature_2m_max",
    "temperature_2m_min",
    "temperature_2m_mean",
    "precipitation_sum",
    "wind_speed_10m_max",
]


def validate_daily_weather_data(daily_data: dict) -> None:
    if not daily_data:
        raise ValueError("Weather response does not contain daily data.")

    missing_fields = [
        field for field in REQUIRED_DAILY_FIELDS if field not in daily_data
    ]

    if missing_fields:
        raise ValueError(
            f"Weather response is missing required daily fields: {missing_fields}"
        )

    field_lengths = {
        field: len(daily_data[field]) for field in REQUIRED_DAILY_FIELDS
    }

    unique_lengths = set(field_lengths.values())

    if len(unique_lengths) != 1:
        raise ValueError(
            f"Weather daily fields have inconsistent lengths: {field_lengths}"
        )


def transform_daily_weather_response(
    weather_data: dict,
    location_id: int,
) -> pd.DataFrame:
    daily_data = weather_data.get("daily", {})

    validate_daily_weather_data(daily_data)

    dates = daily_data["time"]
    temperature_max = daily_data["temperature_2m_max"]
    temperature_min = daily_data["temperature_2m_min"]
    temperature_mean = daily_data["temperature_2m_mean"]
    precipitation_sum = daily_data["precipitation_sum"]
    wind_speed_max = daily_data["wind_speed_10m_max"]

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
