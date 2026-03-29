import os
from io import BytesIO
from PIL import Image
import uuid

def compress_image(image_file, max_width=800, quality=60):
    """
    Compress image before upload to Supabase.
    
    Args:
        image_file: File object from request
        max_width: Maximum width in pixels
        quality: JPEG quality (0-100)
    
    Returns:
        tuple: (BytesIO object, filename)
    """
    try:
        # Open image
        img = Image.open(image_file)
        
        # Convert RGBA to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Calculate new dimensions
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        
        # Save as JPEG with reduced quality
        output = BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        output.seek(0)
        
        # Generate filename
        filename = f"product_{uuid.uuid4().hex}.jpg"
        
        return output, filename
        
    except Exception as e:
        raise Exception(f"Image compression failed: {str(e)}")


def allowed_file(filename):
    """Check if file is allowed image type."""
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions
