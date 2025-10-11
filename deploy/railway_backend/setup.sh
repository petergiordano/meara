#!/bin/bash

# Setup script for Railway Backend local testing
# This script prepares the backend for local development

set -e  # Exit on error

echo "🚀 Setting up Railway Backend for DeepStack Analysis..."
echo ""

# Check if we're in the right directory
if [ ! -f "main.py" ]; then
    echo "❌ Error: Please run this script from the railway_backend directory"
    exit 1
fi

# Step 1: Create virtual environment
echo "1️⃣  Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "   ✅ Virtual environment created"
else
    echo "   ℹ️  Virtual environment already exists"
fi

# Step 2: Activate virtual environment and install dependencies
echo ""
echo "2️⃣  Installing Python dependencies..."
source venv/bin/activate
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt
echo "   ✅ Dependencies installed"

# Step 3: Install Playwright browser
echo ""
echo "3️⃣  Installing Playwright Chromium browser..."
playwright install chromium
echo "   ✅ Browser installed"

# Step 4: Copy DeepStack code
echo ""
echo "4️⃣  Copying DeepStack Collector code..."

DEEPSTACK_SOURCE="../../../deepstack"

if [ ! -d "$DEEPSTACK_SOURCE" ]; then
    echo "   ⚠️  DeepStack not found at $DEEPSTACK_SOURCE"
    echo "   Please manually copy deepstack.py and src/ directory"
else
    if [ -f "$DEEPSTACK_SOURCE/deepstack.py" ]; then
        cp "$DEEPSTACK_SOURCE/deepstack.py" .
        echo "   ✅ Copied deepstack.py"
    fi

    if [ -d "$DEEPSTACK_SOURCE/src" ]; then
        cp -r "$DEEPSTACK_SOURCE/src" .
        echo "   ✅ Copied src/ directory"
    fi
fi

# Step 5: Create output directory
echo ""
echo "5️⃣  Creating output directory..."
mkdir -p output
echo "   ✅ Output directory ready"

# Step 6: Verify setup
echo ""
echo "6️⃣  Verifying setup..."

MISSING=()

if [ ! -f "deepstack.py" ]; then
    MISSING+=("deepstack.py")
fi

if [ ! -d "src" ]; then
    MISSING+=("src/ directory")
fi

if [ ${#MISSING[@]} -eq 0 ]; then
    echo "   ✅ All required files present"
else
    echo "   ⚠️  Missing files:"
    for item in "${MISSING[@]}"; do
        echo "      - $item"
    done
fi

# Done
echo ""
echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Activate virtual environment:"
echo "      source venv/bin/activate"
echo ""
echo "   2. Run the server:"
echo "      python3 main.py"
echo ""
echo "   3. Test the API:"
echo "      curl http://localhost:8000/health"
echo ""
echo "   4. Start an analysis:"
echo '      curl -X POST http://localhost:8000/api/analyze \'
echo '        -H "Content-Type: application/json" \'
echo "        -d '{\"company_name\": \"GGWP\", \"company_url\": \"https://ggwp.com\"}'"
echo ""
