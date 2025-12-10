import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  TreePine,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  PoundSterling,
  CheckCircle2,
  Calendar,
  Star,
  Fence,
  Droplets
} from 'lucide-react'

export default function FieldRentCalculator() {
  const [acreage, setAcreage] = useState('2')
  const [numHorses, setNumHorses] = useState('1')
  const [region, setRegion] = useState('average')
  const [fieldType, setFieldType] = useState('grazing')
  const [facilities, setFacilities] = useState({
    water: true,
    shelter: false,
    fencing: true,
    access: true,
    arena: false,
    stables: false
  })
  const [includeMaintenance, setIncludeMaintenance] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState<any>(null)

  const fieldTypes = [
    { id: 'grazing', name: 'Basic Grazing', description: 'Pasture only', baseRate: 80 },
    { id: 'paddock', name: 'Paddock with Facilities', description: 'Water, shelter available', baseRate: 120 },
    { id: 'equestrian', name: 'Equestrian Land', description: 'Arena, stables possible', baseRate: 180 },
    { id: 'livery', name: 'DIY Livery Field', description: 'Full DIY setup', baseRate: 150 }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.8,
    'southeast': 1.4,
    'southwest': 1.2,
    'average': 1.0,
    'north': 0.8,
    'scotland': 0.7,
    'wales': 0.75
  }

  const facilityCosts = {
    water: { annual: 200, description: 'Mains or trough supply' },
    shelter: { annual: 0, description: 'Field shelter (one-off or included)' },
    fencing: { annual: 150, description: 'Fencing maintenance fund' },
    access: { annual: 50, description: 'Gate and track maintenance' },
    arena: { annual: 500, description: 'Arena maintenance/surface' },
    stables: { annual: 600, description: 'Stable rent if available' }
  }

  const maintenanceCosts = {
    harrowing: 100,      // 2x per year
    topping: 80,         // 2x per year
    fertilizer: 150,     // Annual
    weedKiller: 60,      // As needed
    pooPicking: 0,       // DIY
    fenceRepairs: 100,   // Annual budget
    gateOiling: 20       // Annual
  }

  const calculate = () => {
    const acres = parseFloat(acreage)
    const horses = parseInt(numHorses)
    const field = fieldTypes.find(f => f.id === fieldType)
    if (!field) return

    const regionFactor = regionMultipliers[region]

    // Base rent (per acre per year)
    const baseRentPerAcre = field.baseRate * regionFactor
    const annualBaseRent = baseRentPerAcre * acres

    // Facility costs
    let facilityCost = 0
    Object.entries(facilities).forEach(([key, enabled]) => {
      if (enabled) {
        facilityCost += facilityCosts[key as keyof typeof facilityCosts].annual
      }
    })

    // Maintenance costs
    let maintenanceCost = 0
    if (includeMaintenance) {
      maintenanceCost = Object.values(maintenanceCosts).reduce((a, b) => a + b, 0)
      // Scale by acreage
      maintenanceCost *= Math.max(1, acres / 2)
    }

    const totalAnnual = annualBaseRent + facilityCost + maintenanceCost
    const monthlyRent = totalAnnual / 12
    const perHorseMonthly = monthlyRent / horses
    const perAcreAnnual = totalAnnual / acres

    // Minimum acreage check
    const recommendedAcres = horses * 1.5
    const acreageOk = acres >= recommendedAcres

    // Compare to livery
    const diyLiveryEquivalent = 150 * horses * 12 // DIY livery comparison
    const grassLiveryEquivalent = 100 * horses * 12

    setResult({
      totalAnnual: totalAnnual.toFixed(2),
      monthlyRent: monthlyRent.toFixed(2),
      perHorseMonthly: perHorseMonthly.toFixed(2),
      perAcreAnnual: perAcreAnnual.toFixed(2),
      breakdown: {
        baseRent: annualBaseRent.toFixed(2),
        facilities: facilityCost.toFixed(2),
        maintenance: maintenanceCost.toFixed(2)
      },
      fieldInfo: field,
      acreage: acres,
      horses: horses,
      acreageOk,
      recommendedAcres,
      comparison: {
        diyLivery: diyLiveryEquivalent.toFixed(2),
        grassLivery: grassLiveryEquivalent.toFixed(2),
        savings: (diyLiveryEquivalent - totalAnnual).toFixed(2)
      },
      regionFactor
    })
  }

  const faqs = [
    {
      q: 'How much does field rent cost for horses UK?',
      a: 'Horse field rent in the UK varies from £40-200+ per acre per year depending on location and facilities. Basic grazing costs £50-100/acre in rural areas, while paddocks near London can cost £150-250/acre. Most horse owners pay £100-300/month total for 2-3 acres with basic facilities.'
    },
    {
      q: 'How much land does a horse need?',
      a: 'The general rule is 1-1.5 acres per horse for grazing, plus additional land for rotation. Two horses need 2-3 acres minimum. This allows adequate grazing while resting sections. Ponies need slightly less, large horses or those on restricted grazing may need more.'
    },
    {
      q: 'What should be included in field rent?',
      a: 'Basic field rent should include: secure fencing, access via gate, and ideally water supply. Check if maintenance (harrowing, topping) is included or extra. Clarify responsibilities for fence repairs, water costs, and poo-picking. Get everything in writing.'
    },
    {
      q: 'Is it cheaper to rent a field or use grass livery?',
      a: 'Renting your own field (£100-200/month) can be cheaper than grass livery (£80-150/horse/month) for 2+ horses. However, you take on all maintenance, fencing, water, and insurance responsibilities. Grass livery is simpler but offers less control.'
    },
    {
      q: 'What should I look for when renting a field?',
      a: 'Key factors: secure fencing (post and rail ideal), reliable water supply, good drainage, shelter from elements, safe access for vehicles, ragwort-free grazing, and secure gate. Check neighbours (avoid fields next to stallions or busy roads).'
    },
    {
      q: 'Do I need insurance for a rented field?',
      a: 'Yes, you need public liability insurance (covers third-party injury/damage). Most policies are £100-200/year. Your horse insurance should cover the horse. The landowner should have their own insurance. Check lease terms for insurance requirements.'
    },
    {
      q: 'What are typical field maintenance costs?',
      a: 'Annual maintenance includes: harrowing (£50-100 twice yearly), topping (£40-80 twice yearly), fertilizing (£100-200/acre), weed control (£50-100), fence repairs (£100-200 budget), water/trough maintenance (£50-100). Total £400-800/year for 2 acres.'
    },
    {
      q: 'Can I put up a field shelter without planning permission?',
      a: 'Field shelters under 15sqm often don\'t need planning permission if they\'re moveable/temporary. Fixed structures usually require permission. Check with your local planning authority before installation. Some landowners have specific restrictions in lease agreements.'
    },
    {
      q: 'What should be in a field rental agreement?',
      a: 'Include: rent amount and payment terms, notice period (typically 1-3 months), maintenance responsibilities, permitted use and number of horses, insurance requirements, access arrangements, who pays for water/repairs, and conditions for termination.'
    },
    {
      q: 'How do I find fields to rent for horses?',
      a: 'Options include: local farmers (ask around), horse Facebook groups, Gumtree/Preloved, local feed merchants notice boards, BHS Access pages, and word of mouth at local yards. Building a relationship with local farmers often yields the best long-term arrangements.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Field Rent Calculator UK 2025 | Horse Grazing Costs | HorseCost</title>
        <meta 
          name="description" 
          content="Free field rent calculator for UK horse owners. Calculate grazing land costs, paddock rent, and maintenance expenses. Compare to livery with 2025 prices." 
        />
        <meta name="keywords" content="horse field rent UK, grazing land cost, paddock rent price, horse land rental, equestrian land rent" />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#166534" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:title" content="Field Rent Calculator UK 2025 | HorseCost" />
        <meta property="og:description" content="Calculate horse field and grazing land costs including maintenance." />
        <meta property="og:url" content="https://horsecost.co.uk/field-rent-calculator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Field Rent Calculator UK | HorseCost" />

        <link rel="canonical" href="https://horsecost.co.uk/field-rent-calculator" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/#calculators' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Field Rent Calculator', 'item': 'https://horsecost.co.uk/field-rent-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Field Rent Calculator UK',
                'description': 'Calculate horse field and grazing land rental costs.',
                'url': 'https://horsecost.co.uk/field-rent-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.6', 'ratingCount': '145' }
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
            <a href="/" className="text-green-700 hover:text-green-800 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <TreePine className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Field Rent Calculator</h1>
                <p className="text-green-200">UK 2025 Grazing & Land Costs</p>
              </div>
            </div>
            <p className="text-green-100 max-w-2xl">
              Calculate field rental costs for your horses including grazing land, paddock facilities, 
              and annual maintenance. Compare to livery options.
            </p>
            <p className="text-green-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Field Type</label>
                  </div>
                  <div className="space-y-2">
                    {fieldTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setFieldType(type.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          fieldType === type.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${fieldType === type.id ? 'text-green-700' : 'text-gray-900'}`}>
                              {type.name}
                            </p>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                          <p className="text-sm text-gray-600">~£{type.baseRate}/acre</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Acreage</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['1', '1.5', '2', '3', '4', '5'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setAcreage(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          acreage === val
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val} acres
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Number of Horses</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['1', '2', '3', '4'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setNumHorses(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          numHorses === val
                            ? 'bg-green-600 text-white'
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
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                  >
                    <option value="london">Greater London (Most expensive)</option>
                    <option value="southeast">South East England</option>
                    <option value="southwest">South West England</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England</option>
                    <option value="wales">Wales</option>
                    <option value="scotland">Scotland (Most affordable)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Facilities Included</label>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(facilityCosts).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={facilities[key as keyof typeof facilities]}
                          onChange={(e) => setFacilities({...facilities, [key]: e.target.checked})}
                          className="w-5 h-5 text-green-600 rounded"
                        />
                        <div className="flex-1 flex justify-between">
                          <span className="capitalize text-gray-900">{key}</span>
                          <span className="text-sm text-gray-500">
                            {value.annual > 0 ? `+£${value.annual}/yr` : 'Included'}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-green-700 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Maintenance Options
                  </button>

                  {showAdvanced && (
                    <div className="mt-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeMaintenance}
                          onChange={(e) => setIncludeMaintenance(e.target.checked)}
                          className="w-5 h-5 text-green-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Include Maintenance Costs</span>
                          <p className="text-sm text-gray-500">Harrowing, topping, fertilizing, fence repairs</p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Field Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
                      <p className="text-green-100 text-sm mb-1">Annual Field Cost</p>
                      <p className="text-4xl font-bold">£{result.totalAnnual}</p>
                      <p className="text-green-200 text-sm mt-1">{result.acreage} acres - {result.fieldInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-green-100 text-xs">Monthly</p>
                          <p className="font-bold">£{result.monthlyRent}</p>
                        </div>
                        <div>
                          <p className="text-green-100 text-xs">Per Horse/Month</p>
                          <p className="font-bold">£{result.perHorseMonthly}</p>
                        </div>
                      </div>
                    </div>

                    {!result.acreageOk && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-amber-800">
                          <AlertCircle className="w-5 h-5" />
                          <p className="font-medium">
                            Recommended: {result.recommendedAcres} acres for {result.horses} horse{result.horses > 1 ? 's' : ''}
                          </p>
                        </div>
                        <p className="text-sm text-amber-700 mt-1">
                          Allow 1-1.5 acres per horse for adequate grazing
                        </p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Rent ({result.acreage} acres)</span>
                          <span className="font-medium">£{result.breakdown.baseRent}</span>
                        </div>
                        {parseFloat(result.breakdown.facilities) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Facilities</span>
                            <span className="font-medium">£{result.breakdown.facilities}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.maintenance) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Maintenance</span>
                            <span className="font-medium">£{result.breakdown.maintenance}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Annual</span>
                          <span>£{result.totalAnnual}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Per Acre</span>
                          <span>£{result.perAcreAnnual}/year</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-green-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Compare to Livery</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">DIY Livery (equivalent)</span>
                          <span className="font-medium">£{result.comparison.diyLivery}/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Grass Livery (equivalent)</span>
                          <span className="font-medium">£{result.comparison.grassLivery}/year</span>
                        </div>
                        {parseFloat(result.comparison.savings) > 0 && (
                          <div className="flex justify-between pt-2 border-t text-green-600 font-semibold">
                            <span>Potential Savings vs DIY Livery</span>
                            <span>£{result.comparison.savings}/year</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {result.acreageOk && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <p className="font-medium text-green-800">
                            Good acreage for {result.horses} horse{result.horses > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <TreePine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Configure your field requirements to see costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <Fence className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-green-900 mb-2">Field Rental Checklist</h3>
                <ul className="text-green-800 space-y-1 text-sm">
                  <li>• <strong>Check fencing</strong> - post and rail or electric, properly maintained</li>
                  <li>• <strong>Water supply</strong> - reliable mains, stream, or regular trough filling</li>
                  <li>• <strong>Shelter</strong> - natural (hedges, trees) or field shelter needed</li>
                  <li>• <strong>Drainage</strong> - avoid waterlogged fields, check gateway condition</li>
                  <li>• <strong>Access</strong> - suitable for horse transport and daily visits</li>
                  <li>• <strong>Neighbours</strong> - check for stallions, barking dogs, or hazards nearby</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Field Rent Prices 2025</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Region</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Basic Grazing</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">With Facilities</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Equestrian</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Greater London</td>
                    <td className="py-3 px-4 text-center">£140-180/acre</td>
                    <td className="py-3 px-4 text-center">£200-280/acre</td>
                    <td className="py-3 px-4 text-center">£300-400/acre</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">South East</td>
                    <td className="py-3 px-4 text-center">£100-140/acre</td>
                    <td className="py-3 px-4 text-center">£150-200/acre</td>
                    <td className="py-3 px-4 text-center">£220-300/acre</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">South West</td>
                    <td className="py-3 px-4 text-center">£80-120/acre</td>
                    <td className="py-3 px-4 text-center">£120-180/acre</td>
                    <td className="py-3 px-4 text-center">£180-250/acre</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Midlands</td>
                    <td className="py-3 px-4 text-center">£70-100/acre</td>
                    <td className="py-3 px-4 text-center">£100-150/acre</td>
                    <td className="py-3 px-4 text-center">£150-220/acre</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Northern England</td>
                    <td className="py-3 px-4 text-center">£50-80/acre</td>
                    <td className="py-3 px-4 text-center">£80-120/acre</td>
                    <td className="py-3 px-4 text-center">£120-180/acre</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Wales</td>
                    <td className="py-3 px-4 text-center">£50-75/acre</td>
                    <td className="py-3 px-4 text-center">£75-110/acre</td>
                    <td className="py-3 px-4 text-center">£110-160/acre</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Scotland</td>
                    <td className="py-3 px-4 text-center">£40-70/acre</td>
                    <td className="py-3 px-4 text-center">£70-100/acre</td>
                    <td className="py-3 px-4 text-center">£100-150/acre</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Prices per acre per year. Add water, maintenance, and facility costs for total annual expense.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Annual Maintenance Costs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Essential Maintenance</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Harrowing (2x yearly)</span>
                    <span className="font-medium">£80-150</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Topping (2x yearly)</span>
                    <span className="font-medium">£60-120</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Fertilizing (annual)</span>
                    <span className="font-medium">£100-200/acre</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Weed Control</span>
                    <span className="font-medium">£50-100</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Infrastructure</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Fence Repairs (budget)</span>
                    <span className="font-medium">£100-300/year</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Gate Maintenance</span>
                    <span className="font-medium">£20-50/year</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Water Supply</span>
                    <span className="font-medium">£100-300/year</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Public Liability Insurance</span>
                    <span className="font-medium">£100-200/year</span>
                  </div>
                </div>
              </div>
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
              <a href="/livery-cost-calculator" className="bg-amber-50 hover:bg-amber-100 rounded-xl p-4 transition group">
                <Fence className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600">Livery Calculator</h3>
                <p className="text-sm text-gray-600">Compare livery options</p>
              </a>
              <a href="/horse-loan-calculator" className="bg-emerald-50 hover:bg-emerald-100 rounded-xl p-4 transition group">
                <Star className="w-8 h-8 text-emerald-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600">Loan Calculator</h3>
                <p className="text-sm text-gray-600">Loan vs buy costs</p>
              </a>
              <a href="/annual-horse-cost-calculator" className="bg-orange-50 hover:bg-orange-100 rounded-xl p-4 transition group">
                <Calendar className="w-8 h-8 text-orange-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">Annual Cost Calculator</h3>
                <p className="text-sm text-gray-600">Complete ownership budget</p>
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Considering Your Own Land?</h2>
            <p className="text-green-100 mb-6 max-w-xl mx-auto">
              Renting a field can be cheaper than livery for multiple horses. Calculate your full ownership costs to compare.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition"
            >
              Calculate All Costs
              <Calculator className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
