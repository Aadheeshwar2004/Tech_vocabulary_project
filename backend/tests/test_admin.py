def test_create_term(client, db, admin_token, log_result):
    response = client.post(
        "/api/admin/terms",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "term": "PyTest",
            "definition": "Testing framework",
            "example": "pytest test_app.py",
            "real_world": "Used in CI pipelines",
            "difficulty": "easy"
        }
    )

    log_result(db, "test_create_term", "/api/admin/terms", "POST", 200, response.status_code)
    assert response.status_code == 200
