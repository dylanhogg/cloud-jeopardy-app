import hashlib
from datetime import datetime
from entities.qna import QnaList, Qna


def get_hash(q, a):
    return hashlib.md5(f"{q}_{a}".encode('utf-8')).hexdigest()


def parse_qnas(product, lines):
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
                qnas.append(Qna(id=len(qnas), question=q, answer=a, hash=get_hash(q, a)))

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
        qnas.append(Qna(id=len(qnas), question=q, answer=a, hash=get_hash(q, a)))

    qna_list.qnas_count = len(qnas)
    qna_list.qnas = qnas
    return qna_list
