export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-amber-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brown mb-4">
            About Senkulatharu
          </h1>
          <p className="text-lg text-gray-700">
            Understanding our mission and the farmers we support
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12 max-w-4xl">
          {/* What is Senkulatharu */}
          <section>
            <h2 className="text-3xl font-bold text-brown mb-4">
              What is Senkulatharu?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              "Senkulatharu" - a Tamil phrase meaning "blood-bonded farming" - encapsulates our philosophy of deep connection to the land.
              The phrase "இது உதிரத்தில் இணைத்த உழவு" (This is farming bonded in blood) reflects the hereditary commitment of farmers
              to their craft, passed down through generations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Senkulatharu is a platform celebrating the authentic produce of dryland farmers from Kadavur, Tamil Nadu.
              We believe in honest farming, fair practices, and connecting consumers directly with the source of their food.
            </p>
          </section>

          {/* Dryland Farming */}
          <section>
            <h2 className="text-3xl font-bold text-brown mb-4">
              Understanding Dryland Farming
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Dryland farming is an ancient, sustainable agricultural practice adapted to regions with limited rainfall.
              Unlike irrigated agriculture, dryland farming relies on rainwater harvesting and soil conservation techniques
              that have been refined over centuries in places like Kadavur.
            </p>
            <div className="bg-white rounded-lg p-6 my-4 border-l-4 border-forest-green">
              <h4 className="font-bold text-brown mb-2">Key Characteristics:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Water conservation through traditional methods</li>
                <li>Crop rotation and mixed farming practices</li>
                <li>Zero chemical inputs - purely organic methods</li>
                <li>Biodiversity preservation</li>
                <li>Soil health and carbon sequestration</li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Dryland farmers are stewards of the land, maintaining ecological balance while producing nutrient-rich food.
            </p>
          </section>

          {/* Farmer Stories */}
          <section>
            <h2 className="text-3xl font-bold text-brown mb-4">
              Stories from Kadavur
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold text-brown mb-2">Farmer Ramesh - Rice & Millet Grower</h3>
                <p className="text-gray-700">
                  For 35 years, Ramesh has cultivated traditional varieties of rice and millets on his 5-acre farm.
                  Using time-tested dryland methods, he maintains soil fertility naturally. "My grandfather taught me that
                  the soil is not just earth - it's living wealth. We don't exploit it; we nurture it," he says with pride.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold text-brown mb-2">Farmers Savitri & Seela - Women Farmers Collective</h3>
                <p className="text-gray-700">
                  A collective of 12 women farmers grows forest honey, sundakai berries, and avaram poo using sustainable harvesting.
                  They've transformed their livelihoods by combining traditional knowledge with sustainable practices.
                  "We work with nature, not against it. Our products are pure and good for everyone's health," Savitri shares.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold text-brown mb-2">Farmer Kumar - Oil Seed Cultivation</h3>
                <p className="text-gray-700">
                  Kumar cultivates groundnut and gingelly seeds on marginal land using intercropping techniques.
                  His oil production is small-batch and cold-pressed. He represents the next generation of dryland farmers,
                  combining traditional knowledge with modern sustainable practices.
                </p>
              </div>
            </div>
          </section>

          {/* Natural Farming */}
          <section>
            <h2 className="text-3xl font-bold text-brown mb-4">
              Our Natural Farming Practices
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-sand rounded-lg p-6">
                <h4 className="font-bold text-brown mb-2 flex items-center mb-3">
                  <span className="text-2xl mr-2">🌍</span> Soil Conservation
                </h4>
                <p className="text-sm text-gray-700">
                  Practices like crop rotation, legume intercropping, and natural composting maintain soil structure
                  and fertility without synthetic inputs.
                </p>
              </div>
              <div className="bg-sand rounded-lg p-6">
                <h4 className="font-bold text-brown mb-2 flex items-center mb-3">
                  <span className="text-2xl mr-2">💧</span> Water Management
                </h4>
                <p className="text-sm text-gray-700">
                  Rainwater harvesting, mulching, and contour farming maximize water retention in drought-prone areas.
                </p>
              </div>
              <div className="bg-sand rounded-lg p-6">
                <h4 className="font-bold text-brown mb-2 flex items-center mb-3">
                  <span className="text-2xl mr-2">🍃</span> Biodiversity
                </h4>
                <p className="text-sm text-gray-700">
                  Mixed cropping and hedgerow farming create habitats for beneficial insects and wildlife,
                  creating a self-sustaining ecosystem.
                </p>
              </div>
              <div className="bg-sand rounded-lg p-6">
                <h4 className="font-bold text-brown mb-2 flex items-center mb-3">
                  <span className="text-2xl mr-2">🌱</span> No Chemicals
                </h4>
                <p className="text-sm text-gray-700">
                  Zero pesticides, herbicides, or synthetic fertilizers. Pure organic matter and companion planting
                  manage pests naturally.
                </p>
              </div>
            </div>
          </section>

          {/* Our Mission */}
          <section className="bg-brown text-sand rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">
              Our Mission
            </h2>
            <p className="leading-relaxed mb-4">
              We connect conscious consumers with the authentic, naturally-grown produce of dryland farmers.
              By celebrating their stories and practices, we:
            </p>
            <ul className="list-disc list-inside space-y-2">
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
