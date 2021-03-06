import os
import json
import typer
from loguru import logger
from cloud_products.aws import AwsCrawler
from entities.qna import Qna


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


def save(obj, filename) -> None:
    with open(filename, "w") as f:
        f.write(str(obj))


def save_product_text(crawler, product, output_path):
    print(f"Saving {product.name} from {product.abs_href}...")
    product_text = crawler.get_product_text(product, use_cache=True)
    filename = os.path.join(output_path, f"{crawler.valid_filename(product.abs_href)}_content.txt")
    save(product_text, filename)


def save_faq_text(crawler, product, output_path):
    print(f"Saving {product.name} FAQ from {product.abs_href_faq}...")
    faq_text = crawler.get_faq_text(product, use_cache=True)
    filename = os.path.join(output_path, f"{crawler.valid_filename(product.abs_href_faq)}_faqs.txt")
    save(faq_text, filename)

    qnas = _parse_qnas(faq_text)
    qnas_json = [x.dict() for x in qnas]
    parsed_faq_text = json.dumps(qnas_json, indent=4)
    filename = os.path.join(output_path, f"{crawler.valid_filename(product.abs_href_faq)}_faqs.json")
    save(parsed_faq_text, filename)


def main():
    logger.info("Run full AWS Crawler and load to S3...")

    crawler = AwsCrawler()
    products = crawler.get_products()
    print(f"Found {len(products)} products.")

    output_path = "./data/scrape_results/"

    for product in products: #[0:3]:
        logger.debug(product.name)
        # if "bean" in product.std_name:
        save_product_text(crawler, product, output_path)
        save_faq_text(crawler, product, output_path)

    print(f"Finished.")


if __name__ == "__main__":
    # typer.run(main)
    main()
