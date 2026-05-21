from datetime import date

from pydantic import BaseModel, Field


class LocationResponse(BaseModel):
    """Schema for location data"""
    location_id: int
    city: str
    state: str
    country: str
    latitude: float
    longitude: float
    timezone: str

    model_config = {"from_attributes": True}


class DailyWeatherResponse(BaseModel):
    """Schema for daily weather data"""
    weather_daily_id: int
    location_id: int
    city: str
    state: str
    country: str
    date: date
    temperature_max_celsius: float | None = Field(None, description="Maximum temperature in Celsius")
    temperature_min_celsius: float | None = Field(None, description="Minimum temperature in Celsius")
    temperature_mean_celsius: float | None = Field(None, description="Mean temperature in Celsius")
    precipitation_sum_mm: float | None = Field(None, description="Total precipitation in millimeters")
    wind_speed_max_kmh: float | None = Field(None, description="Maximum wind speed in km/h")

    model_config = {"from_attributes": True}


class WeatherSummaryResponse(BaseModel):
    """Schema for weather summary by location"""
    location_id: int
    city: str
    state: str
    country: str
    total_days: int
    start_date: date
    end_date: date
    avg_temperature_mean_celsius: float | None = Field(None, description="Average mean temperature")
    avg_temperature_max_celsius: float | None = Field(None, description="Average maximum temperature")
    avg_temperature_min_celsius: float | None = Field(None, description="Average minimum temperature")
    total_precipitation_mm: float | None = Field(None, description="Total precipitation")
    avg_wind_speed_max_kmh: float | None = Field(None, description="Average maximum wind speed")

    model_config = {"from_attributes": True}


class WeatherComparisonResponse(BaseModel):
    """Schema for weather comparison data"""
    location_id: int
    city: str
    state: str
    country: str
    year: int
    month: int
    avg_temperature_mean_celsius: float | None = Field(None, description="Average mean temperature")
    avg_temperature_max_celsius: float | None = Field(None, description="Average maximum temperature")
    avg_temperature_min_celsius: float | None = Field(None, description="Average minimum temperature")
    total_precipitation_mm: float | None = Field(None, description="Total precipitation")
    avg_wind_speed_max_kmh: float | None = Field(None, description="Average maximum wind speed")

    model_config = {"from_attributes": True}
