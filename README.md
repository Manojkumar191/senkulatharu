# 🌾 Senkulatharu - Farmer Product Showcase Platform

A modern full-stack web application connecting consumers directly with dryland farmers from Kadavur, Tamil Nadu.

**"This is farming bonded in blood"** - Senkulatharu celebrates the heritage and sustainability of dryland farming.

---

## 🎯 What is Senkulatharu?

Senkulatharu is a **farmer product showcase website** (not a full ecommerce platform) where:
- Farmers showcase naturally-grown products
- Customers view products and **order directly via WhatsApp**
- No login, no checkout, no payment processing
- Direct farmer-to-consumer connection

### Key Features

✅ **Beautiful Homepage**
- Header with Tamil title and tagline
- Infinite marquee banner with product images
- Value proposition cards
- Category showcase
- Call-to-action sections

✅ **Product Catalog**
- Browse all products
- Search and filter
- Direct WhatsApp ordering
- Product image and detailed descriptions

✅ **Content Pages**
- **About**: Farmer stories, dryland farming explanation, sustainable practices
- **Blog**: Stories from Kadavur, farming knowledge, featured farmers
- **Admin Panel**: Simple product management (no authentication needed)

✅ **Technical Excellence**
- Responsive design (mobile, tablet, desktop)
- Fast-loading with Vite
- Auto-compressing image uploads
- Direct Supabase database integration
- Database-backed product management
- Deployment-ready (Vercel + Render)

---

## 🏗️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **Backend** | Python Flask + Gunicorn |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage (images) |
| **Image Processing** | Python Pillow (auto-compress) |
| **Deployment** | Vercel (frontend) + Render (backend) |
| **Package Manager** | npm (frontend) + pip (backend) |

---

## 📂 Project Structure

```
senkulatharu/
│
├── 📁 frontend/              React + Vite application
│   ├── src/
│   │   ├── pages/            Page components
│   │   │   ├── Home.tsx      Hero + categories
│   │   │   ├── Products.tsx  Product listing
│   │   │   ├── About.tsx     Farmer stories
│   │   │   ├── Blog.tsx      Blog posts
│   │   │   └── Admin.tsx     Product management
│   │   ├── components/
│   │   │   ├── Header.tsx    Navigation
│   │   │   └── Footer.tsx    Footer
│   │   ├── api/
│   │   │   └── products.ts   API client
│   │   ├── index.css         Global styles + animations
│   │   └── App.tsx           Main component
│   ├── public/
│   │   ├── marquee-1.jpg     Marquee images
│   │   ├── marquee-2.jpg
│   │   ├── marquee-3.jpg
│   │   └── marquee-4.jpg
│   └── Various config files (vite, tailwind, tsconfig, etc)
│
├── 📁 backend/               Flask API server
│   ├── app.py                Main Flask app
│   ├── config.py             Configuration
│   ├── routes.py             API endpoints
│   ├── utils.py              Image compression
│   ├── Procfile              Deployment config
│   ├── requirements.txt      Python dependencies
│   └── .env.example          Environment template
│
├── 📁 docs/                  Documentation
│   ├── README.md             Main documentation
│   ├── LOCAL_SETUP.md        Local development setup
│   ├── SUPABASE_SETUP.md     Database configuration
│   ├── DEPLOYMENT.md         Production deployment
│   └── QUICKSTART.md         Quick start guide
│
├── .gitignore                Git configuration
└── README.md                 This file
```

---

## 🚀 Quick Start

### 1️⃣ Prerequisites

```bash
# Check versions
node --version      # Should be v16+
python --version    # Should be v3.9+
npm --version       # Should be latest
```

### 2️⃣ Clone and Setup

```bash
# Clone repository
git clone <repo-url>
cd senkulatharu

# Create Supabase project (see docs/SUPABASE_SETUP.md)
```

