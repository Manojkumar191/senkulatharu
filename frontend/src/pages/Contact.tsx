const contactAddress =
  'No.5/223, Kurumbapatti Palaviduthi (Post), Tharagampatti (S.O), Kadavur, Karur, Tamil Nadu, India - 621311'
const contactEmail = 'senkulatharu@gmail.com'
const contactPhone = '+91 90800 59430'
const phoneHref = '+919080059430'
const whatsappNumber = '919080059430'

const encodedAddress = encodeURIComponent(contactAddress)
const mapEmbedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`
const mapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`

const contactHighlights = [
  {
    title: 'Visit Us',
    detail: contactAddress,
    icon: '📍',
  },
  {
    title: 'Call Us',
    detail: contactPhone,
    icon: '📞',
    href: `tel:${phoneHref}`,
  },
  {
    title: 'Email Us',
    detail: contactEmail,
    icon: '✉️',
    href: `mailto:${contactEmail}`,
  },
  {
    title: 'Business Hours',
    detail: 'Monday - Saturday: 9:30 AM - 2:00 PM & 4:00 PM - 9:00 PM',
    icon: '🕘',
  },
]

const faqs = [
  {
    question: 'Do you offer bulk discounts?',
    answer:
      'Yes! We offer special pricing for bulk orders. Contact us with your requirements for a custom quote.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept cash, UPI, all major credit/debit cards, and bank transfers. Credit terms available for businesses.',
  },
  {
    question: 'Do you deliver products?',
    answer:
      'Yes, we provide local delivery within Karur. For larger orders, we can arrange delivery to nearby cities.',
  },
  {
    question: 'Can I return a product?',
    answer:
      'Unopened products can be returned within 7 days with the original receipt. Some electrical items have specific return policies.',
  },
]

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-100 to-emerald-200 py-14 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10 space-y-7">
        <div className="text-center space-y-4 reveal-stagger delay-1">
          <div className="floating-badge w-fit mx-auto reveal-stagger delay-2">
            <span className="badge-dot" aria-hidden />
            Contact and Support
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-brown reveal-stagger delay-3">Get in Touch</h1>
          <p className="text-lg text-brown/85 font-semibold max-w-2xl mx-auto reveal-stagger delay-4">
            Reach us for product enquiries, bulk orders, delivery support, and business partnerships.
          </p>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {contactHighlights.map((item, index) => (
            <article
              key={item.title}
              className="glass-surface rounded-2xl p-5 shadow-sage reveal-stagger soft-card-hover min-h-[170px]"
              style={{ animationDelay: `${0.15 + index * 0.08}s` }}
            >
              <div className="text-2xl mb-2" aria-hidden>
                {item.icon}
              </div>
              <h2 className="text-lg font-extrabold text-brown mb-2">{item.title}</h2>
              {item.href ? (
                <a href={item.href} className="text-brown/90 font-semibold leading-relaxed hover:text-forest-green transition-colors">
                  {item.detail}
                </a>
              ) : (
                <p className="text-brown/90 font-semibold leading-relaxed">{item.detail}</p>
              )}
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
          <article className="glass-surface rounded-2xl p-7 shadow-sage reveal-stagger delay-3 soft-card-hover">
            <h2 className="text-2xl font-bold text-brown">Send us a Message</h2>
            <p className="text-brown/85 font-semibold mt-2 mb-5">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-sm font-bold text-brown" htmlFor="fullName">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  placeholder="Your name"
                  className="mt-1 w-full rounded-xl border border-brown/20 bg-white px-4 py-2.5 text-brown placeholder-brown/45 focus:outline-none focus:ring-2 focus:ring-forest-green/30"
                />
              </div>

              <div className="md:col-span-1">
                <label className="text-sm font-bold text-brown" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="mt-1 w-full rounded-xl border border-brown/20 bg-white px-4 py-2.5 text-brown placeholder-brown/45 focus:outline-none focus:ring-2 focus:ring-forest-green/30"
                />
              </div>

              <div className="md:col-span-1">
                <label className="text-sm font-bold text-brown" htmlFor="emailAddress">
                  Email Address *
                </label>
                <input
                  id="emailAddress"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-xl border border-brown/20 bg-white px-4 py-2.5 text-brown placeholder-brown/45 focus:outline-none focus:ring-2 focus:ring-forest-green/30"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-bold text-brown" htmlFor="subject">
                  Subject *
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  placeholder="How can we help?"
                  className="mt-1 w-full rounded-xl border border-brown/20 bg-white px-4 py-2.5 text-brown placeholder-brown/45 focus:outline-none focus:ring-2 focus:ring-forest-green/30"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-bold text-brown" htmlFor="message">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  placeholder="Tell us more about your enquiry..."
                  className="mt-1 w-full rounded-xl border border-brown/20 bg-white px-4 py-2.5 text-brown placeholder-brown/45 focus:outline-none focus:ring-2 focus:ring-forest-green/30"
                />
              </div>

              <div className="md:col-span-2 flex flex-wrap gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-forest-green to-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-amber hover:opacity-95 transition-all"
                >
                  Send Message
                </button>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700 transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
            </form>
          </article>

          <section className="glass-surface rounded-2xl p-7 shadow-sage reveal-stagger delay-4 soft-card-hover flex flex-col">
          <h2 className="text-2xl font-bold text-brown">Find Us</h2>
          <p className="text-brown/85 font-semibold mt-2">Visit our store for the best shopping experience.</p>
          <p className="text-brown font-semibold mt-3 leading-relaxed">
            <span className="font-bold">Address:</span> {contactAddress}
          </p>
          <a
            href={mapsDirectionsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
          >
            Get Directions on Google Maps
          </a>

          <div className="mt-5 overflow-hidden rounded-2xl border border-brown/15 shadow-sage flex-1 min-h-[320px]">
            <iframe
              title="Company location map"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
        </section>

        <section className="glass-surface rounded-2xl p-7 shadow-sage reveal-stagger delay-5 soft-card-hover">
          <h2 className="text-2xl font-bold text-brown">Frequently Asked Questions</h2>
          <p className="text-brown/80 mt-2 mb-5">Quick answers to common questions</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((item) => (
              <article key={item.question} className="rounded-xl border border-brown/15 bg-white/90 p-5 soft-card-hover">
                <h3 className="text-lg font-extrabold text-brown mb-2">{item.question}</h3>
                <p className="text-brown/85 font-semibold leading-relaxed">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}