import hashlib
import urllib.request
from qna import Qna, QnaList
from datetime import datetime
from loguru import logger
from typing import Optional
from fastapi import FastAPI
from dataclasses import dataclass

app = FastAPI()


# @app.get("/")
# def read_root():
#     return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}


@app.get("/health")
def get_qnas():
    return {"health": "ok"}


@app.get("/version")
def get_qnas():
    return {"version": "v0.0.4"}


@app.get("/get_qnas")
def get_qnas():

    @dataclass
    class Product:
        name: str
        code: str
        desc: str

    url = "https://raw.githubusercontent.com/dylanhogg/cloud-products/master/sample_data/aws_products/"

    # filename = "aws.amazon.com_api-gateway_faqs__faqs.txt"
    # filename = "aws.amazon.com_elasticbeanstalk_faqs__faqs.txt"
    # filename = "aws.amazon.com_machine-learning_containers_faqs__faqs.txt"
    filename = "aws.amazon.com_ec2_faqs__faqs.txt"

    lines = urllib.request.urlopen(url + filename)
    lines = [line.decode('utf-8').strip() for line in lines]

    product = Product(name="ec2", code="ec2", desc="ec2")
    return _parse_qnas(product, lines)


def _get_hash(q, a):
    return hashlib.md5(f"{q}_{a}".encode('utf-8')).hexdigest()


def _parse_qnas(product, lines):
    date = datetime.now().isoformat()
    qna_list = QnaList(product_code=product.code, product_name=product.name, product_desc=product.desc,
                       date=date, qnas_count=0, qnas=[])

    if lines is None:
        # WARNING:root:FAQ page did not exist for page (or alternatives):
        # https://aws.amazon.com/aws-cost-management/aws-budgets/faq/
        # TODO: review this
        return qna_list

    qn_line = ""
    ans_lines = []
    qnas = []

    for line in lines:
        if line.startswith("Q:"):
            if len(qn_line) > 0 and len(ans_lines) > 0:
                # Append previous question and answer
                q = qn_line.replace("Q: ", "")
                a = "\n".join(ans_lines)
                qnas.append(Qna(id=len(qnas), question=q, answer=a, hash=_get_hash(q, a)))

            # Start fresh question and answer
            qn_line = line
            ans_lines = []
        else:
            ans_lines.append(line)

    if len(ans_lines) > 0:
        q = qn_line.replace("Q: ", "")
        a = ans_lines[0]
        # NOTE: For last question, only first line of answer is included.
        #       It's difficult to know when last answer finishes and other guff starts.
        qnas.append(Qna(id=len(qnas), question=q, answer=a, hash=_get_hash(q, a)))

    qna_list.qnas_count = len(qnas)
    qna_list.qnas = qnas
    return qna_list

