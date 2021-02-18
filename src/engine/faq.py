import urllib.request
from entitles.qna import Qna
from loguru import logger


def get_qnas():
    url = "https://raw.githubusercontent.com/dylanhogg/cloud-products/master/sample_data/aws_products/"

    #filename = "aws.amazon.com_api-gateway_faqs__faqs.txt"
    #filename = "aws.amazon.com_elasticbeanstalk_faqs__faqs.txt"
    filename = "aws.amazon.com_machine-learning_containers_faqs__faqs.txt"

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
                qnas.append(Qna(q, a))

            # Start fresh question and answer
            qn_line = line
            ans_lines = []
        else:
            ans_lines.append(line)

    # TODO: how to find when the last answer finishes? Remove last one?

    return qnas
