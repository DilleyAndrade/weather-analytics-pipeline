CREATE TABLE IF NOT EXISTS dim_location (
    location_id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'Brazil',
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    timezone VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_dim_location_city_state_country UNIQUE (city, state, country)
);

CREATE TABLE IF NOT EXISTS dim_date (
    date_id INTEGER PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL,
    day_name VARCHAR(20) NOT NULL,
    month_name VARCHAR(20) NOT NULL,
    quarter INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fact_weather_daily (
    weather_daily_id BIGSERIAL PRIMARY KEY,
    location_id INTEGER NOT NULL,
    date_id INTEGER NOT NULL,

    temperature_max_celsius NUMERIC(6, 2),
    temperature_min_celsius NUMERIC(6, 2),
    temperature_mean_celsius NUMERIC(6, 2),
    precipitation_sum_mm NUMERIC(8, 2),
    wind_speed_max_kmh NUMERIC(8, 2),

    source VARCHAR(100) NOT NULL DEFAULT 'Open-Meteo',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_fact_weather_daily_location
        FOREIGN KEY (location_id)
        REFERENCES dim_location(location_id),

    CONSTRAINT fk_fact_weather_daily_date
        FOREIGN KEY (date_id)
        REFERENCES dim_date(date_id),

    CONSTRAINT uq_fact_weather_daily_location_date
        UNIQUE (location_id, date_id)
);

CREATE INDEX IF NOT EXISTS idx_fact_weather_daily_location_id
    ON fact_weather_daily(location_id);

CREATE INDEX IF NOT EXISTS idx_fact_weather_daily_date_id
    ON fact_weather_daily(date_id);

CREATE INDEX IF NOT EXISTS idx_dim_date_date
    ON dim_date(date);