import urllib.request
from loguru import logger


def get_data():
    url = "https://raw.githubusercontent.com/dylanhogg/cloud-products/master/sample_data/aws_products/"
    filename = "aws.amazon.com_api-gateway_faqs__faqs.txt"
    #filename = "aws.amazon.com_elasticbeanstalk_faqs__faqs.txt"
    lines = urllib.request.urlopen(url + filename)

    qna = []
    qn = ""
    ans = []
    for binline in lines:
        # logger.info(line)
        line = binline.decode('utf-8').strip()
        if line.startswith("Q:"):
            if ans != "" and len(ans) > 0:
                qna.append((qn, ans))  # TODO: bugs around this that can have empty qn.
            qn = line
            ans = []
        else:
            ans.append(line)

    return qna
