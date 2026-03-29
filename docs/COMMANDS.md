# Commands & Shortcuts Cheat Sheet

Quick reference for commonly used commands.

## 🎯 Quick Start Commands

### Start Everything (Local Development)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Then open:** http://localhost:5173

---

## 📦 Frontend Commands

### Installation & Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update environment variables
nano .env  # or use your editor
```

### Development

```bash
# Start dev server (auto-reload on changes)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

### Development Server URLs

```
Homepage:     http://localhost:5173
Products:     http://localhost:5173/products
About:        http://localhost:5173/about
Blog:         http://localhost:5173/blog
Admin Panel:  http://localhost:5173/admin
```

### Common Frontend Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Kill port 5173
lsof -i :5173 && kill -9 <PID>

# Run on different port
npm run dev -- --port 3000
```

---

## 🐍 Backend Commands

### Installation & Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate venv (choose one)
source venv/bin/activate           # macOS/Linux
venv\Scripts\activate              # Windows

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

### Running

```bash
# Start development server
python app.py

# With venv activated, should run on http://localhost:5000

# Check if running
curl http://localhost:5000/health
```

### Dependency Management

```bash
# Install new package
pip install package_name

# Update all packages
pip install -r requirements.txt --upgrade

# Save current dependencies
pip freeze > requirements.txt

# List all installed packages
pip list
```

### Virtual Environment

```bash
# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Deactivate
deactivate

# Delete venv (to reset)
rm -rf venv              # macOS/Linux
rmdir /s /q venv         # Windows
```

### Common Backend Issues

```bash
# Kill port 5000
lsof -i :5000 && kill -9 <PID>

# Test if Flask is installed
python -c "import flask; print('OK')"

# Test if Supabase is working
python -c "from supabase import create_client; print('OK')"

# Run tests
python -m pytest  # if using pytest
```

---

## 🗄️ Database (Supabase) Commands

### CLI Operations

```bash
# Create Supabase project (web interface)
# https://supabase.com → New Project

# Get credentials
# Supabase → Settings → API → Copy URL and Anon Key
```

### Common Database Operations

**Get products:**
```bash
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
  https://your-project.supabase.co/rest/v1/products
```

**Add product:**
```bash
curl -X POST https://your-project.supabase.co/rest/v1/products \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Name",
    "price": 100,
    "description": "Description"
  }'
```

---

## 🚀 Deployment Commands

### Frontend (Vercel)

```bash
# Push to GitHub (auto-deploys)
git add .
git commit -m "Update frontend"
git push origin main

# Manual deployment via Vercel CLI
npm install -g vercel
vercel
```

### Backend (Render)

```bash
# Push to GitHub (auto-deploys)
git add .
git commit -m "Update backend"
git push origin main

# Check logs
# Render Dashboard → Service → Logs
```

---

## 📝 Git Commands

### Basic Git

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Descriptive message"

# Push to origin
git push origin main

# Pull latest
git pull origin main
```

### Branches

```bash
# Create new branch
git checkout -b feature/new-feature

# Switch to branch
git checkout branch-name

# List branches
git branch -a

# Delete branch
git branch -d branch-name
```

### Undo Changes

```bash
# Undo unstaged changes
git checkout -- filename

# Undo committed changes (local)
git reset --soft HEAD~1

# View history
git log
```

---

## 🔒 Environment Variables

### View Environment Files

```bash
# Frontend
cat frontend/.env

# Backend
cat backend/.env

# Show without .env
cat frontend/.env.example
cat backend/.env.example
```

### Edit Environment Files

```bash
# Using nano (Linux/macOS)
nano frontend/.env
# Press Ctrl+X, then Y, then Enter to save

# Using vi (Linux/macOS)
vi frontend/.env
# Press i to edit, Esc, then :wq to save

# Using cat (create file)
cat > frontend/.env << EOF
VITE_API_URL=http://localhost:5000
VITE_ADMIN_PASSWORD=admin123
EOF
```

### Check Specific Variable

```bash
# Frontend API URL
grep VITE_API_URL frontend/.env

# Backend Supabase URL
grep SUPABASE_URL backend/.env
```

---

## 🧹 Cleanup Commands

### Remove Build Artifacts

```bash
# Frontend
rm -rf frontend/dist
rm -rf frontend/node_modules

# Backend
rm -rf backend/__pycache__
rm -rf backend/*.pyc
```

### Reset to Clean State

```bash
# Full frontend reset
cd frontend
rm -rf node_modules dist package-lock.json
npm install
npm run dev

# Full backend reset
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

---

## 🔍 Debugging Commands

### Check Ports

```bash
# macOS/Linux
lsof -i :5000      # Check port 5000
lsof -i :5173      # Check port 5173

# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

### Test APIs

```bash
# Health check
curl http://localhost:5000/health

# Get products
curl http://localhost:5000/products

# Supabase connection test
curl https://your-project.supabase.co/rest/v1/
```

### View Logs

