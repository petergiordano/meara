#!/bin/bash
set -e

echo "===== Installing Python dependencies ====="
pip install -r requirements.txt

echo "===== Installing Playwright Firefox browser ====="
playwright install --with-deps firefox

echo "===== Build complete ====="
