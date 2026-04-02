import { useEffect, useState } from 'react'
import { Product, getProducts } from '../api/products'

const PRODUCT_SEARCH_PREFILL_KEY = 'senkulatharu_products_search_prefill'

const parseTaggedCategory = (description: string): string => {
  const match = description.match(/\[Category:\s*([^\]]+)\]/i)
  return match ? match[1].trim() : 'Others'
}

const parseTaggedStock = (description: string): number => {
  const match = description.match(/\[Stock:\s*(\d+)\]/i)
  return match ? Number(match[1]) : 0
}

const stripMetaTags = (description: string): string => {
  return description
    .replace(/\[Category:\s*[^\]]+\]\s*/gi, '')
    .replace(/\[Stock:\s*\d+\]\s*/gi, '')
    .trim()
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    const prefill = sessionStorage.getItem(PRODUCT_SEARCH_PREFILL_KEY)
    if (!prefill) return
    setSearchTerm(prefill)
    sessionStorage.removeItem(PRODUCT_SEARCH_PREFILL_KEY)
  }, [])

  useEffect(() => {
    const filtered = products.filter((product) => {
      const text = `${product.name} ${stripMetaTags(product.description)}`.toLowerCase()
      const matchesSearch = text.includes(searchTerm.toLowerCase())
      const category = parseTaggedCategory(product.description)
      const matchesCategory = selectedCategory === 'All' || category === selectedCategory
      return matchesSearch && matchesCategory
    })
    setFilteredProducts(filtered)
  }, [searchTerm, products, selectedCategory])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
      const dynamicCategories = Array.from(new Set(data.map((p) => parseTaggedCategory(p.description))))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b))
      setCategories(dynamicCategories)
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryCount = (category: string) => {
    if (category === 'All') return products.length
    return products.filter((p) => parseTaggedCategory(p.description) === category).length
  }

  const handleWhatsAppOrder = (product: Product) => {
    const message = `Hello, I want to order ${product.name}, Price: ₹${product.price}`
    const encodedMessage = encodeURIComponent(message)
    const whatsappNumber = '919080059430'
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-100 to-emerald-200 pt-4 md:pt-6 pb-12">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-brown">Our Products</h1>
              <p className="text-lg text-brown/75 max-w-2xl">
                Direct from Kadavur farms. Order via WhatsApp to reserve the freshest batches.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3 text-sm text-brown/70">
              <div className="divider-dot" aria-hidden />
              Packed slow • Shipped fresh
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 glass-surface rounded-2xl p-4 shadow-sage">
          <div className="flex items-center gap-3 border border-brown/10 rounded-xl px-4 py-3 bg-white/70">
            <span className="text-brown/60" aria-hidden>🔎</span>
            <input
              type="text"
              placeholder="Search grains, oils, honey, tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-brown placeholder-brown/50"
            />
          </div>
        </div>

        {!loading && products.length > 0 && (
          <div className="mb-8 glass-surface rounded-2xl p-5 shadow-sage border border-brown/10">
            <h2 className="text-lg md:text-xl font-bold text-brown mb-4">Product categories</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  selectedCategory === 'All'
                    ? 'bg-forest-green text-white shadow-amber'
                    : 'bg-white text-brown border border-brown/15 hover:border-forest-green/40'
                }`}
              >
                All ({getCategoryCount('All')})
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                    selectedCategory === category
                      ? 'bg-forest-green text-white shadow-amber'
                      : 'bg-white text-brown border border-brown/15 hover:border-forest-green/40'
                  }`}
                >
                  {category} ({getCategoryCount(category)})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-lg text-brown">Loading products...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="glass-surface rounded-2xl p-12 text-center shadow-sage">
            <p className="text-lg text-brown mb-4">No products available yet.</p>
            <p className="text-sm text-brown/70">Check back soon for fresh produce from our farmers!</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-12">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="tilt-card bg-white/80 border border-brown/10 rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="relative h-64 bg-emerald-50 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23999%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EProduct Image%3C/text%3E%3C/svg%3E'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown/70 to-transparent" />
                  <div className="absolute left-4 bottom-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/90 text-xs font-semibold text-brown">
                      {parseTaggedCategory(product.description)}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-200/90 text-xs font-semibold text-brown">
                      Stock: {parseTaggedStock(product.description)}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-brown">{product.name}</h3>
                  <p className="text-brown/70 text-sm leading-relaxed line-clamp-3">
                    {stripMetaTags(product.description)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-forest-green">₹{product.price}</span>
                    <button
                      onClick={() => handleWhatsAppOrder(product)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-forest-green to-emerald-500 text-white font-semibold shadow-amber"
                    >
                      WhatsApp order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Search Results */}
        {!loading && products.length > 0 && filteredProducts.length === 0 && (
          <div className="glass-surface rounded-2xl p-12 text-center shadow-sage">
            <p className="text-lg text-brown">No products found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
