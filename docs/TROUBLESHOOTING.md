# Comprehensive Troubleshooting Guide

Solutions for common issues when setting up and running Senkulatharu.

## Table of Contents
1. [Frontend Issues](#frontend-issues)
2. [Backend Issues](#backend-issues)
3. [Database Issues](#database-issues)
4. [Image Upload Issues](#image-upload-issues)
5. [Deployment Issues](#deployment-issues)
6. [WhatsApp Integration](#whatsapp-integration)

---

## Frontend Issues

### Issue: "npm: command not found"

**Cause:** Node.js/npm not installed

**Solution:**
```bash
# Check if installed
node --version
npm --version

# If not, download from https://nodejs.org
# Choose LTS version for stability
# Install and verify
node --version  # Should be v16+
npm --version   # Should be latest
```

### Issue: "Port 5173 already in use"

**Cause:** Another process using the port

**Solution:**
```bash
# macOS/Linux
lsof -i :5173
kill -9 <PID>

# Windows PowerShell
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3000
```

### Issue: "Module not found"

**Cause:** Dependencies not installed or corrupted

**Solution:**
```bash
cd frontend

# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Try again
npm run dev
```

### Issue: "VITE env variable not loading"

**Cause:** .env file not found or wrong format

**Solution:**
```bash
cd frontend

# Check file exists
ls -la .env  # macOS/Linux
dir .env    # Windows

# Verify content
cat .env  # Should show VITE_API_URL=...

# Restart dev server - env vars loaded on startup
npm run dev

# Try in browser console
console.log(import.meta.env.VITE_API_URL)
```

### Issue: "Images not showing in marquee"

**Cause:** Missing files in public folder

**Solution:**
```bash
# Check public folder
cd frontend/public
ls -la  # Should show marquee-1.jpg, marquee-2.jpg, etc.

# If missing, add images
# Copy 4 images and name them:
# - marquee-1.jpg (250x200px recommended)
# - marquee-2.jpg
# - marquee-3.jpg
# - marquee-4.jpg

# Restart dev server
npm run dev

# Check browser Network tab
# Look for 404 errors on images
```

### Issue: "CSS not applying (Tailwind not working)"

**Cause:** Tailwind build issue

**Solution:**
```bash
cd frontend

# Verify tailwind config exists
ls -la tailwind.config.js

# Check index.css has @tailwind directives
cat src/index.css  # Should have @tailwind

# Rebuild
npm run build

# If still broken, reinstall
npm install -D tailwindcss@latest postcss autoprefixer
```

### Issue: "Admin panel not submitting to backend"

**Cause:** Backend not running or CORS error

**Solution:**
```bash
# 1. Check backend is running
curl http://localhost:5000/health
# Should return: {"status": "healthy"}

# 2. Check VITE_API_URL in frontend/.env
cat frontend/.env  # VITE_API_URL=http://localhost:5000

# 3. Check browser Network tab
# - Right-click → Inspect → Network tab
# - Submit form and look for failed request
# - Check response for CORS error

# 4. If CORS error, update backend/.env
# Change CORS_ORIGINS=http://localhost:5173
# Restart backend
```

### Issue: "404 errors in production"

**Cause:** Frontend routes not configured for SPA

**Solution for Vercel:**
1. Go to Vercel project settings
2. Go to **Build & Deployment** → **Build Output Settings**
3. Set **Output Directory** to `dist`
4. In **Advanced** → **Framework Preset**, select `Vite`
5. Redeploy

Or create `public/_redirects`:
```
/* /index.html 200
```

---

## Backend Issues

### Issue: "python: command not found"

**Cause:** Python not installed or wrong version

**Solution:**
```bash
# Check if installed
python --version      # Windows/macOS
python3 --version     # macOS/Linux

# If not installed:
# Download from https://www.python.org
# Choose Python 3.9 or higher

# Verify installation
python --version  # Should be 3.9+
```

### Issue: "Port 5000 already in use"

**Cause:** Another process using the port

**Solution:**
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows PowerShell
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
export PORT=5001  # Then python app.py
```

### Issue: "ModuleNotFoundError: No module named 'flask'"

**Cause:** Dependencies not installed or wrong environment

**Solution:**
```bash
cd backend

# Verify venv is activated
# Should see (venv) prefix in terminal
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# If not showing (venv), activate first

# Install dependencies
pip install -r requirements.txt

# Verify installation
python -c "import flask; print('OK')"
```

### Issue: "Virtual environment issues"

**Cause:** Venv corrupted or not properly created

**Solution:**
```bash
cd backend

# Remove old venv
rm -rf venv  # macOS/Linux
rmdir /s /q venv  # Windows

# Create fresh venv
python -m venv venv

# Activate
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Should see (venv) prefix

# Install dependencies
pip install -r requirements.txt

# Test
python -c "import flask; print('OK')"
```

### Issue: "Pillow installation fails"

**Cause:** Missing system libraries (macOS/Linux)

**Solution:**
```bash
# macOS
brew install libjpeg
brew install libpng

# Then retry
pip install Pillow

# Linux (Ubuntu/Debian)
sudo apt-get install libjpeg-dev
sudo apt-get install libpng-dev
pip install Pillow
```

### Issue: "Backend starts but crashes on request"

**Cause:** Missing environment variables or import error

**Solution:**
```bash
# Check .env file exists
ls -la backend/.env

# Verify variables
cat backend/.env

# Check all imports work
python -c "from app import create_app; print('OK')"

# If error, check:
# - Supabase URL format (must have https://)
# - SUPABASE_KEY is correct
# - All requirements installed: pip install -r requirements.txt

# Try verbose mode
python app.py  # Check terminal error message
```

### Issue: "Gunicorn fails in production"

**Cause:** Gunicorn not properly configured

**Solution:**
```bash
# Verify Procfile exists
cat Procfile  # Should show: web: gunicorn app:create_app()

# Test gunicorn locally
pip install gunicorn
gunicorn app:create_app()
# Should run without errors

# Check for syntax errors
python -m py_compile app.py config.py routes.py utils.py
```

---

## Database Issues

### Issue: "No module named 'supabase'"

**Cause:** Supabase client not installed

**Solution:**
```bash
cd backend
source venv/bin/activate
pip install supabase
```

### Issue: "connection timeout" or "can't connect to Supabase"

**Cause:** Wrong URL, no internet, or Supabase down

**Solution:**
```bash
# 1. Check URL format
cat backend/.env | grep SUPABASE_URL
# Should start with https://

# 2. Test URL manually
curl https://YOUR_SUPABASE_URL

# 3. Verify Supabase project is active
# Go to supabase.com and check project status

# 4. Check internet connection
ping google.com

# 5. Check credentials are correct
# Go to Supabase dashboard → Settings → API
# Verify URL and Key match your .env
```

### Issue: "RLS policy preventing access"

**Cause:** Row Level Security policies not set correctly

**Solution:**
```sql
-- Go to Supabase SQL Editor and run:
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Products are publicly readable"
ON products FOR SELECT USING (true);

-- Allow all operations
CREATE POLICY "Products can be inserted"
ON products FOR INSERT WITH CHECK (true);

CREATE POLICY "Products can be updated"
ON products FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Products can be deleted"
ON products FOR DELETE USING (true);
```

### Issue: "Products table not found"

**Cause:** Table not created in Supabase

**Solution:**
1. Go to Supabase dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Paste and run the SQL from SUPABASE_SETUP.md
5. Verify table appears in **Table Editor**

### Issue: "Anon key permissions denied"

**Cause:** Using Service Role Key instead of Anon Key

**Solution:**
```bash
# Go to Supabase → Settings → API
# Copy "Anon Public" key (NOT "Service Role Secret" key)
# Update backend/.env with Anon key
# Restart backend
```

---

## Image Upload Issues

### Issue: "Image upload fails with 413 error"

**Cause:** File too large

**Solution:**
```bash
# Check max file size in config.py
# Default is 25MB

# If uploading larger file, reduce image size:
# - Use image editor to compress
# - Resize to reasonable dimension (e.g., 1200px wide)
# - Or increase MAX_CONTENT_LENGTH in config.py
```

### Issue: "Unsupported image format"

**Cause:** Image format not in allowed list

**Solution:**
```bash
# Allowed formats: png, jpg, jpeg, gif, webp
# Check your image file
file image.jpg  # Should show image type

# If not image, convert:
# Use online converter or:
ffmpeg -i image.pdf image.jpg  # Convert PDF to JPG
```

### Issue: "Image compresses but doesn't upload to Supabase"

**Cause:** Storage bucket permissions wrong

**Solution:**
```bash
# 1. Go to Supabase Dashboard → Storage
# 2. Click "products" bucket
# 3. Check "Public" toggle is ON
# 4. Go to Policies tab
# 5. Make sure bucket allows upload:

-- Run in SQL Editor:
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');
```

### Issue: "Image URL 404 after upload"

**Cause:** Image stored but not publicly accessible

**Solution:**
```bash
# 1. Verify bucket is public (see above)
# 2. Check image URL format:
# Should be: https://xxx.supabase.co/storage/v1/object/public/products/...

# 3. If URL structure wrong, check code in routes.py
# Make sure image_url is constructed correctly

# 4. Manually test URL in browser:
curl "https://xxx.supabase.co/storage/v1/object/public/products/product_xyz.jpg"
# Should return image, not 404
```

---

## Deployment Issues

### Vercel Deployment

#### Issue: "Build failed - Cannot find module"

**Solution:**
1. Go to Vercel project settings
2. Check **Build Command**: `npm run build`
3. Check **Output Directory**: `dist`
4. Verify all dependencies in `package.json`
5. Redeploy

#### Issue: "Production API calls fail"

**Solution:**
1. Update `VITE_API_URL` environment variable to production backend URL
2. Format: `https://your-backend-url.onrender.com`
3. Trigger redeploy (any git push)

### Render Deployment

#### Issue: "Build logs show Python errors"

**Solution:**
1. Check build command uses correct Python: `python3 -m venv venv`
2. Check all packages in requirements.txt
3. View logs in Render dashboard
4. Deploy manually if needed

#### Issue: "Service crashes after deploy"

**Solution:**
1. Check backend logs in Render dashboard
2. Verify environment variables are set
3. Check Procfile syntax: `web: gunicorn app:create_app()`
4. Test locally first: `gunicorn app:create_app()`

#### Issue: "Cold start delays"

**Normal for free tier!** First request takes 5-10 seconds.

**Options:**
- Use Render paid tier to avoid cold starts
- Or accept the delay (normal)
- Ping health endpoint periodically (not recommended)

---

## WhatsApp Integration

### Issue: "WhatsApp link not opening"

**Cause:** Incorrect phone number format

**Solution:**
```javascript
// In frontend/src/pages/Products.tsx
// Format: country_code + number (no + or spaces)
const whatsappNumber = '919876543210'  // ✓ Correct
const whatsappNumber = '+91 9876 543210'  // ✗ Wrong

// Find and replace:
const whatsappNumber = '919876543210'  // Change to your number
```

### Issue: "Message shows with incorrect format"

**Cause:** Message string encoding

**Solution:**
```javascript
// The message is auto-formatted as:
const message = `Hello, I want to order ${product.name}, Price: ₹${product.price}`

// It should display correctly
// If not, verify:
// 1. Product name and price are correct
// 2. Currency symbol displays (₹)
// 3. Browser supports unicode
```

### Issue: "Opening desktop WhatsApp instead of web"

**Cause:** Device configuration

**Solution:**
- Mobile: Natural, WhatsApp app opens
- Desktop: May need WhatsApp Web already open
- Use: `https://wa.me/919876543210?text=message` format
- Should work on phone, may need WhatsApp Web on desktop

---

## General Debugging Tips

### Enable Browser DevTools

```javascript
// Right-click → Inspect → Console tab

// Check for JavaScript errors:
// Red errors = frontend issue

// Network tab:
// Check API calls, status codes, response

// Application tab:
// Check localStorage, .env variables
```

### Backend Debugging

```python
# Add debug prints in routes.py
@bp.route('/products', methods=['GET'])
def get_products():
    print("GET /products called")  # Debug line
    try:
        response = supabase.table('products').select('*').execute()
        print(f"Got {len(response.data)} products")  # Debug line
        return jsonify({'success': True, 'products': response.data}), 200
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug line
        return jsonify({'success': False, 'message': str(e)}), 500
```

### Check Logs

```bash
# Frontend logs appear in browser console
# Or: npm run dev (watch terminal)

# Backend logs appear in terminal where you ran: python app.py
# Keep terminal visible while testing

# Production logs:
# Vercel: Vercel Dashboard → Deployments → Logs
# Render: Render Dashboard → Logs
```

---

## Need More Help?

1. **Check documentation**:
   - Main README.md
   - Specific guide in /docs folder
   - Code comments in source files

2. **Share error message**:
   - Full error text (not screenshot)
   - Steps to reproduce
   - Environment (OS, python version, node version)

3. **Check browser console**:
   - Right-click → Inspect → Console
   - Look for red error messages

---

**Still stuck? Verify the basics:**
- ✓ Backend running: `curl http://localhost:5000/health`
- ✓ Frontend running: Open http://localhost:5173
- ✓ Supabase credential: Test in https://supabase.com/dashboard
- ✓ .env files: Check frontend/.env and backend/.env exist
- ✓ Dependencies: `pip install -r requirements.txt` and `npm install`

**You've got this! 💪**
