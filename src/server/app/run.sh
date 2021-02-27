#!/bin/sh
set -e

uvicorn faq_server:app --workers 1 --host 0.0.0.0 --port 80