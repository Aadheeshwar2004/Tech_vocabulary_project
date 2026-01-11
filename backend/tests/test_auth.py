def test_register_user(client, db, log_result):
    response = client.post(
        "/api/auth/register",
        json={
            "username": "testuser123",
            "email": "test123@test.com",
            "password": "test123"
        }
    )

    log_result(db, "test_register_user", "/api/auth/register", "POST", 200, response.status_code)
    assert response.status_code == 200


def test_login_user(client, db, log_result):
    response = client.post(
        "/api/auth/login",
        data={"username": "testuser123", "password": "test123"}
    )

    log_result(db, "test_login_user", "/api/auth/login", "POST", 200, response.status_code)
    assert response.status_code == 200
