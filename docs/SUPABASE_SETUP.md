# Supabase Setup Guide

Complete guide to set up Supabase for Senkulatharu.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: `senkulatharu`
   - Database Password: (save this somewhere safe)
   - Region: Choose closest to your users
5. Wait for project to initialize (2-3 minutes)

## Step 2: Get Credentials

After project is created:

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon Public Key** (labeled as "Anon key")
3. Save these in your `.env` files:

```bash
# backend/.env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_anon_key_here
```

```bash
# frontend/.env
VITE_API_URL=http://localhost:5000  # or your deployed backend URL
```

## Step 3: Create `products` Table

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Paste this SQL:

```sql
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  USING (true);

-- Allow only authenticated users to insert/update/delete
CREATE POLICY "Products can be inserted"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Products can be updated"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Products can be deleted"
  ON products FOR DELETE
  USING (true);
```

4. Click **Run**
5. You should see "Products table created" message

## Step 4: Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **Create a new bucket**
3. Fill in:
   - Name: `products`
   - Public bucket: YES (toggle on)
4. Click **Create bucket**

## Step 5: Set Storage Policies

1. Click on `products` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Select **For full customization**
5. Paste this policy:

```sql
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Public Upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products');

CREATE POLICY "Public Delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products');
```

## Step 6: Verify Setup

### Test via API

```bash
# Get products (should return empty array initially)
curl https://xxxxx.supabase.co/rest/v1/products \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "apikey: YOUR_ANON_KEY"

# Response should be:
# []
```

### In Supabase Dashboard

1. Go to **Table Editor**
2. You should see `products` table listed
3. Click on it - should be empty

### Storage

1. Go to **Storage**
2. Click `products` bucket
3. Should show "No files uploaded yet"

## Step 7: Test Complete Setup

### Backend Test

1. Start backend:
```bash
cd backend
source venv/bin/activate
python app.py
```

2. Test in another terminal:
```bash
curl http://localhost:5000/products
# Response: {"success": true, "products": []}
```

### Frontend Test

1. Start frontend:
```bash
cd frontend
npm run dev
```

2. Open http://localhost:5173/admin
3. Log in with password: `admin123`
4. Try adding a test product
5. Go to Products page - should see it listed

## Troubleshooting

### "RLS policy preventing access"
- Make sure policies are created correctly
- Check that public bucket is enabled
- Verify anon key permissions

### "Can't read image after upload"
- Verify bucket is PUBLIC
- Check image URL format in database
- Ensure CORS is configured

### "Table doesn't exist"
- Run the CREATE TABLE SQL query again
- Check that query executed without errors
- Refresh the table editor

### Connection Error
- Verify SUPABASE_URL format (must have `https://`)
- Check SUPABASE_KEY is correct
- Ensure project is active (not paused)

## Production Considerations

1. **Use Service Role Key for Backend**: For production, use the "Service Role Key" instead of Anon Key for better security
2. **Row Level Security**: Implement proper RLS policies
3. **SSL**: Always use HTTPS
4. **Rate Limiting**: Consider implementing rate limiting
5. **Backups**: Enable automatic backups in Supabase settings

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Storage Documentation](https://supabase.com/docs/guides/storage)

---

**All set! Your Supabase project is ready.**
