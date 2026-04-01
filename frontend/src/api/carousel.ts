import { createClient } from '@supabase/supabase-js'

export type CarouselSection = 'top' | 'marquee'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
	? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
	: null

export const getDefaultCarouselImages = (): string[] => [
	'/carousel/farmer1.svg',
	'/carousel/farmer2.svg',
	'/carousel/farmer3.svg',
	'/carousel/farmer4.svg',
	'/carousel/farmer5.svg',
]

export const getCarouselImages = async (section: CarouselSection): Promise<string[]> => {
	if (supabase) {
		const { data, error } = await supabase
			.from('carousel_images')
			.select('image_url, sort_order, created_at')
			.eq('section', section)
			.order('sort_order', { ascending: true })
			.order('created_at', { ascending: true })

		if (!error && data && data.length > 0) {
			return Array.isArray(data) ? data.map((row) => row.image_url).filter(Boolean) : []
		}
	}

	const response = await fetch(`${API_URL}/carousel-images/${section}`)
	const data = await response.json()

	if (!response.ok || !data?.success) {
		return getDefaultCarouselImages()
	}

	const images = Array.isArray(data?.images) ? data.images.filter(Boolean) : []
	return images.length > 0 ? images : getDefaultCarouselImages()
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
