from flask import Blueprint, request, jsonify
from supabase import create_client, Client
from config import Config
from utils import compress_image, allowed_file
import uuid
import re
import base64
import json

bp = Blueprint('api', __name__)

# Initialize Supabase (with development mode support)
supabase: Client = None
IS_DEVELOPMENT_MODE = False


def get_project_ref_from_url(url):
    try:
        host = (url or '').replace('https://', '').replace('http://', '').split('/')[0]
        return host.split('.')[0] if host else ''
    except Exception:
        return ''


def get_project_ref_from_jwt(token):
    try:
        parts = str(token or '').split('.')
        if len(parts) < 2:
            return ''

        payload = parts[1].replace('-', '+').replace('_', '/')
        padding = len(payload) % 4
        if padding:
            payload += '=' * (4 - padding)

        decoded = json.loads(base64.b64decode(payload).decode('utf-8'))
        return str(decoded.get('ref', '')).strip()
    except Exception:
        return ''


def get_effective_supabase_key():
    service_key = Config.SUPABASE_SERVICE_ROLE_KEY
    anon_key = Config.SUPABASE_KEY

    if not service_key:
        return anon_key

    url_ref = get_project_ref_from_url(Config.SUPABASE_URL)
    service_ref = get_project_ref_from_jwt(service_key)

    if url_ref and service_ref and url_ref != service_ref:
        print(
            f"⚠️  SUPABASE_SERVICE_ROLE_KEY ref '{service_ref}' does not match SUPABASE_URL ref '{url_ref}'. "
            "Falling back to SUPABASE_KEY."
        )
        return anon_key

    return service_key

try:
    if Config.SUPABASE_URL and 'your-project-id' not in Config.SUPABASE_URL:
        supabase = create_client(Config.SUPABASE_URL, get_effective_supabase_key())
    else:
        IS_DEVELOPMENT_MODE = True
        print("⚠️  Development mode: Supabase not configured. Please add SUPABASE_URL and SUPABASE_KEY to .env")
except Exception as e:
    IS_DEVELOPMENT_MODE = True
    print(f"⚠️  Development mode: Could not Initialize Supabase: {str(e)}")

# Mock products for development mode
MOCK_PRODUCTS = [
    {
        'id': 'mock-1',
        'name': 'Sample Product 1',
        'price': 500.00,
        'description': 'This is a sample product in development mode',
        'image_url': 'https://via.placeholder.com/400x300?text=Product+1',
        'created_at': '2024-01-01T00:00:00'
    }
]


def build_description_with_meta(description, category=None, stock=None):
    """Build description with optional category/stock tags while preserving plain text."""
    cleaned = (description or '').strip()
    if not cleaned:
        return ''

    # Remove existing tags to avoid duplicates during edits
    cleaned = re.sub(r'^\[Category:\s*[^\]]+\]\s*', '', cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r'^\[Stock:\s*\d+\]\s*', '', cleaned, flags=re.IGNORECASE)

    parts = []
    if category and str(category).strip().lower() != 'uncategorized':
        parts.append(f"[Category: {str(category).strip()}]")

    if stock not in [None, '']:
        try:
            stock_num = max(0, int(float(stock)))
            parts.append(f"[Stock: {stock_num}]")
        except ValueError:
            pass

    if parts:
        return f"{' '.join(parts)} {cleaned}".strip()

    return cleaned


def is_valid_carousel_section(section):
    return section in ['top', 'marquee']


def get_admin_password_error_response():
    return jsonify({'success': False, 'message': 'Unauthorized admin action'}), 401


def verify_admin_password():
    admin_password = request.headers.get('X-Admin-Password', '')
    expected = Config.ADMIN_PASSWORD or 'admin123'
    return bool(admin_password and admin_password == expected)


def normalize_image_url(url):
    return str(url or '').strip().split('?', 1)[0]


