# Environment Variables Reference

Complete guide to all environment variables used in Senkulatharu.

## Frontend Variables

### `.env` File Location
`frontend/.env`

### Variables

| Variable | Type | Example | Required | Notes |
|----------|------|---------|----------|-------|
| `VITE_API_URL` | String | `http://localhost:5000` | Yes | Backend API URL. Change to production URL for deployed app. |
| `VITE_ADMIN_PASSWORD` | String | `admin123` | Yes | Password to access admin panel. Change to secure password. |

### Frontend `.env` Example

```bash
# Local Development
VITE_API_URL=http://localhost:5000
VITE_ADMIN_PASSWORD=admin123

# Production
VITE_API_URL=https://senkulatharu-api.onrender.com
VITE_ADMIN_PASSWORD=your_secure_password_here
```

---

## Backend Variables

### `.env` File Location
`backend/.env`

### Variables

| Variable | Type | Example | Required | Notes |
|----------|------|---------|----------|-------|
| `SUPABASE_URL` | String | `https://xxxxx.supabase.co` | Yes | Your Supabase project URL. Get from Supabase dashboard. |
| `SUPABASE_KEY` | String | `eyJhbGciOi...` | Yes | Supabase Anon Key (NOT Service Role Key). Public key is fine. |
| `SUPABASE_BUCKET` | String | `products` | Yes | Name of storage bucket for images. |
| `FLASK_ENV` | String | `development` or `production` | No | Flask environment. `production` for deployed. |
| `PORT` | Number | `5000` | No | Port to run server. Default: 5000. Render sets this automatically. |
| `CORS_ORIGINS` | String | `http://localhost:5173,https://yourdomain.com` | No | Comma-separated URLs allowed to access API. |

### Backend `.env` Example

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_anon_key_here
SUPABASE_BUCKET=products

# Flask Configuration
FLASK_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Server
PORT=5000
```

---

## Getting Your Credentials

### Supabase URL & Key

1. Go to [supabase.com](https://supabase.com)
2. Log in to your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **Anon Public** → `SUPABASE_KEY`

### Example Supabase URL
```
https://abcdefghijklmnop.supabase.co
```

### Example Supabase Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzMwMjQwMCwiZXhwIjoxOTI5Njc4NDAwfQ.ABC...
```

---

## Environment-Specific Configurations

### Local Development

**frontend/.env:**
```bash
VITE_API_URL=http://localhost:5000
VITE_ADMIN_PASSWORD=admin123
```

**backend/.env:**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
SUPABASE_BUCKET=products
FLASK_ENV=development
PORT=5000
CORS_ORIGINS=http://localhost:5173
```

### Production (Deployed)

**Vercel (Frontend):**
```bash
VITE_API_URL=https://senkulatharu-api.onrender.com
VITE_ADMIN_PASSWORD=your_secure_password_here
```

**Render (Backend):**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
SUPABASE_BUCKET=products
FLASK_ENV=production
CORS_ORIGINS=https://senkulatharu.vercel.app,https://yourdomain.com
```

---

## Important Notes

### 🔐 Security

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use Anon Key (not Service Role Key)** - Anon key is designed to be public
3. **Change admin password** - Don't use default `admin123` in production
4. **Keep Supabase Key secret** - Set CORS to prevent abuse
5. **Use HTTPS** - Always use HTTPS URLs, never HTTP

### 🌐 CORS Origins

CORS Origins should include:
- Local development: `http://localhost:5173`
- Production frontend: `https://your-domain.com`
- Additional testing domains if needed

Example:
```bash
CORS_ORIGINS=http://localhost:5173,https://senkulatharu.vercel.app,https://yourdomain.com
```

### 🔄 Updating Variables

**Local:**
1. Edit `.env` file
2. Restart `npm run dev` or `python app.py`
3. Changes take effect immediately

**Production (Vercel):**
1. Go to Vercel Dashboard
2. Project → Settings → Environment Variables
3. Update variable
4. Trigger redeploy (any git push)

**Production (Render):**
1. Go to Render Dashboard
2. Service → Environment
3. Update variable
4. Auto-redeploys

---

## Common Issues

### "Invalid Supabase URL"
- Make sure URL starts with `https://`
- Copy exact URL from Supabase dashboard
- Don't include trailing slash

### "CORS Error"
- Update `CORS_ORIGINS` with your frontend URL
- Include protocol: `https://` not just domain
- Separate multiple origins with comma (no spaces)

### "Unauthorized Access"
- Verify SUPABASE_KEY is Anon Key (not Service Role)
- Check Supabase table RLS policies

### Environment variables not loading
- Restart development server
- Make sure `.env` file is in correct folder
- Check `FLASK_ENV` environment variable not overwriting `.env`

---

## .env File Locations

```
senkulatharu/
├── frontend/
│   └── .env              ← Frontend env vars
├── backend/
│   └── .env              ← Backend env vars
└── .env.example          ← (Don't edit, template only)
```

---

## Using Environment Variables in Code

### Frontend (React)
```javascript
const apiUrl = import.meta.env.VITE_API_URL
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

console.log(apiUrl)  // http://localhost:5000
```

### Backend (Flask)
```python
from config import Config

url = Config.SUPABASE_URL
key = Config.SUPABASE_KEY
bucket = Config.SUPABASE_BUCKET
```

---

## Template Files

### frontend/.env.example
```bash
VITE_API_URL=http://localhost:5000
VITE_ADMIN_PASSWORD=your_admin_password_here
```

### backend/.env.example
```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-key-here
SUPABASE_BUCKET=products

# Flask Configuration
FLASK_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Server
PORT=5000
```

---

## Production Deployment Checklist

- [ ] All Supabase credentials set
- [ ] Admin password changed and secure
- [ ] Frontend `VITE_API_URL` points to production backend
- [ ] Backend `CORS_ORIGINS` includes production frontend
- [ ] `FLASK_ENV` set to `production`
- [ ] All variables verified in deployment platform
- [ ] No `.env` files committed to GitHub
- [ ] `.gitignore` includes `*.env` and `.env`

---

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Flask Configuration](https://flask.palletsprojects.com/config/)
- [Supabase API Keys](https://supabase.com/docs/reference/api-keys)

---

**All set! Your environment variables are configured correctly.** ✅
