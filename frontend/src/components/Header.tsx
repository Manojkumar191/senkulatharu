import { Page } from '../App'

interface HeaderProps {
  onNavigate: (page: Page) => void
  currentPage: Page
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const isActive = (page: Page) => currentPage === page ? 'text-green-600 font-bold' : 'text-brown hover:text-green-600'

  return (
    <header className="sticky top-0 z-50 bg-sand shadow-lg">
      <div className="w-full px-2 md:px-3 py-4">
        {/* Logo and Title */}
        <div className="mb-4 -ml-1 md:-ml-2 flex items-start gap-4">
          <img
            src="/logo.png"
            alt="Senkulatharu logo"
            className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border border-brown/20 shadow-sm"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-brown">SENKULATHARU</h1>
            <p className="text-sm text-forest-green italic">இது உதிரத்தில் இணைத்த உழவு</p>
            <p className="text-xs text-gray-600 mt-1">Honest food from the dryland farms of Kadavur</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-4 md:gap-8 border-t border-brown/20 pt-4">
          <button
            onClick={() => onNavigate('home')}
            className={`text-sm md:text-base font-medium transition-colors ${isActive('home')}`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('products')}
            className={`text-sm md:text-base font-medium transition-colors ${isActive('products')}`}
          >
            Products
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`text-sm md:text-base font-medium transition-colors ${isActive('about')}`}
          >
            About
          </button>
          <button
            onClick={() => onNavigate('blog')}
            className={`text-sm md:text-base font-medium transition-colors ${isActive('blog')}`}
          >
            Blog
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`text-sm md:text-base font-medium transition-colors ml-auto ${isActive('admin')}`}
          >
            Admin
          </button>
        </nav>
      </div>
    </header>
  )
}