@bp.route('/carousel-images/<section>', methods=['GET'])
def get_carousel_images(section):
    """Fetch carousel images for a section."""
    try:
        if IS_DEVELOPMENT_MODE:
            return jsonify({'success': True, 'images': []}), 200

        section = (section or '').strip().lower()
        if not is_valid_carousel_section(section):
            return jsonify({'success': False, 'message': 'Invalid carousel section'}), 400

        response = supabase.table('carousel_images') \
            .select('image_url, sort_order, created_at') \
            .eq('section', section) \
            .order('sort_order') \
            .order('created_at') \
            .execute()

        rows = response.data or []
        images = [row.get('image_url') for row in rows if row.get('image_url')]

        return jsonify({'success': True, 'images': images}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500


@bp.route('/products', methods=['GET'])
def get_products():
    """Fetch all products from database."""
    try:
        if IS_DEVELOPMENT_MODE:
            # Return mock products in development mode
            return jsonify({'success': True, 'products': MOCK_PRODUCTS, 'mode': 'development'}), 200
        
        response = supabase.table('products').select('*').execute()
        products = response.data if response.data else []
        return jsonify({'success': True, 'products': products}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@bp.route('/add-product', methods=['POST'])
def add_product():
    """Add new product with image upload and compression."""
    try:
        if IS_DEVELOPMENT_MODE:
            return jsonify({
                'success': False,
                'message': 'Product upload disabled in development mode. Please configure Supabase in .env file.'
            }), 400

        # Get form data
        name = request.form.get('name')
        price = request.form.get('price')
        description = request.form.get('description')
        image = request.files.get('image')
        category = request.form.get('category')
        stock = request.form.get('stock')

        # Validation
        if not all([name, price, description, image]):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400

        if not allowed_file(image.filename):
            return jsonify({'success': False, 'message': 'Invalid image file type'}), 400

        try:
            price = float(price)
        except ValueError:
            return jsonify({'success': False, 'message': 'Invalid price format'}), 400

        # Compress image
        compressed_image, filename = compress_image(image, Config.IMAGE_MAX_WIDTH, Config.IMAGE_QUALITY)

        # Upload to Supabase Storage
        file_path = f"products/{filename}"
        supabase.storage.from_(Config.SUPABASE_BUCKET).upload(
            file_path,
            compressed_image.read(),
            {'content-type': 'image/jpeg'}
        )

        # Get public URL
        image_url = f"{Config.SUPABASE_URL}/storage/v1/object/public/{Config.SUPABASE_BUCKET}/{file_path}"

        description = build_description_with_meta(description, category, stock)

        # Insert product into database
        product_data = {
            'id': str(uuid.uuid4()),
            'name': name,
            'price': price,
            'description': description,
            'image_url': image_url,
        }
        
        response = supabase.table('products').insert(product_data).execute()

        return jsonify({
            'success': True,
            'message': 'Product added successfully',
            'product': response.data[0] if response.data else product_data
        }), 201

    except Exception as e:
        error_text = str(e)
        if 'Bucket not found' in error_text:
            return jsonify({
                'success': False,
                'message': f"Storage bucket '{Config.SUPABASE_BUCKET}' not found. Create it in Supabase: Storage -> New bucket -> name '{Config.SUPABASE_BUCKET}' (Public bucket enabled)."
            }), 400
        if 'row-level security policy' in error_text or 'Unauthorized' in error_text:
            return jsonify({
                'success': False,
                'message': f"Supabase RLS blocked this operation. Add INSERT policy for table 'products' and INSERT policy for storage.objects on bucket '{Config.SUPABASE_BUCKET}', or use a service_role key in backend .env."
            }), 403
        return jsonify({'success': False, 'message': f'Error: {error_text}'}), 500


@bp.route('/product/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product by ID."""
    try:
        if IS_DEVELOPMENT_MODE:
            return jsonify({
                'success': False,
                'message': 'Product deletion disabled in development mode.'
            }), 400

        # Get product to find image file
        response = supabase.table('products').select('image_url').eq('id', product_id).execute()
        
        if not response.data:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        product = response.data[0]
        
        # Extract file path from image URL
        if product.get('image_url'):
            try:
                # Parse the file path from URL
                public_prefix = f"/storage/v1/object/public/{Config.SUPABASE_BUCKET}/"
                file_path = product['image_url'].split(public_prefix)[-1]
                # Delete from storage
                supabase.storage.from_(Config.SUPABASE_BUCKET).remove([file_path])
            except Exception as e:
                print(f"Warning: Could not delete image file: {str(e)}")

        # Delete from database
        supabase.table('products').delete().eq('id', product_id).execute()

        return jsonify({'success': True, 'message': 'Product deleted successfully'}), 200

    except Exception as e:
        error_text = str(e)
        if 'row-level security policy' in error_text or 'Unauthorized' in error_text:
            return jsonify({
                'success': False,
                'message': f"Supabase RLS blocked delete. Add DELETE policy for table 'products' and DELETE policy for storage.objects on bucket '{Config.SUPABASE_BUCKET}', or use a service_role key in backend .env."
            }), 403
        return jsonify({'success': False, 'message': f'Error: {error_text}'}), 500


@bp.route('/product/<product_id>', methods=['PUT'])
def update_product(product_id):
    """Update product details by ID."""
    try:
        if IS_DEVELOPMENT_MODE:
            return jsonify({
                'success': False,
                'message': 'Product update disabled in development mode.'
            }), 400

        payload = request.get_json(silent=True) or {}
        update_data = {}

        if 'name' in payload and payload['name']:
            update_data['name'] = str(payload['name']).strip()

        if 'price' in payload and payload['price'] not in [None, '']:
            try:
                update_data['price'] = float(payload['price'])
            except ValueError:
                return jsonify({'success': False, 'message': 'Invalid price format'}), 400

        if 'description' in payload and payload['description']:
            category = payload.get('category')
            stock = payload.get('stock')
            update_data['description'] = build_description_with_meta(payload['description'], category, stock)

        if not update_data:
            return jsonify({'success': False, 'message': 'No valid fields to update'}), 400

        response = supabase.table('products').update(update_data).eq('id', product_id).execute()

        if not response.data:
            return jsonify({'success': False, 'message': 'Product not found'}), 404

        return jsonify({
            'success': True,
            'message': 'Product updated successfully',
            'product': response.data[0]
        }), 200

    except Exception as e:
        error_text = str(e)
        if 'row-level security policy' in error_text or 'Unauthorized' in error_text:
            return jsonify({
                'success': False,
                'message': "Supabase RLS blocked update. Add UPDATE policy for table 'products', or use a service_role key in backend .env."
            }), 403
        return jsonify({'success': False, 'message': f'Error: {error_text}'}), 500


@bp.route('/carousel-image', methods=['POST'])
def add_carousel_image():
    """Add carousel image (admin action via backend)."""
    try:
        if IS_DEVELOPMENT_MODE:
            return jsonify({
                'success': False,
                'message': 'Carousel upload disabled in development mode. Please configure Supabase in .env file.'
            }), 400

        if not verify_admin_password():
            return get_admin_password_error_response()

        section = request.form.get('section', '').strip().lower()
        image = request.files.get('image')

        if not is_valid_carousel_section(section):
            return jsonify({'success': False, 'message': 'Invalid carousel section'}), 400

        if not image or not image.filename:
            return jsonify({'success': False, 'message': 'Image file is required'}), 400

        if not allowed_file(image.filename):
            return jsonify({'success': False, 'message': 'Invalid image file type'}), 400

        compressed_image, filename = compress_image(image, Config.IMAGE_MAX_WIDTH, Config.IMAGE_QUALITY)

        file_path = f"carousel/{section}/{filename}"
        supabase.storage.from_(Config.SUPABASE_BUCKET).upload(
            file_path,
            compressed_image.read(),
            {'content-type': 'image/jpeg'}
        )

        image_url = f"{Config.SUPABASE_URL}/storage/v1/object/public/{Config.SUPABASE_BUCKET}/{file_path}"

        sort_response = supabase.table('carousel_images').select('sort_order').eq('section', section).order('sort_order', desc=True).limit(1).execute()
        next_sort_order = ((sort_response.data[0]['sort_order'] if sort_response.data else 0) + 1)

        payload = {
            'id': str(uuid.uuid4()),
            'section': section,
            'image_url': image_url,
            'storage_path': file_path,
            'sort_order': next_sort_order,
        }

        insert_response = supabase.table('carousel_images').insert(payload).execute()

        return jsonify({
            'success': True,
            'message': 'Carousel image added successfully',
            'image': insert_response.data[0] if insert_response.data else payload,
        }), 201

    except Exception as e:
        error_text = str(e)
        if 'Bucket not found' in error_text:
            return jsonify({
                'success': False,
                'message': f"Storage bucket '{Config.SUPABASE_BUCKET}' not found."
            }), 400
        if 'row-level security policy' in error_text or 'Unauthorized' in error_text:
            return jsonify({
                'success': False,
                'message': "Supabase RLS blocked carousel insert. Set SUPABASE_SERVICE_ROLE_KEY in backend .env (recommended) or create INSERT policies for carousel_images and storage.objects."
            }), 403
        return jsonify({'success': False, 'message': f'Error: {error_text}'}), 500


@bp.route('/carousel-image', methods=['DELETE'])
def delete_carousel_image():
    """Delete one carousel image (admin action via backend)."""
    try:
        if IS_DEVELOPMENT_MODE:
            return jsonify({
                'success': False,
                'message': 'Carousel delete disabled in development mode.'
            }), 400

        if not verify_admin_password():
            return get_admin_password_error_response()

        payload = request.get_json(silent=True) or {}
        section = str(payload.get('section', '')).strip().lower()
        image_url = str(payload.get('image_url', '')).strip()

        if not is_valid_carousel_section(section):
            return jsonify({'success': False, 'message': 'Invalid carousel section'}), 400

        if not image_url:
            return jsonify({'success': False, 'message': 'image_url is required'}), 400

        response = supabase.table('carousel_images').select('id, storage_path, image_url').eq('section', section).execute()
        rows = response.data or []

        wanted = normalize_image_url(image_url)
        row = next((r for r in rows if normalize_image_url(r.get('image_url')) == wanted), None)

        if not row:
            row = next((r for r in rows if r.get('storage_path') and wanted.endswith(r.get('storage_path'))), None)

        if not row:
            return jsonify({'success': True, 'message': 'Carousel image already removed'}), 200

        if row.get('storage_path'):
            supabase.storage.from_(Config.SUPABASE_BUCKET).remove([row['storage_path']])

        supabase.table('carousel_images').delete().eq('id', row['id']).execute()

        return jsonify({'success': True, 'message': 'Carousel image removed successfully'}), 200

    except Exception as e:
        error_text = str(e)
        if 'row-level security policy' in error_text or 'Unauthorized' in error_text:
            return jsonify({
                'success': False,
                'message': "Supabase RLS blocked carousel delete. Use service_role key in backend .env or allow backend role policies."
            }), 403
        return jsonify({'success': False, 'message': f'Error: {error_text}'}), 500


@bp.route('/carousel-images/<section>', methods=['DELETE'])
def reset_carousel_section(section):
    """Reset carousel section by deleting all custom images (admin action via backend)."""
    try:
        if IS_DEVELOPMENT_MODE:
            return jsonify({
                'success': False,
                'message': 'Carousel reset disabled in development mode.'
            }), 400

        if not verify_admin_password():
            return get_admin_password_error_response()

        section = (section or '').strip().lower()
        if not is_valid_carousel_section(section):
            return jsonify({'success': False, 'message': 'Invalid carousel section'}), 400

        response = supabase.table('carousel_images').select('id, storage_path').eq('section', section).execute()
        rows = response.data or []

        paths = [row.get('storage_path') for row in rows if row.get('storage_path')]
        if paths:
            supabase.storage.from_(Config.SUPABASE_BUCKET).remove(paths)

        supabase.table('carousel_images').delete().eq('section', section).execute()

        return jsonify({'success': True, 'message': 'Carousel section reset successfully'}), 200

    except Exception as e:
        error_text = str(e)
        if 'row-level security policy' in error_text or 'Unauthorized' in error_text:
            return jsonify({
                'success': False,
                'message': "Supabase RLS blocked carousel reset. Use service_role key in backend .env or allow backend role policies."
            }), 403
        return jsonify({'success': False, 'message': f'Error: {error_text}'}), 500


@bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    mode = 'development' if IS_DEVELOPMENT_MODE else 'production'
    return jsonify({'status': 'healthy', 'mode': mode}), 200
