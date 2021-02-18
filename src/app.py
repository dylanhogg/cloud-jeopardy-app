import typer
import random
import time
from loguru import logger
from library import env, log
from rich.console import Console
from rich.table import Table
from engine import faq


def randomise_questions(qns, correct_idx=0):
    rnd_qns = list(qns)
    random.shuffle(rnd_qns)
    new_correct_idx = rnd_qns.index(qns[correct_idx])
    return rnd_qns, new_correct_idx


def main(required_arg: str, optional_arg: str = None) -> None:
    logger.info(f"Hello! required_arg = {required_arg}, optional_arg = {optional_arg}")
    logger.info(f"PYTHONPATH = {env.get('PYTHONPATH', 'Not set')}")
    logger.info(f"LOG_STDERR_LEVEL = {env.get('LOG_STDERR_LEVEL', 'Not set. Copy `.env_template` to `.env`')}")
    logger.info(f"LOG_FILE_LEVEL = {env.get('LOG_FILE_LEVEL', 'Not set. Copy `.env_template` to `.env`')}")

    qnas = faq.get_qnas()
    count = len(qnas)

    while True:
        correct_qn_inx = random.randrange(0, count)
        false_qn1_inx = random.randrange(0, count)
        false_qn2_inx = random.randrange(0, count)

        correct_ans = qnas[correct_qn_inx].answer

        questions = [
            qnas[correct_qn_inx].question,
            qnas[false_qn1_inx].question,
            qnas[false_qn2_inx].question,
        ]

        rnd_questions, correct_idx = randomise_questions(questions)

        debug = False
        if debug:
            # for qna in qnas:
            #     print(qna)
            print(f"\nAnswer: {correct_ans}\n")
            print(f"Correct Qn: {questions[0]}")
            print(f"False Qn 1: {questions[1]}")
            print(f"False Qn 2: {questions[2]}\n")
            print(f"Old correct index: 0; New correct index: {correct_idx}")

        # https://rich.readthedocs.io/en/latest/_modules/rich/color.html
        table = Table(show_header=True, header_style="bold steel_blue3", row_styles=["steel_blue3"])
        table.add_column("Answer", width=60)
        table.add_column("What was the question?", width=60)
        table.add_row(
            correct_ans, f"1) {rnd_questions[0]}\n\n2) {rnd_questions[1]}\n\n3) {rnd_questions[2]}"
        )
        console = Console()
        console.print(table)

        correct_choice = str(correct_idx+1)
        choice = input("What is the question? 1, 2 or 3?  ").strip()
        correct_text = f"The question was: {correct_choice}) {questions[0]}"

        if choice == correct_choice:
            print(f"\nCorrect! {correct_text}\n")
        elif choice.lower() == "q":
            print(f"\nBye! {correct_text}\n")
            break
        else:
            print(f"\nWrong :( {correct_text}\n")

        time.sleep(1)


if __name__ == "__main__":
    log.configure()
    typer.run(main)
