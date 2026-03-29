export type CarouselSection = 'top' | 'marquee'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const getDefaultCarouselImages = (): string[] => []

export const getCarouselImages = async (section: CarouselSection): Promise<string[]> => {
	const response = await fetch(`${API_URL}/carousel-images/${section}`)
	const data = await response.json()

	if (!response.ok || !data?.success) {
		throw new Error(data?.message || 'Failed to load carousel images')
	}

	const urls = Array.isArray(data?.images) ? data.images.filter(Boolean) : []
	return urls
}

export const addCarouselImage = async (section: CarouselSection, file: File, adminPassword: string) => {
	const form = new FormData()
	form.append('section', section)
	form.append('image', file)

	const response = await fetch(`${API_URL}/carousel-image`, {
		method: 'POST',
		headers: {
			'X-Admin-Password': adminPassword,
		},
		body: form,
	})

	const data = await response.json()
	if (!response.ok || !data?.success) {
		throw new Error(data?.message || 'Failed to add carousel image')
	}

	return data?.image?.image_url || ''
}

export const removeCarouselImage = async (section: CarouselSection, imageUrl: string, adminPassword: string) => {
	const response = await fetch(`${API_URL}/carousel-image`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'X-Admin-Password': adminPassword,
		},
		body: JSON.stringify({ section, image_url: imageUrl }),
	})

	const data = await response.json()
	if (!response.ok || !data?.success) {
		throw new Error(data?.message || 'Failed to remove carousel image')
	}
}

export const resetCarouselImages = async (section: CarouselSection, adminPassword: string) => {
	const response = await fetch(`${API_URL}/carousel-images/${section}`, {
		method: 'DELETE',
		headers: {
			'X-Admin-Password': adminPassword,
		},
	})

	const data = await response.json()
	if (!response.ok || !data?.success) {
		throw new Error(data?.message || 'Failed to reset carousel images')
	}
}
