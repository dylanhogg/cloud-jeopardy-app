import os
import json
import datetime
import typer
from loguru import logger
from library import parser
from cloud_products.aws import AwsCrawler


def save(obj, filename) -> None:
    with open(filename, "w") as f:
        f.write(str(obj))


def save_product_results(success_products, error_products, output_path):
    results = {
        "success": success_products,
        "error": error_products,
        "crawl_datetime": str(datetime.datetime.now())
    }
    filename = os.path.join(output_path, "_aws-products.json")
    save(json.dumps(results, indent=4), filename)


def save_product_text(crawler, product, output_path):
    product_text = crawler.get_product_text(product, use_cache=True)
    filename = os.path.join(output_path, f"{product.code}-product.txt")
    print(f"Saving {product.name} from {product.abs_href} to {filename}...")
    save(product_text, filename)


def save_faq_text(crawler, product, output_path):
    faq_text = crawler.get_faq_text(product, use_cache=True)
    filename = os.path.join(output_path, f"{product.code}-faq.txt")
    print(f"Saving {product.name} FAQ from {product.abs_href_faq} to {filename}...")
    save(faq_text, filename)

    qna_list = parser.parse_qnas(product, faq_text)
    qnas_json = qna_list.dict()
    parsed_faq_text = json.dumps(qnas_json, indent=4)
    filename = os.path.join(output_path, f"{product.code}-faq.json")
    data_error = len(qna_list.qnas) < 3
    if data_error:
        filename = filename.replace(".json", ".ERROR.json")
    save(parsed_faq_text, filename)

    return data_error


def main():
    logger.info("Run full AWS Crawler and load to S3...")

    crawler = AwsCrawler()
    products = crawler.get_products()
    print(f"Found {len(products)} products.")

    output_path = "./static_files/faqs/"

    success_products = []
    error_products = []

    for product in products: #[0:5]:
        logger.debug(product.name)
        # if "bean" in product.std_name:
        save_product_text(crawler, product, output_path)
        data_error = save_faq_text(crawler, product, output_path)
        if data_error:
            error_products.append(product.code)
        else:
            success_products.append(product.code)

    # output master file with all products
    save_product_results(success_products, error_products, output_path);

    print(f"Finished.")


if __name__ == "__main__":
    # typer.run(main)
    main()
