from ingestion.load.postgres_loader import test_database_connection


def main() -> None:
    is_connected = test_database_connection()

    if is_connected:
        print("Database connection successful.")
    else:
        print("Database connection failed.")


if __name__ == "__main__":
    main()