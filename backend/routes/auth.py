import hashlib
import hmac

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import text

from backend.database import get_database_engine


router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    username: str
    name: str
    role: str


def hash_password(password: str, salt: str) -> str:
    return hashlib.sha256(f"{salt}:{password}".encode("utf-8")).hexdigest()


def ensure_dashboard_users_table() -> None:
    engine = get_database_engine()

    create_table_query = text(
        """
        CREATE TABLE IF NOT EXISTS dashboard_user (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR(80) NOT NULL UNIQUE,
            display_name VARCHAR(120) NOT NULL,
            role VARCHAR(40) NOT NULL DEFAULT 'user',
            password_salt VARCHAR(120) NOT NULL,
            password_hash CHAR(64) NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """
    )

    create_index_query = text(
        """
        CREATE INDEX IF NOT EXISTS idx_dashboard_user_username
            ON dashboard_user(username);
        """
    )

    seed_query = text(
        """
        INSERT INTO dashboard_user (
            username,
            display_name,
            role,
            password_salt,
            password_hash
        )
        VALUES
            (
                'admin',
                'Administrador',
                'admin',
                'weather-admin-salt',
                'f7c537a56a4a2efb3b1d1c1c896079f16cfc361dc81f38449f18b0ed50ba4095'
            ),
            (
                'usuario',
                'Usuário Normal',
                'user',
                'weather-user-salt',
                '8300700c4b38f8ce6e267dbe7b57b46deb78034d7b82eee9f6248279b76fdcd8'
            )
        ON CONFLICT (username) DO UPDATE SET
            display_name = EXCLUDED.display_name,
            role = EXCLUDED.role,
            password_salt = EXCLUDED.password_salt,
            password_hash = EXCLUDED.password_hash,
            is_active = TRUE,
            updated_at = CURRENT_TIMESTAMP;
        """
    )

    with engine.begin() as connection:
        connection.execute(create_table_query)
        connection.execute(create_index_query)
        connection.execute(seed_query)


@router.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest) -> LoginResponse:
    engine = get_database_engine()

    query = text(
        """
        SELECT
            username,
            display_name,
            role,
            password_salt,
            password_hash
        FROM dashboard_user
        WHERE username = :username
            AND is_active = TRUE;
        """
    )

    with engine.connect() as connection:
        result = connection.execute(
            query,
            {
                "username": credentials.username.strip(),
            },
        )
        user = result.mappings().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Login ou senha incorretos.",
        )

    candidate_hash = hash_password(
        credentials.password,
        user["password_salt"],
    )

    if not hmac.compare_digest(candidate_hash, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Login ou senha incorretos.",
        )

    return LoginResponse(
        username=user["username"],
        name=user["display_name"],
        role=user["role"],
    )
