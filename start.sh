#!/bin/bash
# start.sh — JeevanSetu full-stack launcher
# Starts FastAPI backend (port 8000) + Vite dev server (port 5173)

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🌊 JeevanSetu — Flash Flood Early Warning System        ║"
echo "║  SIH26192 · Full-Stack Startup                           ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python 3.10+"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Kill any existing processes on our ports
echo "🔄 Clearing ports 8000 and 5173..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 1

# Start FastAPI backend
echo "🚀 Starting FastAPI backend (ML + Weather API)..."
cd "$(dirname "$0")/backend"
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "   ✅ Backend PID: $BACKEND_PID"
sleep 2

# Test backend
HEALTH=$(curl -s http://localhost:8000/api/health 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['status'])" 2>/dev/null)
if [ "$HEALTH" = "online" ]; then
    echo "   ✅ FastAPI backend ONLINE at http://localhost:8000"
    echo "   📊 Model: RandomForestClassifier (98.3% accuracy)"
    echo "   🌐 Weather: Open-Meteo API (Chamoli, Uttarakhand)"
else
    echo "   ⚠️  Backend may still be starting..."
fi

# Start Vite frontend
echo ""
echo "🎨 Starting Vite frontend..."
cd "$(dirname "$0")"
npm run dev &
FRONTEND_PID=$!
echo "   ✅ Frontend PID: $FRONTEND_PID"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ JeevanSetu is starting up!                           ║"
echo "║                                                          ║"
echo "║  🌐 Dashboard:  http://localhost:5173                    ║"
echo "║  🤖 API Docs:   http://localhost:8000/docs               ║"
echo "║  💚 Health:     http://localhost:8000/api/health         ║"
echo "║                                                          ║"
echo "║  Press Ctrl+C to stop both servers                       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Wait and cleanup on exit
trap "echo ''; echo '🛑 Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
