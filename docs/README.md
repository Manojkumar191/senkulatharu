# Senkulatharu - Full Stack Ecommerce Application

A modern full-stack web application showcasing farmer products with direct WhatsApp ordering. Built with React, Flask, and Supabase.

## 📋 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Setup Instructions](#setup-instructions)
4. [Database Setup](#database-setup)
5. [Local Development](#local-development)
6. [Deployment](#deployment)
7. [Features](#features)

---

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Python Flask
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Image Processing**: Python Pillow
- **Deployment**: Render (Backend) + Vercel (Frontend)

---

## 📁 Project Structure

```
senkulatharu/
├── frontend/                  # React Vite application
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Blog.tsx
│   │   │   └── Admin.tsx
│   │   ├── components/       # Reusable components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── api/              # API client
│   │   │   └── products.ts
│   │   ├── App.tsx           # Main app component
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
│
├── backend/                   # Flask API
│   ├── app.py                # Main Flask app
│   ├── config.py             # Configuration
│   ├── routes.py             # API endpoints
│   ├── utils.py              # Image compression
│   ├── requirements.txt
│   └── .env.example
│
└── docs/                      # Documentation
    ├── SUPABASE_SETUP.md
    ├── DEPLOYMENT.md
    └── LOCAL_SETUP.md
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 16+ (for frontend)
- Python 3.9+ (for backend)
- Git
- Supabase account (free tier available at supabase.com)

### 1. Clone/Initialize Project

```bash
# Navigate to project directory
cd senkulatharu
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your API URL
# VITE_API_URL=http://localhost:5000
# VITE_ADMIN_PASSWORD=your_secure_password
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Update .env with Supabase credentials
# SUPABASE_URL=your_url
# SUPABASE_KEY=your_key
# SUPABASE_BUCKET=products
```

---

## 🗄️ Database Setup

See [SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md) for detailed Supabase configuration.

Quick steps:
1. Create Supabase project
2. Create `products` table with schema
3. Create `products` storage bucket
4. Get credentials and add to `.env`

---

## 💻 Local Development

### Start Backend

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
# Server runs on http://localhost:5000
```

### Start Frontend (in new terminal)

```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Default Admin Credentials

- Password: `admin123` (change in `.env`)
- URL: http://localhost:5173/admin

### Testing

1. **Homepage**: http://localhost:5173
2. **Products**: http://localhost:5173/products
3. **Admin Panel**: http://localhost:5173/admin
   - Add a test product
   - Upload an image (will be auto-compressed)
   - View in Products page
4. **WhatsApp Integration**: Click "Order via WhatsApp" on any product

---

## 🌐 Deployment

### Frontend (Vercel)

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Frontend section

Quick steps:
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Backend (Render)

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Backend section

Quick steps:
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy

---

## ✨ Key Features

### Frontend
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Marquee banner with CSS animations
- ✅ Product search and filtering
- ✅ WhatsApp integration for orders
- ✅ Admin panel for product management
- ✅ About and Blog pages with stories
- ✅ Optimized static content loading
- ✅ Clean, earthy UI with Tailwind CSS

### Backend
- ✅ Image compression (Pillow) before upload
- ✅ Supabase Storage integration
- ✅ PostgreSQL database with products table
- ✅ RESTful API endpoints
- ✅ CORS enabled for frontend
- ✅ Error handling and validation
- ✅ Health check endpoint

### Database
- ✅ Products table with proper schema
- ✅ Image storage bucket
- ✅ Public image URL generation
- ✅ Automatic image compression on upload

---

## 🔐 Security Notes

1. **Admin Password**: Change default password in `.env`
2. **CORS**: Configure for your domain only
3. **Supabase Keys**: Keep keys secret, use backend for sensitive operations
4. **Image Upload**: Only allow image files, validate on server
5. **Environment Variables**: Never commit `.env` file to git

---

## 📝 API Endpoints

### Products

```
GET /products
- Get all products
- Response: { success: true, products: [...] }

POST /add-product
- Add new product with image
- Request: FormData { name, price, description, image }
- Response: { success: true, product: {...} }

DELETE /product/<id>
- Delete product by ID
- Response: { success: true, message: "..." }

GET /health
- Health check
- Response: { status: "healthy" }
```

---

## 🖼️ Adding Marquee Images

The marquee displays 4 images. Add them to `frontend/public/`:

```
public/
├── marquee-1.jpg
├── marquee-2.jpg
├── marquee-3.jpg
└── marquee-4.jpg
```

These images are loaded from the static assets in README format to avoid backend calls.

---

## 🐛 Troubleshooting

### Images not showing in marquee
- Check `frontend/public/` for image files
- Verify file names match: `marquee-1.jpg`, `marquee-2.jpg`, etc.
- Check browser console for 404 errors

### Admin panel not submitting products
- Verify backend is running on correct port
- Check CORS settings in `.env`
- Check browser Network tab for API errors
- Verify Supabase credentials

### WhatsApp link not working
- Make sure WhatsApp number is set in `Products.tsx`
- Test with format: `919876543210` (country code + number)

### Image upload failing
- Check file size (max 25MB)
- Ensure image format is supported (jpg, png, jpeg, gif, webp)
- Check Supabase storage bucket exists and is public

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Flask Documentation](https://flask.palletsprojects.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Pillow Documentation](https://pillow.readthedocs.io)

---

## 📄 License

This project is created for Senkulatharu farmer cooperative.

---

## 🤝 Support

For issues or questions, please refer to the deployment and setup guides in the `/docs` folder.

---

**Last Updated**: March 2024
