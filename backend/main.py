from fastapi import FastAPI


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
    return {
        "status": "healthy"
    }