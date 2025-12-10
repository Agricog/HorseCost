import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  TreePine,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Calendar,
  Star,
  Fence
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
  {/* ========== 1. PRIMARY META TAGS (4) ========== */}
  <title>Horse Transport Cost Calculator UK 2025 | Moving & Travel Prices | HorseCost</title>
  <meta 
    name="description" 
    content="Free horse transport cost calculator for UK owners. Calculate professional transporter prices, DIY moving costs, and compare options for shows, moves, and vet visits. 2025 UK prices." 
  />
  <meta 
    name="keywords" 
    content="horse transport cost UK, horse transporter prices, moving horse cost, horse travel calculator, horsebox hire cost, equine transport quotes, horse taxi prices" 
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
  <meta name="theme-color" content="#0369a1" />

  {/* ========== 5. OPEN GRAPH / FACEBOOK (8) ========== */}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="HorseCost" />
  <meta property="og:locale" content="en_GB" />
  <meta property="og:title" content="Horse Transport Cost Calculator UK 2025 | Moving Prices | HorseCost" />
  <meta property="og:description" content="Calculate horse transport costs for moves, shows, and vet visits. Compare professional transporters with DIY options." />
  <meta property="og:url" content="https://horsecost.co.uk/horse-transport-calculator" />
  <meta property="og:image" content="https://horsecost.co.uk/images/transport-calculator-og-1200x630.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Horse Transport Cost Calculator showing UK transporter prices by distance" />

  {/* ========== 6. TWITTER CARD (6) ========== */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@HorseCost" />
  <meta name="twitter:title" content="Horse Transport Cost Calculator UK 2025 | HorseCost" />
  <meta name="twitter:description" content="Calculate horse moving costs. Compare professional transport, local taxi, and DIY options." />
  <meta name="twitter:image" content="https://horsecost.co.uk/images/transport-calculator-twitter-1200x675.jpg" />
  <meta name="twitter:image:alt" content="Horse Transport Cost Calculator UK" />

  {/* ========== 7. CANONICAL & ALTERNATE (2) ========== */}
  <link rel="canonical" href="https://horsecost.co.uk/horse-transport-calculator" />
  <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/horse-transport-calculator" />

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
            { 
              '@type': 'ListItem', 
              'position': 1, 
              'name': 'Home', 
              'item': 'https://horsecost.co.uk'
            },
            { 
              '@type': 'ListItem', 
              'position': 2, 
              'name': 'Calculators', 
              'item': 'https://horsecost.co.uk/#calculators'
            },
            { 
              '@type': 'ListItem', 
              'position': 3, 
              'name': 'Horse Transport Calculator', 
              'item': 'https://horsecost.co.uk/horse-transport-calculator'
            }
          ]
        },
        {
          '@type': 'SoftwareApplication',
          'name': 'Horse Transport Cost Calculator UK',
          'description': 'Calculate horse transport and moving costs in the UK. Compare professional transporters, local horse taxis, and DIY options with 2025 prices.',
          'url': 'https://horsecost.co.uk/horse-transport-calculator',
          'applicationCategory': 'FinanceApplication',
          'operatingSystem': 'Web',
          'offers': { 
            '@type': 'Offer', 
            'price': '0', 
            'priceCurrency': 'GBP',
            'availability': 'https://schema.org/InStock'
          },
          'aggregateRating': { 
            '@type': 'AggregateRating', 
            'ratingValue': '4.7', 
            'ratingCount': '178',
            'bestRating': '5',
            'worstRating': '1'
          },
          'author': {
            '@type': 'Organization',
            'name': 'HorseCost'
          }
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'How much does horse transport cost UK?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Professional horse transport in the UK costs £2-3 per mile with minimum charges of £50-100. A typical 50-mile journey costs £100-150, while 100 miles costs £200-300. Prices vary by region, urgency, and number of horses. DIY transport costs around £0.60-0.80 per mile in fuel and wear.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How do I find a horse transporter?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Options include: asking your yard for recommendations, Facebook horse transport groups, British Grooms Association lists, your vet clinic contacts, or transport directories. Always check insurance, reviews, and inspect vehicles if possible. Word of mouth recommendations are often best.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What should I check before booking transport?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Verify: valid insurance (goods in transit + public liability), DEFRA authorization if required, clean well-maintained vehicle, driver experience with horses, breakdown cover, and references. Ask about their loading approach for difficult loaders.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How far can a horse travel in one day?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Horses should rest every 4 hours and drink every 6 hours. Most experts recommend maximum 8-10 hours travel per day (300-400 miles). For longer journeys, overnight stops are advisable. Young, old, or unfit horses may need shorter travel times.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Do I need to travel with my horse?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Professional transporters typically travel alone unless you arrange to accompany. For valuable competition horses or nervous travellers, you may want to follow in your car. Some transporters charge extra if you travel with them.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What paperwork do I need for horse transport?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Required: horse\'s passport (legally required at all times). Recommended: vaccination records, ownership documents, destination livery agreement. For international transport, you\'ll need export health certificates and TRACES documentation.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Should I sedate my horse for travel?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Sedation is generally not recommended as it affects balance and stress response. Horses are safer travelling alert. If your horse is extremely difficult, discuss with your vet - they may recommend alternative calming approaches. Address loading training instead.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How do I prepare my horse for transport?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Fit travel boots or bandages (all four legs plus hock and knee boots), tail guard, light rug if needed. Provide hay net for longer journeys. Ensure horse is calm before loading. Remove shoes if travelling long distance (some choose to).'
              }
            },
            {
              '@type': 'Question',
              'name': 'Is it cheaper to hire a trailer or use a transporter?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'For occasional journeys, professional transport is usually cheaper and easier. Trailer hire costs £50-80/day plus fuel (£0.60-0.80/mile), and you need a suitable towing vehicle. If you transport 10+ times yearly, owning makes more sense.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What insurance do I need for horse transport?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'If using professionals, they should have goods in transit insurance. Your horse insurance should cover transport incidents. If self-transporting, check your trailer/horsebox insurance covers the horse\'s value. Always verify cover before travel.'
              }
            }
          ]
        },
        {
          '@type': 'HowTo',
          'name': 'How to Use the Horse Transport Cost Calculator',
          'description': 'Step-by-step guide to calculating your horse transport and moving costs',
          'step': [
            {
              '@type': 'HowToStep',
              'position': 1,
              'name': 'Select Journey Type',
              'text': 'Choose the purpose of your journey: one-off move (buying/relocating), competition/show, vet/clinic visit, or holiday/training. This helps tailor the estimate.'
            },
            {
              '@type': 'HowToStep',
              'position': 2,
              'name': 'Enter Distance',
              'text': 'Input the one-way journey distance in miles. Use Google Maps to calculate if unsure. Common distances are provided as quick-select buttons.'
            },
            {
              '@type': 'HowToStep',
              'position': 3,
              'name': 'Select Number of Horses',
              'text': 'Choose how many horses are travelling. Multiple horses often get discounted rates as they share the journey.'
            },
            {
              '@type': 'HowToStep',
              'position': 4,
              'name': 'Choose Transport Method',
              'text': 'Select your preferred option: professional transporter, local horse taxi, friend/yard help, or self-transport with your own vehicle.'
            },
            {
              '@type': 'HowToStep',
              'position': 5,
              'name': 'Calculate and Compare',
              'text': 'Click Calculate to see your estimated transport cost, estimated journey time, and comparison between different transport options.'
            }
          ]
        },
        {
          '@type': 'Article',
          'headline': 'Horse Transport Cost Calculator UK 2025 - Moving & Travel Prices',
          'description': 'Free calculator for UK horse transport costs. Compare professional transporters, horse taxis, and DIY options for moves, shows, and vet visits.',
          'datePublished': '2025-01-01',
          'dateModified': '2025-01-15',
          'author': {
            '@type': 'Organization',
            'name': 'HorseCost',
            'url': 'https://horsecost.co.uk'
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'HorseCost',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://horsecost.co.uk/logo.png',
              'width': 200,
              'height': 200
            }
          },
          'image': 'https://horsecost.co.uk/images/transport-calculator-og-1200x630.jpg',
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': 'https://horsecost.co.uk/horse-transport-calculator'
          }
        },
        {
          '@type': 'Organization',
          'name': 'HorseCost',
          'url': 'https://horsecost.co.uk',
          'logo': 'https://horsecost.co.uk/logo.png',
          'description': 'Free professional horse cost calculators for UK equestrians',
          'sameAs': [
            'https://www.facebook.com/HorseCost',
            'https://twitter.com/HorseCost',
            'https://www.instagram.com/HorseCost'
          ],
          'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'Customer Support',
            'email': 'hello@horsecost.co.uk'
          },
          'address': {
            '@type': 'PostalAddress',
            'addressCountry': 'GB'
          }
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
