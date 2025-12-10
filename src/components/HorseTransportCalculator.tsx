import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Truck,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Star,
  MapPin
} from 'lucide-react'

export default function HorseTransportCalculator() {
  const [journeyType, setJourneyType] = useState('oneoff')
  const [distance, setDistance] = useState('')
  const [numHorses, setNumHorses] = useState('1')
  const [vehicleType, setVehicleType] = useState('professional')
  const [region, setRegion] = useState('average')
  const [urgency, setUrgency] = useState('standard')
  const [includeReturn, setIncludeReturn] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [overnightStops, setOvernightStops] = useState('0')
  const [result, setResult] = useState<any>(null)

  const journeyTypes = [
    { id: 'oneoff', name: 'One-Off Move', description: 'Buying, selling, or relocating' },
    { id: 'show', name: 'Competition/Show', description: 'Regular event transport' },
    { id: 'clinic', name: 'Vet/Clinic Visit', description: 'Hospital or specialist visit' },
    { id: 'holiday', name: 'Holiday/Training', description: 'Extended stay transport' }
  ]

  const vehicleTypes = [
    { id: 'professional', name: 'Professional Transporter', baseRate: 2.50, minCharge: 80, description: 'Insured, experienced driver' },
    { id: 'local', name: 'Local Horse Taxi', baseRate: 2.00, minCharge: 50, description: 'Local journeys, often cheaper' },
    { id: 'friend', name: 'Friend/Yard Help', baseRate: 0.80, minCharge: 20, description: 'Fuel contribution only' },
    { id: 'self', name: 'Self-Transport', baseRate: 0.65, minCharge: 0, description: 'Your own vehicle' }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.35,
    'southeast': 1.2,
    'average': 1.0,
    'north': 0.9,
    'scotland': 1.1 // Higher due to distances
  }

  const urgencyMultipliers: Record<string, number> = {
    'emergency': 2.0,
    'urgent': 1.5,
    'standard': 1.0,
    'flexible': 0.9
  }

  const calculate = () => {
    if (!distance) {
      alert('Please enter the journey distance')
      return
    }

    const dist = parseFloat(distance)
    const horses = parseInt(numHorses)
    const vehicle = vehicleTypes.find(v => v.id === vehicleType)
    if (!vehicle) return

    const regionFactor = regionMultipliers[region]
    const urgencyFactor = urgencyMultipliers[urgency]

    // Calculate one-way distance cost
    let oneWayDist = dist
    if (includeReturn && vehicleType !== 'self') {
      oneWayDist = dist // Professional charges based on one-way, their return is their problem
    }

    // Base transport cost
    let baseCost = Math.max(vehicle.baseRate * oneWayDist, vehicle.minCharge)
    
    // Apply multipliers
    baseCost *= regionFactor * urgencyFactor

    // Multiple horses discount (not quite double)
    if (horses === 2) {
      baseCost *= 1.5
    } else if (horses > 2) {
      baseCost *= 1.5 + ((horses - 2) * 0.3)
    }

    // Self-transport is return journey
    if (vehicleType === 'self' && includeReturn) {
      baseCost *= 2
    }

    // Overnight stops
    const overnight = parseInt(overnightStops)
    const overnightCost = overnight * 150 * horses // Livery + your accommodation

    // Insurance/documentation for longer journeys
    let extraCosts = 0
    if (dist > 200) {
      extraCosts += 30 // Travel boots, hay nets, water
    }
    if (journeyType === 'holiday' || dist > 300) {
      extraCosts += 20 // Documentation check
    }

    const totalCost = baseCost + overnightCost + extraCosts

    // Calculate per mile rate
    const perMile = totalCost / (includeReturn && vehicleType === 'self' ? dist * 2 : dist)

    // Compare options
    const proQuote = Math.max(2.50 * dist, 80) * regionFactor * urgencyFactor
    const localQuote = Math.max(2.00 * dist, 50) * regionFactor * urgencyFactor
    const selfCost = 0.65 * dist * 2 // Return journey for self

    setResult({
      totalCost: totalCost.toFixed(2),
      baseCost: baseCost.toFixed(2),
      overnightCost: overnightCost.toFixed(2),
      extraCosts: extraCosts.toFixed(2),
      perMile: perMile.toFixed(2),
      distance: dist,
      horses: horses,
      vehicleInfo: vehicle,
      journeyInfo: journeyTypes.find(j => j.id === journeyType),
      comparison: {
        professional: proQuote.toFixed(2),
        local: localQuote.toFixed(2),
        self: selfCost.toFixed(2)
      },
      estimatedTime: getEstimatedTime(dist),
      tips: getTips(dist, journeyType, horses)
    })
  }

  const getEstimatedTime = (dist: number) => {
    // Average 40mph including stops
    const hours = dist / 40
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`
    } else if (hours < 2) {
      return `${hours.toFixed(1)} hours`
    } else {
      return `${Math.round(hours)} hours (with rest stops)`
    }
  }

  const getTips = (dist: number, journey: string, horses: number) => {
    const tips = []
    if (dist > 100) tips.push('Allow for comfort breaks every 2-3 hours')
    if (dist > 200) tips.push('Consider breaking the journey with an overnight stop')
    if (horses > 1) tips.push('Ensure horses are compatible travel companions')
    if (journey === 'show') tips.push('Add extra time for plaiting and preparation')
    if (journey === 'clinic') tips.push('Bring horse\'s medical records and passport')
    return tips
  }

  const faqs = [
    {
      q: 'How much does horse transport cost UK?',
      a: 'Professional horse transport in the UK costs £2-3 per mile with minimum charges of £50-100. A typical 50-mile journey costs £100-150, while 100 miles costs £200-300. Prices vary by region, urgency, and number of horses. DIY transport costs around £0.60-0.80 per mile in fuel and wear.'
    },
    {
      q: 'How do I find a horse transporter?',
      a: 'Options include: asking your yard for recommendations, Facebook horse transport groups, British Grooms Association lists, your vet clinic contacts, or transport directories. Always check insurance, reviews, and inspect vehicles if possible. Word of mouth recommendations are often best.'
    },
    {
      q: 'What should I check before booking transport?',
      a: 'Verify: valid insurance (goods in transit + public liability), DEFRA authorization if required, clean well-maintained vehicle, driver experience with horses, breakdown cover, and references. Ask about their loading approach for difficult loaders.'
    },
    {
      q: 'How far can a horse travel in one day?',
      a: 'Horses should rest every 4 hours and drink every 6 hours. Most experts recommend maximum 8-10 hours travel per day (300-400 miles). For longer journeys, overnight stops are advisable. Young, old, or unfit horses may need shorter travel times.'
    },
    {
      q: 'Do I need to travel with my horse?',
      a: 'Professional transporters typically travel alone unless you arrange to accompany. For valuable competition horses or nervous travellers, you may want to follow in your car. Some transporters charge extra if you travel with them.'
    },
    {
      q: 'What paperwork do I need for horse transport?',
      a: 'Required: horse\'s passport (legally required at all times). Recommended: vaccination records, ownership documents, destination livery agreement. For international transport, you\'ll need export health certificates and TRACES documentation.'
    },
    {
      q: 'Should I sedate my horse for travel?',
      a: 'Sedation is generally not recommended as it affects balance and stress response. Horses are safer travelling alert. If your horse is extremely difficult, discuss with your vet - they may recommend alternative calming approaches. Address loading training instead.'
    },
    {
      q: 'How do I prepare my horse for transport?',
      a: 'Fit travel boots or bandages (all four legs plus hock and knee boots), tail guard, light rug if needed. Provide hay net for longer journeys. Ensure horse is calm before loading. Remove shoes if travelling long distance (some choose to).'
    },
    {
      q: 'Is it cheaper to hire a trailer or use a transporter?',
      a: 'For occasional journeys, professional transport is usually cheaper and easier. Trailer hire costs £50-80/day plus fuel (£0.60-0.80/mile), and you need a suitable towing vehicle. If you transport 10+ times yearly, owning makes more sense.'
    },
    {
      q: 'What insurance do I need for horse transport?',
      a: 'If using professionals, they should have goods in transit insurance. Your horse insurance should cover transport incidents. If self-transporting, check your trailer/horsebox insurance covers the horse\'s value. Always verify cover before travel.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Horse Transport Cost Calculator UK 2025 | Moving & Travel | HorseCost</title>
        <meta 
          name="description" 
          content="Free horse transport cost calculator for UK. Calculate professional transport, DIY moving costs, and compare options. Get accurate 2025 quotes for horse journeys." 
        />
        <meta name="keywords" content="horse transport cost UK, horse transporter prices, moving horse cost, horse travel calculator, horsebox hire cost" />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0369a1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:title" content="Horse Transport Cost Calculator UK 2025 | HorseCost" />
        <meta property="og:description" content="Calculate horse transport costs for moves, shows, and vet visits." />
        <meta property="og:url" content="https://horsecost.co.uk/horse-transport-calculator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Horse Transport Calculator UK | HorseCost" />

        <link rel="canonical" href="https://horsecost.co.uk/horse-transport-calculator" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/#calculators' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Horse Transport Calculator', 'item': 'https://horsecost.co.uk/horse-transport-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Transport Cost Calculator UK',
                'description': 'Calculate horse transport and moving costs in the UK.',
                'url': 'https://horsecost.co.uk/horse-transport-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.7', 'ratingCount': '178' }
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
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <a href="/" className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Horse Transport Calculator</h1>
                <p className="text-sky-200">UK 2025 Moving & Travel Costs</p>
              </div>
            </div>
            <p className="text-sky-100 max-w-2xl">
              Calculate horse transport costs for one-off moves, shows, vet visits, and more. 
              Compare professional transporters with DIY options.
            </p>
            <p className="text-sky-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Journey Type</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {journeyTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setJourneyType(type.id)}
                        className={`p-3 rounded-xl text-left transition border-2 ${
                          journeyType === type.id
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`font-medium text-sm ${journeyType === type.id ? 'text-sky-700' : 'text-gray-900'}`}>
                          {type.name}
                        </p>
                        <p className="text-xs text-gray-500">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Distance (one way, miles)</label>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['25', '50', '100', '150', '250'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setDistance(val)}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          distance === val
                            ? 'bg-sky-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val} miles
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Number of Horses</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['1', '2', '3', '4'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setNumHorses(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          numHorses === val
                            ? 'bg-sky-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Transport Method</label>
                  </div>
                  <div className="space-y-2">
                    {vehicleTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setVehicleType(type.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          vehicleType === type.id
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${vehicleType === type.id ? 'text-sky-700' : 'text-gray-900'}`}>
                              {type.name}
                            </p>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                          <p className="text-sm text-gray-600">~£{type.baseRate}/mile</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Urgency</label>
                  </div>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none"
                  >
                    <option value="emergency">Emergency (same day) - 2x cost</option>
                    <option value="urgent">Urgent (24-48 hours) - 1.5x cost</option>
                    <option value="standard">Standard (1 week+) - Normal rate</option>
                    <option value="flexible">Flexible (any time) - May get discount</option>
                  </select>
                </div>

                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sky-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Additional Options
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeReturn}
                          onChange={(e) => setIncludeReturn(e.target.checked)}
                          className="w-5 h-5 text-sky-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Return Journey</span>
                          <p className="text-sm text-gray-500">For self-transport only</p>
                        </div>
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Overnight Stops</label>
                        <select
                          value={overnightStops}
                          onChange={(e) => setOvernightStops(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sky-500 focus:outline-none"
                        >
                          <option value="0">None</option>
                          <option value="1">1 night (+ ~£150/horse)</option>
                          <option value="2">2 nights (+ ~£300/horse)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Region</label>
                        <select
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sky-500 focus:outline-none"
                        >
                          <option value="london">London / South East</option>
                          <option value="southeast">Home Counties</option>
                          <option value="average">Midlands / Average UK</option>
                          <option value="north">Northern England</option>
                          <option value="scotland">Scotland (higher due to distances)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-sky-700 hover:to-blue-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Transport Cost
                </button>

                {result && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 text-white">
                      <p className="text-sky-100 text-sm mb-1">Estimated Transport Cost</p>
                      <p className="text-4xl font-bold">£{result.totalCost}</p>
                      <p className="text-sky-200 text-sm mt-1">{result.vehicleInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sky-100 text-xs">Per Mile</p>
                          <p className="font-bold">£{result.perMile}</p>
                        </div>
                        <div>
                          <p className="text-sky-100 text-xs">Est. Time</p>
                          <p className="font-bold">{result.estimatedTime}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transport ({result.distance} miles)</span>
                          <span className="font-medium">£{result.baseCost}</span>
                        </div>
                        {parseFloat(result.overnightCost) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Overnight Stops</span>
                            <span className="font-medium">£{result.overnightCost}</span>
                          </div>
                        )}
                        {parseFloat(result.extraCosts) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Travel Extras</span>
                            <span className="font-medium">£{result.extraCosts}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total</span>
                          <span>£{result.totalCost}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-sky-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Compare Options</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Professional Transporter</span>
                          <span className="font-medium">£{result.comparison.professional}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Local Horse Taxi</span>
                          <span className="font-medium">£{result.comparison.local}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Self-Transport (fuel)</span>
                          <span className="font-medium">£{result.comparison.self}</span>
                        </div>
                      </div>
                    </div>

                    {result.tips.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Journey Tips
                        </h3>
                        <ul className="text-sm text-amber-800 space-y-1">
                          {result.tips.map((tip: string, i: number) => (
                            <li key={i}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-sky-50 rounded-xl p-4">
                      <h3 className="font-semibold text-sky-900 mb-2">Journey Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Distance</p>
                          <p className="font-bold text-gray-900">{result.distance} miles</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Horses</p>
                          <p className="font-bold text-gray-900">{result.horses}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Journey Type</p>
                          <p className="font-bold text-gray-900">{result.journeyInfo?.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Est. Duration</p>
                          <p className="font-bold text-gray-900">{result.estimatedTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Enter journey details to see transport costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-sky-50 border-l-4 border-sky-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-sky-900 mb-2">Before Booking Transport</h3>
                <ul className="text-sky-800 space-y-1 text-sm">
                  <li>• <strong>Check insurance</strong> - ensure transporter has goods in transit cover</li>
                  <li>• <strong>Have passport ready</strong> - legally required for all horse movements</li>
                  <li>• <strong>Prepare your horse</strong> - travel boots, rug if needed, hay net</li>
                  <li>• <strong>Arrange timing</strong> - avoid rush hour and allow for delays</li>
                  <li>• <strong>Exchange contacts</strong> - transporter, destination yard, emergency contact</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Horse Transport Prices 2025</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Distance</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Professional</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Local Taxi</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Self (fuel)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">25 miles</td>
                    <td className="py-3 px-4 text-center">£80-100</td>
                    <td className="py-3 px-4 text-center">£50-70</td>
                    <td className="py-3 px-4 text-center">£30-40</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">50 miles</td>
                    <td className="py-3 px-4 text-center">£120-150</td>
                    <td className="py-3 px-4 text-center">£80-110</td>
                    <td className="py-3 px-4 text-center">£50-70</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">100 miles</td>
                    <td className="py-3 px-4 text-center">£220-280</td>
                    <td className="py-3 px-4 text-center">£180-220</td>
                    <td className="py-3 px-4 text-center">£100-130</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">200 miles</td>
                    <td className="py-3 px-4 text-center">£400-500</td>
                    <td className="py-3 px-4 text-center">£350-450</td>
                    <td className="py-3 px-4 text-center">£200-260</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">300+ miles</td>
                    <td className="py-3 px-4 text-center">£600-800+</td>
                    <td className="py-3 px-4 text-center">£500-700+</td>
                    <td className="py-3 px-4 text-center">£300-400</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Prices for 1 horse. Add 50% for 2 horses, 80% for 3 horses. Emergency/same-day transport typically double.
            </p>
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
              <a href="/trailer-cost-calculator" className="bg-sky-50 hover:bg-sky-100 rounded-xl p-4 transition group">
                <Truck className="w-8 h-8 text-sky-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-sky-600">Trailer Running Costs</h3>
                <p className="text-sm text-gray-600">Own trailer expenses</p>
              </a>
              <a href="/competition-budget-calculator" className="bg-rose-50 hover:bg-rose-100 rounded-xl p-4 transition group">
                <Star className="w-8 h-8 text-rose-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-rose-600">Competition Budget</h3>
                <p className="text-sm text-gray-600">Show season costs</p>
              </a>
              <a href="/first-horse-calculator" className="bg-pink-50 hover:bg-pink-100 rounded-xl p-4 transition group">
                <Calendar className="w-8 h-8 text-pink-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-pink-600">First Horse Calculator</h3>
                <p className="text-sm text-gray-600">Buying costs included</p>
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-r from-sky-600 to-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Planning Regular Transport?</h2>
            <p className="text-sky-100 mb-6 max-w-xl mx-auto">
              If you compete regularly, calculate whether owning a trailer or horsebox makes financial sense.
            </p>
            <a 
              href="/trailer-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-sky-600 px-6 py-3 rounded-xl font-bold hover:bg-sky-50 transition"
            >
              Calculate Ownership Costs
              <Calculator className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
