import { useState, useEffect, useMemo, useRef, type TouchEvent } from 'react'
import { Page } from '../App'
import { getCarouselImages, getDefaultCarouselImages } from '../api/carousel'
import { getProducts } from '../api/products'

const TOP_CAROUSEL_CACHE_KEY = 'senkulatharu_top_carousel_cache'
const MARQUEE_CAROUSEL_CACHE_KEY = 'senkulatharu_marquee_carousel_cache'
const PRODUCT_SEARCH_PREFILL_KEY = 'senkulatharu_products_search_prefill'
const MIN_SWIPE_DISTANCE = 35
const MARQUEE_SPEED_PX_PER_SECOND = 42

interface DisplayMarqueeItem {
  id: string
  name: string
  imageUrl: string
  fromProduct: boolean
}

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
  const [marqueeProducts, setMarqueeProducts] = useState<Array<{ id: string; name: string; imageUrl: string }>>([])
  const [isCarouselLoaded, setIsCarouselLoaded] = useState(false)
  const [marqueeOffset, setMarqueeOffset] = useState(0)
  const [marqueeDirection, setMarqueeDirection] = useState<-1 | 1>(-1)
  const [isMarqueePaused, setIsMarqueePaused] = useState(false)
  const touchStartXRef = useRef<number | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const cycleWidthRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number | null>(null)

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
      const fallbackImages = getDefaultCarouselImages()
      try {
        const [topImages, movingImages, products] = await Promise.all([
          getCarouselImages('top'),
          getCarouselImages('marquee'),
          getProducts(),
        ])
        const safeTopImages = topImages.length > 0 ? topImages : fallbackImages
        const safeMarqueeImages = movingImages.length > 0 ? movingImages : fallbackImages
        const normalizedProducts = products
          .filter((product) => typeof product.name === 'string' && product.name.trim().length > 0)
          .filter((product) => typeof product.image_url === 'string' && product.image_url.trim().length > 0)
          .map((product) => ({
            id: product.id,
            name: product.name,
            imageUrl: product.image_url,
          }))
        setTopCarouselImages(safeTopImages)
        setMarqueeImages(safeMarqueeImages)
        setMarqueeProducts(normalizedProducts)
        writeCarouselCache(TOP_CAROUSEL_CACHE_KEY, safeTopImages)
        writeCarouselCache(MARQUEE_CAROUSEL_CACHE_KEY, safeMarqueeImages)
      } catch {
        setTopCarouselImages(fallbackImages)
        setMarqueeImages(fallbackImages)
        setMarqueeProducts([])
        writeCarouselCache(TOP_CAROUSEL_CACHE_KEY, fallbackImages)
        writeCarouselCache(MARQUEE_CAROUSEL_CACHE_KEY, fallbackImages)
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

  const marqueeProductNames = [
    'Heritage Rices',
    'Wheat Grains & Flours',
    'Cold-Pressed Oils',
    'Forest Honey & Herbs',
  ]

  const marqueeItems = useMemo<DisplayMarqueeItem[]>(() => {
    if (marqueeProducts.length > 0) {
      return marqueeProducts.map((product) => ({
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        fromProduct: true,
      }))
    }

    return marqueeImages.map((image, index) => ({
      id: `fallback-${index}`,
      name: marqueeProductNames[index % marqueeProductNames.length],
      imageUrl: image,
      fromProduct: false,
    }))
  }, [marqueeImages, marqueeProductNames, marqueeProducts])

  const duplicatedMarqueeItems = useMemo(() => {
    return [...marqueeItems, ...marqueeItems]
  }, [marqueeItems])

  useEffect(() => {
    const recalculateCycleWidth = () => {
      if (!trackRef.current || marqueeItems.length === 0) {
        cycleWidthRef.current = 0
        setMarqueeOffset(0)
        return
      }

      cycleWidthRef.current = trackRef.current.scrollWidth / 2
      setMarqueeOffset((prev) => {
        const cycle = cycleWidthRef.current
        if (!cycle) return 0
        if (prev <= -cycle || prev >= 0) {
          return -Math.abs(prev % cycle)
        }
        return prev
      })
    }

    recalculateCycleWidth()
    window.addEventListener('resize', recalculateCycleWidth)
    return () => window.removeEventListener('resize', recalculateCycleWidth)
  }, [marqueeItems.length])

  useEffect(() => {
    if (isMarqueePaused || marqueeItems.length === 0 || cycleWidthRef.current <= 0) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      animationFrameRef.current = null
      lastFrameTimeRef.current = null
      return
    }

    const animate = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp
      }

      const deltaMs = timestamp - lastFrameTimeRef.current
      const deltaPx = (deltaMs / 1000) * MARQUEE_SPEED_PX_PER_SECOND * marqueeDirection
      const cycle = cycleWidthRef.current

      setMarqueeOffset((prev) => {
        let next = prev + deltaPx
        if (cycle > 0) {
          while (next <= -cycle) next += cycle
          while (next > 0) next -= cycle
        }
        return next
      })

      lastFrameTimeRef.current = timestamp
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      animationFrameRef.current = null
      lastFrameTimeRef.current = null
    }
  }, [isMarqueePaused, marqueeDirection, marqueeItems.length])

  const handleMarqueeTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null
  }

  const handleMarqueeTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current
    const endX = event.changedTouches[0]?.clientX ?? null
    touchStartXRef.current = null

    if (startX === null || endX === null) return

    const deltaX = endX - startX
    if (Math.abs(deltaX) < MIN_SWIPE_DISTANCE) return

    setMarqueeDirection(deltaX < 0 ? -1 : 1)
    setIsMarqueePaused(false)
  }

  const handleMarqueeItemClick = (item: DisplayMarqueeItem) => {
    if (item.fromProduct) {
      sessionStorage.setItem(PRODUCT_SEARCH_PREFILL_KEY, item.name)
    }
    onNavigate('products')
  }

  const categories = [
    { id: 1, name: 'Rice, Millets & Dal', icon: '🌾' },
    { id: 2, name: 'Forest honey, Sundakai, Avaram poo', icon: '🍯' },
    { id: 3, name: 'Oils', badge: 'Coming Soon', icon: '🫗' },
    { id: 4, name: 'Garden kits', icon: '🌱' },
  ]

  const valuePillars = [
    {
      title: 'Farm-first sourcing',
      copy: 'Harvested in small batches, shade-dried, and packed without additives.',
      icon: '🌾',
    },
    {
      title: 'Slow-crafted oils',
      copy: 'Cold-pressed gingelly, groundnut, and coconut oils that keep nutrients intact.',
      icon: '🛢️',
    },
    {
      title: 'Forest pantry',
      copy: 'Wild honey, sundakai, and herbs gathered responsibly by women farmer collectives.',
      icon: '🍯',
    },
    {
      title: 'Grower tools',
      copy: 'Garden kits, seed starters, and soil boosters that help you grow at home.',
      icon: '🧺',
    },
  ]

  const statHighlights = [
    { label: 'Heritage grains', value: '40+' },
    { label: 'Farmer families', value: '80+' },
    { label: 'Cold-pressed oils', value: '6' },
  ]

  const farmTools = [
    {
      title: 'Clay pot fermenters',
      detail: 'Hold probiotics longer and keep flavors earthy and clean.',
      tone: 'from-emerald-100 to-green-50',
    },
    {
      title: 'Seed starter trays',
      detail: 'Kickstart kitchen gardens with moisture-lock cocopeat.',
      tone: 'from-emerald-50 to-white',
    },
    {
      title: 'Stone grinders',
      detail: 'Slow grinding retains aroma for masalas and millet flours.',
      tone: 'from-teal-100 to-emerald-50',
    },
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

  const movingFeedbacksForward = [...feedbacks, ...feedbacks]

  return (
    <div className="space-y-0 page-shell">
      {/* Hero */}
      <section className="relative overflow-hidden pt-5 md:pt-8 pb-20 md:pb-28 bg-gradient-to-br from-emerald-100 via-green-100 to-emerald-200">
        <div className="radial-spot -left-16 top-6" aria-hidden />
        <div className="radial-spot sun right-0 -top-10" aria-hidden />
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 relative anim-rise">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-clay anim-rise">
              Honest food and tools crafted by dryland farmers.
            </h1>
            <p className="text-lg md:text-xl text-brown/80 leading-relaxed max-w-xl anim-fade">
              Grains, oils, forest honey, and garden tools gathered with care by small and women farmers.
              Packed slow, shipped fresh.
            </p>
            <div className="cta-grid max-w-xl anim-rise">
              <button
                onClick={() => onNavigate('products')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold shadow-amber bg-gradient-to-r from-forest-green to-emerald-500 hover:opacity-95 hover:-translate-y-0.5 transition-all duration-300"
              >
                Browse farm produce
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="cta-ghost flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-clay font-semibold hover:-translate-y-0.5 transition-all duration-300"
              >
                Meet our farmers
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-lg anim-fade">
              {statHighlights.map((stat) => (
                <div key={stat.label} className="glass-surface rounded-xl p-3 shadow-sage text-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-2xl font-bold text-forest-green">{stat.value}</div>
                  <div className="text-xs uppercase text-brown/70 tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flow-card glass-surface glow-border rounded-3xl shadow-sage p-3 anim-rise">
            <div className="absolute -left-10 top-8 w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-300 rounded-full opacity-35" aria-hidden />
            <div className="absolute -right-6 -bottom-8 w-24 h-24 bg-gradient-to-br from-emerald-100 to-white rounded-full opacity-40" aria-hidden />
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              {topCarouselImages.length > 0 ? (
                <img
                  src={topCarouselImages[currentIndex]}
                  alt={`Field ${currentIndex + 1}`}
                  className="w-full h-[400px] md:h-[480px] object-cover"
                />
              ) : (
                <div className="w-full h-[400px] md:h-[480px] bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 pattern-grid flex items-center justify-center text-brown/60">
                  Farmer images will appear here
                </div>
              )}
              <div className="absolute left-4 top-4 px-3 py-2 rounded-full bg-white/85 text-xs font-semibold shadow-sm flex items-center gap-2">
                <span className="badge-dot" aria-hidden />
                Live field spotlight
              </div>
              <div className="absolute right-4 bottom-4 bg-white/85 backdrop-blur-sm px-4 py-3 rounded-xl shadow-md text-sm text-brown/80">
                <div className="font-semibold">Dryland harvest</div>
                <div className="text-xs">Sun-kissed grains and heritage seeds</div>
              </div>
            </div>
            <div className="absolute -right-4 -top-6 floating shadow-amber px-3 py-2 rounded-lg bg-white text-sm font-semibold text-forest-green">
              Fresh batch this week
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="pt-0 pb-16 md:pb-24 bg-emerald-50/80">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="divider-dot" aria-hidden />
            <span className="uppercase text-xs tracking-[0.2em] text-brown/70">Crafted with care</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-bold text-brown mb-6">Everything from our farms</h3>
          <p className="text-lg text-brown/80 max-w-3xl mb-10">
            We grow, harvest, cold-press, and hand-pack. Add farm tools to your kitchen and balcony gardens to keep the story going.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valuePillars.map((item) => (
              <div key={item.title} className="tilt-card glass-surface rounded-2xl p-6 shadow-sage flex gap-4 items-start anim-rise">
                <div className="text-3xl" aria-hidden>{item.icon}</div>
                <div>
                  <h4 className="text-xl font-bold text-brown mb-2">{item.title}</h4>
                  <p className="text-brown/80 leading-relaxed">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <section className="marquee-container">
        <div
          className="marquee-track-shell"
          onMouseEnter={() => setIsMarqueePaused(true)}
          onMouseLeave={() => setIsMarqueePaused(false)}
          onTouchStart={handleMarqueeTouchStart}
          onTouchEnd={handleMarqueeTouchEnd}
        >
          {duplicatedMarqueeItems.length > 0 ? (
            <div
              ref={trackRef}
              className="marquee-wrapper"
              style={{ transform: `translateX(${marqueeOffset}px)` }}
            >
              {duplicatedMarqueeItems.map((item, index) => (
                <button
                  key={`${item.id}-${index}`}
                  type="button"
                  className="marquee-item marquee-item-button"
                  onClick={() => handleMarqueeItemClick(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="marquee-item-image"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22200%22%3E%3Crect fill=%22%235a7d7c%22 width=%22250%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EProduct Image%3C/text%3E%3C/svg%3E'
                    }}
                  />
                  <div className="marquee-product-name">{item.name}</div>
                </button>
              ))}
            </div>
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
      <section className="pt-0 pb-16 md:pb-24 bg-gradient-to-br from-emerald-100 via-green-100 to-emerald-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <div className="section-heading">
                <span className="tagline text-xs text-brown/70">shop by range</span>
                <h3 className="text-3xl md:text-4xl font-bold text-brown">Farm pantry and tools</h3>
              </div>
              <p className="text-brown/80 mt-3 max-w-2xl">
                Pick a lane: grains and millets, forest pantry essentials, slow oils, or ready-to-grow garden kits.
              </p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="shine px-4 py-2 rounded-lg bg-forest-green text-white font-semibold shadow-amber"
            >
              Explore catalog
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="tilt-card-lite bg-white rounded-2xl shadow-lg border border-brown/10 p-6 flex flex-col gap-4 cursor-pointer anim-rise"
                onClick={() => onNavigate('products')}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl" aria-hidden>{category.icon}</span>
                  {category.badge && (
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-brown">{category.badge}</span>
                  )}
                </div>
                <h4 className="text-xl font-bold text-brown">{category.name}</h4>
                <p className="text-sm text-brown/70">Sourced directly, cleaned and packed with no additives.</p>
                <div className="flex items-center gap-2 text-forest-green font-semibold text-sm">
                  <span>View products</span>
                  <span aria-hidden>{'>'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools and kits */}
      <section className="pt-0 pb-14 md:pb-20 bg-emerald-50/85">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="badge-dot" aria-hidden />
            <span className="text-sm font-bold text-brown/90">Farm tools for your kitchen</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {farmTools.map((tool) => (
              <div key={tool.title} className={`tilt-card rounded-2xl p-6 shadow-sage bg-gradient-to-br ${tool.tone} anim-rise`}>
                <h4 className="text-xl font-extrabold text-brown mb-2">{tool.title}</h4>
                <p className="text-brown/90 font-semibold leading-relaxed">{tool.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="feedback-marquee-container">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10">
          <h3 className="text-2xl md:text-3xl font-bold text-sand text-center mb-4">
            What Our Customers Say
          </h3>
        </div>
        <div className="feedback-track-shell">
          <div className="feedback-marquee-wrapper">
            {movingFeedbacksForward.map((feedback, index) => (
              <article key={`forward-${feedback.id}-${index}`} className="feedback-card">
                <p className="feedback-text">{`${feedback.line1} ${feedback.line2} ${feedback.line3}`}</p>
                <span className="feedback-author">{feedback.name}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
