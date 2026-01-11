def test_get_terms(client, db, user_token, log_result):
    response = client.get(
        "/api/terms",
        headers={"Authorization": f"Bearer {user_token}"}
    )

    log_result(db, "test_get_terms", "/api/terms", "GET", 200, response.status_code)
    assert response.status_code == 200


def test_stats(client, db, user_token, log_result):
    response = client.get(
        "/api/stats",
        headers={"Authorization": f"Bearer {user_token}"}
    )

    log_result(db, "test_stats", "/api/stats", "GET", 200, response.status_code)
    assert response.status_code == 200
