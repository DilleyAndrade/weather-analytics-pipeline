import requests

from ingestion.config import get_open_meteo_base_url


def fetch_daily_weather(
    latitude: float,
    longitude: float,
    start_date: str,
    end_date: str,
    timezone: str,
) -> dict:
    url = get_open_meteo_base_url()

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": start_date,
        "end_date": end_date,
        "daily": ",".join(
            [
                "temperature_2m_max",
                "temperature_2m_min",
                "temperature_2m_mean",
                "precipitation_sum",
                "wind_speed_10m_max",
            ]
        ),
        "timezone": timezone,
    }

    response = requests.get(url, params=params, timeout=30)

    if not response.ok:
        raise requests.HTTPError(
            f"Open-Meteo API request failed. "
            f"Status code: {response.status_code}. "
            f"Response: {response.text}",
            response=response,
        )

    return response.json()