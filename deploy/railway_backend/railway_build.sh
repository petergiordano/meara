#!/bin/bash
set -e

echo "===== Installing Python dependencies ====="
python3 -m pip install -r requirements.txt

echo "===== Installing Playwright Firefox browser ====="
python3 -m playwright install --with-deps firefox

echo "===== Build complete ====="
