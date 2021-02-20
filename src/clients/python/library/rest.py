import requests
from urllib.parse import urljoin
from library import env


def get(path):
    base = env.get("BASE_REST_SERVER", "http://127.0.0.1:8000/")
    url = urljoin(base, path)
    return requests.get(url).json()