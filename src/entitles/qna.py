from dataclasses import dataclass
from pydantic import BaseModel


class Qna(BaseModel):
    question: str
    answer: str
