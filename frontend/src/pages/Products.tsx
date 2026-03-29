import { useEffect, useState } from 'react'
import { Product, getProducts } from '../api/products'

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
    <div className="min-h-screen bg-gradient-to-br from-sand to-amber-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brown mb-4">
            Our Products
          </h1>
          <p className="text-lg text-gray-700">
            Direct from dryland farms to your table. Click "Order via WhatsApp" to place your order.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-lg border-2 border-brown/20 focus:outline-none focus:border-forest-green text-brown placeholder-gray-500"
          />
        </div>

        {!loading && products.length > 0 && (
          <div className="mb-8 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-brown/10">
            <h2 className="text-lg md:text-xl font-bold text-brown mb-4">Product Categories</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-forest-green text-white border-forest-green'
                    : 'bg-sand/40 text-brown border-brown/20 hover:bg-sand'
                }`}
              >
                All ({getCategoryCount('All')})
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-forest-green text-white border-forest-green'
                      : 'bg-sand/40 text-brown border-brown/20 hover:bg-sand'
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
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-lg text-gray-600 mb-4">
              No products available yet.
            </p>
            <p className="text-sm text-gray-500">
              Check back soon for fresh produce from our farmers!
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="card-hover bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="h-64 overflow-hidden bg-gray-200">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23999%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EProduct Image%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-sand text-brown text-xs font-semibold">
                      {parseTaggedCategory(product.description)}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-brown text-xs font-semibold">
                      Stock: {parseTaggedStock(product.description)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brown mb-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {stripMetaTags(product.description)}
                  </p>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-forest-green">
                      ₹{product.price}
                    </span>
                  </div>

                  <button
                    onClick={() => handleWhatsAppOrder(product)}
                    className="btn-whatsapp w-full justify-center"
                  >
                    <span>💬</span>
                    Order via WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Search Results */}
        {!loading && products.length > 0 && filteredProducts.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-lg text-gray-600">
              No products found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
