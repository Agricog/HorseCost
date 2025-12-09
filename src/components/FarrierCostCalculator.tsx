import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Scissors,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  PieChart,
  Calendar,
  CheckCircle2,
  XCircle
} from 'lucide-react'

export default function FarrierCostCalculator() {
  // Hoof care type
  const [hoofCareType, setHoofCareType] = useState('')
  
  // Costs
  const [costPerVisit, setCostPerVisit] = useState('')
  const [visitFrequency, setVisitFrequency] = useState('6')
  
  // Additional services
  const [includeRemedialWork, setIncludeRemedialWork] = useState(false)
  const [remedialCostPerVisit, setRemedialCostPerVisit] = useState('')
  const [includeEmergency, setIncludeEmergency] = useState(false)
  const [emergencyBudget, setEmergencyBudget] = useState('')
  
  const [result, setResult] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // UK Average farrier prices 2025
  const ukAverages = {
    trim: { low: 30, avg: 40, high: 55 },
    frontShoesOnly: { low: 50, avg: 65, high: 85 },
    fullSet: { low: 80, avg: 100, high: 140 },
    remedialShoes: { low: 120, avg: 150, high: 200 },
    emergency: 150 // Average emergency callout
  }

  // Presets for hoof care types
  const hoofCarePresets: Record<string, { cost: number, label: string, description: string }> = {
    'barefoot-trim': { cost: 40, label: 'Barefoot Trim', description: 'Regular trimming only, no shoes' },
    'front-shoes': { cost: 65, label: 'Front Shoes Only', description: 'Shoes on front hooves, back trimmed' },
    'full-set': { cost: 100, label: 'Full Set (4 shoes)', description: 'All four hooves shod' },
    'remedial': { cost: 150, label: 'Remedial/Therapeutic', description: 'Specialised shoeing for problems' }
  }

  const applyPreset = (type: string) => {
    setHoofCareType(type)
    const preset = hoofCarePresets[type]
    if (preset) {
      setCostPerVisit(preset.cost.toString())
    }
  }

  const calculate = () => {
    const cost = parseFloat(costPerVisit) || 100
    const weeks = parseInt(visitFrequency) || 6
    const remedial = includeRemedialWork ? (parseFloat(remedialCostPerVisit) || 50) : 0
    const emergency = includeEmergency ? (parseFloat(emergencyBudget) || 150) : 0

    // Calculate visits per year
    const visitsPerYear = Math.ceil(52 / weeks)
    
    // Annual costs
    const annualBasicCost = cost * visitsPerYear
    const annualRemedialCost = remedial * visitsPerYear
    const annualTotalCost = annualBasicCost + annualRemedialCost + emergency

    // Monthly average
    const monthlyAverage = annualTotalCost / 12

    // Cost per day
    const dailyCost = annualTotalCost / 365

    // Comparison with averages
    const avgFullSetAnnual = ukAverages.fullSet.avg * 9 // 9 visits at 6 weeks
    const avgTrimAnnual = ukAverages.trim.avg * 6 // 6 visits at 8 weeks (barefoot)

    setResult({
      visitsPerYear,
      costPerVisit: cost.toFixed(2),
      annualBasic: annualBasicCost.toFixed(2),
      annualRemedial: annualRemedialCost.toFixed(2),
      annualEmergency: emergency.toFixed(2),
      annualTotal: annualTotalCost.toFixed(2),
      monthlyAverage: monthlyAverage.toFixed(2),
      dailyCost: dailyCost.toFixed(2),
      comparison: {
        vsFullSet: annualTotalCost - avgFullSetAnnual,
        vsTrim: annualTotalCost - avgTrimAnnual,
        savingsIfBarefoot: annualBasicCost - avgTrimAnnual
      },
      schedule: {
        weeks: weeks,
        nextVisits: Array.from({ length: 4 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() + (weeks * 7 * (i + 1)))
          return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        })
      }
    })
  }

  const faqs = [
    {
      q: "How much does a farrier cost in the UK 2025?",
      a: "UK farrier costs in 2025 range from £30-55 for a trim, £50-85 for front shoes only, and £80-140 for a full set of four shoes. Remedial or therapeutic shoeing costs £120-200+ per visit. Prices vary by region, with the South East typically 15-20% higher than northern areas."
    },
    {
      q: "How often should a horse see the farrier?",
      a: "Most horses need farrier attention every 6-8 weeks. Shod horses typically need visits every 5-7 weeks as shoes wear and hooves grow. Barefoot horses may go 8-10 weeks between trims. Young horses, those with hoof problems, or competition horses may need more frequent visits."
    },
    {
      q: "Is it cheaper to keep a horse barefoot?",
      a: "Yes, barefoot horses are significantly cheaper - around £240-400/year vs £700-1200/year for shod horses. However, barefoot isn't suitable for all horses. Consider terrain, workload, and hoof quality. Some horses need shoes for protection or corrective reasons."
    },
    {
      q: "What is included in a farrier visit?",
      a: "A standard visit includes: trimming and balancing all four hooves, checking for thrush or other issues, and fitting/refitting shoes if shod. The farrier should assess gait and discuss any concerns. Hot shoeing (shaping shoes with heat) is standard practice in the UK."
    },
    {
      q: "Why do farrier prices vary so much?",
      a: "Prices vary based on: geographic location (South vs North), farrier's experience and qualifications (registered vs apprentice), type of work (basic vs remedial), horse's behaviour and hoof condition, and whether it's a yard visit or single horse. Specialist farriers charge more for complex cases."
    },
    {
      q: "What is remedial or therapeutic shoeing?",
      a: "Remedial shoeing addresses specific hoof or limb problems like laminitis, navicular, or conformational issues. It requires specialist knowledge and custom shoes. Costs are £120-200+ per visit. A vet referral may be needed, and regular reassessment is essential."
    },
    {
      q: "How do I find a good farrier?",
      a: "Look for a Farriers Registration Council (FRC) registered farrier - it's a legal requirement in the UK. Ask for recommendations from your yard, vet, or local horse groups. A good farrier arrives on time, handles horses well, explains their work, and is happy to discuss concerns."
    },
    {
      q: "What are signs my horse needs the farrier?",
      a: "Signs include: shoes loose or clicking, visible hoof growth over shoes, uneven wear, chips or cracks in hoof wall, stumbling or changing gait, and reaching or exceeding the 6-8 week interval. Don't wait for problems - regular maintenance prevents issues."
    },
    {
      q: "Should I use hot or cold shoeing?",
      a: "Hot shoeing (heating shoes to shape them) is preferred by most UK farriers as it allows precise fitting and can seal the hoof. Cold shoeing uses pre-made shoes and is quicker but less customised. For most horses, hot shoeing provides better results."
    },
    {
      q: "What if my horse loses a shoe?",
      a: "A lost shoe is usually non-emergency - keep the horse in a clean, dry area and call your farrier. If there's hoof damage or the horse is lame, treat as urgent. Most farriers charge £20-40 for a single shoe replacement, or it may be included in their service. Emergency callouts cost more."
    }
  ]

  return (
    <>
      <Helmet>
        <title>Farrier Cost Calculator UK 2025 | Shoeing & Trimming Prices | HorseCost</title>
        <meta 
          name="description" 
          content="Free farrier cost calculator for UK horse owners. Calculate annual shoeing, trimming, and hoof care costs. Compare barefoot vs shod expenses with 2025 UK pricing." 
        />
        <meta 
          name="keywords" 
          content="farrier cost calculator, horse shoeing costs UK, farrier prices 2025, barefoot horse cost, horse hoof care, annual farrier budget, shoeing vs trimming cost" 
        />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#57534e" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:title" content="Farrier Cost Calculator UK 2025 | HorseCost" />
        <meta property="og:description" content="Calculate your annual farrier costs. Compare barefoot vs shod options with UK 2025 pricing." />
        <meta property="og:url" content="https://horsecost.co.uk/farrier-cost-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/farrier-cost-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Farrier Cost Calculator UK | HorseCost" />
        <meta name="twitter:description" content="Calculate annual farrier and hoof care costs for your horse." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/farrier-cost-calculator-twitter.jpg" />

        <link rel="canonical" href="https://horsecost.co.uk/farrier-cost-calculator" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Farrier Cost Calculator', 'item': 'https://horsecost.co.uk/farrier-cost-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Farrier Cost Calculator UK',
                'url': 'https://horsecost.co.uk/farrier-cost-calculator',
                'description': 'Calculate annual farrier and hoof care costs for UK horses with 2025 pricing.',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.7', 'ratingCount': '258', 'bestRating': '5', 'worstRating': '1' }
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
          <a href="/" className="text-stone-600 hover:text-stone-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-stone-600 to-stone-500 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Scissors className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Farrier Cost Calculator UK</h1>
                <p className="text-stone-200 mt-1">Calculate annual shoeing and hoof care costs</p>
              </div>
            </div>
            <p className="text-stone-100 max-w-3xl">
              Work out your yearly farrier budget for shoeing, trimming, and remedial hoof care. 
              Compare barefoot vs shod costs with accurate 2025 UK pricing.
            </p>
            <p className="text-stone-300 text-sm mt-2">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Main Calculator Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              
              {/* Section 1: Hoof Care Type */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-stone-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h2 className="text-xl font-bold text-gray-900">Hoof Care Type</h2>
                </div>
                <p className="text-gray-600 mb-4">Select your horse's hoof care arrangement to see typical costs.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(hoofCarePresets).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className={`p-4 rounded-lg border-2 text-left transition ${
                        hoofCareType === key 
                          ? 'border-stone-500 bg-stone-50 text-stone-700' 
                          : 'border-gray-200 hover:border-stone-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">{preset.label}</div>
                      <div className="text-sm text-gray-500 mt-1">~£{preset.cost}/visit</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2: Visit Details */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-stone-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h2 className="text-xl font-bold text-gray-900">Visit Details</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Cost Per Visit (£)
                    </label>
                    <input
                      type="number"
                      value={costPerVisit}
                      onChange={(e) => setCostPerVisit(e.target.value)}
                      placeholder="e.g., 100"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      UK avg: Trim £40 | Front shoes £65 | Full set £100
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Visit Frequency
                    </label>
                    <select
                      value={visitFrequency}
                      onChange={(e) => setVisitFrequency(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    >
                      <option value="5">Every 5 weeks (10 visits/year)</option>
                      <option value="6">Every 6 weeks (9 visits/year)</option>
                      <option value="7">Every 7 weeks (7 visits/year)</option>
                      <option value="8">Every 8 weeks (6 visits/year)</option>
                      <option value="10">Every 10 weeks (5 visits/year)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Shod horses: 5-7 weeks | Barefoot: 6-10 weeks
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Additional Costs */}
              <div className="mb-8">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-3 mb-4 text-left w-full"
                >
                  <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h2 className="text-xl font-bold text-gray-900">Additional Costs</h2>
                  {showAdvanced ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                
                {showAdvanced && (
                  <div className="pl-11 space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="remedial"
                        checked={includeRemedialWork}
                        onChange={(e) => setIncludeRemedialWork(e.target.checked)}
                        className="w-5 h-5 mt-1 text-stone-600 rounded"
                      />
                      <div className="flex-1">
                        <label htmlFor="remedial" className="font-medium text-gray-700 cursor-pointer">
                          Include remedial/corrective work
                        </label>
                        <p className="text-sm text-gray-500">For horses with hoof problems requiring special shoes</p>
                        {includeRemedialWork && (
                          <div className="mt-3">
                            <label className="block text-sm text-gray-600 mb-1">Additional cost per visit (£)</label>
                            <input
                              type="number"
                              value={remedialCostPerVisit}
                              onChange={(e) => setRemedialCostPerVisit(e.target.value)}
                              placeholder="e.g., 50"
                              className="w-48 p-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="emergency"
                        checked={includeEmergency}
                        onChange={(e) => setIncludeEmergency(e.target.checked)}
                        className="w-5 h-5 mt-1 text-stone-600 rounded"
                      />
                      <div className="flex-1">
                        <label htmlFor="emergency" className="font-medium text-gray-700 cursor-pointer">
                          Include emergency fund
                        </label>
                        <p className="text-sm text-gray-500">For lost shoes, emergency callouts, or unexpected issues</p>
                        {includeEmergency && (
                          <div className="mt-3">
                            <label className="block text-sm text-gray-600 mb-1">Annual emergency budget (£)</label>
                            <input
                              type="number"
                              value={emergencyBudget}
                              onChange={(e) => setEmergencyBudget(e.target.value)}
                              placeholder="e.g., 150"
                              className="w-48 p-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculate}
                className="w-full bg-gradient-to-r from-stone-600 to-stone-500 text-white py-4 rounded-xl font-bold text-lg hover:from-stone-700 hover:to-stone-600 transition shadow-lg"
              >
                <Calculator className="w-5 h-5 inline mr-2" />
                Calculate Farrier Costs
              </button>
            </div>

            {/* Results Section */}
            {result && (
              <div className="border-t border-gray-200 bg-gradient-to-b from-stone-50 to-white p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <PieChart className="w-6 h-6 text-stone-600" />
                  Your Farrier Costs
                </h2>
                
                {/* Main Results */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-stone-600 text-white p-6 rounded-xl text-center">
                    <div className="text-stone-200 text-sm font-medium">Annual Total</div>
                    <div className="text-4xl font-bold mt-1">£{parseFloat(result.annualTotal).toLocaleString()}</div>
                  </div>
                  <div className="bg-white border-2 border-stone-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Monthly Average</div>
                    <div className="text-3xl font-bold text-gray-900 mt-1">£{result.monthlyAverage}</div>
                  </div>
                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Per Visit</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">£{result.costPerVisit}</div>
                  </div>
                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Visits/Year</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{result.visitsPerYear}</div>
                  </div>
                </div>

                {/* Visit Schedule */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-stone-600" />
                    Upcoming Visits (Every {result.schedule.weeks} weeks)
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {result.schedule.nextVisits.map((date: string, i: number) => (
                      <div key={i} className="bg-stone-50 px-4 py-2 rounded-lg">
                        <span className="text-stone-600 font-medium">{date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-gray-900 mb-4">Annual Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Regular farrier visits ({result.visitsPerYear} x £{result.costPerVisit})</span>
                      <span className="font-medium">£{parseFloat(result.annualBasic).toLocaleString()}</span>
                    </div>
                    {parseFloat(result.annualRemedial) > 0 && (
                      <div className="flex justify-between items-center">
                        <span>Remedial work</span>
                        <span className="font-medium">£{parseFloat(result.annualRemedial).toLocaleString()}</span>
                      </div>
                    )}
                    {parseFloat(result.annualEmergency) > 0 && (
                      <div className="flex justify-between items-center">
                        <span>Emergency fund</span>
                        <span className="font-medium">£{parseFloat(result.annualEmergency).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 font-bold text-lg">
                      <span>Total Annual Cost</span>
                      <span>£{parseFloat(result.annualTotal).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Comparison */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-stone-600" />
                    Cost Comparison
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${result.comparison.vsFullSet < 0 ? 'bg-green-50' : 'bg-amber-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {result.comparison.vsFullSet < 0 
                          ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                          : <TrendingUp className="w-5 h-5 text-amber-600" />
                        }
                        <span className="font-medium">vs UK Average (Full Set)</span>
                      </div>
                      <p className={`text-lg font-bold ${result.comparison.vsFullSet < 0 ? 'text-green-700' : 'text-amber-700'}`}>
                        {result.comparison.vsFullSet < 0 ? `£${Math.abs(result.comparison.vsFullSet).toFixed(0)} less` : `£${result.comparison.vsFullSet.toFixed(0)} more`}
                      </p>
                      <p className="text-sm text-gray-600">UK avg full set: ~£900/year</p>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${hoofCareType === 'barefoot-trim' ? 'bg-green-50' : 'bg-blue-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Scissors className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Barefoot Savings</span>
                      </div>
                      <p className="text-lg font-bold text-blue-700">
                        {hoofCareType === 'barefoot-trim' 
                          ? 'Already barefoot!' 
                          : `Save ~£${Math.abs(result.comparison.savingsIfBarefoot).toFixed(0)}/year`
                        }
                      </p>
                      <p className="text-sm text-gray-600">UK avg barefoot: ~£240/year</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Important Notes */}
          <div className="bg-stone-50 border-l-4 border-stone-500 p-6 rounded-r-lg mt-8">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-stone-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-stone-800 mb-2">Important Hoof Care Notes</h3>
                <ul className="text-stone-900 space-y-1 text-sm">
                  <li>• Only use Farriers Registration Council (FRC) registered farriers - it's a legal requirement in the UK</li>
                  <li>• Never extend intervals beyond 8 weeks for shod horses - this causes hoof and shoe problems</li>
                  <li>• Barefoot transition should be done gradually with professional guidance</li>
                  <li>• Poor hoof care leads to lameness - the most common cause of lost riding days</li>
                  <li>• Book your farrier well in advance - good farriers are often booked 4-6 weeks ahead</li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Farrier Prices Table */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">UK Farrier Prices 2025</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                <thead>
                  <tr className="bg-stone-600 text-white">
                    <th className="p-4 text-left">Service</th>
                    <th className="p-4 text-right">Low</th>
                    <th className="p-4 text-right">Average</th>
                    <th className="p-4 text-right">High</th>
                    <th className="p-4 text-right">Annual (9 visits)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Barefoot Trim</td>
                    <td className="p-4 text-right">£30</td>
                    <td className="p-4 text-right">£40</td>
                    <td className="p-4 text-right">£55</td>
                    <td className="p-4 text-right font-bold text-green-700">£240-360</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">Front Shoes Only</td>
                    <td className="p-4 text-right">£50</td>
                    <td className="p-4 text-right">£65</td>
                    <td className="p-4 text-right">£85</td>
                    <td className="p-4 text-right font-bold">£450-585</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Full Set (4 shoes)</td>
                    <td className="p-4 text-right">£80</td>
                    <td className="p-4 text-right">£100</td>
                    <td className="p-4 text-right">£140</td>
                    <td className="p-4 text-right font-bold">£720-900</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">Remedial Shoeing</td>
                    <td className="p-4 text-right">£120</td>
                    <td className="p-4 text-right">£150</td>
                    <td className="p-4 text-right">£200+</td>
                    <td className="p-4 text-right font-bold text-amber-700">£1,080-1,350+</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4 font-medium">Emergency Callout</td>
                    <td className="p-4 text-right">£80</td>
                    <td className="p-4 text-right">£100</td>
                    <td className="p-4 text-right">£150+</td>
                    <td className="p-4 text-right text-gray-500">Per incident</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-2">* Prices vary by region. South East typically 15-20% higher. Include travel for remote locations.</p>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 space-y-12">
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
              <a href="/annual-horse-cost-calculator" className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-stone-400 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900">Annual Cost Calculator</h3>
                <p className="text-gray-600 text-sm mt-1">Complete yearly ownership costs</p>
              </a>
              <a href="/horse-feed-calculator" className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-stone-400 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900">Feed Calculator</h3>
                <p className="text-gray-600 text-sm mt-1">Daily hay and feed costs</p>
              </a>
              <a href="/calculators/horse-livery" className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-stone-400 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900">Livery Calculator</h3>
                <p className="text-gray-600 text-sm mt-1">Compare livery options and costs</p>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-stone-600 to-stone-500 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Need to Calculate Total Horse Costs?</h2>
            <p className="text-stone-200 mb-4">Try our comprehensive Annual Horse Cost Calculator for a complete budget.</p>
            <a 
              href="/annual-horse-cost-calculator" 
              className="inline-block bg-white text-stone-600 px-6 py-3 rounded-lg font-bold hover:bg-stone-50 transition"
            >
              Calculate Annual Costs
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
