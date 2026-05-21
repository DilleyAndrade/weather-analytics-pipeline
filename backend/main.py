from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import test_database_connection
from backend.routes.auth import ensure_dashboard_users_table
from backend.routes.auth import router as auth_router
from backend.routes.weather import router as weather_router


app = FastAPI(
    title="Weather Analytics API",
    description="API for querying weather analytics data.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather_router)
app.include_router(auth_router)


@app.on_event("startup")
def startup() -> None:
    ensure_dashboard_users_table()


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
