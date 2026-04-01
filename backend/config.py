import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = FLASK_ENV == 'development'
    
    # Supabase
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    EFFECTIVE_SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY
    SUPABASE_BUCKET = os.getenv('SUPABASE_BUCKET', 'products')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin123')
    
    # File Upload
    MAX_CONTENT_LENGTH = 25 * 1024 * 1024  # 25MB max file size
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    
    # Image Compression
    IMAGE_MAX_WIDTH = 800
    IMAGE_QUALITY = 60
    
    # CORS
    _raw_cors = os.getenv('CORS_ORIGINS', 'http://localhost:5173,https://yourdomain.com')
    CORS_ORIGINS = [origin.strip().rstrip('/') for origin in _raw_cors.split(',') if origin.strip()]
