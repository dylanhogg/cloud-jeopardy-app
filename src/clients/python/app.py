import time
import typer
from typing import List
from pydantic import parse_obj_as
from loguru import logger
from rich.console import Console
from rich.table import Table
from entities.qna import Qna
from library import env, log, rand, rest


def rest_client_get_qnas():
    qnas_json = rest.get("get_qnas")
    return parse_obj_as(List[Qna], qnas_json)


def main(optional_arg: str = None) -> None:
    logger.info(f"Hello! optional_arg = {optional_arg}")
    logger.info(f"PYTHONPATH = {env.get('PYTHONPATH', 'Not set')}")
    logger.info(f"LOG_STDERR_LEVEL = {env.get('LOG_STDERR_LEVEL', 'Not set. Copy `.env_template` to `.env`')}")
    logger.info(f"LOG_FILE_LEVEL = {env.get('LOG_FILE_LEVEL', 'Not set. Copy `.env_template` to `.env`')}")

    qnas = rest_client_get_qnas()  # TODO: handle requests.exceptions.ConnectionError
    count = len(qnas)

    while True:
        # correct_qn_inx = len(qnas) - 1
        correct_qn_inx = rand.get_random(0, count)
        false_qn1_inx = rand.get_random(0, count, [correct_qn_inx])
        false_qn2_inx = rand.get_random(0, count, [correct_qn_inx, false_qn1_inx])

        # Jeopardy style
        correct_ans = qnas[correct_qn_inx].answer
        questions = [
            qnas[correct_qn_inx].question,
            qnas[false_qn1_inx].question,
            qnas[false_qn2_inx].question,
        ]

        # Traditional multi-choice style (also need to change headings etc)
        traditional = False
        if traditional:
            correct_ans = qnas[correct_qn_inx].question
            questions = [
                qnas[correct_qn_inx].answer,
                qnas[false_qn1_inx].answer,
                qnas[false_qn2_inx].answer,
            ]

        rnd_questions, correct_idx = rand.randomise_questions(questions)

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
        # TODO: include more info link?
        # TODO: Ascii text? https://www.patorjk.com/software/taag/

        if choice == correct_choice:
            print(f"  _________  ___  ___  _______________")
            print(f" / ___/ __ \/ _ \/ _ \/ __/ ___/_  __/")
            print(f"/ /__/ /_/ / , _/ , _/ _// /__  / /")
            print(f"\___/\____/_/|_/_/|_/___/\___/ /_/")
            # print(f"Correct. {correct_text}\n")
        elif choice.lower() == "q":
            print(f"  _________  ____  ___  _____  ______")
            print(f" / ___/ __ \/ __ \/ _ \/ _ ) \/ / __/")
            print(f"/ (_ / /_/ / /_/ / // / _  |\  / _/")
            print(f"\___/\____/\____/____/____/ /_/___/")
            print(f"\nGoodbye! {correct_text}\n")
            break
        else:
            print(f" _      _____  ____  _  _______")
            print(f"| | /| / / _ \/ __ \/ |/ / ___/")
            print(f"| |/ |/ / , _/ /_/ /    / (_ /")
            print(f"|__/|__/_/|_|\____/_/|_/\___/")
            print(f"\nWrong. {correct_text}\n")

        time.sleep(1)


if __name__ == "__main__":
    log.configure()
    typer.run(main)
    # main()