### 3️⃣ Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure
cp .env.example .env
# ✏️ Add your Supabase credentials to .env
```

### 4️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure
cp .env.example .env
# ✏️ Default settings work with local backend

# Add marquee images to public/
# - marquee-1.jpg (250x200px recommended)
# - marquee-2.jpg
# - marquee-3.jpg
# - marquee-4.jpg
```

### 5️⃣ Run Locally

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python app.py
# ✅ Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# ✅ Frontend runs on http://localhost:5173
```

### 6️⃣ Test

- Homepage: http://localhost:5173
- Admin Panel: http://localhost:5173/admin
- Password: `admin123` (change in .env)

---

## 📚 Detailed Documentation

### Getting Started
- **[Quick Start Guide](./QUICKSTART.md)** - 10-minute setup
- **[Local Setup](./docs/LOCAL_SETUP.md)** - Complete local development guide
- **[Main README](./docs/README.md)** - Project overview

### Configuration
- **[Supabase Setup](./docs/SUPABASE_SETUP.md)** - Database and storage setup
- **[Environment Variables](./docs/ENV_VARIABLES.md)** - Configuration reference

### Deployment
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deploy to Vercel + Render
- **[Production Checklist](./docs/DEPLOYMENT.md#checklist)** - Pre-launch checklist

---

## 🎨 Features & Pages

### Home Page
- Title: "SENKULATHARU" with Tamil subtitle
- Value proposition cards
- Infinite CSS marquee banner (4 product images)
- Product categories showcase
- Call-to-action button

### Products Page
- Display all products from database
- Search and filter functionality
- Product cards with images, price, description
- "Order via WhatsApp" button for each product
- Direct WhatsApp integration

### About Page
- Meaning of "Senkulatharu"
- Dryland farming explanation
- Farmer stories and testimonials
- Natural farming practices
- Why choose Senkulatharu

### Blog Page
- Featured stories from Kadavur
- Farmer interviews
- Farming knowledge
- Traditional practices
- Newsletter signup

### Admin Panel
- Simple protected route (no database authentication)
- Add products with:
  - Product name
  - Price
  - Description
  - Image upload (auto-compressed)
- View all products
- Delete products
- Real-time updates

---

## 🔄 API Endpoints

### GET /products
Fetch all products from database.
```bash
curl http://localhost:5000/products
```
Response:
```json
{
  "success": true,
  "products": [
    {
      "id": "uuid",
      "name": "Organic Rice",
      "price": 250,
      "description": "...",
      "image_url": "https://..."
    }
  ]
}
```

### POST /add-product
Add new product with image upload and auto-compression.
```bash
curl -X POST http://localhost:5000/add-product \
  -F "name=Rice" \
  -F "price=250" \
  -F "description=..." \
  -F "image=@image.jpg"
```

### DELETE /product/{id}
Delete product by ID.
```bash
curl -X DELETE http://localhost:5000/product/uuid
```

### GET /health
Health check endpoint.
```bash
curl http://localhost:5000/health
```

---

## 🖼️ Image Handling

### Marquee Images
- Stored in `frontend/public/`
- Loaded directly from frontend (no backend calls)
- CSS animation, infinite loop
- Recommended size: 250x200px

### Product Images
- Uploaded by admin panel
- **Auto-compressed** before upload:
  - Max width: 800px
  - Quality: 60%
  - Format: JPEG
- Stored in Supabase Storage
- Public URLs generated automatically

---

## ⚙️ Configuration

### Admin Password

**Local Development:**
```bash
# frontend/.env
VITE_ADMIN_PASSWORD=admin123
```

**Production:**
Change to secure password and deploy to Vercel.

### WhatsApp Number

Edit `frontend/src/pages/Products.tsx`:
```typescript
const whatsappNumber = '919876543210'  // Country code + number
```

### Theme Colors

Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  brown: '#6B4F3A',      // Primary brown
  sand: '#F5E9DA',       // Light background
  'forest-green': '#5A7D7C', // Accent green
}
```

---

## 🔐 Security Checklist

