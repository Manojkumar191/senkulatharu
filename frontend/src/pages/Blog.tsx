export default function Blog() {
  const stories = [
    {
      id: 1,
      title: 'The Ancient Wisdom of Dryland Farming in Kadavur',
      date: 'March 2024',
      excerpt: 'How generations of dryland farmers have perfected sustainable agriculture...',
      content: `Kadavur, located in the heart of Tamil Nadu's dryland region, has a rich tradition of sustainable farming.
      For centuries, farmers here have developed techniques to thrive in a landscape with erratic rainfall and challenging soil conditions.

      The key is understanding the symbiosis between soil, water, and crops. Traditional dryland farmers practice:

      • Crop rotation to maintain soil fertility
      • Rainwater harvesting through traditional bunds and tanks
      • Mulching to reduce water evaporation
      • Mixed cropping with complementary plants

      These practices aren't just clever - they're deeply sustainable. The same fields have been productive for generations,
      without synthetic inputs, without exhausting the soil.`
    },
    {
      id: 2,
      title: 'Women Farmers of Kadavur: Guardians of Forest Products',
      date: 'February 2024',
      excerpt: 'The inspiring story of how women collectively harvest and sustain forest products...',
      content: `In Kadavur, women farmer collectives have become guardians of forest-based livelihoods. They sustainably harvest
      forest honey, sundakai berries, and avaram poo flowers - products that have been used in traditional medicine and cooking for centuries.

      These aren't just economic activities - they're acts of conservation. By valuing and harvesting these products sustainably,
      women farmers protect the forest ecosystem itself.

      "We work in partnership with the forest," says Savitri, one of the collective leaders. "We take only what the forest can give us freely,
      and we ensure the plants thrive for future generations."

      Through fair-trade practices and direct market linkages, these women are achieving economic independence while preserving
      both the forest and its invaluable biodiversity.`
    },
    {
      id: 3,
      title: 'Why Your Food Choices Matter: The Dryland Difference',
      date: 'January 2024',
      excerpt: 'Understanding the impact of choosing dryland-farmed products...',
      content: `Every food choice you make has ripples. When you choose naturally-grown dryland produce, you're:

      1. Supporting farmers who practice sustainable agriculture - reducing carbon footprint and environmental impact
      2. Ensuring healthier, nutrient-dense food reaches your table without pesticide residues
      3. Contributing to fair incomes for small and marginal farmers struggling against industrial agriculture
      4. Preserving traditional knowledge and cultural practices
      5. Protecting biodiversity and soil health

      Senkulatharu makes it easy to make these choices. By connecting directly with dryland farmers from Kadavur,
      you're not just buying food - you're participating in a movement toward truly sustainable agriculture.`
    },
    {
      id: 4,
      title: 'The Nutritional Power of Traditional Millets',
      date: 'December 2023',
      excerpt: 'Rediscovering ancient grains and their benefits...',
      content: `For thousands of years, millets were the staple grain of Indian dryland regions. Then, the Green Revolution happened,
      and rice and wheat took over. Now, nutritionists and farmers alike are rediscovering what our ancestors knew:

      Millets are nutritional powerhouses:
      • High in fiber, promoting digestive health
      • Rich in minerals like iron, magnesium, and phosphorus
      • Naturally gluten-free
      • Low glycemic index - excellent for diabetics
      • Drought-resistant and environmentally sustainable to grow

      The farmers of Kadavur never stopped growing millets. They preserved the seeds, maintained the varieties, and continued
      traditional cultivation methods. Now, as people seek healthier and more sustainable food, millet cultivation is seeing a revival.

      By choosing traditionally-grown millets from Senkulatharu, you're choosing nutrition, tradition, and sustainability.`
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-100 to-emerald-200 py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center mb-14 space-y-4 reveal-stagger delay-1">
          <div className="floating-badge w-fit mx-auto reveal-stagger delay-2">
            <span className="badge-dot" aria-hidden />
            Field notes and stories
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-brown reveal-stagger delay-3">Stories from Kadavur</h1>
          <p className="text-lg text-brown/75 max-w-2xl mx-auto reveal-stagger delay-4">
            Tales of tradition, sustainability, and the farmers who make it happen
          </p>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          {stories.map((story, index) => (
            <article
              key={story.id}
              className={`glass-surface rounded-2xl shadow-sage overflow-hidden tilt-card soft-card-hover blog-article ${
                index % 2 === 0 ? 'blog-card-enter-left' : 'blog-card-enter-right'
              }`}
              style={{ animationDelay: `${0.15 + index * 0.1}s` }}
            >
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-brown/90 font-semibold">
                  <span className="badge-dot" aria-hidden />
                  <span>📅 {story.date}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-brown">{story.title}</h2>
                <p className="text-brown font-semibold border-l-4 border-forest-green/60 pl-4">
                  {story.excerpt}
                </p>
                <div className="max-w-none text-brown font-semibold whitespace-pre-line leading-relaxed">
                  {story.content}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-16 bg-gradient-to-r from-forest-green to-emerald-600 text-sand rounded-2xl p-10 shadow-amber max-w-3xl mx-auto text-center reveal-stagger soft-card-hover" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-2xl font-bold mb-3">Get Stories in Your Inbox</h3>
          <p className="mb-6 font-medium" style={{ color: '#ffffff' }}>
            Subscribe to receive stories from our farmers, tips on dryland farming, and exclusive offers.
          </p>
          <form className="flex flex-col md:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg text-brown placeholder-brown/50 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-forest-green font-semibold rounded-lg hover:bg-emerald-50 transition-all"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
