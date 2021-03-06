from entities.qna import Qna


def parse_qnas(lines):
    qnas = []

    if lines is None:
        # WARNING:root:FAQ page did not exist for page (or alternatives):
        # https://aws.amazon.com/aws-cost-management/aws-budgets/faq/
        # TODO: review this
        return qnas

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
