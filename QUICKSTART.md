# Quick Start Guide

Get Senkulatharu running in 10 minutes!

## 📋 Prerequisites

- Node.js 16+
- Python 3.9+
- Supabase account (free at supabase.com)

## ⚡ 5-Minute Quick Start

### 1. Set Up Supabase (2 min)

- Create project at supabase.com
- Create `products` table (use SQL from SUPABASE_SETUP.md)
- Create `products` storage bucket (PUBLIC)
- Copy URL and Anon Key

### 2. Configure Backend (1 min)

```bash
cd backend

# Create venv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install
pip install -r requirements.txt

# Create .env
cp .env.example .env
# Fill in Supabase URL and Key
```

### 3. Configure Frontend (1 min)

```bash
cd frontend

# Install
npm install

# Create .env
cp .env.example .env
# Should work with defaults (http://localhost:5000)
```

### 4. Run Everything (1 min)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Opens http://localhost:5173
```

## ✅ Done!

- Homepage: http://localhost:5173
- Admin: http://localhost:5173/admin (password: admin123)
- Add a product and test!

---

## 📖 Full Documentation

- [Local Setup](./docs/LOCAL_SETUP.md) - Detailed setup guide
- [Supabase Setup](./docs/SUPABASE_SETUP.md) - Database configuration
- [Deployment](./docs/DEPLOYMENT.md) - Deploy to Vercel + Render
- [Main README](./docs/README.md) - Project overview

---

## 🔑 Key Files

```
frontend/
  ├── src/pages/         ← Edit these to customize UI
  ├── src/components/
  └── public/            ← Add marquee images here

backend/
  ├── app.py             ← Main app
  ├── routes.py          ← API endpoints
  ├── utils.py           ← Image compression
  └── .env               ← Your Supabase credentials
```

---

## 💡 Common Tasks

**Change Admin Password:**
- Edit `frontend/.env`: `VITE_ADMIN_PASSWORD=your_password`
- Also update backend .env for production

**Add Marquee Images:**
- Place 4 images in `frontend/public/`
- Name them: `marquee-1.jpg`, `marquee-2.jpg`, `marquee-3.jpg`, `marquee-4.jpg`

**Change WhatsApp Number:**
- Edit `frontend/src/pages/Products.tsx`
- Find: `const whatsappNumber = '919876543210'`
- Replace with your number

**Customize Colors:**
- Edit `frontend/tailwind.config.js`
- Colors: brown (#6B4F3A), sand (#F5E9DA), forest-green (#5A7D7C)

---

## 🐛 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 5000 in use | `lsof -i :5000` then `kill -9 <PID>` |
| Port 5173 in use | `lsof -i :5173` then `kill -9 <PID>` |
| Venv not activating | Use full path: `source ./venv/bin/activate` |
| Supabase error | Check SUPABASE_URL has `https://` prefix |
| CORS error | Update CORS_ORIGINS in backend .env |
| Images not uploading | Make sure bucket is PUBLIC in Supabase |

---

## 🚀 Deploy to Production

When ready:

1. **Backend**: Push to GitHub → Deploy on Render (1 hour)
2. **Frontend**: Push to GitHub → Deploy on Vercel (5 min)

See [Deployment Guide](./docs/DEPLOYMENT.md) for details.

---

## 📞 Need Help?

1. Check relevant guide in `/docs` folder
2. Check browser console for errors
3. Check terminal logs for backend errors
4. Verify Supabase credentials are correct

---

**Ready to build? Let's go! 🎉**

Open http://localhost:5173 and start exploring.
