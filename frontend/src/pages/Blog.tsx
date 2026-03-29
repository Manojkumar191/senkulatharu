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
    <div className="min-h-screen bg-gradient-to-br from-sand to-amber-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-brown mb-4">
            Stories from Kadavur
          </h1>
          <p className="text-lg text-gray-700">
            Tales of tradition, sustainability, and the farmers who make it happen
          </p>
        </div>

        {/* Stories Grid */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {stories.map((story) => (
            <article
              key={story.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden card-hover"
            >
              <div className="p-8">
                {/* Meta Information */}
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm text-gray-500">📅 {story.date}</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-brown mb-4">
                  {story.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-700 mb-4 italic border-l-4 border-forest-green pl-4">
                  {story.excerpt}
                </p>

                {/* Full Content */}
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                  {story.content}
                </div>

                {/* Read More Button */}
                <button className="mt-6 text-forest-green font-semibold hover:text-brown transition-colors">
                  Continue reading →
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <section className="mt-16 bg-brown text-sand rounded-lg p-8 max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-3">
            Get Stories in Your Inbox
          </h3>
          <p className="mb-6 opacity-90">
            Subscribe to receive stories from our farmers, tips on dryland farming, and exclusive offers.
          </p>
          <form className="flex flex-col md:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg text-brown placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-forest-green text-sand font-semibold rounded-lg hover:bg-opacity-90 transition-all"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
