import random


def randomise_questions(qns, correct_idx=0):
    rnd_qns = list(qns)
    random.shuffle(rnd_qns)
    new_correct_idx = rnd_qns.index(qns[correct_idx])
    return rnd_qns, new_correct_idx


def get_random(start, stop=None, exclude=[]):
    while True:
        rnd = random.randrange(start, stop)
        if len(exclude) == 0 or rnd not in exclude:
            break
    return rnd