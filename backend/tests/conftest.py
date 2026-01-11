import sqlite3
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from database import Base, get_db
from auth_utils import create_access_token

# -------------------- SQLITE TEST DB --------------------

TEST_RESULTS_DB = "tests/test_results.db"

def init_test_results_db():
    conn = sqlite3.connect(TEST_RESULTS_DB)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS test_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            test_name TEXT,
            endpoint TEXT,
            method TEXT,
            expected_status INTEGER,
            actual_status INTEGER,
            result TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_test_results_db()

# -------------------- API CLIENT FIXTURE --------------------

@pytest.fixture
def client():
    return TestClient(app)

# -------------------- RESULT LOGGER FIXTURE --------------------

@pytest.fixture
def log_result():
    def _log(db, test_name, endpoint, method, expected, actual):
        result = "PASS" if expected == actual else "FAIL"
        db.execute(
            """
            INSERT INTO test_results
            (test_name, endpoint, method, expected_status, actual_status, result)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (test_name, endpoint, method, expected, actual, result)
        )
        db.commit()
    return _log

# -------------------- SQLITE CONNECTION FIXTURE --------------------

@pytest.fixture
def db():
    conn = sqlite3.connect(TEST_RESULTS_DB)
    yield conn
    conn.close()

# -------------------- AUTH TOKEN FIXTURES --------------------

@pytest.fixture
def user_token():
    return create_access_token({"sub": "user"})

@pytest.fixture
def admin_token():
    return create_access_token({"sub": "admin"})
