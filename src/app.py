import typer
import random
from tqdm import tqdm
from time import sleep
from loguru import logger
from library import env, log
from rich.console import Console
from rich.table import Table

from engine import faq


def main(required_arg: str, optional_arg: str = None) -> None:
    logger.info(f"Hello! required_arg = {required_arg}, optional_arg = {optional_arg}")
    logger.info(f"PYTHONPATH = {env.get('PYTHONPATH', 'Not set')}")
    logger.info(f"LOG_STDERR_LEVEL = {env.get('LOG_STDERR_LEVEL', 'Not set. Copy `.env_template` to `.env`')}")
    logger.info(f"LOG_FILE_LEVEL = {env.get('LOG_FILE_LEVEL', 'Not set. Copy `.env_template` to `.env`')}")

    # for i in tqdm(range(5)):
    #     sleep(0.1)

    qnas = faq.get_data()
    # for qna in qnas:
    #     logger.info(qna)

    count = len(qnas)
    correct_inx = random.randrange(0, count)
    false1_inx = random.randrange(0, count)
    false2_inx = random.randrange(0, count)

    correct_ans = qnas[correct_inx][1][0]

    correct_qn = qnas[correct_inx][0]
    false1_qn = qnas[false1_inx][0]
    false2_qn = qnas[false2_inx][0]

    print("Answer:")
    print(correct_ans)

    print("Question 1:")
    print(false1_qn)

    print("Question 2:")
    print(false2_qn)

    print("Question 3:")
    print(correct_qn)

    # table = Table(show_header=True, header_style="bold blue")
    # table.add_column("Date", style="dim", width=12)
    # table.add_column("Title")
    # table.add_column("Production Budget", justify="right")
    # table.add_column("Box Office", justify="right")
    # table.add_row(
    #     "Dev 20, 2019", "Star Wars: The Rise of Skywalker", "$275,000,000", "$375,126,118"
    # )
    # table.add_row(
    #     "May 25, 2018",
    #     "[red]Solo[/red]: A Star Wars Story",
    #     "$275,000,000",
    #     "$393,151,347",
    # )
    # table.add_row(
    #     "Dec 15, 2017",
    #     "Star Wars Ep. VIII: The Last Jedi",
    #     "$262,000,000",
    #     "[bold]$1,332,539,889[/bold]",
    # )
    #
    # console = Console()
    # console.print(table)


if __name__ == "__main__":
    # log.configure()
    typer.run(main)
