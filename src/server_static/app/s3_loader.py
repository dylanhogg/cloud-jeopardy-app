import os
import json
import typer
from loguru import logger
from library import parser
from cloud_products.aws import AwsCrawler


def save(obj, filename) -> None:
    with open(filename, "w") as f:
        f.write(str(obj))


def save_product_text(crawler, product, output_path):
    print(f"Saving {product.name} from {product.abs_href}...")
    product_text = crawler.get_product_text(product, use_cache=True)
    filename = os.path.join(output_path, f"{product.code}-product.txt")
    save(product_text, filename)


def save_faq_text(crawler, product, output_path):
    print(f"Saving {product.name} FAQ from {product.abs_href_faq}...")
    faq_text = crawler.get_faq_text(product, use_cache=True)
    filename = os.path.join(output_path, f"{product.code}-faq.txt")
    save(faq_text, filename)

    qnas = parser.parse_qnas(faq_text)
    qnas_json = [x.dict() for x in qnas]
    parsed_faq_text = json.dumps(qnas_json, indent=4)
    filename = os.path.join(output_path, f"{product.code}-faq.json")
    if len(qnas) < 3:
        filename = filename.replace(".json", ".ERROR.json")
    save(parsed_faq_text, filename)


def main():
    logger.info("Run full AWS Crawler and load to S3...")

    crawler = AwsCrawler()
    products = crawler.get_products()
    print(f"Found {len(products)} products.")

    output_path = "./static_files/faqs/"

    for product in products: #[0:5]:
        logger.debug(product.name)
        # if "bean" in product.std_name:
        save_product_text(crawler, product, output_path)
        save_faq_text(crawler, product, output_path)

    print(f"Finished.")


if __name__ == "__main__":
    # typer.run(main)
    main()
