import { Page } from '../App'

interface FooterProps {
  onNavigate: (page: Page) => void
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brown text-sand mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-3">Senkulatharu</h3>
            <p className="text-sm opacity-90">
              Supporting farmers through authentic, naturally grown produce from the dryland farms of Kadavur.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-bold mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => onNavigate('home')} className="text-sm opacity-90 hover:opacity-100 text-left">
                Home
              </button>
              <button onClick={() => onNavigate('products')} className="text-sm opacity-90 hover:opacity-100 text-left">
                Products
              </button>
              <button onClick={() => onNavigate('about')} className="text-sm opacity-90 hover:opacity-100 text-left">
                About
              </button>
              <button onClick={() => onNavigate('blog')} className="text-sm opacity-90 hover:opacity-100 text-left">
                Blog
              </button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-3">Contact</h3>
            <p className="text-sm opacity-90">
              📧 Email: info@senkulatharu.com
            </p>
            <p className="text-sm opacity-90 mt-2">
              📱 WhatsApp: Available on product pages
            </p>
            <p className="text-sm opacity-90 mt-2">
              📍 Kadavur, Tamil Nadu
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-sand/20 pt-8">
          <p className="text-center text-sm opacity-75">
            © {currentYear} Senkulatharu. Supporting dryland farmers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