- [ ] Admin password changed from default
- [ ] CORS origins configured for your domain
- [ ] Supabase credentials not in public code
- [ ] `.env` files added to `.gitignore`
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Supabase RLS policies configured
- [ ] Regular database backups enabled

---

## 🚢 Deployment

### Frontend (Vercel)
- Zero-config deployment
- Auto-deploys on GitHub push
- CDN everywhere
- Free tier included

### Backend (Render)
- Simple deploy from GitHub
- Auto-restart on failure
- Environment variables managed
- Free tier (with cold start delay)

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for complete instructions.

---

## 💾 Database Schema

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### Storage Bucket
- Name: `products`
- Public: Yes
- Files: `products/product_<uuid>.jpg`

---

## 📊 Performance

### Frontend Optimization
- Vite for fast builds
- Tailwind CSS for minimal CSS
- React lazy loading ready
- CDN delivery via Vercel

### Backend Optimization
- Flask for lightweight API
- Pillow compression reduces upload size
- Supabase for fast database
- Gunicorn for production

### Image Optimization
- Server-side compression (Pillow)
- JPEG format (efficient)
- 60% quality (good visual quality)
- Max 800px width

---

## 🐛 Troubleshooting

### Frontend Issues
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run dev

# Clear port
lsof -i :5173 && kill -9 <PID>
```

### Backend Issues
```bash
# Update dependencies
pip install -r requirements.txt --upgrade

# Clear port
lsof -i :5000 && kill -9 <PID>
```

### Database Connection
- Verify Supabase URL starts with `https://`
- Use Anon Key (not Service Role Key)
- Check project is not paused
- Verify storage bucket exists

See [LOCAL_SETUP.md](./docs/LOCAL_SETUP.md#troubleshooting) for more.

---

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Flask Documentation](https://flask.palletsprojects.com)
- [Supabase Docs](https://supabase.com/docs)
- [Python Pillow](https://pillow.readthedocs.io)

---

## 📋 File Checklist

### Frontend Structure
- ✅ React app with Vite bundler
- ✅ Tailwind CSS styling
- ✅ 5 page components (Home, Products, About, Blog, Admin)
- ✅ Header and Footer components
- ✅ API client with axios
- ✅ CSS animations (marquee)
- ✅ Mobile responsive design
- ✅ Environment configuration

### Backend Structure
- ✅ Flask API server
- ✅ 3 main API endpoints
- ✅ Image compression with Pillow
- ✅ Supabase integration
- ✅ CORS configuration
- ✅ Environment-based config
- ✅ Production-ready (Gunicorn)
- ✅ Health check endpoint

### Documentation
- ✅ Main README (this file)
- ✅ Quick Start Guide
- ✅ Local Setup Guide
- ✅ Supabase Configuration
- ✅ Deployment Guide
- ✅ Comprehensive Comments in Code

---

## 🎯 Next Steps

1. **Set up Supabase**: Follow [Supabase Setup](./docs/SUPABASE_SETUP.md)
2. **Run locally**: Follow [Quick Start](./QUICKSTART.md)
3. **Customize**: Update colors, text, images
4. **Deploy**: Follow [Deployment Guide](./docs/DEPLOYMENT.md)
5. **Share**: Tell farmers about your platform!

---

## 📞 Support

1. Check the relevant guide in `/docs` directory
2. Review browser console for frontend errors
3. Check terminal logs for backend errors
4. Verify Supabase and environment configuration

---

## 📄 License & Credits

This project is created for the Senkulatharu farmer cooperative, supporting sustainable dryland farming in Kadavur, Tamil Nadu.

**Supporting farmers. Celebrating sustainability. Direct from farm to table.** 🌾

---

## 🙏 Acknowledgments

- Built with ❤️ for Senkulatharu farmers
- Powered by React, Flask, and Supabase
- Inspired by sustainable agriculture

---

**Ready to launch? Start with [Quick Start Guide](./QUICKSTART.md)** 🚀

---

*Last Updated: March 2024*
*Built for modern web technologies with a traditional farming spirit*
