import { Page } from '../App'

interface HeaderProps {
  onNavigate: (page: Page) => void
  currentPage: Page
}

const navItems: { key: Page; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'products', label: 'Products' },
  { key: 'blog', label: 'Blog' },
  { key: 'contact', label: 'Contact' },
]

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const isActive = (page: Page) => currentPage === page
  const whatsappNumber = '919080059430'
  const callNumber = '+919080059430'

  return (
    <header className="sticky top-0 z-50 border-b border-brown/10 bg-white/85 backdrop-blur-md shadow-[0_8px_22px_rgba(29,58,44,0.1)]">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 lg:px-10 py-3">
        <nav aria-label="Primary navigation" className="flex items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/logo.png"
              alt="Senkulatharu logo"
              className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover border border-brown/15 shadow-sm shrink-0"
            />
            <div className="min-w-0 leading-tight">
              <h1 className="text-xl md:text-2xl font-bold text-brown tracking-tight truncate">SENKULATHARU</h1>
              <p className="text-[10px] md:text-xs text-forest-green font-semibold italic truncate">இது உதிரத்தில் இணைத்த உழவு</p>
            </div>
          </div>

          <div className="hidden lg:grid flex-1 grid-cols-5 items-center mx-6 xl:mx-10">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                aria-current={isActive(item.key) ? 'page' : undefined}
                className={`w-full text-center text-base font-semibold transition-colors duration-200 border-b-2 pb-1 ${
                  isActive(item.key)
                    ? 'text-forest-green border-forest-green'
                    : 'text-brown/80 border-transparent hover:text-brown'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => onNavigate('admin')}
              aria-current={isActive('admin') ? 'page' : undefined}
              className={`inline-flex items-center rounded-xl px-3.5 py-2 text-sm font-semibold border transition-colors ${
                isActive('admin')
                  ? 'bg-emerald-100 text-brown border-emerald-300'
                  : 'bg-white text-brown border-brown/20 hover:bg-emerald-50'
              }`}
            >
              Quick Login
            </button>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center rounded-xl bg-emerald-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`tel:${callNumber}`}
              className="inline-flex items-center rounded-xl bg-blue-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
            >
              Call Us
            </a>
          </div>
        </nav>

        <div className="mt-3 flex lg:hidden items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              aria-current={isActive(item.key) ? 'page' : undefined}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold border transition-colors ${
                isActive(item.key)
                  ? 'bg-emerald-100 text-brown border-emerald-300'
                  : 'bg-white text-brown/80 border-brown/20 hover:bg-emerald-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => onNavigate('admin')}
            aria-current={isActive('admin') ? 'page' : undefined}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold border transition-colors ${
              isActive('admin')
                ? 'bg-emerald-100 text-brown border-emerald-300'
                : 'bg-white text-brown/80 border-brown/20 hover:bg-emerald-50'
            }`}
          >
            Quick Login
          </button>
          <a
            href={`tel:${callNumber}`}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Call Us
          </a>
        </div>
      </div>
    </header>
  )
}
