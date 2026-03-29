import { useEffect, useState } from 'react'
import { Product, addProduct, deleteProduct, getProducts, updateProduct } from '../api/products'
import {
  addCarouselImage,
  getCarouselImages,
  getDefaultCarouselImages,
  removeCarouselImage,
  resetCarouselImages,
} from '../api/carousel'

const CATEGORY_STORAGE_KEY = 'senkulatharu_custom_categories'
const UNCAT = 'Uncategorized'

type AdminSection = 'add-product' | 'products' | 'categories' | 'carousels'

type CarouselTarget = 'top' | 'marquee'

interface AdminProduct extends Product {
  category: string
  stock: number
  cleanDescription: string
}

const parseCategoryFromDescription = (description: string) => {
  const match = description.match(/\[Category:\s*([^\]]+)\]/i)
  return match ? match[1].trim() : UNCAT
}

const parseStockFromDescription = (description: string) => {
  const match = description.match(/\[Stock:\s*(\d+)\]/i)
  return match ? Number(match[1]) : 0
}

const stripMetaTags = (description: string) => {
  return description
    .replace(/\[Category:\s*[^\]]+\]\s*/gi, '')
    .replace(/\[Stock:\s*\d+\]\s*/gi, '')
    .trim()
}

const buildDescriptionWithMeta = (description: string, category: string, stock: string) => {
  const cleaned = stripMetaTags(description)
  if (!cleaned) return ''

  const tags: string[] = []
  if (category && category !== UNCAT) {
    tags.push(`[Category: ${category}]`)
  }

  if (stock !== '') {
    const safeStock = Math.max(0, Math.floor(Number(stock)))
    if (!Number.isNaN(safeStock)) {
      tags.push(`[Stock: ${safeStock}]`)
    }
  }

  return tags.length > 0 ? `${tags.join(' ')} ${cleaned}` : cleaned
}

const normalizeProduct = (product: Product): AdminProduct => {
  const category = parseCategoryFromDescription(product.description || '')
  const stock = parseStockFromDescription(product.description || '')

  return {
    ...product,
    category,
    stock,
    cleanDescription: stripMetaTags(product.description || ''),
  }
}

