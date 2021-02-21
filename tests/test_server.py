import faq_server


def test1() -> None:
    qnas = faq_server.get_qnas()
    assert len(qnas) > 0
