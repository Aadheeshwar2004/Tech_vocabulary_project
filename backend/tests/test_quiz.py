def test_random_quiz(client, db, user_token, log_result):
    response = client.get(
        "/api/quiz/random",
        headers={"Authorization": f"Bearer {user_token}"}
    )

    log_result(db, "test_random_quiz", "/api/quiz/random", "GET", 200, response.status_code)
    assert response.status_code == 200
