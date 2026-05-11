import requests

from ingestion.config import get_open_meteo_base_url
from ingestion.utils.logger import get_logger


logger = get_logger(__name__)


def build_daily_weather_params(
    latitude: float,
    longitude: float,
    start_date: str,
    end_date: str,
    timezone: str,
) -> dict:
    return {
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


def fetch_daily_weather(
    latitude: float,
    longitude: float,
    start_date: str,
    end_date: str,
    timezone: str,
) -> dict:
    url = get_open_meteo_base_url()

    params = build_daily_weather_params(
        latitude=latitude,
        longitude=longitude,
        start_date=start_date,
        end_date=end_date,
        timezone=timezone,
    )

    logger.info(
        "Requesting Open-Meteo data. latitude=%s longitude=%s start_date=%s end_date=%s",
        latitude,
        longitude,
        start_date,
        end_date,
    )

    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
    except requests.RequestException as error:
        logger.exception("Open-Meteo API request failed.")
        raise RuntimeError(
            f"Failed to fetch weather data from Open-Meteo. "
            f"URL: {url}. Parameters: {params}."
        ) from error

    return response.json()
