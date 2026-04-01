import os
from flask import Flask, request
from flask_cors import CORS
from config import Config
from routes import bp


def _normalize_origin(origin: str) -> str:
    return (origin or '').strip().rstrip('/')

def create_app():
    """Create and configure Flask app."""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app, resources={r"/*": {"origins": Config.CORS_ORIGINS}})

    @app.after_request
    def add_cors_headers(response):
        origin = _normalize_origin(request.headers.get('Origin', ''))
        is_vercel_domain = origin.endswith('.vercel.app')
        if origin in Config.CORS_ORIGINS or origin.startswith('http://localhost:') or is_vercel_domain:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Vary'] = 'Origin'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Admin-Password'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        return response
    
    # Register blueprints
    app.register_blueprint(bp)
    
    return app


if __name__ == '__main__':
    app = create_app()
    
    # Use environment variable for port, default to 5000
    port = int(os.getenv('PORT', 5000))
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=Config.DEBUG
    )
