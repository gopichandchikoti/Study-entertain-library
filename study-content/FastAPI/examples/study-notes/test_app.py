from fastapi.testclient import TestClient
from app import create_app

def test_crud_validation_ownership_and_openapi():
    with TestClient(create_app()) as client:
        headers = {"x-demo-user": "student-a"}
        value = {"title": " APIs ", "body": "Study HTTP", "topic": "api"}
        assert client.get("/health").status_code == 200
        assert client.get("/notes").status_code == 401
        assert client.get("/docs").status_code == 200
        assert client.get("/openapi.json").status_code == 200
        created = client.post("/notes", headers=headers, json=value)
        assert created.status_code == 201
        note = created.json()
        assert note["title"] == "APIs"
        assert "owner" not in note
        assert client.get(f"/notes/{note['id']}", headers={"x-demo-user": "student-b"}).status_code == 404
        assert client.post("/notes", headers=headers, json={**value, "title": " "}).status_code == 422
        assert client.post("/notes", headers=headers, json={**value, "title": "x" * 121}).status_code == 422
        assert client.get("/notes?limit=101", headers=headers).status_code == 422
        assert client.put(f"/notes/{note['id']}", headers=headers, json={**value, "title": "REST"}).json()["title"] == "REST"
        assert client.patch(f"/notes/{note['id']}/completion", headers=headers, json={"completed": True}).json()["completed"] is True
        assert client.delete(f"/notes/{note['id']}", headers=headers).status_code == 204
        assert client.get(f"/notes/{note['id']}", headers=headers).status_code == 404
