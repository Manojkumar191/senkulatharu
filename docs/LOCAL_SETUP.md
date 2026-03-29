# Local Development Setup

Step-by-step guide to set up Senkulatharu for local development.

## 💻 System Requirements

- **Node.js**: v16 or higher
- **Python**: v3.9 or higher
- **npm**: Latest version
- **Git**: For version control
- **Supabase Account**: Free account at supabase.com

## 🎯 Setup Steps

### Phase 1: Project Initialization

#### Step 1.1: Clone or Initialize Project

```bash
# If you haven't already, navigate to the project
cd senkulatharu

# Initialize git (if new project)
git init
```

#### Step 1.2: Create Root .gitignore

Create `/senkulatharu/.gitignore`:

```
node_modules/
venv/
env/
.env
.env.local
.DS_Store
dist/
build/
__pycache__/
*.pyc
.vscode/
.idea/
```

---

### Phase 2: Frontend Setup

#### Step 2.1: Navigate to Frontend

```bash
cd frontend
```

#### Step 2.2: Install Dependencies

```bash
npm install
```

This installs:
- React & React DOM
- Vite (build tool)
- Tailwind CSS
- Axios (HTTP client)

#### Step 2.3: Create Environment File

```bash
cp .env.example .env
```

Edit `.env`:

```bash
VITE_API_URL=http://localhost:5000
VITE_ADMIN_PASSWORD=admin123
```

#### Step 2.4: Add Marquee Images

Create placeholder images or add real ones:

```bash
cd public

# Create dummy images (250x200px PNG files)
# Or download real images and name them:
# - marquee-1.jpg
# - marquee-2.jpg
# - marquee-3.jpg
# - marquee-4.jpg

cd ../..  # Back to project root
```

#### Step 2.5: Test Frontend Build

```bash
cd frontend
npm run build

# Check if dist/ folder is created without errors
ls dist/
```

Good! Now clean up:

```bash
rm -rf dist  # Optional - only if you want to reduce disk space
```

---

### Phase 3: Backend Setup

#### Step 3.1: Navigate to Backend

```bash
cd backend
```

#### Step 3.2: Create Python Virtual Environment

**On Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` prefix in your terminal.

#### Step 3.3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- Flask (web framework)
- Pillow (image processing)
- python-dotenv (environment variables)
- supabase (database client)
- Flask-CORS (cross-origin requests)

#### Step 3.4: Create Environment File

```bash
cp .env.example .env
```

Edit `.env` - you'll fill this after Supabase setup:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key_here
SUPABASE_BUCKET=products
FLASK_ENV=development
```

#### Step 3.5: Test Backend Imports

```bash
# Activate venv if not already (should see (venv) prefix)
python -c "import flask; import PIL; print('All imports OK')"

# Should print: All imports OK
```

---

### Phase 4: Supabase Setup

Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) in detail:

1. Create Supabase project
2. Get credentials
3. Create `products` table
4. Create `products` storage bucket
5. Test the setup

Copy credentials to both `.env` files:

**backend/.env:**
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_anon_key
```

**frontend/.env:**
```
VITE_API_URL=http://localhost:5000
```

---

### Phase 5: Run Locally

#### Terminal 1: Start Backend

```bash
cd backend
source venv/bin/activate  # (venv\Scripts\activate on Windows)
python app.py

# Output should show:
# WARNING in app.run() is not recommended...
# Running on http://0.0.0.0:5000
```

#### Terminal 2: Start Frontend

Open new terminal and run:

```bash
cd frontend
npm run dev

# Output shows:
# VITE v5.0.0  ready in 234 ms
# ➜  Local:   http://localhost:5173/
```

#### Terminal 3 (Optional): Monitor Logs

Keep a terminal watching for errors:

```bash
# You can skip this if only using 2 terminals
```

---

## 🧪 Testing Locally

### 1. Test Frontend

1. Open http://localhost:5173
2. See home page with title "SENKULATHARU"
3. Click "Browse Products" button
4. Should see "No products available yet"

### 2. Test Backend Connection

In browser console:
```javascript
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(d => console.log(d))

