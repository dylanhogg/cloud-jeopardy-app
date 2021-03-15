from fastapi.testclient import TestClient
from faq_server import app

client = TestClient(app)

# https://fastapi.tiangolo.com/tutorial/testing/


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"health": "ok"}


def test_get_qnas():
    response = client.get("/get_qnas")
    assert response.status_code == 200
    # assert response.json() == {"health": "ok"}

    # TODO: convert json to list?


# import faq_server
#
#
# def test1() -> None:
#     qnas = faq_server.get_qnas()
#     assert len(qnas) > 0
