import urllib.request
from entitles.qna import Qna
from loguru import logger
from typing import Optional
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}


@app.get("/get_qnas")
def get_qnas():
    url = "https://raw.githubusercontent.com/dylanhogg/cloud-products/master/sample_data/aws_products/"

    # filename = "aws.amazon.com_api-gateway_faqs__faqs.txt"
    # filename = "aws.amazon.com_elasticbeanstalk_faqs__faqs.txt"
    # filename = "aws.amazon.com_machine-learning_containers_faqs__faqs.txt"
    filename = "aws.amazon.com_ec2_faqs__faqs.txt"

    lines = urllib.request.urlopen(url + filename)
    lines = [line.decode('utf-8').strip() for line in lines]

    return _parse_qnas(lines)


def _parse_qnas(lines):
    qnas = []
    qn_line = ""
    ans_lines = []

    for line in lines:
        if line.startswith("Q:"):
            if len(qn_line) > 0 and len(ans_lines) > 0:
                # Append previous question and answer
                q = qn_line.replace("Q: ", "")
                a = "\n".join(ans_lines)
                qnas.append(Qna(question=q, answer=a))

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
        qnas.append(Qna(question=q, answer=a))

    return qnas

