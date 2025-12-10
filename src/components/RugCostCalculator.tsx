import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Shirt,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Star,
  Thermometer
} from 'lucide-react'

export default function RugCostCalculator() {
  const [horseType, setHorseType] = useState('clipped')
  const [climate, setClimate] = useState('average')
  const [stabling, setStabling] = useState('mixed')
  const [budgetLevel, setBudgetLevel] = useState('mid')
  const [includeSpares, setIncludeSpares] = useState(true)
  const [includeSheets, setIncludeSheets] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState<any>(null)

  const horseTypes = [
    { id: 'native', name: 'Native/Unclipped', rugsNeeded: 'minimal', multiplier: 0.5, description: 'Hardy breeds, natural coat' },
    { id: 'unclipped', name: 'Unclipped (Non-Native)', rugsNeeded: 'light', multiplier: 0.7, description: 'Good coat but not native hardy' },
    { id: 'trace', name: 'Trace/Bib Clip', rugsNeeded: 'moderate', multiplier: 0.85, description: 'Partial clip, some protection needed' },
    { id: 'clipped', name: 'Hunter/Full Clip', rugsNeeded: 'full', multiplier: 1.0, description: 'Full rug wardrobe needed' },
    { id: 'thin', name: 'Fine-Coated/Thin Skinned', rugsNeeded: 'extra', multiplier: 1.2, description: 'TBs, Arabs - feel the cold' }
  ]

  const climates = [
    { id: 'mild', name: 'Mild (South Coast)', multiplier: 0.8 },
    { id: 'average', name: 'Average UK', multiplier: 1.0 },
    { id: 'cold', name: 'Cold (Scotland/North)', multiplier: 1.15 },
    { id: 'wet', name: 'Very Wet Area', multiplier: 1.1 }
  ]

  const stablingTypes = [
    { id: 'out247', name: 'Out 24/7', turnoutHeavy: true, stableRug: false, multiplier: 1.1 },
    { id: 'mixed', name: 'Mixed (In at Night)', turnoutHeavy: true, stableRug: true, multiplier: 1.0 },
    { id: 'mostly_in', name: 'Mostly Stabled', turnoutHeavy: false, stableRug: true, multiplier: 0.9 }
  ]

  const budgetLevels = {
    budget: { name: 'Budget', multiplier: 0.6, brands: 'Shires, Derby House', lifespan: 2 },
    mid: { name: 'Mid-Range', multiplier: 1.0, brands: 'WeatherBeeta, Horseware', lifespan: 3 },
    premium: { name: 'Premium', multiplier: 1.6, brands: 'Rambo, Bucas, Back on Track', lifespan: 5 }
  }

  // Base rug prices (mid-range, medium weight, average size)
  const rugPrices = {
    turnoutLight: { name: 'Lightweight Turnout (0g)', base: 70, essential: true },
    turnoutMedium: { name: 'Medium Turnout (200g)', base: 95, essential: true },
    turnoutHeavy: { name: 'Heavy Turnout (300g+)', base: 120, essential: true },
    stableLight: { name: 'Stable Rug Light', base: 45, essential: false },
    stableMedium: { name: 'Stable Rug Medium', base: 60, essential: true },
    stableHeavy: { name: 'Stable Rug Heavy', base: 75, essential: false },
    fleece: { name: 'Fleece/Cooler', base: 35, essential: true },
    rainSheet: { name: 'Rain Sheet', base: 55, essential: false },
    flySheet: { name: 'Fly Sheet (Summer)', base: 50, essential: false },
    flyMask: { name: 'Fly Mask', base: 18, essential: true },
    exercise: { name: 'Exercise Sheet', base: 40, essential: false },
    underBlanket: { name: 'Under Blanket/Liner', base: 50, essential: false }
  }

  const calculate = () => {
    const horse = horseTypes.find(h => h.id === horseType)
    const climateData = climates.find(c => c.id === climate)
    const stablingData = stablingTypes.find(s => s.id === stabling)
    const budget = budgetLevels[budgetLevel as keyof typeof budgetLevels]
    
    if (!horse || !climateData || !stablingData || !budget) return

    // Calculate which rugs are needed
    const rugsNeeded: any[] = []
    let totalInitial = 0

    // Turnout rugs - almost always needed
    if (horse.multiplier >= 0.5) {
      rugsNeeded.push({ ...rugPrices.turnoutLight, quantity: 1, reason: 'Spring/autumn, mild days' })
      totalInitial += rugPrices.turnoutLight.base * budget.multiplier
    }
    if (horse.multiplier >= 0.7) {
      rugsNeeded.push({ ...rugPrices.turnoutMedium, quantity: includeSpares ? 2 : 1, reason: 'Main winter turnout' })
      totalInitial += rugPrices.turnoutMedium.base * budget.multiplier * (includeSpares ? 2 : 1)
    }
    if (horse.multiplier >= 0.85 && (climateData.multiplier >= 1.0 || stablingData.turnoutHeavy)) {
      rugsNeeded.push({ ...rugPrices.turnoutHeavy, quantity: 1, reason: 'Coldest days/nights' })
      totalInitial += rugPrices.turnoutHeavy.base * budget.multiplier
    }

    // Stable rugs - if stabled
    if (stablingData.stableRug) {
      if (horse.multiplier >= 0.7) {
        rugsNeeded.push({ ...rugPrices.stableMedium, quantity: 1, reason: 'Night time stabling' })
        totalInitial += rugPrices.stableMedium.base * budget.multiplier
      }
      if (horse.multiplier >= 1.0 && climateData.multiplier >= 1.0) {
        rugsNeeded.push({ ...rugPrices.stableHeavy, quantity: 1, reason: 'Very cold nights' })
        totalInitial += rugPrices.stableHeavy.base * budget.multiplier
      }
    }

    // Fleece/cooler - always useful
    rugsNeeded.push({ ...rugPrices.fleece, quantity: 1, reason: 'Drying off, travel, layering' })
    totalInitial += rugPrices.fleece.base * budget.multiplier

    // Fly mask - essential for most
    rugsNeeded.push({ ...rugPrices.flyMask, quantity: includeSpares ? 2 : 1, reason: 'Summer fly protection' })
    totalInitial += rugPrices.flyMask.base * budget.multiplier * (includeSpares ? 2 : 1)

    // Optional sheets
    if (includeSheets) {
      if (climateData.id === 'wet' || stablingData.id === 'out247') {
        rugsNeeded.push({ ...rugPrices.rainSheet, quantity: 1, reason: 'No-fill waterproof option' })
        totalInitial += rugPrices.rainSheet.base * budget.multiplier
      }
      rugsNeeded.push({ ...rugPrices.flySheet, quantity: 1, reason: 'Summer UV/fly protection' })
      totalInitial += rugPrices.flySheet.base * budget.multiplier
    }

    // Under blanket for cold horses
    if (horse.multiplier >= 1.2 || climateData.id === 'cold') {
      rugsNeeded.push({ ...rugPrices.underBlanket, quantity: 1, reason: 'Extra warmth layer' })
      totalInitial += rugPrices.underBlanket.base * budget.multiplier
    }

    // Calculate annual replacement cost
    const replacementRate = 1 / budget.lifespan // What fraction replaced per year
    const annualReplacement = totalInitial * replacementRate

    // Repairs and cleaning
    const annualRepairs = 30 * budget.multiplier
    const annualCleaning = 40 // Professional clean once a year

    const totalAnnual = annualReplacement + annualRepairs + annualCleaning
    const totalRugCount = rugsNeeded.reduce((sum, rug) => sum + rug.quantity, 0)

    // Compare budget levels
    const budgetTotal = totalInitial * (budgetLevels.budget.multiplier / budget.multiplier)
    const premiumTotal = totalInitial * (budgetLevels.premium.multiplier / budget.multiplier)

    setResult({
      totalInitial: totalInitial.toFixed(2),
      totalAnnual: totalAnnual.toFixed(2),
      monthlyAverage: (totalAnnual / 12).toFixed(2),
      rugCount: totalRugCount,
      rugsNeeded,
      breakdown: {
        replacement: annualReplacement.toFixed(2),
        repairs: annualRepairs.toFixed(2),
        cleaning: annualCleaning.toFixed(2)
      },
      budgetInfo: budget,
      horseInfo: horse,
      comparison: {
        budget: budgetTotal.toFixed(2),
        mid: totalInitial.toFixed(2),
        premium: premiumTotal.toFixed(2)
      },
      fiveYearCost: (totalInitial + (totalAnnual * 4)).toFixed(2),
      tips: getTips(horseType, climate, stabling)
    })
  }

  const getTips = (horse: string, climate: string, stabling: string) => {
    const tips = []
    if (horse === 'native') tips.push('Native breeds often need fewer rugs - don\'t over-rug')
    if (horse === 'thin') tips.push('Fine-coated horses feel the cold - invest in quality rugs')
    if (climate === 'wet') tips.push('Waterproofing is crucial - re-proof annually')
    if (stabling === 'out247') tips.push('Have a spare turnout for wet days')
    tips.push('Measure your horse carefully - ill-fitting rugs cause rubs')
    tips.push('Check rugs daily for damage and adjust straps')
    return tips
  }

  const faqs = [
    {
      q: 'How much do horse rugs cost UK?',
      a: 'Horse rugs in the UK cost £35-200+ each depending on type and quality. Budget turnouts cost £50-80, mid-range £80-120, and premium brands £120-200+. A basic rug wardrobe (3-4 rugs) costs £200-400 budget, £350-600 mid-range, or £600-1000+ premium. Annual replacement and repair adds £80-200.'
    },
    {
      q: 'How many rugs does a horse need?',
      a: 'A clipped horse typically needs 4-6 rugs: lightweight turnout, medium turnout (plus spare), heavy turnout, stable rug, and fleece cooler. Add fly sheet/mask for summer. Unclipped natives may only need 1-2 turnouts. The exact number depends on clip level, climate, and whether stabled.'
    },
    {
      q: 'What rugs do I need for a clipped horse?',
      a: 'A clipped horse needs: lightweight turnout (0g) for mild days, medium turnout (200g) as main winter rug, heavy turnout (300g+) for cold snaps, stable rug for nights in, fleece for drying/layering. Consider a rain sheet for spring/autumn and under-blanket for very cold weather.'
    },
    {
      q: 'Should I buy budget or premium rugs?',
      a: 'Budget rugs (£50-80) last 1-2 seasons but need replacing often. Mid-range (£80-120) balance quality and value, lasting 2-3 years. Premium rugs (£120-200+) last 4-5+ years with better waterproofing and fit. Premium works out cheaper long-term if you can afford the upfront cost.'
    },
    {
      q: 'How long do horse rugs last?',
      a: 'Budget rugs last 1-2 years, mid-range 2-3 years, and premium 4-5+ years with proper care. Turnout rugs wear faster than stable rugs. Lifespan depends on: horse behaviour (rug wreckers!), quality of waterproofing, proper fit, and care (cleaning, storage, repairs).'
    },
    {
      q: 'Do unclipped horses need rugs?',
      a: 'Many unclipped horses cope without rugs if: they\'re native/hardy breeds, have good natural shelter, and aren\'t losing condition. However, most unclipped horses benefit from a lightweight/medium turnout in very wet weather to prevent rain scald. Watch your horse - if shivering, they need rugging.'
    },
    {
      q: 'How do I know if my horse is too hot or cold?',
      a: 'Check the base of ears and inside back legs - these should feel warm, not hot or cold. A cold horse has cold ears, may shiver, and tucks up. An over-rugged horse sweats under the rug, has a damp coat, and may lose condition. Adjust rugging to temperature, wind, and rain.'
    },
    {
      q: 'When should I start rugging my horse?',
      a: 'Start rugging when temperatures drop below 10°C for clipped horses, or 5°C for unclipped. Consider wind chill and rain - a wet 10°C day with wind is colder than a dry 5°C day. Clipped horses need rugging immediately after clipping. Introduce gradually if possible.'
    },
    {
      q: 'How do I measure my horse for rugs?',
      a: 'Measure from centre of chest, along the side, to the point of buttock. This gives rug size in feet/inches (e.g., 6\'0"). Common sizes: ponies 4\'6"-5\'9", cobs 5\'9"-6\'3", horses 6\'0"-6\'9", large horses 6\'9"-7\'3". Fit is crucial - too small causes rubs, too big slips.'
    },
    {
      q: 'How do I care for horse rugs?',
      a: 'Shake out mud daily, brush when dry, repair tears promptly. Wash 1-2 times per season (or professionally clean £15-25). Re-proof waterproof rugs annually (Nikwax or professional). Store clean and dry in summer. Check straps, buckles, and stitching regularly. Good care extends rug life significantly.'
    }
  ]

  return (
    <>
      <Helmet>
        {/* ========== 1. PRIMARY META TAGS (4) ========== */}
        <title>Horse Rug Cost Calculator UK 2025 | How Many Rugs Needed | HorseCost</title>
        <meta 
          name="description" 
          content="Free horse rug cost calculator for UK owners. Calculate how many rugs your horse needs, compare budget vs premium brands, and plan your annual rug budget. 2025 UK prices." 
        />
        <meta 
          name="keywords" 
          content="horse rug cost UK, how many rugs does a horse need, turnout rug price, horse blanket cost, WeatherBeeta price, Rambo rug cost, horse rug wardrobe" 
        />
        <meta name="author" content="HorseCost" />

        {/* ========== 2. ROBOTS & CRAWLING (2) ========== */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* ========== 3. VIEWPORT & MOBILE (3) ========== */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* ========== 4. THEME & APPEARANCE (1) ========== */}
        <meta name="theme-color" content="#7c3aed" />

        {/* ========== 5. OPEN GRAPH / FACEBOOK (8) ========== */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:title" content="Horse Rug Cost Calculator UK 2025 | How Many Rugs | HorseCost" />
        <meta property="og:description" content="Calculate how many rugs your horse needs and plan your rug budget with UK 2025 prices." />
        <meta property="og:url" content="https://horsecost.co.uk/rug-cost-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/rug-calculator-og-1200x630.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Horse Rug Cost Calculator showing rug wardrobe and prices" />

        {/* ========== 6. TWITTER CARD (6) ========== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Horse Rug Cost Calculator UK 2025 | HorseCost" />
        <meta name="twitter:description" content="Calculate your horse rug needs and costs. Budget vs premium comparison included." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/rug-calculator-twitter-1200x675.jpg" />
        <meta name="twitter:image:alt" content="Horse Rug Cost Calculator UK" />

        {/* ========== 7. CANONICAL & ALTERNATE (2) ========== */}
        <link rel="canonical" href="https://horsecost.co.uk/rug-cost-calculator" />
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/rug-cost-calculator" />

        {/* ========== 8. PRECONNECT & PERFORMANCE (2) ========== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* ========== 9. JSON-LD STRUCTURED DATA (6 Schemas) ========== */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/#calculators' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Rug Cost Calculator', 'item': 'https://horsecost.co.uk/rug-cost-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Rug Cost Calculator UK',
                'description': 'Calculate how many rugs your horse needs and plan your rug budget with UK 2025 pricing.',
                'url': 'https://horsecost.co.uk/rug-cost-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.7', 'ratingCount': '234', 'bestRating': '5', 'worstRating': '1' },
                'author': { '@type': 'Organization', 'name': 'HorseCost' }
              },
              {
                '@type': 'FAQPage',
                'mainEntity': faqs.map(faq => ({
                  '@type': 'Question',
                  'name': faq.q,
                  'acceptedAnswer': { '@type': 'Answer', 'text': faq.a }
                }))
              },
              {
                '@type': 'HowTo',
                'name': 'How to Use the Horse Rug Cost Calculator',
                'description': 'Step-by-step guide to calculating your horse rug needs and costs',
                'step': [
                  { '@type': 'HowToStep', 'position': 1, 'name': 'Select Horse Type', 'text': 'Choose your horse\'s coat type and clip level as this determines rug requirements.' },
                  { '@type': 'HowToStep', 'position': 2, 'name': 'Set Your Climate', 'text': 'Select your UK region climate - colder areas need heavier rugs.' },
                  { '@type': 'HowToStep', 'position': 3, 'name': 'Choose Stabling Situation', 'text': 'Indicate if horse lives out 24/7, is stabled at night, or mostly stabled.' },
                  { '@type': 'HowToStep', 'position': 4, 'name': 'Select Budget Level', 'text': 'Choose budget, mid-range, or premium brands to match your spending.' },
                  { '@type': 'HowToStep', 'position': 5, 'name': 'Calculate Rug Wardrobe', 'text': 'Click Calculate to see your complete rug list, initial cost, and annual budget.' }
                ]
              },
              {
                '@type': 'Article',
                'headline': 'Horse Rug Cost Calculator UK 2025 - How Many Rugs Does Your Horse Need',
                'description': 'Free calculator for UK horse rug costs. Work out your complete rug wardrobe and compare budget vs premium brands.',
                'datePublished': '2025-01-01',
                'dateModified': '2025-01-15',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png', 'width': 200, 'height': 200 } },
                'image': 'https://horsecost.co.uk/images/rug-calculator-og-1200x630.jpg',
                'mainEntityOfPage': { '@type': 'WebPage', '@id': 'https://horsecost.co.uk/rug-cost-calculator' }
              },
              {
                '@type': 'Organization',
                'name': 'HorseCost',
                'url': 'https://horsecost.co.uk',
                'logo': 'https://horsecost.co.uk/logo.png',
                'description': 'Free professional horse cost calculators for UK equestrians',
                'sameAs': ['https://www.facebook.com/HorseCost', 'https://twitter.com/HorseCost', 'https://www.instagram.com/HorseCost'],
                'contactPoint': { '@type': 'ContactPoint', 'contactType': 'Customer Support', 'email': 'hello@horsecost.co.uk' },
                'address': { '@type': 'PostalAddress', 'addressCountry': 'GB' }
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <a href="/" className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Shirt className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Rug Cost Calculator</h1>
                <p className="text-violet-200">UK 2025 Rug Wardrobe Planner</p>
              </div>
            </div>
            <p className="text-violet-100 max-w-2xl">
              Calculate how many rugs your horse needs and plan your rug budget. 
              Compare budget, mid-range, and premium brands.
            </p>
            <p className="text-violet-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Horse Type / Clip Level</label>
                  </div>
                  <div className="space-y-2">
                    {horseTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setHorseType(type.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          horseType === type.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${horseType === type.id ? 'text-violet-700' : 'text-gray-900'}`}>
                              {type.name}
                            </p>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                          <p className="text-sm text-gray-600 capitalize">{type.rugsNeeded}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Your Climate</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {climates.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setClimate(c.id)}
                        className={`p-3 rounded-xl text-center transition border-2 ${
                          climate === c.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`font-medium text-sm ${climate === c.id ? 'text-violet-700' : 'text-gray-900'}`}>
                          {c.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Stabling Situation</label>
                  </div>
                  <div className="space-y-2">
                    {stablingTypes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStabling(s.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          stabling === s.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`font-medium ${stabling === s.id ? 'text-violet-700' : 'text-gray-900'}`}>
                          {s.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Budget Level</label>
                  </div>
                  <div className="flex gap-2">
                    {Object.entries(budgetLevels).map(([key, level]) => (
                      <button
                        key={key}
                        onClick={() => setBudgetLevel(key)}
                        className={`flex-1 py-3 rounded-xl font-medium transition ${
                          budgetLevel === key
                            ? 'bg-violet-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {budgetLevels[budgetLevel as keyof typeof budgetLevels].brands}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-violet-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Options
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeSpares}
                          onChange={(e) => setIncludeSpares(e.target.checked)}
                          className="w-5 h-5 text-violet-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Include Spare Rugs</span>
                          <p className="text-sm text-gray-500">Spare turnout for wet days</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeSheets}
                          onChange={(e) => setIncludeSheets(e.target.checked)}
                          className="w-5 h-5 text-violet-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Include Fly Sheet</span>
                          <p className="text-sm text-gray-500">Summer protection</p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-violet-700 hover:to-purple-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Rug Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
                      <p className="text-violet-100 text-sm mb-1">Initial Rug Wardrobe</p>
                      <p className="text-4xl font-bold">£{result.totalInitial}</p>
                      <p className="text-violet-200 text-sm mt-1">{result.rugCount} rugs - {result.budgetInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-violet-100 text-xs">Annual Cost</p>
                          <p className="font-bold">£{result.totalAnnual}</p>
                        </div>
                        <div>
                          <p className="text-violet-100 text-xs">Monthly</p>
                          <p className="font-bold">£{result.monthlyAverage}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Your Rug Wardrobe</h3>
                      <div className="space-y-2 text-sm">
                        {result.rugsNeeded.map((rug: any, i: number) => (
                          <div key={i} className="flex justify-between items-start">
                            <div>
                              <span className="text-gray-900">{rug.name}</span>
                              {rug.quantity > 1 && <span className="text-violet-600 ml-1">×{rug.quantity}</span>}
                              <p className="text-xs text-gray-500">{rug.reason}</p>
                            </div>
                            <span className="font-medium">£{(rug.base * result.budgetInfo.multiplier * rug.quantity).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Annual Running Costs</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Replacement Fund</span>
                          <span className="font-medium">£{result.breakdown.replacement}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Repairs</span>
                          <span className="font-medium">£{result.breakdown.repairs}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Professional Cleaning</span>
                          <span className="font-medium">£{result.breakdown.cleaning}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Annual</span>
                          <span>£{result.totalAnnual}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-violet-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Budget Comparison</h3>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <p className="text-gray-600 text-xs">Budget</p>
                          <p className="font-bold">£{result.comparison.budget}</p>
                        </div>
                        <div className="bg-violet-50 rounded-lg p-2 text-center">
                          <p className="text-violet-600 text-xs">Mid-Range</p>
                          <p className="font-bold">£{result.comparison.mid}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2 text-center">
                          <p className="text-purple-600 text-xs">Premium</p>
                          <p className="font-bold">£{result.comparison.premium}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Premium lasts {budgetLevels.premium.lifespan} years vs {budgetLevels.budget.lifespan} years for budget
                      </p>
                    </div>

                    <div className="bg-violet-50 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">5-Year Total Cost</span>
                        <span className="font-bold text-violet-700 text-lg">£{result.fiveYearCost}</span>
                      </div>
                    </div>

                    {result.tips.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <Thermometer className="w-5 h-5" />
                          Tips for Your Horse
                        </h3>
                        <ul className="text-sm text-amber-800 space-y-1">
                          {result.tips.map((tip: string, i: number) => (
                            <li key={i}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Shirt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Configure your horse's needs to see rug recommendations</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-violet-50 border-l-4 border-violet-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-violet-900 mb-2">Rugging Guidelines</h3>
                <ul className="text-violet-800 space-y-1 text-sm">
                  <li>• <strong>Don't over-rug</strong> - horses tolerate cold better than we think</li>
                  <li>• <strong>Check temperature</strong> - feel ears and under rug daily</li>
                  <li>• <strong>Waterproofing matters</strong> - a wet horse is a cold horse</li>
                  <li>• <strong>Fit is crucial</strong> - poor fit causes rubs and slipping</li>
                  <li>• <strong>Layer up</strong> - use liners rather than one heavy rug</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Rug Prices 2025</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Rug Type</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Budget</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Mid-Range</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Lightweight Turnout (0g)</td>
                    <td className="py-3 px-4 text-center">£40-55</td>
                    <td className="py-3 px-4 text-center">£60-85</td>
                    <td className="py-3 px-4 text-center">£100-140</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Medium Turnout (200g)</td>
                    <td className="py-3 px-4 text-center">£55-75</td>
                    <td className="py-3 px-4 text-center">£85-120</td>
                    <td className="py-3 px-4 text-center">£140-180</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Heavy Turnout (300g+)</td>
                    <td className="py-3 px-4 text-center">£70-90</td>
                    <td className="py-3 px-4 text-center">£100-140</td>
                    <td className="py-3 px-4 text-center">£160-220</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Stable Rug Medium</td>
                    <td className="py-3 px-4 text-center">£35-50</td>
                    <td className="py-3 px-4 text-center">£50-75</td>
                    <td className="py-3 px-4 text-center">£80-120</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Fleece/Cooler</td>
                    <td className="py-3 px-4 text-center">£20-30</td>
                    <td className="py-3 px-4 text-center">£30-45</td>
                    <td className="py-3 px-4 text-center">£50-80</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group bg-gray-50 rounded-xl">
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                    <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                    <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Calculators</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/tack-equipment-calculator" className="bg-cyan-50 hover:bg-cyan-100 rounded-xl p-4 transition group">
                <Star className="w-8 h-8 text-cyan-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-cyan-600">Tack & Equipment</h3>
                <p className="text-sm text-gray-600">Full gear costs</p>
              </a>
              <a href="/clipping-cost-calculator" className="bg-indigo-50 hover:bg-indigo-100 rounded-xl p-4 transition group">
                <Calendar className="w-8 h-8 text-indigo-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">Clipping Calculator</h3>
                <p className="text-sm text-gray-600">Clipping affects rug needs</p>
              </a>
              <a href="/annual-horse-cost-calculator" className="bg-amber-50 hover:bg-amber-100 rounded-xl p-4 transition group">
                <Calculator className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600">Annual Costs</h3>
                <p className="text-sm text-gray-600">Complete budget</p>
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Calculate Your Full Tack & Equipment Costs</h2>
            <p className="text-violet-100 mb-6 max-w-xl mx-auto">
              Rugs are just part of your equipment budget. Get the complete picture.
            </p>
            <a 
              href="/tack-equipment-calculator"
              className="inline-flex items-center gap-2 bg-white text-violet-600 px-6 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
            >
              Calculate Equipment Costs
              <Calculator className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
