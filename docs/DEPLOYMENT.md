# Deployment Guide

Complete guide to deploy Senkulatharu to production.

## 📋 Prerequisites

- GitHub repository with code pushed
- Vercel account (free tier available)
- Render account (free tier available)
- Supabase project with credentials

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Make sure all changes are committed and pushed to GitHub:
```bash
cd frontend
git add .
git commit -m "Prepare for deployment"
git push
```

2. Update `.env` for production:
```bash
# frontend/.env.production (or update .env)
VITE_API_URL=https://your-backend-api.onrender.com
VITE_ADMIN_PASSWORD=your_secure_password_here
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (easier integration)
3. Click **Add New...** → **Project**
4. Select your GitHub repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Set Environment Variables:
   - Click **Environment Variables**
   - Add:
     - Key: `VITE_API_URL`
     - Value: `https://your-backend-url.onrender.com`
    - Add:
       - Key: `VITE_SUPABASE_URL`
       - Value: `https://your-project-id.supabase.co`
    - Add:
       - Key: `VITE_SUPABASE_ANON_KEY`
       - Value: `your_supabase_anon_key`
   - Add:
     - Key: `VITE_ADMIN_PASSWORD`
     - Value: `your_secure_password`

7. Click **Deploy**
8. Wait for deployment (usually 1-2 minutes)
9. Get your URL: `https://your-app.vercel.app`

### Step 3: Verify Frontend

1. Open your deployed URL
2. Check all pages load correctly
3. Verify Products page can fetch from backend
4. Test Admin panel login

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend

1. Make sure backend code is pushed to GitHub:
```bash
cd backend
git add .
git commit -m "Prepare for deployment"
git push
```

2. Update `requirements.txt` (should include gunicorn):
```bash
pip freeze > requirements.txt
```

3. Create `Procfile` in backend directory:
```bash
web: gunicorn app:create_app()
```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com)
2. Sign up (preferably with GitHub)
3. Click **New +** → **Web Service**
4. Select your GitHub repository
5. Configure service (or use repo blueprint via `render.yaml`):
   - **Name**: `senkulatharu-api`
   - **Environment**: `Python 3`
   - **Region**: Choose closest to users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:create_app()`

6. Set Environment Variables:
   - Click **Environment**
   - Add all from `.env`:
     ```
     SUPABASE_URL=https://xxxxx.supabase.co
     SUPABASE_KEY=your_anon_key
     SUPABASE_BUCKET=products
     PORT=5000
     FLASK_ENV=production
     CORS_ORIGINS=https://your-app.vercel.app,https://yourdomain.com
     ```

7. Click **Create Web Service**
8. Wait for deployment (usually 5-10 minutes)
9. Get your URL from dashboard: `https://senkulatharu-api.onrender.com`

### Step 3: Verify Backend

```bash
# Test health endpoint
curl https://senkulatharu-api.onrender.com/health
# Should return: {"status": "healthy"}

# Test products endpoint
curl https://senkulatharu-api.onrender.com/products
# Should return: {"success": true, "products": [...]}
```

---

## 🔄 Connect Frontend to Backend

After backend is deployed:

1. Copy your backend URL (e.g., `https://senkulatharu-api.onrender.com`)
2. Go to Vercel project settings
3. Update `VITE_API_URL` environment variable
4. Trigger redeploy (any commit to main branch)
5. Verify frontend can fetch products

---

## 🖼️ Set Up Marquee Images

Since marquee images are stored locally in frontend:

1. Add 4 images to `frontend/public/`:
   - `marquee-1.jpg` (250x200px recommended)
   - `marquee-2.jpg`
   - `marquee-3.jpg`
   - `marquee-4.jpg`

2. Commit and push:
```bash
git add frontend/public/marquee-*.jpg
git commit -m "Add marquee images"
git push
```

3. Vercel will automatically deploy with images

---

## 📱 Custom Domain (Optional)

### Frontend (Vercel)

1. Go to Vercel project
2. Click **Settings** → **Domains**
3. Click **Add Custom Domain**
4. Enter your domain (e.g., `senkulatharu.com`)
5. Follow DNS configuration instructions
6. Wait for verification (usually 24 hours)

### Backend (Render)

1. Go to Render service
2. Click **Settings**
3. Go to **Custom Domain**
4. Enter subdomain (e.g., `api.senkulatharu.com`)
5. Add DNS records as instructed

---

## 🔒 Security Checklist

- [ ] Admin password changed from default
- [ ] CORS origins configured for your domain only
- [ ] Supabase credentials not exposed in code
- [ ] All `.env` files added to `.gitignore`
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Images stored in Supabase (not backend filesystem)
- [ ] Regular backups enabled in Supabase

---

## 🚀 Performance Optimization

### Frontend (Vercel)
- Images are auto-optimized
- CDN distribution worldwide
- Automatic gzip compression

### Backend (Render)
- Keep free tier for low traffic
- Consider upgrading to paid for high traffic
- Implement caching headers

### Database (Supabase)
- Indexes created on frequently queried columns
- Connection pooling enabled
- Regular backups enabled

---

## 🐛 Troubleshooting

### "CORS Error"
- Update `CORS_ORIGINS` in backend `.env`
- Include full frontend URL with protocol
- Redeploy backend
- Clear browser cache

### "Network Error when fetching products"
- Verify backend is running: `curl https://backend-url/health`
- Check `VITE_API_URL` in frontend
- Check browser Network tab for actual request

### "Cold Start Delay"
- Normal for free tier services
- Render spins down after 15 minutes inactivity
- First request after idle takes 5-10 seconds
- Upgrade to paid if not acceptable

### "Image Upload Fails"
- Verify Supabase credentials
- Check storage bucket is PUBLIC
- Verify bucket name is "products"
- Check file size is under 25MB

### "Database Connection Error"
- Verify SUPABASE_URL starts with `https://`
- Check SUPABASE_KEY is correct (Anon key, not Service key)
- Verify Supabase project is not paused
- Check Network tab for actual error

---

## 📊 Monitoring

### Vercel
- Dashboard shows deployment status
- Analytics show traffic and performance
- Real-time error monitoring

### Render
- Dashboard shows service logs
- Metrics show CPU/Memory usage
- Email alerts for issues

### Supabase
- SQL Editor for analytics
- Storage usage monitoring
- API statistics

---

## 💾 Backup & Recovery

### Database Backup
1. Go to Supabase dashboard
2. Settings → **Backups**
3. Enable automatic backups
4. Download manual backup if needed

### Code Backup
- GitHub is your primary backup
- Always push before deploying
- Use git branches for testing

---

## 🔄 Continuous Deployment

Both Vercel and Render automatically deploy when you push to GitHub:

1. Make changes locally
2. Commit: `git commit -m "message"`
3. Push: `git push`
4. Automatic deployment starts
5. Check dashboard for status

---

## 🎉 Production Launch Checklist

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render
- [ ] Custom domain configured (optional)
- [ ] SSL certificates working
- [ ] Email setup for WhatsApp orders
- [ ] Marquee images uploaded
- [ ] Sample products added
- [ ] Admin panel tested
- [ ] WhatsApp link tested
- [ ] Mobile responsiveness verified
- [ ] Performance optimized
- [ ] Security checklist complete
- [ ] Monitoring configured
- [ ] Backup strategy in place

---

**You're live! 🚀**

For issues, check the troubleshooting guide or reach out for support.
