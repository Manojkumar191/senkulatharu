import { Page } from '../App'

interface HeaderProps {
  onNavigate: (page: Page) => void
  currentPage: Page
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const isActive = (page: Page) => currentPage === page ? 'text-green-600 font-bold' : 'text-brown hover:text-green-600'

  return (
    <header className="sticky top-0 z-50 bg-sand shadow-lg">
      <div className="w-full px-2 md:px-3 py-6">
        {/* Logo and Title */}
        <div className="mb-5 -ml-1 md:-ml-2 flex items-start gap-5">
          <img
            src="/logo.png"
            alt="Senkulatharu logo"
            className="w-24 h-24 md:w-28 md:h-28 rounded-lg object-cover border border-brown/20 shadow-sm"
          />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-brown">SENKULATHARU</h1>
            <p className="text-base text-forest-green italic">இது உதிரத்தில் இணைத்த உழவு</p>
            <p className="text-sm text-gray-600 mt-1">Honest food from the dryland farms of Kadavur</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap items-center gap-5 md:gap-10 border-t border-brown/20 pt-5 pb-1">
          <button
            onClick={() => onNavigate('home')}
            className={`text-base md:text-lg font-medium transition-colors ${isActive('home')}`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('products')}
            className={`text-base md:text-lg font-medium transition-colors ${isActive('products')}`}
          >
            Products
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`text-base md:text-lg font-medium transition-colors ${isActive('about')}`}
          >
            About
          </button>
          <button
            onClick={() => onNavigate('blog')}
            className={`text-base md:text-lg font-medium transition-colors ${isActive('blog')}`}
          >
            Blog
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`text-base md:text-lg font-medium transition-colors ml-auto ${isActive('admin')}`}
          >
            Admin
          </button>
        </nav>
      </div>
    </header>
  )
}
