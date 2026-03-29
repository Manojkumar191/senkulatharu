import { useState, useEffect } from 'react'
import { Page } from '../App'
import { getCarouselImages, getDefaultCarouselImages } from '../api/carousel'

const TOP_CAROUSEL_CACHE_KEY = 'senkulatharu_top_carousel_cache'
const MARQUEE_CAROUSEL_CACHE_KEY = 'senkulatharu_marquee_carousel_cache'

const readCarouselCache = (key: string): string[] => {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string' && v.trim().length > 0) : []
  } catch {
    return []
  }
}

const writeCarouselCache = (key: string, images: string[]) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(images))
  } catch {
    // Ignore cache write failures (private mode/storage limits).
  }
}

interface HomeProps {
  onNavigate: (page: Page) => void
}

export default function Home({ onNavigate }: HomeProps) {
  const [topCarouselImages, setTopCarouselImages] = useState<string[]>(() => readCarouselCache(TOP_CAROUSEL_CACHE_KEY))
  const [marqueeImages, setMarqueeImages] = useState<string[]>(() => readCarouselCache(MARQUEE_CAROUSEL_CACHE_KEY))
  const [isCarouselLoaded, setIsCarouselLoaded] = useState(false)

  // State for interactive carousel
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate carousel every 3 seconds
  useEffect(() => {
    if (topCarouselImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topCarouselImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [topCarouselImages.length])

  useEffect(() => {
    const loadCarouselImages = async () => {
      try {
        const [topImages, movingImages] = await Promise.all([
          getCarouselImages('top'),
          getCarouselImages('marquee'),
        ])
        setTopCarouselImages(topImages)
        setMarqueeImages(movingImages)
        writeCarouselCache(TOP_CAROUSEL_CACHE_KEY, topImages)
        writeCarouselCache(MARQUEE_CAROUSEL_CACHE_KEY, movingImages)
      } catch {
        setTopCarouselImages([])
        setMarqueeImages([])
      } finally {
        setIsCarouselLoaded(true)
      }
    }

    loadCarouselImages()
  }, [])

  useEffect(() => {
    if (currentIndex >= topCarouselImages.length) {
      setCurrentIndex(0)
    }
  }, [currentIndex, topCarouselImages.length])

  // Handle arrow navigation
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + topCarouselImages.length) % topCarouselImages.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % topCarouselImages.length)
  }

  // Create duplicate images for seamless marquee loop
  const extendedImages = [...marqueeImages, ...marqueeImages]
  const marqueeProductNames = [
    'Heritage Rices',
    'Wheat Grains & Flours',
    'Cold-Pressed Oils',
    'Forest Honey & Herbs',
  ]

  const categories = [
    { id: 1, name: 'Rice, Millets & Dal', icon: '🌾' },
    { id: 2, name: 'Forest honey, Sundakai, Avaram poo', icon: '🍯' },
    { id: 3, name: 'Oils', badge: 'Coming Soon', icon: '🫗' },
    { id: 4, name: 'Garden kits', icon: '🌱' },
  ]

  const feedbacks = [
    {
      id: 1,
      line1: 'The millet quality is excellent and very fresh.',
      line2: 'Packing was neat and delivery was on time.',
      line3: 'My family loved the taste.',
      name: 'Karthik R.',
    },
    {
      id: 2,
      line1: 'Authentic products just like village-grown food.',
      line2: 'Clean grains and natural aroma in every batch.',
      line3: 'Highly recommended for healthy cooking.',
      name: 'Priya S.',
    },
    {
      id: 3,
      line1: 'Customer support was very friendly and helpful.',
      line2: 'Received exactly what was shown in the catalog.',
      line3: 'Will continue ordering regularly.',
      name: 'Mohan V.',
    },
    {
      id: 4,
      line1: 'The honey was pure and naturally sweet.',
      line2: 'No artificial taste, very genuine quality.',
      line3: 'Worth every rupee.',
      name: 'Anitha K.',
    },
  ]

  const feedbackImagePool = marqueeImages.length > 0 ? marqueeImages : topCarouselImages

  const movingFeedbacks = [...feedbacks, ...feedbacks].map((feedback, index) => ({
    ...feedback,
    imageUrl: feedbackImagePool.length > 0 ? feedbackImagePool[index % feedbackImagePool.length] : '',
  }))

  return (
    <div className="space-y-0">
      {/* Interactive Carousel Banner */}
      <section className="interactive-carousel-container">
        <div className="interactive-carousel-wrapper">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="carousel-button carousel-button-prev"
            aria-label="Previous farmer"
          >
            ‹
          </button>

          {/* Image Display */}
          <div className="carousel-image-container">
            {topCarouselImages.length > 0 ? (
              <img
                src={topCarouselImages[currentIndex]}
                alt={`Farmer ${currentIndex + 1}`}
                className="carousel-image"
              />
            ) : isCarouselLoaded ? (
              <div className="w-full h-full flex items-center justify-center text-center text-sm text-brown/80 px-4">
                Carousel is empty. Admin can upload images.
              </div>
            ) : (
              <div className="w-full h-full" />
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="carousel-button carousel-button-next"
            aria-label="Next farmer"
          >
            ›
          </button>

          {/* Dots Indicator */}
          {topCarouselImages.length > 0 && (
            <div className="carousel-dots">
              {topCarouselImages.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to farmer ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sand to-amber-50 py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-brown mb-5">
            SENKULATHARU
          </h2>
          <p className="text-2xl md:text-3xl text-forest-green italic mb-7">
            இது உதிரத்தில் இணைத்த உழவு
          </p>
          <p className="text-xl md:text-2xl text-brown font-semibold mb-5">
            Honest food from the dryland farms of Kadavur
          </p>
          <p className="text-lg text-brown/90 font-medium max-w-3xl mx-auto leading-relaxed">
            Naturally grown produce sourced from small, marginal and women farmers.
            Direct from farm to your table, supporting sustainable agriculture.
          </p>
        </div>
      </section>

      {/* Marquee Banner */}
      <section className="marquee-container">
        <div className="marquee-wrapper">
          {extendedImages.length > 0 ? (
            extendedImages.map((image, index) => (
              <div key={index} className="marquee-item">
                <img
                  src={image}
                  alt={`Product showcase ${index + 1}`}
                  className="marquee-item-image"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22200%22%3E%3Crect fill=%22%235a7d7c%22 width=%22250%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EProduct Image%3C/text%3E%3C/svg%3E'
                  }}
                />
                <div className="marquee-product-name">
                  {marqueeProductNames[index % marqueeProductNames.length]}
                </div>
              </div>
            ))
          ) : isCarouselLoaded ? (
            <div className="w-full py-8 text-center text-sm text-brown/80">
              Moving carousel is empty. Admin can upload images.
            </div>
          ) : (
            <div className="w-full py-8" />
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-brown/5 to-forest-green/5">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl md:text-5xl font-bold text-brown mb-14 text-center">
            Product Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="card-hover p-9 md:p-10 bg-white rounded-lg shadow-md text-center cursor-pointer hover:shadow-lg min-h-[250px] flex flex-col items-center justify-center"
                onClick={() => onNavigate('products')}
              >
                <div className="text-6xl mb-5">{category.icon}</div>
                <h4 className="text-xl md:text-2xl font-bold text-brown mb-3">
                  {category.name}
                </h4>
                {category.badge && (
                  <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 text-sm font-semibold rounded-full">
                    {category.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-forest-green text-sand">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to taste authentic dryland produce?
          </h3>
          <p className="text-lg mb-8 opacity-90">
            Browse our products and order directly via WhatsApp
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="btn-primary text-lg px-8 py-3"
          >
            Browse Products
          </button>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-brown mb-6 text-center">
              Why Choose Senkulatharu?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card-hover p-8 md:p-10 bg-sand rounded-lg min-h-[210px]">
                <div className="text-5xl mb-4">🌱</div>
                <h4 className="text-2xl font-bold text-brown mb-3">Naturally Grown</h4>
                <p className="text-lg text-gray-700 leading-relaxed">
                  No chemical inputs. Pure, organic farming methods from generations of dryland farming knowledge.
                </p>
              </div>
              <div className="card-hover p-8 md:p-10 bg-sand rounded-lg min-h-[210px]">
                <div className="text-5xl mb-4">👨‍🌾</div>
                <h4 className="text-2xl font-bold text-brown mb-3">Direct from Farmers</h4>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Support small, marginal and women farmers. Fair prices, direct relationships.
                </p>
              </div>
              <div className="card-hover p-8 md:p-10 bg-sand rounded-lg min-h-[210px]">
                <div className="text-5xl mb-4">🏜️</div>
                <h4 className="text-2xl font-bold text-brown mb-3">Dryland Farming</h4>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Sustainable agriculture adapted to Kadavur's climate. Water-efficient and eco-friendly.
                </p>
              </div>
              <div className="card-hover p-8 md:p-10 bg-sand rounded-lg min-h-[210px]">
                <div className="text-5xl mb-4">✨</div>
                <h4 className="text-2xl font-bold text-brown mb-3">Premium Quality</h4>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Carefully harvested and processed. Maintains nutritional value and authentic taste.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="feedback-marquee-container">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-sand text-center mb-8">
            Customer Feedback
          </h3>
        </div>
        <div className="feedback-marquee-wrapper">
          {movingFeedbacks.map((feedback, index) => (
            <div key={`${feedback.id}-${index}`} className="feedback-card">
              <div className="feedback-card-content">
                {feedback.imageUrl && (
                  <img
                    src={feedback.imageUrl}
                    alt={`${feedback.name} review`}
                    className="feedback-card-image"
                  />
                )}
                <div className="feedback-card-text">
                  <p>{feedback.line1}</p>
                  <p>{feedback.line2}</p>
                  <p>{feedback.line3}</p>
                  <span>{feedback.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
