import app
from engine import faq


def test1() -> None:
    qnas = faq.get_qnas()
    assert len(qnas) > 0
