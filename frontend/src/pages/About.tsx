export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-100 to-emerald-200 pt-4 md:pt-6">
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-0 pb-16 md:pb-24 space-y-10">
        <div className="flex flex-col gap-3 reveal-stagger delay-1">
          <h1 className="text-4xl md:text-5xl font-bold text-brown reveal-stagger delay-3">About Senkulatharu</h1>
          <p className="text-lg text-brown/75 max-w-3xl reveal-stagger delay-4">
            Understanding our mission and the farmers we support
          </p>
        </div>

        <div className="space-y-8">
          <section className="glass-surface rounded-2xl p-8 shadow-sage reveal-stagger delay-2 soft-card-hover">
            <h2 className="text-3xl font-bold text-brown mb-4">What is Senkulatharu?</h2>
            <p className="text-brown/80 leading-relaxed mb-4">
              "Senkulatharu" - a Tamil phrase meaning "blood-bonded farming" - encapsulates our philosophy of deep connection to the land.
              The phrase "இது உதிரத்தில் இணைத்த உழவு" (This is farming bonded in blood) reflects the hereditary commitment of farmers
              to their craft, passed down through generations.
            </p>
            <p className="text-brown/80 leading-relaxed">
              Senkulatharu is a platform celebrating the authentic produce of dryland farmers from Kadavur, Tamil Nadu.
              We believe in honest farming, fair practices, and connecting consumers directly with the source of their food.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8 shadow-sage reveal-stagger delay-3 soft-card-hover">
            <h2 className="text-3xl font-bold text-brown mb-4">Understanding Dryland Farming</h2>
            <p className="text-brown/80 leading-relaxed mb-4">
              Dryland farming is an ancient, sustainable agricultural practice adapted to regions with limited rainfall.
              Unlike irrigated agriculture, dryland farming relies on rainwater harvesting and soil conservation techniques
              that have been refined over centuries in places like Kadavur.
            </p>
            <div className="bg-white rounded-xl p-6 my-4 border border-forest-green/20 soft-card-hover">
              <h4 className="font-bold text-brown mb-3">Key characteristics</h4>
              <ul className="list-disc list-inside text-brown/80 space-y-2">
                <li>Water conservation through traditional methods</li>
                <li>Crop rotation and mixed farming practices</li>
                <li>Zero chemical inputs - purely organic methods</li>
                <li>Biodiversity preservation</li>
                <li>Soil health and carbon sequestration</li>
              </ul>
            </div>
            <p className="text-brown/80 leading-relaxed">
              Dryland farmers are stewards of the land, maintaining ecological balance while producing nutrient-rich food.
            </p>
          </section>

          <section className="glass-surface rounded-2xl p-8 shadow-sage reveal-stagger delay-4 soft-card-hover">
            <h2 className="text-3xl font-bold text-brown mb-4">Stories from Kadavur</h2>
            <div className="space-y-6">
              <div className="bg-white/90 rounded-xl p-6 border border-brown/10 soft-card-hover">
                <h3 className="text-xl font-bold text-brown mb-2">Farmer Ramesh - Rice & Millet Grower</h3>
                <p className="text-brown/80 leading-relaxed">
                  For 35 years, Ramesh has cultivated traditional varieties of rice and millets on his 5-acre farm.
                  Using time-tested dryland methods, he maintains soil fertility naturally. "My grandfather taught me that
                  the soil is not just earth - it's living wealth. We don't exploit it; we nurture it," he says with pride.
                </p>
              </div>
              <div className="bg-white/90 rounded-xl p-6 border border-brown/10 soft-card-hover">
                <h3 className="text-xl font-bold text-brown mb-2">Farmers Savitri & Seela - Women Farmers Collective</h3>
                <p className="text-brown/80 leading-relaxed">
                  A collective of 12 women farmers grows forest honey, sundakai berries, and avaram poo using sustainable harvesting.
                  They've transformed their livelihoods by combining traditional knowledge with sustainable practices.
                  "We work with nature, not against it. Our products are pure and good for everyone's health," Savitri shares.
                </p>
              </div>
              <div className="bg-white/90 rounded-xl p-6 border border-brown/10 soft-card-hover">
                <h3 className="text-xl font-bold text-brown mb-2">Farmer Kumar - Oil Seed Cultivation</h3>
                <p className="text-brown/80 leading-relaxed">
                  Kumar cultivates groundnut and gingelly seeds on marginal land using intercropping techniques.
                  His oil production is small-batch and cold-pressed. He represents the next generation of dryland farmers,
                  combining traditional knowledge with modern sustainable practices.
                </p>
              </div>
            </div>
          </section>

          <section className="glass-surface rounded-2xl p-8 shadow-sage reveal-stagger delay-5 soft-card-hover">
            <h2 className="text-3xl font-bold text-brown mb-4">Our Natural Farming Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-sand rounded-xl p-6 soft-card-hover">
                <h4 className="font-bold text-brown mb-3 flex items-center">
                  <span className="text-2xl mr-2">🌍</span> Soil conservation
                </h4>
                <p className="text-sm text-brown/80">
                  Practices like crop rotation, legume intercropping, and natural composting maintain soil structure
                  and fertility without synthetic inputs.
                </p>
              </div>
              <div className="bg-sand rounded-xl p-6 soft-card-hover">
                <h4 className="font-bold text-brown mb-3 flex items-center">
                  <span className="text-2xl mr-2">💧</span> Water management
                </h4>
                <p className="text-sm text-brown/80">
                  Rainwater harvesting, mulching, and contour farming maximize water retention in drought-prone areas.
                </p>
              </div>
              <div className="bg-sand rounded-xl p-6 soft-card-hover">
                <h4 className="font-bold text-brown mb-3 flex items-center">
                  <span className="text-2xl mr-2">🍃</span> Biodiversity
                </h4>
                <p className="text-sm text-brown/80">
                  Mixed cropping and hedgerow farming create habitats for beneficial insects and wildlife,
                  creating a self-sustaining ecosystem.
                </p>
              </div>
              <div className="bg-sand rounded-xl p-6 soft-card-hover">
                <h4 className="font-bold text-brown mb-3 flex items-center">
                  <span className="text-2xl mr-2">🌱</span> No chemicals
                </h4>
                <p className="text-sm text-brown/80">
                  Zero pesticides, herbicides, or synthetic fertilizers. Pure organic matter and companion planting
                  manage pests naturally.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl p-8 shadow-amber bg-gradient-to-r from-forest-green to-brown text-white reveal-stagger delay-6 soft-card-hover">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="leading-relaxed mb-4 text-white">
              We connect conscious consumers with the authentic, naturally-grown produce of dryland farmers.
              By celebrating their stories and practices, we:
            </p>
            <ul className="list-disc list-inside space-y-2 text-white font-semibold">
              <li>Support fair livelihoods for small, marginal, and women farmers</li>
              <li>Stop the exploitation of agricultural labor</li>
              <li>Promote dryland farming as sustainable agriculture</li>
              <li>Preserve traditional farming knowledge</li>
              <li>Provide consumers with genuinely healthy, chemical-free food</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