const readCustomCategories = (): string[] => {
  const saved = localStorage.getItem(CATEGORY_STORAGE_KEY)
  if (!saved) return []
  try {
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

const saveCustomCategories = (categories: string[]) => {
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories))
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [adminSessionPassword, setAdminSessionPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeSection, setActiveSection] = useState<AdminSection>('add-product')
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    description: '',
    category: UNCAT,
    stock: '0',
  })

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: UNCAT,
    stock: '0',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [topCarouselImages, setTopCarouselImages] = useState<string[]>(() => getDefaultCarouselImages())
  const [marqueeCarouselImages, setMarqueeCarouselImages] = useState<string[]>(() => getDefaultCarouselImages())
  const [topCarouselFile, setTopCarouselFile] = useState<File | null>(null)
  const [marqueeCarouselFile, setMarqueeCarouselFile] = useState<File | null>(null)

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

  const loadCarouselState = async () => {
    try {
      const [topImages, movingImages] = await Promise.all([
        getCarouselImages('top'),
        getCarouselImages('marquee'),
      ])
      setTopCarouselImages(topImages)
      setMarqueeCarouselImages(movingImages)
    } catch (err: any) {
      setError(err?.message || 'Failed to load carousel images from database')
      setTopCarouselImages([])
      setMarqueeCarouselImages([])
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === adminPassword) {
      setAdminSessionPassword(password)
      setIsAuthenticated(true)
      setPassword('')
      setError('')
      loadProducts()
      refreshCategories([])
      loadCarouselState()
    } else {
      setError('Incorrect password')
    }
  }

  const loadProducts = async () => {
    try {
      const data = await getProducts()
      const normalized = data.map(normalizeProduct)
      setProducts(normalized)
      refreshCategories(normalized)
    } catch {
      setError('Failed to load products')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts()
      loadCarouselState()
    }
  }, [isAuthenticated])

  const refreshCategories = (productList: AdminProduct[]) => {
    const fromProducts = productList
      .map((p) => p.category)
      .filter((c) => c && c !== UNCAT)

    const merged = Array.from(new Set([...readCustomCategories(), ...fromProducts]))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))

    setCategories(merged)
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name || !formData.price || !formData.description || !selectedFile) {
      setError('All product fields are required')
      return
    }

    if (formData.stock === '' || Number(formData.stock) < 0) {
      setError('Stock must be 0 or more')
      return
    }

    setLoading(true)
    try {
      const form = new FormData()
      form.append('name', formData.name)
      form.append('price', formData.price)
      form.append('description', buildDescriptionWithMeta(formData.description, formData.category, formData.stock))
      form.append('category', formData.category)
      form.append('stock', formData.stock)
      form.append('image', selectedFile)

      const response = await addProduct(form)
      if (response.success) {
        setSuccess('Product added successfully!')
        setFormData({ name: '', price: '', description: '', category: UNCAT, stock: '0' })
        setSelectedFile(null)
        await loadProducts()
      } else {
        setError(response.message)
      }
    } catch {
      setError('Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = () => {
    const category = newCategory.trim()
    if (!category) return

    if (category.toLowerCase() === UNCAT.toLowerCase()) {
      setError('This category name is reserved')
      return
    }

    if (categories.some((c) => c.toLowerCase() === category.toLowerCase())) {
      setError('Category already exists')
      return
    }

    const updated = [...categories, category].sort((a, b) => a.localeCompare(b))
    setCategories(updated)
    saveCustomCategories(updated)
    setNewCategory('')
    setSuccess('Category added successfully!')
    setError('')
  }

  const handleDeleteCategory = async (category: string) => {
    if (!confirm(`Delete category "${category}"? Products in this category will be moved to "${UNCAT}".`)) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const productsInCategory = products.filter((p) => p.category === category)

      for (const product of productsInCategory) {
        const response = await updateProduct(product.id, {
          description: product.cleanDescription,
          category: UNCAT,
          stock: product.stock,
        })

        if (!response.success) {
          throw new Error(response.message)
        }
      }

      const updated = categories.filter((c) => c !== category)
      setCategories(updated)
      saveCustomCategories(updated)
      setSuccess('Category deleted successfully!')
      await loadProducts()
    } catch (err: any) {
      setError(err?.message || 'Failed to delete category')
    } finally {
      setLoading(false)
    }
  }

  const startEditProduct = (product: AdminProduct) => {
    setEditingProductId(product.id)
    setEditForm({
      name: product.name,
      price: String(product.price),
      description: product.cleanDescription,
      category: product.category,
      stock: String(product.stock),
    })
    setError('')
    setSuccess('')
  }

  const cancelEditProduct = () => {
    setEditingProductId(null)
    setEditForm({ name: '', price: '', description: '', category: UNCAT, stock: '0' })
  }

  const handleEditChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveEdit = async (productId: string) => {
    setError('')
    setSuccess('')

    if (!editForm.name || !editForm.price || !editForm.description) {
      setError('Name, price, and description are required')
      return
    }

    if (editForm.stock === '' || Number(editForm.stock) < 0) {
      setError('Stock must be 0 or more')
      return
    }

    setLoading(true)
    try {
      const response = await updateProduct(productId, {
        name: editForm.name,
        price: Number(editForm.price),
        description: editForm.description,
        category: editForm.category,
        stock: Number(editForm.stock),
      })

      if (response.success) {
        setSuccess('Product updated successfully!')
        cancelEditProduct()
        await loadProducts()
      } else {
        setError(response.message)
      }
    } catch {
      setError('Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    setLoading(true)
    try {
      const response = await deleteProduct(productId)
      if (response.success) {
        setSuccess('Product deleted successfully!')
        await loadProducts()
      } else {
        setError(response.message)
      }
    } catch {
      setError('Failed to delete product')
    } finally {
      setLoading(false)
    }
  }

  const handleCarouselFileSelect = (target: CarouselTarget, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (target === 'top') {
      setTopCarouselFile(file)
      return
    }

    setMarqueeCarouselFile(file)
  }

  const handleAddCarouselImage = async (target: CarouselTarget) => {
    const file = target === 'top' ? topCarouselFile : marqueeCarouselFile

    if (!file) {
      setError('Please select an image file first')
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await addCarouselImage(target, file, adminSessionPassword)
      if (target === 'top') setTopCarouselFile(null)
      if (target === 'marquee') setMarqueeCarouselFile(null)
      await loadCarouselState()

      setSuccess('Carousel image added successfully!')
    } catch (err: any) {
      setError(err?.message || 'Failed to add carousel image')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveCarouselImage = async (target: CarouselTarget, index: number) => {
    const current = target === 'top' ? topCarouselImages : marqueeCarouselImages
    if (current.length <= 1) {
      setError('At least one image is required')
      return
    }

    const imageUrl = current[index]

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await removeCarouselImage(target, imageUrl, adminSessionPassword)
      await loadCarouselState()
      setSuccess('Carousel image removed successfully!')
    } catch (err: any) {
      setError(err?.message || 'Failed to remove carousel image')
    } finally {
      setLoading(false)
    }
  }

  const handleResetCarousel = async (target: CarouselTarget) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await resetCarouselImages(target, adminSessionPassword)
      if (target === 'top') setTopCarouselFile(null)
      if (target === 'marquee') setMarqueeCarouselFile(null)
      await loadCarouselState()
      setSuccess('Carousel reset to default images')
    } catch (err: any) {
      setError(err?.message || 'Failed to reset carousel images')
    } finally {
      setLoading(false)
    }
  }

  const isDefaultFallbackImage = (imageUrl: string) => imageUrl.startsWith('/carousel/')

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sand to-amber-50 flex items-center justify-center py-12">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-brown mb-6 text-center">Admin Panel</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-brown mb-2">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border-2 border-brown/20 rounded-lg focus:outline-none focus:border-forest-green"
              />
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
            )}
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>
          <p className="text-xs text-gray-600 mt-4 text-center">Default password: admin123 (change in .env)</p>
        </div>
      </div>
    )
  }

  const sectionButtonClass = (section: AdminSection) => {
    const isActive = activeSection === section
    return `w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
      isActive
        ? 'bg-forest-green text-white shadow'
        : 'bg-white/70 text-brown hover:bg-white'
    }`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-amber-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-4xl font-bold text-brown">Admin Panel</h1>
          <button
            onClick={() => {
              setIsAuthenticated(false)
              setAdminSessionPassword('')
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="bg-brown/90 rounded-xl p-4 h-fit lg:sticky lg:top-4">
            <h2 className="text-sand text-lg font-bold mb-4">Admin Sections</h2>
            <div className="space-y-2">
              <button onClick={() => setActiveSection('add-product')} className={sectionButtonClass('add-product')}>
                Add Product
              </button>
              <button onClick={() => setActiveSection('products')} className={sectionButtonClass('products')}>
                Edit Products
              </button>
              <button onClick={() => setActiveSection('categories')} className={sectionButtonClass('categories')}>
                Product Categories
              </button>
              <button onClick={() => setActiveSection('carousels')} className={sectionButtonClass('carousels')}>
                Carousel Images
              </button>
            </div>
          </aside>

          <main className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>
            )}

            {activeSection === 'add-product' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-brown mb-4">Add New Product</h2>
                <form onSubmit={handleAddProduct} className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-sm font-semibold text-brown mb-1">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-brown/20 rounded-lg focus:outline-none focus:border-forest-green text-sm"
                      placeholder="e.g., Organic Rice"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brown mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleFormChange('price', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-brown/20 rounded-lg focus:outline-none focus:border-forest-green text-sm"
                      placeholder="e.g., 250"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brown mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-brown/20 rounded-lg focus:outline-none focus:border-forest-green text-sm h-24 resize-none"
                      placeholder="Describe the product..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brown mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-brown/20 rounded-lg focus:outline-none focus:border-forest-green text-sm"
                    >
                      <option value={UNCAT}>{UNCAT}</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brown mb-1">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => handleFormChange('stock', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-brown/20 rounded-lg focus:outline-none focus:border-forest-green text-sm"
                      placeholder="e.g., 100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brown mb-1">Product Image</label>
                    <input type="file" accept="image/*" onChange={handleFileSelect} className="w-full text-sm" />
                    {selectedFile && <p className="text-xs text-green-600 mt-1">✓ {selectedFile.name} selected</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding...' : 'Add Product'}
                  </button>
                </form>
              </div>
            )}

            {activeSection === 'products' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-brown mb-4">Products ({products.length})</h2>

                {products.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No products yet. Add one using the form.</p>
                ) : (
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="border-2 border-brown/10 rounded-lg p-4 hover:border-forest-green transition-colors"
                      >
                        <div className="flex gap-4">
                          <div className="w-20 h-20 flex-shrink-0">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect fill=%22%23e5e7eb%22 width=%2280%22 height=%2280%22/%3E%3C/svg%3E'
                              }}
                            />
                          </div>

                          <div className="flex-1">
                            {editingProductId === product.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editForm.name}
                                  onChange={(e) => handleEditChange('name', e.target.value)}
                                  className="w-full px-2 py-1 border border-brown/20 rounded text-sm"
                                />
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editForm.price}
                                  onChange={(e) => handleEditChange('price', e.target.value)}
                                  className="w-full px-2 py-1 border border-brown/20 rounded text-sm"
                                />
                                <select
                                  value={editForm.category}
                                  onChange={(e) => handleEditChange('category', e.target.value)}
                                  className="w-full px-2 py-1 border border-brown/20 rounded text-sm"
                                >
                                  <option value={UNCAT}>{UNCAT}</option>
                                  {categories.map((category) => (
                                    <option key={category} value={category}>
                                      {category}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="number"
                                  min="0"
                                  value={editForm.stock}
                                  onChange={(e) => handleEditChange('stock', e.target.value)}
                                  className="w-full px-2 py-1 border border-brown/20 rounded text-sm"
                                />
                                <textarea
                                  value={editForm.description}
                                  onChange={(e) => handleEditChange('description', e.target.value)}
                                  className="w-full px-2 py-1 border border-brown/20 rounded text-sm h-16 resize-none"
                                />
                              </div>
                            ) : (
                              <>
                                <h3 className="font-bold text-brown">{product.name}</h3>
                                <p className="text-xs text-forest-green font-semibold mt-1">Category: {product.category}</p>
                                <p className="text-xs text-brown/80 font-semibold mt-1">Stock: {product.stock}</p>
                                <p className="text-sm text-gray-700 line-clamp-1">{product.cleanDescription}</p>
                                <p className="text-lg font-bold text-forest-green mt-1">₹{product.price}</p>
                              </>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            {editingProductId === product.id ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(product.id)}
                                  disabled={loading}
                                  className="px-3 py-2 bg-forest-green text-white rounded text-sm hover:opacity-90 disabled:opacity-50"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditProduct}
                                  disabled={loading}
                                  className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditProduct(product)}
                                  disabled={loading}
                                  className="px-3 py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700 transition-colors disabled:opacity-50"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  disabled={loading}
                                  className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'categories' && (
              <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl">
                <h2 className="text-2xl font-bold text-brown mb-4">Manage Categories</h2>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="flex-1 px-3 py-2 border-2 border-brown/20 rounded-lg focus:outline-none focus:border-forest-green text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3 py-2 bg-forest-green text-white rounded-lg text-sm hover:opacity-90"
                  >
                    Add
                  </button>
                </div>

                {categories.length === 0 ? (
                  <p className="text-xs text-gray-500">No categories yet.</p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center justify-between bg-sand/40 px-3 py-2 rounded text-sm">
                        <span className="text-brown font-semibold">{category}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category)}
                          className="text-red-700 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'carousels' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-brown">Top Carousel Images</h2>
                    <button
                      type="button"
                      onClick={() => handleResetCarousel('top')}
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
                    >
                      Reset Defaults
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Admin-managed images from database. Upload or remove images here.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCarouselFileSelect('top', e)}
                      className="text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCarouselImage('top')}
                      disabled={loading || !topCarouselFile}
                      className="px-4 py-2 bg-forest-green text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
                    >
                      Add to Top Carousel
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {topCarouselImages.length === 0 && (
                      <div className="col-span-full text-sm text-gray-600 bg-sand/30 rounded-lg px-3 py-4">
                        No top carousel images yet. Upload images to display them on Home.
                      </div>
                    )}
                    {topCarouselImages.map((image, index) => (
                      <div key={`top-${index}`} className="relative border rounded-lg overflow-hidden bg-sand/30">
                        <img src={image} alt={`Top carousel ${index + 1}`} className="w-full h-28 object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveCarouselImage('top', index)}
                          className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-brown">Moving Carousel Images</h2>
                    <button
                      type="button"
                      onClick={() => handleResetCarousel('marquee')}
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
                    >
                      Reset Defaults
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Admin-managed images from database. Upload or remove images here.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCarouselFileSelect('marquee', e)}
                      className="text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCarouselImage('marquee')}
                      disabled={loading || !marqueeCarouselFile}
                      className="px-4 py-2 bg-forest-green text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
                    >
                      Add to Moving Carousel
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {marqueeCarouselImages.length === 0 && (
                      <div className="col-span-full text-sm text-gray-600 bg-sand/30 rounded-lg px-3 py-4">
                        No moving carousel images yet. Upload images to display them on Home.
                      </div>
                    )}
                    {marqueeCarouselImages.map((image, index) => (
                      <div key={`marquee-${index}`} className="relative border rounded-lg overflow-hidden bg-sand/30">
                        <img src={image} alt={`Moving carousel ${index + 1}`} className="w-full h-28 object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveCarouselImage('marquee', index)}
                          className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
