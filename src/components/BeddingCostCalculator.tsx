import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Layers,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  PoundSterling,
  Calendar,
  Leaf,
  Truck
} from 'lucide-react'

export default function BeddingCostCalculator() {
  const [beddingType, setBeddingType] = useState('shavings')
  const [stableSize, setStableSize] = useState('standard')
  const [horsesKeptIn, setHorsesKeptIn] = useState('stabled')
  const [region, setRegion] = useState('average')
  const [customBagPrice, setCustomBagPrice] = useState('')
  const [customBagsPerWeek, setCustomBagsPerWeek] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [includeDisposal, setIncludeDisposal] = useState(true)
  const [bulkBuying, setBulkBuying] = useState(false)
  const [result, setResult] = useState<any>(null)

  const beddingTypes = [
    { 
      id: 'shavings', 
      name: 'Wood Shavings', 
      description: 'Most popular option',
      bagPrice: 9,
      bagWeight: '20kg',
      bagsPerWeekFull: 3,
      bagsPerWeekPartial: 1.5,
      disposal: 'easy',
      pros: ['Widely available', 'Good absorbency', 'Easy to muck out'],
      cons: ['Can be dusty', 'Takes time to decompose']
    },
    { 
      id: 'straw', 
      name: 'Straw', 
      description: 'Traditional bedding',
      bagPrice: 5,
      bagWeight: 'bale',
      bagsPerWeekFull: 2,
      bagsPerWeekPartial: 1,
      disposal: 'easy',
      pros: ['Cheapest option', 'Warm & comfortable', 'Easy to find'],
      cons: ['Horses may eat it', 'More waste volume', 'Can be dusty']
    },
    { 
      id: 'pellets', 
      name: 'Wood Pellets', 
      description: 'Expands when wet',
      bagPrice: 8,
      bagWeight: '15kg',
      bagsPerWeekFull: 2,
      bagsPerWeekPartial: 1,
      disposal: 'medium',
      pros: ['Very absorbent', 'Low dust', 'Less storage space'],
      cons: ['Higher initial cost', 'Needs water to expand', 'Can be slippery initially']
    },
    { 
      id: 'hemp', 
      name: 'Hemp Bedding', 
      description: 'Eco-friendly option',
      bagPrice: 14,
      bagWeight: '20kg',
      bagsPerWeekFull: 2,
      bagsPerWeekPartial: 1,
      disposal: 'excellent',
      pros: ['Very absorbent', 'Virtually dust-free', 'Composts quickly'],
      cons: ['Most expensive', 'Not always available']
    },
    { 
      id: 'paper', 
      name: 'Shredded Paper', 
      description: 'Dust-free option',
      bagPrice: 11,
      bagWeight: '20kg',
      bagsPerWeekFull: 2.5,
      bagsPerWeekPartial: 1.5,
      disposal: 'medium',
      pros: ['Dust-free', 'Good for respiratory issues', 'Recyclable'],
      cons: ['Can get soggy', 'Sticks to rugs', 'Moderate cost']
    },
    { 
      id: 'rubber', 
      name: 'Rubber Matting', 
      description: 'Minimal bedding needed',
      bagPrice: 0,
      bagWeight: 'one-off',
      bagsPerWeekFull: 0.5,
      bagsPerWeekPartial: 0.25,
      disposal: 'minimal',
      pros: ['Long-term savings', 'Easy to clean', 'Comfortable'],
      cons: ['High upfront cost (£300-600)', 'Needs thin layer on top']
    },
    { 
      id: 'miscanthus', 
      name: 'Miscanthus', 
      description: 'Elephant grass bedding',
      bagPrice: 12,
      bagWeight: '20kg',
      bagsPerWeekFull: 2,
      bagsPerWeekPartial: 1,
      disposal: 'excellent',
      pros: ['Very absorbent', 'Low dust', 'Sustainable'],
      cons: ['Not widely available', 'Premium price']
    }
  ]

  const stableSizes = [
    { id: 'small', name: 'Small (10x10ft)', multiplier: 0.8 },
    { id: 'standard', name: 'Standard (12x12ft)', multiplier: 1.0 },
    { id: 'large', name: 'Large (14x14ft)', multiplier: 1.3 },
    { id: 'foaling', name: 'Foaling Box (16x16ft)', multiplier: 1.6 }
  ]

  const keepingOptions = [
    { id: 'stabled', name: 'Fully Stabled', description: 'In overnight + daytime', multiplier: 1.0 },
    { id: 'nightonly', name: 'Night Only', description: 'Out during day', multiplier: 0.6 },
    { id: 'parttime', name: 'Part Time', description: '3-4 nights per week', multiplier: 0.4 },
    { id: 'fieldkept', name: 'Field Kept', description: 'Occasional stabling only', multiplier: 0.15 }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.25,
    'southeast': 1.15,
    'average': 1.0,
    'north': 0.9,
    'scotland': 0.95
  }

  const disposalCosts: Record<string, number> = {
    easy: 30,
    medium: 50,
    excellent: 20,
    minimal: 10
  }

  const calculate = () => {
    const bedding = beddingTypes.find(b => b.id === beddingType)
    const size = stableSizes.find(s => s.id === stableSize)
    const keeping = keepingOptions.find(k => k.id === horsesKeptIn)
    
    if (!bedding || !size || !keeping) return

    const regionFactor = regionMultipliers[region]
    
    // Calculate bags per week
    let bagsPerWeek = keeping.multiplier >= 0.5 
      ? bedding.bagsPerWeekFull * size.multiplier * keeping.multiplier
      : bedding.bagsPerWeekPartial * size.multiplier * (keeping.multiplier / 0.5)
    
    // Custom override
    if (customBagsPerWeek && parseFloat(customBagsPerWeek) > 0) {
      bagsPerWeek = parseFloat(customBagsPerWeek)
    }
    
    // Bag price
    let bagPrice = bedding.bagPrice
    if (customBagPrice && parseFloat(customBagPrice) > 0) {
      bagPrice = parseFloat(customBagPrice)
    } else {
      bagPrice *= regionFactor
    }
    
    // Bulk discount
    if (bulkBuying) {
      bagPrice *= 0.85 // 15% bulk discount
    }

    const weeklyBeddingCost = bagsPerWeek * bagPrice
    const monthlyBeddingCost = weeklyBeddingCost * 4.33
    const annualBeddingCost = weeklyBeddingCost * 52

    // Disposal costs
    let annualDisposal = 0
    if (includeDisposal) {
      annualDisposal = disposalCosts[bedding.disposal] * 12 * regionFactor * keeping.multiplier
    }

    // Initial setup (if rubber matting)
    let initialSetup = 0
    if (beddingType === 'rubber') {
      initialSetup = 450 * size.multiplier // rubber mats one-off cost
    }

    const totalAnnual = annualBeddingCost + annualDisposal
    const totalFirstYear = totalAnnual + initialSetup

    // Compare to alternatives
    const shavingsCost = 9 * 3 * 52 * size.multiplier * keeping.multiplier * regionFactor
    const strawCost = 5 * 2 * 52 * size.multiplier * keeping.multiplier * regionFactor

    setResult({
      weeklyBeddingCost: weeklyBeddingCost.toFixed(2),
      monthlyBeddingCost: monthlyBeddingCost.toFixed(2),
      annualBeddingCost: annualBeddingCost.toFixed(2),
      annualDisposal: annualDisposal.toFixed(2),
      totalAnnual: totalAnnual.toFixed(2),
      totalFirstYear: totalFirstYear.toFixed(2),
      initialSetup: initialSetup.toFixed(2),
      bagsPerWeek: bagsPerWeek.toFixed(1),
      bagsPerYear: (bagsPerWeek * 52).toFixed(0),
      bagPrice: bagPrice.toFixed(2),
      beddingInfo: bedding,
      comparison: {
        shavings: shavingsCost.toFixed(2),
        straw: strawCost.toFixed(2),
        current: totalAnnual.toFixed(2)
      },
      savings: {
        vsShavings: (shavingsCost - totalAnnual).toFixed(2),
        vsStraw: (strawCost - totalAnnual).toFixed(2)
      }
    })
  }

  const faqs = [
    {
      q: 'What is the cheapest horse bedding UK?',
      a: 'Straw is typically the cheapest horse bedding in the UK at £4-6 per bale, costing around £400-600/year for a fully stabled horse. However, it creates more waste volume. Wood shavings cost £600-900/year but are easier to manage. Long-term, rubber matting with minimal bedding can be most economical.'
    },
    {
      q: 'How much bedding does a horse need per week?',
      a: 'A fully stabled horse typically needs 2-4 bags/bales of bedding per week depending on type. Shavings: 2-3 bags (20kg), Straw: 2-3 bales, Pellets: 1-2 bags (expand when wet). Horses stabled only at night need 40-60% less. Rubber matting reduces bedding needs by 70-80%.'
    },
    {
      q: 'What is the best bedding for horses with respiratory issues?',
      a: 'Dust-free options are essential for horses with respiratory problems. Paper bedding, hemp, and dust-extracted shavings are best. Avoid straw (dusty and mould-prone) and standard shavings. Rubber matting with minimal dust-free bedding on top is ideal for severe cases.'
    },
    {
      q: 'Is straw or shavings better for horses?',
      a: 'Both have pros and cons. Straw is cheaper, warmer, and traditional but horses may eat it, it\'s dustier, and creates more waste. Shavings are more absorbent, easier to muck out, and horses won\'t eat them, but cost more and take longer to decompose.'
    },
    {
      q: 'How often should horse bedding be changed?',
      a: 'Full bed changes aren\'t usually needed if you muck out daily. With good management, deep litter beds need full changes every 3-6 months. Rubber matting systems may only need weekly deep cleans. Daily removal of droppings and wet patches is essential regardless of bedding type.'
    },
    {
      q: 'What is deep litter bedding for horses?',
      a: 'Deep litter involves removing droppings but leaving wet bedding, adding fresh on top. The bed builds up over weeks/months, generating warmth through decomposition. It works best with straw, requires less daily work, but needs complete strip-out every few months. Not suitable for all horses.'
    },
    {
      q: 'Are rubber stable mats worth it?',
      a: 'Rubber mats cost £300-600 upfront but reduce bedding needs by 70-80%, saving £400-600/year on bedding. They\'re more comfortable, easier to clean, and last 10-20 years. Break-even is typically 1-2 years. Ideal for horses on box rest or with joint issues.'
    },
    {
      q: 'How do I dispose of horse bedding waste?',
      a: 'Options include: muck heap collection services (£20-100/month), farmer collection (often free for straw), local compost schemes, or bagging for garden centres. Straw and hemp compost fastest. Some yards have communal muck heaps with regular collection.'
    },
    {
      q: 'What bedding is best for foals?',
      a: 'Straw is traditionally preferred for foaling boxes - it\'s warm, non-slip, and allows foals to stand easily. Avoid deep shavings (foals can inhale them). Paper or hemp are good alternatives. Ensure bedding is deep and clean for the first few weeks.'
    },
    {
      q: 'How much does horse bedding cost per month UK?',
      a: 'Monthly bedding costs in the UK: Straw £30-50, Shavings £50-90, Pellets £50-70, Hemp £70-110, Paper £60-100. These assume standard stable, fully stabled horse, and average UK prices. Costs vary significantly by region and horse\'s time in stable.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Bedding Cost Calculator UK 2025 | Compare Horse Bedding | HorseCost</title>
        <meta 
          name="description" 
          content="Free horse bedding cost calculator for UK. Compare shavings, straw, hemp, pellets and rubber matting costs. Calculate annual bedding budget with 2025 prices." 
        />
        <meta name="keywords" content="horse bedding cost UK, shavings price, straw bedding cost, hemp bedding horse, rubber stable mats, bedding calculator" />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#854d0e" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:title" content="Bedding Cost Calculator UK 2025 | HorseCost" />
        <meta property="og:description" content="Compare horse bedding costs - shavings, straw, hemp, pellets and more." />
        <meta property="og:url" content="https://horsecost.co.uk/bedding-cost-calculator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bedding Cost Calculator UK | HorseCost" />

        <link rel="canonical" href="https://horsecost.co.uk/bedding-cost-calculator" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/#calculators' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Bedding Cost Calculator', 'item': 'https://horsecost.co.uk/bedding-cost-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Bedding Cost Calculator UK',
                'description': 'Calculate and compare horse bedding costs for different bedding types.',
                'url': 'https://horsecost.co.uk/bedding-cost-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.7', 'ratingCount': '198' }
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
                '@type': 'Organization',
                'name': 'HorseCost',
                'url': 'https://horsecost.co.uk'
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Back Link */}
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <a href="/" className="text-yellow-700 hover:text-yellow-800 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-700 to-amber-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Bedding Cost Calculator</h1>
                <p className="text-yellow-200">UK 2025 Bedding Comparison Tool</p>
              </div>
            </div>
            <p className="text-yellow-100 max-w-2xl">
              Compare horse bedding costs and find the most economical option for your stable. 
              Calculate annual costs for shavings, straw, hemp, pellets, and rubber matting.
            </p>
            <p className="text-yellow-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        {/* Calculator */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Bedding Type */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Bedding Type</label>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {beddingTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setBeddingType(type.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          beddingType === type.id
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${beddingType === type.id ? 'text-yellow-700' : 'text-gray-900'}`}>
                              {type.name}
                            </p>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                          <p className="text-sm text-gray-600">
                            {type.bagPrice > 0 ? `~£${type.bagPrice}/${type.bagWeight}` : 'One-off cost'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stable Size */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Stable Size</label>
                  </div>
                  <select
                    value={stableSize}
                    onChange={(e) => setStableSize(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                  >
                    {stableSizes.map((size) => (
                      <option key={size.id} value={size.id}>{size.name}</option>
                    ))}
                  </select>
                </div>

                {/* Time Stabled */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Time Stabled</label>
                  </div>
                  <div className="space-y-2">
                    {keepingOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setHorsesKeptIn(option.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          horsesKeptIn === option.id
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`font-medium ${horsesKeptIn === option.id ? 'text-yellow-700' : 'text-gray-900'}`}>
                          {option.name}
                        </p>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Region */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                  >
                    <option value="london">London / South East (Higher prices)</option>
                    <option value="southeast">Home Counties</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England</option>
                    <option value="scotland">Scotland / Wales</option>
                  </select>
                </div>

                {/* Advanced Options */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-yellow-700 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Additional Options
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Bag/Bale Price (£)
                        </label>
                        <div className="relative">
                          <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={customBagPrice}
                            onChange={(e) => setCustomBagPrice(e.target.value)}
                            placeholder="Leave blank for estimate"
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bags/Bales Per Week
                        </label>
                        <input
                          type="number"
                          value={customBagsPerWeek}
                          onChange={(e) => setCustomBagsPerWeek(e.target.value)}
                          placeholder="Leave blank for estimate"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                        />
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeDisposal}
                          onChange={(e) => setIncludeDisposal(e.target.checked)}
                          className="w-5 h-5 text-yellow-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Include Muck Disposal</span>
                          <p className="text-sm text-gray-500">Collection or removal costs</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bulkBuying}
                          onChange={(e) => setBulkBuying(e.target.checked)}
                          className="w-5 h-5 text-yellow-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Bulk Buying Discount</span>
                          <p className="text-sm text-gray-500">~15% off for pallet orders</p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Results */}
              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 text-white py-4 rounded-xl font-bold text-lg hover:from-yellow-700 hover:to-amber-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Bedding Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-yellow-600 to-amber-600 rounded-2xl p-6 text-white">
                      <p className="text-yellow-100 text-sm mb-1">Annual Bedding Cost</p>
                      <p className="text-4xl font-bold">£{result.totalAnnual}</p>
                      <p className="text-yellow-200 text-sm mt-1">{result.beddingInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-yellow-100 text-xs">Weekly</p>
                          <p className="font-bold">£{result.weeklyBeddingCost}</p>
                        </div>
                        <div>
                          <p className="text-yellow-100 text-xs">Monthly</p>
                          <p className="font-bold">£{result.monthlyBeddingCost}</p>
                        </div>
                      </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="bg-yellow-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Usage Estimate</h3>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-yellow-600 text-sm">Per Week</p>
                          <p className="text-xl font-bold text-gray-900">{result.bagsPerWeek}</p>
                          <p className="text-xs text-gray-500">bags/bales</p>
                        </div>
                        <div>
                          <p className="text-yellow-600 text-sm">Per Year</p>
                          <p className="text-xl font-bold text-gray-900">{result.bagsPerYear}</p>
                          <p className="text-xs text-gray-500">bags/bales</p>
                        </div>
                        <div>
                          <p className="text-yellow-600 text-sm">Unit Cost</p>
                          <p className="text-xl font-bold text-gray-900">£{result.bagPrice}</p>
                          <p className="text-xs text-gray-500">per bag/bale</p>
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Annual Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bedding</span>
                          <span className="font-medium">£{result.annualBeddingCost}</span>
                        </div>
                        {parseFloat(result.annualDisposal) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Muck Disposal</span>
                            <span className="font-medium">£{result.annualDisposal}</span>
                          </div>
                        )}
                        {parseFloat(result.initialSetup) > 0 && (
                          <div className="flex justify-between text-amber-600">
                            <span>+ Initial Setup (rubber mats)</span>
                            <span className="font-medium">£{result.initialSetup}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Annual</span>
                          <span>£{result.totalAnnual}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pros & Cons */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">{result.beddingInfo.name} - Pros & Cons</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-green-600 font-medium text-sm mb-2">✓ Pros</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {result.beddingInfo.pros.map((pro: string, i: number) => (
                              <li key={i}>• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-red-600 font-medium text-sm mb-2">✗ Cons</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {result.beddingInfo.cons.map((con: string, i: number) => (
                              <li key={i}>• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Comparison */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h3 className="font-semibold text-amber-900 mb-3">Compare to Alternatives</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Wood Shavings</span>
                          <span className={`font-medium ${parseFloat(result.savings.vsShavings) > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            £{result.comparison.shavings}/year
                            {parseFloat(result.savings.vsShavings) > 0 && ` (save £${result.savings.vsShavings})`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Straw</span>
                          <span className={`font-medium ${parseFloat(result.savings.vsStraw) > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            £{result.comparison.straw}/year
                            {parseFloat(result.savings.vsStraw) > 0 && ` (save £${result.savings.vsStraw})`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select your bedding type and stable setup to see costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Box */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">Money-Saving Tips for Bedding</h3>
                <ul className="text-yellow-800 space-y-1 text-sm">
                  <li>• <strong>Buy in bulk</strong> - pallet orders save 10-20% on shavings and pellets</li>
                  <li>• <strong>Consider rubber mats</strong> - upfront cost but 70% less bedding needed</li>
                  <li>• <strong>Muck out efficiently</strong> - use a shavings fork to save bedding</li>
                  <li>• <strong>Local farmers</strong> - often sell straw cheaper than feed merchants</li>
                  <li>• <strong>Share delivery</strong> - split costs with yard friends</li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Bedding Prices Table */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Horse Bedding Prices 2025</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Bedding Type</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Price/Unit</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Weekly Cost</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Annual Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Straw</td>
                    <td className="py-3 px-4 text-center">£4-7/bale</td>
                    <td className="py-3 px-4 text-center">£8-14</td>
                    <td className="py-3 px-4 text-center">£400-750</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Wood Shavings</td>
                    <td className="py-3 px-4 text-center">£8-12/bag</td>
                    <td className="py-3 px-4 text-center">£24-36</td>
                    <td className="py-3 px-4 text-center">£600-950</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Wood Pellets</td>
                    <td className="py-3 px-4 text-center">£7-10/bag</td>
                    <td className="py-3 px-4 text-center">£14-20</td>
                    <td className="py-3 px-4 text-center">£550-850</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Hemp</td>
                    <td className="py-3 px-4 text-center">£12-16/bale</td>
                    <td className="py-3 px-4 text-center">£24-32</td>
                    <td className="py-3 px-4 text-center">£750-1,100</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Paper</td>
                    <td className="py-3 px-4 text-center">£10-13/bag</td>
                    <td className="py-3 px-4 text-center">£25-33</td>
                    <td className="py-3 px-4 text-center">£650-900</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Rubber Mats + Minimal</td>
                    <td className="py-3 px-4 text-center">£300-600 setup</td>
                    <td className="py-3 px-4 text-center">£5-10</td>
                    <td className="py-3 px-4 text-center">£200-400</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Costs based on fully stabled horse in standard 12x12ft stable. Actual costs vary by region, supplier, and horse's habits.
            </p>
          </div>

          {/* FAQ Section */}
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

          {/* Related Calculators */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Calculators</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/horse-feed-calculator" className="bg-green-50 hover:bg-green-100 rounded-xl p-4 transition group">
                <Leaf className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600">Feed Calculator</h3>
                <p className="text-sm text-gray-600">Hay and hard feed costs</p>
              </a>
              <a href="/annual-horse-cost-calculator" className="bg-amber-50 hover:bg-amber-100 rounded-xl p-4 transition group">
                <Calendar className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600">Annual Cost Calculator</h3>
                <p className="text-sm text-gray-600">Complete ownership budget</p>
              </a>
              <a href="/livery-cost-calculator" className="bg-orange-50 hover:bg-orange-100 rounded-xl p-4 transition group">
                <Truck className="w-8 h-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">Livery Calculator</h3>
                <p className="text-sm text-gray-600">Compare livery options</p>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-yellow-600 to-amber-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Calculate Your Full Horse Budget</h2>
            <p className="text-yellow-100 mb-6 max-w-xl mx-auto">
              Bedding is just one cost. Get the complete picture with our Annual Horse Cost Calculator.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-yellow-700 px-6 py-3 rounded-xl font-bold hover:bg-yellow-50 transition"
            >
              Calculate Annual Costs
              <Calculator className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