// Should print: {status: "healthy"}
```

### 3. Test Admin Panel

1. Go to http://localhost:5173/admin
2. Enter password: `admin123`
3. Click Login
4. Should see "Add New Product" form

### 4. Add Sample Product

1. In Admin panel:
   - Name: "Test Rice"
   - Price: "250"
   - Description: "High quality test rice"
   - Upload a test image
2. Click "Add Product"
3. Should see success message
4. Go to Products page - should see the product

### 5. Test WhatsApp Order

1. On Products page, click "Order via WhatsApp"
2. Should open WhatsApp web or app
3. Message should be: "Hello, I want to order Test Rice, Price: ₹250"

### 6. Test Delete

1. In Admin panel, click Delete on the test product
2. Confirm deletion
3. Product disappears from Products page

---

## 📁 Project Structure Verification

Verify you have all files:

```
senkulatharu/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx ✓
│   │   │   ├── Products.tsx ✓
│   │   │   ├── About.tsx ✓
│   │   │   ├── Blog.tsx ✓
│   │   │   └── Admin.tsx ✓
│   │   ├── components/
│   │   │   ├── Header.tsx ✓
│   │   │   └── Footer.tsx ✓
│   │   ├── api/
│   │   │   └── products.ts ✓
│   │   ├── App.tsx ✓
│   │   ├── main.tsx ✓
│   │   └── index.css ✓
│   ├── public/
│   │   └── marquee-*.jpg ✓
│   ├── package.json ✓
│   ├── vite.config.ts ✓
│   └── tailwind.config.js ✓
│
├── backend/
│   ├── app.py ✓
│   ├── config.py ✓
│   ├── routes.py ✓
│   ├── utils.py ✓
│   ├── requirements.txt ✓
│   └── Procfile (for deployment)
│
└── docs/
    ├── README.md ✓
    ├── SUPABASE_SETUP.md ✓
    └── DEPLOYMENT.md ✓
```

---

## 🔧 Troubleshooting

### Frontend Issues

**Port 5173 already in use**
```bash
# Kill process on that port
# macOS/Linux:
lsof -i :5173
kill -9 <PID>

# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Module not found error**
```bash
# Clean install
rm -rf node_modules
npm install
npm run dev
```

**Images not showing**
- Check `frontend/public/` folder
- Verify file names: `marquee-1.jpg`, `marquee-2.jpg`, etc.
- Check browser Network tab for 404s

### Backend Issues

**Python module 'X' not found**
```bash
# Make sure venv is activated (see (venv) prefix)
pip install -r requirements.txt
```

**Port 5000 already in use**
```bash
# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Supabase connection error**
- Verify SUPABASE_URL starts with `https://`
- Check SUPABASE_KEY is the "Anon" key, not "Service Role"
- Make sure Supabase project is active (not paused)

### Full Reset

If something's broken, reset everything:

```bash
# Clean frontend
cd frontend
rm -rf node_modules dist .next .parcel-cache
npm install

# Clean backend
cd ../backend
rm -rf venv __pycache__
python3 -m venv venv
source venv/bin/activate  # (venv\Scripts\activate on Windows)
pip install -r requirements.txt

# Start fresh
npm run dev  # in frontend
python app.py  # in backend (in separate terminal)
```

---

## 📊 Performance Tips

### Frontend
- Images are automatically optimized by Vite
- Use React DevTools extension to debug
- Check Network tab size of CSS/JS bundles

### Backend
- Keep debug mode ON during development
- Use Flask development server (not production)
- Check console for SQL queries

### Database
- Start with small test data
- Monitor Supabase dashboard for usage

---

## VS Code Setup (Optional)

### Recommended Extensions

1. **Frontend**
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Vite
   - Thunder Client (for API testing)

2. **Backend**
   - Python
   - Pylance
   - Flask Snippets

3. **General**
   - GitLens
   - Prettier
   - Thunder Client

### Useful Settings

**.vscode/settings.json**:
```json
{
  "[python]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "ms-python.python",
    "editor.rulers": [80, 120]
  },
  "[typescriptreact]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.tabSize": 2,
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true
}
```

---

## 🚀 Next Steps

After successful local setup:

1. **Learn the code**: Read through each component
2. **Customize**: Change colors, text, images
3. **Add features**: Follow the architecture pattern
4. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📚 Useful Commands

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code

# Backend
python app.py                      # Run development server
pip install -r requirements.txt    # Install dependencies
pip freeze > requirements.txt      # Update requirements
deactivate                         # Exit virtual environment

# Git
git status           # Check changes
git add .            # Stage all
git commit -m ""     # Commit
git push             # Push to GitHub
```

---

## ✅ Completion Checklist

- [ ] Node.js v16+ installed
- [ ] Python 3.9+ installed
- [ ] Project folder created
- [ ] Frontend dependencies installed
- [ ] Backend virtual environment created
- [ ] Backend dependencies installed
- [ ] Supabase project created
- [ ] Products table created
- [ ] Products bucket created
- [ ] Environment files created and filled
- [ ] Frontend runs on http://localhost:5173
- [ ] Backend runs on http://localhost:5000
- [ ] Can add product in admin panel
- [ ] Can view products on products page
- [ ] WhatsApp button works
- [ ] Images upload and display correctly

---

**All set for local development! 🎉**

Open http://localhost:5173 and start building!