```bash
# Backend logs show in terminal where python app.py runs

# Frontend logs show in browser console:
# Right-click → Inspect → Console tab

# Production logs
# Vercel: Dashboard → Deployments → Logs
# Render: Dashboard → Logs
```

---

## 📱 Browser DevTools

### Open DevTools

```
Mac:   Cmd + Option + I  or  Cmd + Option + J (Console)
Windows: F12  or  Ctrl + Shift + I
Linux: F12  or  Ctrl + Shift + I
```

### Useful Tabs

| Tab | Use For |
|-----|---------|
| Console | JavaScript errors, debug logging |
| Network | API calls, response status |
| Application | LocalStorage, cookies, env vars |
| Sources | Set breakpoints, debug code |
| Elements | Inspect HTML, CSS |

---

## 🔑 Keyboard Shortcuts

### Code Editor (VS Code)

```
Ctrl/Cmd + P          → Open file
Ctrl/Cmd + B          → Toggle sidebar
Ctrl/Cmd + J          → Toggle terminal
Ctrl/Cmd + /          → Comment/uncomment
Ctrl/Cmd + K Ctrl/Cmd + C → Comment
Ctrl/Cmd + K Ctrl/Cmd + U → Uncomment
Ctrl/Cmd + Shift + F  → Find in files
Ctrl/Cmd + H          → Find and replace
Ctrl/Cmd + S          → Save file
Ctrl/Cmd + Z          → Undo
Ctrl/Cmd + Shift + Z  → Redo
```

### Browser

```
Ctrl/Cmd + Shift + I  → Open DevTools
F5  or Ctrl/Cmd + R   → Refresh page
Ctrl/Cmd + Shift + R  → Hard refresh (clear cache)
Ctrl/Cmd + L          → Focus address bar
Tab                   → Focus next element
Shift + Tab           → Focus previous element
```

---

## 📊 Useful File Locations

```
Frontend:
  package.json              ← Dependencies, scripts
  frontend/.env             ← Configuration
  frontend/src/App.tsx      ← Main component
  frontend/index.html       ← HTML template
  frontend/public/          ← Static files

Backend:
  backend/app.py            ← Main app
  backend/.env              ← Configuration
  backend/requirements.txt   ← Dependencies
  backend/routes.py         ← API endpoints
  backend/utils.py          ← Helper functions

Docs:
  README.md                 ← Project overview
  QUICKSTART.md             ← Quick setup
  docs/LOCAL_SETUP.md       ← Local development
  docs/SUPABASE_SETUP.md    ← Database setup
  docs/DEPLOYMENT.md        ← Deployment guide
  docs/TROUBLESHOOTING.md   ← Common fixes
```

---

## 💡 Pro Tips

### Useful Aliases (macOS/Linux)

```bash
# Add to ~/.bashrc or ~/.zshrc
alias sp="cd senkulatharu"
alias spf="cd senkulatharu/frontend && npm run dev"
alias spb="cd senkulatharu/backend && source venv/bin/activate && python app.py"
alias killports="lsof -i :5000,5173 | grep LISTEN | awk '{print \$2}' | xargs kill -9"
```

### Windows PowerShell Aliases

```powershell
# Add to $PROFILE (Google how for your shell)
Set-Alias sp cd-senkulatharu -Value 'cd C:\path\to\senkulatharu'
```

### Screen Split Development

**Option 1: VS Code**
- Open integrated terminal
- Click split icon (or Ctrl+Shift+5)
- Run backend in one, frontend in other

**Option 2: tmux (macOS/Linux)**
```bash
tmux new-session -d -s dev
tmux send-keys -t dev "cd backend && python app.py" Enter
tmux send-keys -t dev -X split-window "cd frontend && npm run dev"
```

---

## 🎓 Learning Resources

```bash
# Open documentation
open https://react.dev           # React
open https://vitejs.dev          # Vite
open https://flask.palletsprojects.com  # Flask
open https://supabase.com/docs   # Supabase
open https://tailwindcss.com     # Tailwind
```

---

## 📋 Pre-Deployment Checklist

```bash
# Frontend
npm run build                    # Test build
npm run lint                     # Check for errors
git add . && git commit && git push

# Backend
python -m py_compile app.py      # Check syntax
pip freeze > requirements.txt    # Update deps
git add . && git commit && git push

# Environment
cat frontend/.env > /dev/null    # Verify exists
cat backend/.env > /dev/null     # Verify exists
```

---

## 🚨 Emergency Commands

```bash
# Kill all Node processes
pkill -f node  # macOS/Linux
taskkill /IM node.exe /F  # Windows

# Kill all Python processes
pkill -f python  # macOS/Linux
taskkill /IM python.exe /F  # Windows

# Check what's using port
lsof -i :ANY  # macOS/Linux (all ports)

# Clear npm cache
npm cache clean --force

# Full system reset
rm -rf frontend/node_modules backend/venv
npm install cd frontend
cd ../backend && python -m venv venv
```

---

**Bookmark this page for quick reference! 📌**

For more details, see the full documentation in `/docs` folder.
