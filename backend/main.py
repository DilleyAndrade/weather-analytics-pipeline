from fastapi import FastAPI

from backend.database import test_database_connection


app = FastAPI(
    title="Weather Analytics API",
    description="API for querying weather analytics data.",
    version="0.1.0",
)


@app.get("/")
def root() -> dict:
    return {
        "message": "Weather Analytics API is running."
    }


@app.get("/health")
def health_check() -> dict:
    database_connected = test_database_connection()

    return {
        "status": "healthy",
        "database_connected": database_connected,
    }
