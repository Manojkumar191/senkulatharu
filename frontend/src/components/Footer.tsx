import { Page } from '../App'

interface FooterProps {
  onNavigate: (page: Page) => void
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-surface bg-brown text-sand mt-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-white">Senkulatharu</h3>
            <p className="text-sm text-white font-semibold">
              Supporting farmers through authentic, naturally grown produce from the dryland farms of Kadavur.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-white">Quick Links</h3>
            <div className="flex flex-col gap-2 text-white">
              <button onClick={() => onNavigate('home')} className="text-sm font-semibold hover:text-sun text-left">
                Home
              </button>
              <button onClick={() => onNavigate('products')} className="text-sm font-semibold hover:text-sun text-left">
                Products
              </button>
              <button onClick={() => onNavigate('about')} className="text-sm font-semibold hover:text-sun text-left">
                About
              </button>
              <button onClick={() => onNavigate('blog')} className="text-sm font-semibold hover:text-sun text-left">
                Blog
              </button>
              <button onClick={() => onNavigate('contact')} className="text-sm font-semibold hover:text-sun text-left">
                Contact
              </button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-white">Contact</h3>
            <p className="text-sm text-white font-semibold">
              NELLU SORU MANUFACTURES AND SERVICES
            </p>
            <p className="text-sm text-white font-semibold">
              📧 Email: senkulatharu@gmail.com
            </p>
            <p className="text-sm text-white font-semibold mt-2">
              📞 Call: +91 90800 59430
            </p>
            <p className="text-sm text-white font-semibold mt-2">
              📍 No.5/223, Kurumbapatti Palaviduthi (Post), Tharagampatti (S.O), Kadavur, Karur, Tamil Nadu, India - 621311
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-sand/40 pt-8">
          <p className="text-center text-sm text-white font-semibold">
            © {currentYear} Senkulatharu. Supporting dryland farmers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
