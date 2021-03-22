from pydantic import BaseModel
from typing import List


class Qna(BaseModel):
    id: int
    question: str
    answer: str
    hash: str


class QnaList(BaseModel):
    product_code: str
    product_name: str
    product_desc: str
    product_href: str
    date: str
    qnas_count: int
    qnas: List[Qna]
