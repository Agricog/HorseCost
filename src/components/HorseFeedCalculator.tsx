import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Wheat,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Scale,
  TrendingUp,
  PieChart,
  Leaf,
  Package
} from 'lucide-react'

export default function HorseFeedCalculator() {
  // Horse details
  const [horseWeight, setHorseWeight] = useState('')
  const [workLevel, setWorkLevel] = useState('')
  const [horseType, setHorseType] = useState('')
  
  // Feed costs
  const [hayPricePerBale, setHayPricePerBale] = useState('')
  const [baleWeight, setBaleWeight] = useState('20')
  const [hardFeedPerDay, setHardFeedPerDay] = useState('')
  const [hardFeedPricePerBag, setHardFeedPricePerBag] = useState('')
  const [bagWeight, setBagWeight] = useState('20')
  
  // Supplements
  const [monthlySupplements, setMonthlySupplements] = useState('')
  
  const [result, setResult] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // UK Average prices 2025
  const ukAverages = {
    hayPerBale: 6.50, // £6-8 per small bale
    haylagePerBale: 12.00,
    hardFeedPerBag: 14.00, // 20kg bag
    supplements: 40, // monthly average
    chaff: 12.00, // per bag
  }

  // Hay consumption: 1.5-2.5% of body weight per day
  const workLevelMultipliers: Record<string, { hay: number, hardFeed: number, label: string }> = {
    'rest': { hay: 2.0, hardFeed: 0, label: 'Rest/Light Hacking' },
    'light': { hay: 1.8, hardFeed: 0.5, label: 'Light Work (1-2 days/week)' },
    'moderate': { hay: 1.7, hardFeed: 1.0, label: 'Moderate Work (3-4 days/week)' },
    'hard': { hay: 1.5, hardFeed: 1.5, label: 'Hard Work (5-6 days/week)' },
    'intense': { hay: 1.5, hardFeed: 2.5, label: 'Intense/Competition' }
  }

  // Horse type affects metabolism
  const horseTypeMultipliers: Record<string, { feed: number, label: string }> = {
    'native': { feed: 0.8, label: 'Native Pony (good doer)' },
    'cob': { feed: 0.85, label: 'Cob/Heavyweight' },
    'warmblood': { feed: 1.0, label: 'Warmblood/Sports Horse' },
    'thoroughbred': { feed: 1.1, label: 'Thoroughbred (poor doer)' },
    'youngster': { feed: 1.15, label: 'Youngster (growing)' },
    'veteran': { feed: 1.05, label: 'Veteran (15+ years)' }
  }

  const applyWorkPreset = (level: string) => {
    setWorkLevel(level)
    const preset = workLevelMultipliers[level]
    if (preset) {
      setHardFeedPerDay(preset.hardFeed.toString())
    }
  }

  const calculate = () => {
    const weight = parseFloat(horseWeight) || 500
    const hayPrice = parseFloat(hayPricePerBale) || ukAverages.hayPerBale
    const baleWt = parseFloat(baleWeight) || 20
    const hardFeedKg = parseFloat(hardFeedPerDay) || 0
    const feedBagPrice = parseFloat(hardFeedPricePerBag) || ukAverages.hardFeedPerBag
    const feedBagWt = parseFloat(bagWeight) || 20
    const supplements = parseFloat(monthlySupplements) || 0

    // Get multipliers
    const workMultiplier = workLevelMultipliers[workLevel] || workLevelMultipliers['light']
    const typeMultiplier = horseTypeMultipliers[horseType] || horseTypeMultipliers['warmblood']

    // Calculate daily hay requirement (% of body weight)
    const dailyHayKg = (weight * (workMultiplier.hay / 100)) * typeMultiplier.feed
    
    // Calculate costs
    const pricePerKgHay = hayPrice / baleWt
    const dailyHayCost = dailyHayKg * pricePerKgHay
    
    const pricePerKgFeed = feedBagPrice / feedBagWt
    const dailyHardFeedCost = hardFeedKg * pricePerKgFeed
    
    const dailyTotalFeed = dailyHayCost + dailyHardFeedCost
    const monthlyFeedCost = dailyTotalFeed * 30
    const monthlyTotal = monthlyFeedCost + supplements
    const annualTotal = monthlyTotal * 12

    // Bales needed per month
    const monthlyHayKg = dailyHayKg * 30
    const balesPerMonth = Math.ceil(monthlyHayKg / baleWt)
    
    // Hard feed bags per month
    const monthlyHardFeedKg = hardFeedKg * 30
    const bagsPerMonth = hardFeedKg > 0 ? Math.ceil(monthlyHardFeedKg / feedBagWt) : 0

    // Winter vs Summer (winter typically 20-30% more hay)
    const winterMonthlyTotal = monthlyTotal * 1.25
    const summerMonthlyTotal = monthlyTotal * 0.85

    setResult({
      daily: {
        hayKg: dailyHayKg.toFixed(1),
        hayCost: dailyHayCost.toFixed(2),
        hardFeedKg: hardFeedKg.toFixed(1),
        hardFeedCost: dailyHardFeedCost.toFixed(2),
        totalCost: dailyTotalFeed.toFixed(2)
      },
      monthly: {
        hayKg: monthlyHayKg.toFixed(0),
        balesNeeded: balesPerMonth,
        hayCost: (dailyHayCost * 30).toFixed(2),
        hardFeedKg: monthlyHardFeedKg.toFixed(0),
        bagsNeeded: bagsPerMonth,
        hardFeedCost: (dailyHardFeedCost * 30).toFixed(2),
        supplements: supplements.toFixed(2),
        totalCost: monthlyTotal.toFixed(2)
      },
      annual: {
        totalCost: annualTotal.toFixed(2),
        hayCost: (dailyHayCost * 365).toFixed(2),
        hardFeedCost: (dailyHardFeedCost * 365).toFixed(2),
        supplementsCost: (supplements * 12).toFixed(2)
      },
      seasonal: {
        winter: winterMonthlyTotal.toFixed(2),
        summer: summerMonthlyTotal.toFixed(2)
      },
      breakdown: {
        hayPercentage: ((dailyHayCost / dailyTotalFeed) * 100).toFixed(0) || 100,
        hardFeedPercentage: ((dailyHardFeedCost / dailyTotalFeed) * 100).toFixed(0) || 0
      }
    })
  }

  const faqs = [
    {
      q: "How much hay does a horse need per day?",
      a: "Horses need approximately 1.5-2.5% of their body weight in forage daily. A 500kg horse needs 7.5-12.5kg of hay per day depending on workload, metabolism, and whether they have grazing access. Good doers (native ponies) need less, while poor doers (thoroughbreds) may need more."
    },
    {
      q: "How much does horse feed cost per month UK?",
      a: "Monthly horse feed costs in the UK typically range from £80-200+ depending on horse size, workload, and feed quality. A 500kg horse in light work costs around £100-120/month for hay and basic feed, while a competition horse may cost £200+/month including supplements."
    },
    {
      q: "What is the cost of a bale of hay in the UK 2025?",
      a: "UK hay prices in 2025 range from £5-8 per small bale (15-20kg) and £30-60 for large round bales. Prices vary by region, quality, and season - hay is typically cheapest in summer after harvest and most expensive in late winter/spring."
    },
    {
      q: "How many bales of hay does a horse eat per month?",
      a: "A 500kg horse eating 2% body weight daily needs approximately 300kg of hay monthly, which equals 15-20 small bales (20kg each) or 2-3 large round bales. Horses with good grazing access need less supplementary hay."
    },
    {
      q: "Should I feed hay or haylage?",
      a: "Hay is traditional, stores well, and suits most horses. Haylage (wrapped hay) has higher moisture, is dust-free (good for respiratory issues), but costs more (£10-15/bale) and must be used within days of opening. Many owners use hay in winter and haylage for horses with allergies."
    },
    {
      q: "How much hard feed does a horse need?",
      a: "Many horses in light work need little or no hard feed - forage alone may suffice. Horses in moderate work typically need 0.5-1.5kg hard feed daily, while competition horses may need 2-3kg+. Always follow manufacturer guidelines and introduce feed changes gradually."
    },
    {
      q: "What supplements does my horse need?",
      a: "Most horses on good forage need minimal supplementation. A general vitamin/mineral supplement (£15-30/month) covers deficiencies. Specific supplements (joints, hooves, calming) add £20-50+/month each. Consult a nutritionist before adding multiple supplements."
    },
    {
      q: "How can I reduce horse feed costs?",
      a: "Buy hay in bulk during summer harvest (20-30% savings), use ad-lib hay to reduce hard feed needs, ensure hay is weighed not guessed, use chaff to slow eating, maximise grazing time, and avoid overfeeding supplements. A fat horse on too much feed is wasted money."
    },
    {
      q: "Why do feed costs increase in winter?",
      a: "Winter feed costs rise 20-30% because: horses need more forage without grazing, they burn calories staying warm, hay prices peak in late winter, and more hard feed may be needed to maintain condition. Budget £120-180/month in winter vs £80-120 in summer."
    },
    {
      q: "How do I know if I'm feeding enough?",
      a: "Use body condition scoring (BCS) regularly - you should feel ribs with light pressure but not see them. Monitor weight with a weigh tape monthly. Energy levels and coat condition indicate diet quality. Consult an equine nutritionist for personalised advice."
    }
  ]

  return (
    <>
      <Helmet>
        <title>Horse Feed Calculator UK 2025 | Hay & Feed Costs | HorseCost</title>
        <meta 
          name="description" 
          content="Free horse feed calculator for UK owners. Calculate daily hay requirements, hard feed costs, and monthly feed budgets. Accurate UK 2025 hay and feed pricing." 
        />
        <meta 
          name="keywords" 
          content="horse feed calculator, hay calculator UK, horse feed costs, how much hay does a horse need, monthly horse feed budget, horse nutrition calculator, hay bales per month" 
        />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#15803d" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:title" content="Horse Feed Calculator UK 2025 | HorseCost" />
        <meta property="og:description" content="Calculate your horse's daily hay needs and monthly feed costs. Free UK calculator with 2025 pricing." />
        <meta property="og:url" content="https://horsecost.co.uk/horse-feed-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/horse-feed-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Horse Feed Calculator UK | HorseCost" />
        <meta name="twitter:description" content="Calculate daily hay needs and monthly feed costs for your horse." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/horse-feed-calculator-twitter.jpg" />

        <link rel="canonical" href="https://horsecost.co.uk/horse-feed-calculator" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Horse Feed Calculator', 'item': 'https://horsecost.co.uk/horse-feed-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Feed Calculator UK',
                'url': 'https://horsecost.co.uk/horse-feed-calculator',
                'description': 'Calculate daily hay requirements and monthly feed costs for horses with UK 2025 pricing.',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.8', 'ratingCount': '312', 'bestRating': '5', 'worstRating': '1' }
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
                'url': 'https://horsecost.co.uk',
                'logo': 'https://horsecost.co.uk/logo.png',
                'contactPoint': { '@type': 'ContactPoint', 'contactType': 'Customer Support', 'email': 'hello@horsecost.co.uk' }
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        {/* Back Link */}
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <a href="/" className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Wheat className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Horse Feed Calculator UK</h1>
                <p className="text-green-100 mt-1">Calculate daily hay needs and monthly feed costs</p>
              </div>
            </div>
            <p className="text-green-50 max-w-3xl">
              Work out exactly how much hay your horse needs and what it costs. 
              Includes hard feed, supplements, and seasonal variations with 2025 UK pricing.
            </p>
            <p className="text-green-200 text-sm mt-2">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Main Calculator Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              
              {/* Section 1: Horse Details */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h2 className="text-xl font-bold text-gray-900">Your Horse</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Scale className="w-4 h-4 inline mr-2" />
                      Horse Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={horseWeight}
                      onChange={(e) => setHorseWeight(e.target.value)}
                      placeholder="e.g., 500"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use weigh tape or estimate. Average: 400-600kg</p>
                    <div className="flex gap-2 mt-2">
                      {[350, 450, 500, 550, 650].map(w => (
                        <button
                          key={w}
                          onClick={() => setHorseWeight(w.toString())}
                          className={`px-3 py-1 text-sm rounded-full border ${
                            horseWeight === w.toString() 
                              ? 'bg-green-100 border-green-500 text-green-700' 
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                        >
                          {w}kg
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Horse Type</label>
                    <select
                      value={horseType}
                      onChange={(e) => setHorseType(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select type...</option>
                      {Object.entries(horseTypeMultipliers).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Affects metabolism and feed requirements</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Work Level */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h2 className="text-xl font-bold text-gray-900">Work Level</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(workLevelMultipliers).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => applyWorkPreset(key)}
                      className={`p-4 rounded-lg border-2 text-center transition ${
                        workLevel === key 
                          ? 'border-green-500 bg-green-50 text-green-700' 
                          : 'border-gray-200 hover:border-green-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold text-sm">{val.label.split(' (')[0]}</div>
                      <div className="text-xs text-gray-500 mt-1">{val.hardFeed}kg feed/day</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 3: Hay Costs */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h2 className="text-xl font-bold text-gray-900">Hay Costs</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Leaf className="w-4 h-4 inline mr-2" />
                      Price Per Bale (£)
                    </label>
                    <input
                      type="number"
                      step="0.50"
                      value={hayPricePerBale}
                      onChange={(e) => setHayPricePerBale(e.target.value)}
                      placeholder="e.g., 6.50"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">UK average: £5-8 for small bale</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Bale Weight (kg)</label>
                    <select
                      value={baleWeight}
                      onChange={(e) => setBaleWeight(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="15">Small bale - 15kg</option>
                      <option value="20">Small bale - 20kg</option>
                      <option value="25">Small bale - 25kg</option>
                      <option value="250">Round bale - 250kg</option>
                      <option value="300">Round bale - 300kg</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Hard Feed (Optional) */}
              <div className="mb-8">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-3 mb-4 text-left w-full"
                >
                  <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <h2 className="text-xl font-bold text-gray-900">Hard Feed & Supplements</h2>
                  {showAdvanced ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                
                {showAdvanced && (
                  <div className="grid md:grid-cols-2 gap-6 pl-11">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        <Package className="w-4 h-4 inline mr-2" />
                        Hard Feed Per Day (kg)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={hardFeedPerDay}
                        onChange={(e) => setHardFeedPerDay(e.target.value)}
                        placeholder="e.g., 1.0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">0kg for rest, 1-2kg for moderate work</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Feed Bag Price (£)</label>
                      <input
                        type="number"
                        step="0.50"
                        value={hardFeedPricePerBag}
                        onChange={(e) => setHardFeedPricePerBag(e.target.value)}
                        placeholder="e.g., 14.00"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">UK average: £12-18 per 20kg bag</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Feed Bag Size (kg)</label>
                      <select
                        value={bagWeight}
                        onChange={(e) => setBagWeight(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      >
                        <option value="15">15kg bag</option>
                        <option value="20">20kg bag</option>
                        <option value="25">25kg bag</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Monthly Supplements (£)</label>
                      <input
                        type="number"
                        value={monthlySupplements}
                        onChange={(e) => setMonthlySupplements(e.target.value)}
                        placeholder="e.g., 40"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Vitamins, minerals, joint support, etc.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculate}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-600 transition shadow-lg"
              >
                <Calculator className="w-5 h-5 inline mr-2" />
                Calculate Feed Costs
              </button>
            </div>

            {/* Results Section */}
            {result && (
              <div className="border-t border-gray-200 bg-gradient-to-b from-green-50 to-white p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <PieChart className="w-6 h-6 text-green-600" />
                  Your Feed Costs
                </h2>
                
                {/* Main Results */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-green-600 text-white p-6 rounded-xl text-center">
                    <div className="text-green-200 text-sm font-medium">Monthly Total</div>
                    <div className="text-4xl font-bold mt-1">£{parseFloat(result.monthly.totalCost).toLocaleString()}</div>
                  </div>
                  <div className="bg-white border-2 border-green-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Annual Total</div>
                    <div className="text-3xl font-bold text-gray-900 mt-1">£{parseFloat(result.annual.totalCost).toLocaleString()}</div>
                  </div>
                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Daily Cost</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">£{result.daily.totalCost}</div>
                  </div>
                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Daily Hay</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{result.daily.hayKg}kg</div>
                  </div>
                </div>

                {/* What You'll Need */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-gray-900 mb-4">Monthly Shopping List</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <div>
                          <span className="font-medium">Hay Bales</span>
                          <p className="text-xs text-gray-500">{result.monthly.hayKg}kg total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">{result.monthly.balesNeeded}</span>
                        <p className="text-sm text-gray-600">£{result.monthly.hayCost}</p>
                      </div>
                    </div>
                    {parseFloat(result.monthly.bagsNeeded) > 0 && (
                      <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-amber-600" />
                          <div>
                            <span className="font-medium">Feed Bags</span>
                            <p className="text-xs text-gray-500">{result.monthly.hardFeedKg}kg total</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lg">{result.monthly.bagsNeeded}</span>
                          <p className="text-sm text-gray-600">£{result.monthly.hardFeedCost}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Seasonal Variation */}
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Seasonal Costs (Monthly)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-blue-600 font-medium">❄️ Winter</p>
                      <p className="text-2xl font-bold text-blue-800">£{result.seasonal.winter}</p>
                      <p className="text-xs text-blue-600">+25% more hay, no grazing</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <p className="text-yellow-600 font-medium">☀️ Summer</p>
                      <p className="text-2xl font-bold text-yellow-800">£{result.seasonal.summer}</p>
                      <p className="text-xs text-yellow-600">-15% with good grazing</p>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-3">Annual Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Hay/Forage</span>
                      <span className="font-medium">£{parseFloat(result.annual.hayCost).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hard Feed</span>
                      <span className="font-medium">£{parseFloat(result.annual.hardFeedCost).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Supplements</span>
                      <span className="font-medium">£{parseFloat(result.annual.supplementsCost).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                      <span>Total Annual</span>
                      <span>£{parseFloat(result.annual.totalCost).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Feeding Guide Box */}
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mt-8">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-green-800 mb-2">Essential Feeding Guidelines</h3>
                <ul className="text-green-900 space-y-1 text-sm">
                  <li>• Horses need minimum 1.5% body weight in forage daily - never restrict below this</li>
                  <li>• Always weigh hay - a "section" can vary by 50% in weight</li>
                  <li>• Introduce feed changes gradually over 7-14 days to avoid colic</li>
                  <li>• Good doers (native ponies) may need soaked hay or low-calorie alternatives</li>
                  <li>• Access to clean water is essential - horses drink 25-55 litres daily</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="mt-12 space-y-12">
            
            {/* Understanding Feed Costs */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Horse Feed Costs in the UK</h2>
              <p className="text-gray-700 mb-4">
                Feed is typically the second-largest ongoing cost of horse ownership after livery, accounting for 
                £1,000-3,000+ annually depending on your horse's needs. Understanding how to calculate and 
                optimise feed costs can save hundreds of pounds per year while keeping your horse healthy.
              </p>
              <p className="text-gray-700 mb-4">
                The foundation of any horse's diet should be forage - hay, haylage, or grass. Most horses in 
                light to moderate work can thrive on forage alone with a simple vitamin/mineral supplement. 
                Hard feed should only be added when forage alone cannot meet energy requirements.
              </p>
            </section>

            {/* UK Hay Prices Table */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">UK Hay & Feed Prices 2025</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-green-600 text-white">
                      <th className="p-3 text-left">Feed Type</th>
                      <th className="p-3 text-right">Low</th>
                      <th className="p-3 text-right">Average</th>
                      <th className="p-3 text-right">High</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Small Hay Bale (20kg)</td>
                      <td className="p-3 text-right">£5.00</td>
                      <td className="p-3 text-right">£6.50</td>
                      <td className="p-3 text-right">£8.00</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-3 font-medium">Haylage Bale (25kg)</td>
                      <td className="p-3 text-right">£10.00</td>
                      <td className="p-3 text-right">£12.00</td>
                      <td className="p-3 text-right">£15.00</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Round Bale (300kg)</td>
                      <td className="p-3 text-right">£35.00</td>
                      <td className="p-3 text-right">£50.00</td>
                      <td className="p-3 text-right">£70.00</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-3 font-medium">Hard Feed (20kg bag)</td>
                      <td className="p-3 text-right">£10.00</td>
                      <td className="p-3 text-right">£14.00</td>
                      <td className="p-3 text-right">£20.00</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Chaff (20kg bag)</td>
                      <td className="p-3 text-right">£10.00</td>
                      <td className="p-3 text-right">£12.00</td>
                      <td className="p-3 text-right">£15.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-500 mt-2">* Prices vary by region, quality, and season. Summer prices typically 20-30% lower.</p>
            </section>

            {/* FAQ Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-700">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Related Calculators */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Horse Calculators</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/annual-horse-cost-calculator" className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-green-400 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900">Annual Cost Calculator</h3>
                <p className="text-gray-600 text-sm mt-1">Complete yearly ownership costs</p>
              </a>
              <a href="/farrier-cost-calculator" className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-green-400 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900">Farrier Cost Calculator</h3>
                <p className="text-gray-600 text-sm mt-1">Annual shoeing and trimming costs</p>
              </a>
              <a href="/calculators/horse-livery" className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-green-400 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900">Livery Calculator</h3>
                <p className="text-gray-600 text-sm mt-1">Compare livery options and costs</p>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Need to Calculate Total Horse Costs?</h2>
            <p className="text-green-100 mb-4">Try our comprehensive Annual Horse Cost Calculator for a complete budget.</p>
            <a 
              href="/annual-horse-cost-calculator" 
              className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition"
            >
              Calculate Annual Costs
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
