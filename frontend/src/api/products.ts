import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Product {
  id: string
  name: string
  price: number
  description: string
  image_url: string
  category?: string
  stock?: number
}

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get('/products')
    return response.data.products || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Add product (admin)
export const addProduct = async (formData: FormData): Promise<{ success: boolean; message: string; product?: Product }> => {
  try {
    const response = await apiClient.post('/add-product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add product',
    }
  }
}

// Delete product (admin)
export const deleteProduct = async (productId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/product/${productId}`)
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete product',
    }
  }
}

// Update product (admin)
export const updateProduct = async (
  productId: string,
  payload: Partial<Pick<Product, 'name' | 'price' | 'description' | 'category' | 'stock'>>
): Promise<{ success: boolean; message: string; product?: Product }> => {
  try {
    const response = await apiClient.put(`/product/${productId}`, payload)
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update product',
    }
  }
}

export default apiClient
