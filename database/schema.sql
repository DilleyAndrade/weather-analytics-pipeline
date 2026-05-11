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


CREATE OR REPLACE VIEW vw_weather_daily AS
SELECT
    f.weather_daily_id,
    l.location_id,
    l.city,
    l.state,
    l.country,
    l.latitude,
    l.longitude,
    d.date,
    d.year,
    d.month,
    d.day,
    d.day_of_week,
    d.day_name,
    d.month_name,
    d.quarter,
    f.temperature_max_celsius,
    f.temperature_min_celsius,
    f.temperature_mean_celsius,
    f.precipitation_sum_mm,
    f.wind_speed_max_kmh,
    f.source,
    f.created_at,
    f.updated_at
FROM fact_weather_daily f
JOIN dim_location l
    ON f.location_id = l.location_id
JOIN dim_date d
    ON f.date_id = d.date_id;


CREATE OR REPLACE VIEW vw_weather_summary_by_location AS
SELECT
    l.location_id,
    l.city,
    l.state,
    l.country,
    COUNT(*) AS total_days,
    MIN(d.date) AS start_date,
    MAX(d.date) AS end_date,
    ROUND(AVG(f.temperature_mean_celsius), 2) AS avg_temperature_mean_celsius,
    ROUND(AVG(f.temperature_max_celsius), 2) AS avg_temperature_max_celsius,
    ROUND(AVG(f.temperature_min_celsius), 2) AS avg_temperature_min_celsius,
    ROUND(SUM(f.precipitation_sum_mm), 2) AS total_precipitation_mm,
    ROUND(AVG(f.wind_speed_max_kmh), 2) AS avg_wind_speed_max_kmh
FROM fact_weather_daily f
JOIN dim_location l
    ON f.location_id = l.location_id
JOIN dim_date d
    ON f.date_id = d.date_id
GROUP BY
    l.location_id,
    l.city,
    l.state,
    l.country;


CREATE OR REPLACE VIEW vw_weather_comparison_by_period AS
SELECT
    l.location_id,
    l.city,
    l.state,
    d.year,
    d.month,
    d.month_name,
    COUNT(*) AS total_days,
    ROUND(AVG(f.temperature_mean_celsius), 2) AS avg_temperature_mean_celsius,
    ROUND(MAX(f.temperature_max_celsius), 2) AS max_temperature_celsius,
    ROUND(MIN(f.temperature_min_celsius), 2) AS min_temperature_celsius,
    ROUND(SUM(f.precipitation_sum_mm), 2) AS total_precipitation_mm,
    ROUND(AVG(f.wind_speed_max_kmh), 2) AS avg_wind_speed_max_kmh
FROM fact_weather_daily f
JOIN dim_location l
    ON f.location_id = l.location_id
JOIN dim_date d
    ON f.date_id = d.date_id
GROUP BY
    l.location_id,
    l.city,
    l.state,
    d.year,
    d.month,
    d.month_name;
