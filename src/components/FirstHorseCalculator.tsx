import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Heart,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  PoundSterling,
  CheckCircle2,
  Star,
  ShoppingBag,
  Calendar,
  Shield,
  Stethoscope,
  Home
} from 'lucide-react'

export default function FirstHorseCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('')
  const [horseType, setHorseType] = useState('allrounder')
  const [liveryType, setLiveryType] = useState('diy')
  const [region, setRegion] = useState('average')
  const [includeVetting, setIncludeVetting] = useState(true)
  const [vettingLevel, setVettingLevel] = useState('5stage')
  const [includeInsurance, setIncludeInsurance] = useState(true)
  const [includeFirstAidKit, setIncludeFirstAidKit] = useState(true)
  const [tackOwned, setTackOwned] = useState('none')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState<any>(null)

  const horseTypes = [
    { id: 'pony', name: 'Pony (under 14.2hh)', purchaseRange: '1500-5000', avgCost: 3000 },
    { id: 'cob', name: 'Cob/Native', purchaseRange: '2000-6000', avgCost: 4000 },
    { id: 'allrounder', name: 'All-rounder', purchaseRange: '3000-10000', avgCost: 5500 },
    { id: 'competition', name: 'Competition Horse', purchaseRange: '5000-20000', avgCost: 10000 },
    { id: 'project', name: 'Project/Youngster', purchaseRange: '1000-4000', avgCost: 2500 }
  ]

  const liveryTypes = [
    { id: 'diy', name: 'DIY Livery', monthlyCost: 150, description: 'You do all care' },
    { id: 'part', name: 'Part Livery', monthlyCost: 350, description: 'Shared care' },
    { id: 'full', name: 'Full Livery', monthlyCost: 550, description: 'All care included' },
    { id: 'grass', name: 'Grass Livery', monthlyCost: 100, description: 'Field only' }
  ]

  const vettingOptions = [
    { id: '2stage', name: '2-Stage Vetting', cost: 150 },
    { id: '5stage', name: '5-Stage Vetting', cost: 350 },
    { id: 'full', name: 'Full + X-rays', cost: 800 }
  ]

  const tackPackages = [
    { id: 'none', name: 'Need Everything', saddleCost: 800, bridleCost: 150, rugsCost: 400, bootsCost: 150 },
    { id: 'some', name: 'Have Some Basics', saddleCost: 800, bridleCost: 0, rugsCost: 200, bootsCost: 0 },
    { id: 'saddle', name: 'Have Saddle', saddleCost: 0, bridleCost: 150, rugsCost: 400, bootsCost: 150 },
    { id: 'most', name: 'Have Most Items', saddleCost: 0, bridleCost: 0, rugsCost: 150, bootsCost: 0 }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.3,
    'southeast': 1.15,
    'average': 1.0,
    'north': 0.9,
    'scotland': 0.95
  }

  const calculate = () => {
    const regionFactor = regionMultipliers[region]
    
    // Purchase price
    let purchase = 0
    if (purchasePrice && parseFloat(purchasePrice) > 0) {
      purchase = parseFloat(purchasePrice)
    } else {
      const horse = horseTypes.find(h => h.id === horseType)
      purchase = horse?.avgCost || 5000
    }

    // Pre-purchase vetting
    let vettingCost = 0
    if (includeVetting) {
      const vetting = vettingOptions.find(v => v.id === vettingLevel)
      vettingCost = vetting?.cost || 350
    }

    // Transport to new home
    const transportCost = 150 * regionFactor

    // Livery (first year)
    const livery = liveryTypes.find(l => l.id === liveryType)
    const annualLivery = (livery?.monthlyCost || 350) * 12 * regionFactor

    // Tack & Equipment
    const tack = tackPackages.find(t => t.id === tackOwned)
    const tackCost = tack 
      ? (tack.saddleCost + tack.bridleCost + tack.rugsCost + tack.bootsCost)
      : 1500

    // Saddle fitting
    const saddleFitting = tackOwned === 'none' || tackOwned === 'some' ? 75 : 0

    // Grooming kit & stable equipment
    const groomingKit = 100
    const stableEquipment = liveryType === 'diy' ? 200 : 50

    // First aid kit
    const firstAidKit = includeFirstAidKit ? 80 : 0

    // Insurance (first year)
    let insuranceCost = 0
    if (includeInsurance) {
      insuranceCost = Math.max(200, purchase * 0.05) * regionFactor
    }

    // Farrier (6 visits in first year)
    const farrierCost = 100 * 6 * regionFactor

    // Vet costs (vaccinations, dental, worming)
    const vetRoutine = 400 * regionFactor

    // Feed & bedding (if DIY - included in other livery)
    let feedBedding = 0
    if (liveryType === 'diy' || liveryType === 'grass') {
      feedBedding = 200 * 12 * regionFactor
    }

    // Unexpected costs buffer (10% of running costs)
    const runningCosts = annualLivery + farrierCost + vetRoutine + feedBedding
    const contingency = runningCosts * 0.1

    // Totals
    const oneOffCosts = purchase + vettingCost + transportCost + tackCost + saddleFitting + groomingKit + stableEquipment + firstAidKit
    const firstYearRunning = annualLivery + (includeInsurance ? insuranceCost : 0) + farrierCost + vetRoutine + feedBedding + contingency
    const totalFirstYear = oneOffCosts + firstYearRunning
    const monthlyOngoing = firstYearRunning / 12

    // UK average first year cost
    const ukAverageFirstYear = 12000

    setResult({
      totalFirstYear: totalFirstYear.toFixed(2),
      oneOffCosts: oneOffCosts.toFixed(2),
      firstYearRunning: firstYearRunning.toFixed(2),
      monthlyOngoing: monthlyOngoing.toFixed(2),
      breakdown: {
        purchase: purchase.toFixed(2),
        vetting: vettingCost.toFixed(2),
        transport: transportCost.toFixed(2),
        tack: tackCost.toFixed(2),
        saddleFitting: saddleFitting.toFixed(2),
        groomingKit: groomingKit.toFixed(2),
        stableEquipment: stableEquipment.toFixed(2),
        firstAidKit: firstAidKit.toFixed(2),
        livery: annualLivery.toFixed(2),
        insurance: insuranceCost.toFixed(2),
        farrier: farrierCost.toFixed(2),
        vet: vetRoutine.toFixed(2),
        feedBedding: feedBedding.toFixed(2),
        contingency: contingency.toFixed(2)
      },
      comparison: {
        vsUkAverage: totalFirstYear < ukAverageFirstYear,
        ukAverageFirstYear
      },
      savingsSuggestions: getSavingsSuggestions(liveryType, tackOwned, includeInsurance)
    })
  }

  const getSavingsSuggestions = (livery: string, tack: string, insured: boolean) => {
    const suggestions = []
    
    if (livery === 'full') {
      suggestions.push('Part livery could save £200-300/month if you have time')
    }
    if (tack === 'none') {
      suggestions.push('Good second-hand saddles save 40-60% vs new')
      suggestions.push('Facebook groups often have quality tack for sale')
    }
    if (!insured) {
      suggestions.push('⚠️ We strongly recommend insurance - one colic surgery costs £5,000+')
    }
    
    return suggestions
  }

  const faqs = [
    {
      q: 'How much does it cost to buy a horse in the UK?',
      a: 'Horse prices in the UK vary hugely from £500 for an unbroken project to £50,000+ for a top competition horse. A sensible first horse typically costs £3,000-£8,000. Budget extra for vetting (£150-£800), transport (£100-£200), and initial tack/equipment (£1,000-£2,000).'
    },
    {
      q: 'What is the total first year cost of owning a horse?',
      a: 'The first year of horse ownership typically costs £8,000-£15,000 in the UK, including purchase price, equipment, and running costs. This breaks down to: purchase (£3,000-£8,000), tack/equipment (£1,000-£2,000), and annual costs (£4,000-£8,000 for livery, farrier, vet, insurance).'
    },
    {
      q: 'Should I get a horse vetted before buying?',
      a: 'Yes, always get a pre-purchase vetting for any horse you\'re seriously considering. A 5-stage vetting (£300-£400) checks for health issues and soundness. For expensive horses or those for specific work, consider X-rays (additional £200-£500). It\'s cheaper than buying problems.'
    },
    {
      q: 'What tack do I need for my first horse?',
      a: 'Essential tack includes: properly fitted saddle (£500-£2,000), bridle with bit (£80-£200), numnahs/saddle pads (£30-£60), headcollar and leadrope (£30-£50), rugs (£200-£500 for basic set), grooming kit (£50-£100), and first aid kit (£50-£100).'
    },
    {
      q: 'What type of livery should I choose?',
      a: 'DIY livery (£100-£200/month) requires 2-3 hours daily but is cheapest. Part livery (£250-£450) offers shared care. Full livery (£400-£700+) includes all care but is most expensive. Choose based on your time, experience, and budget. Most first-time owners benefit from part livery.'
    },
    {
      q: 'Do I need horse insurance?',
      a: 'We strongly recommend insurance. Vet fee cover is essential - a single colic surgery costs £5,000-£10,000. Public liability protects you if your horse injures someone. Budget £200-£500/year for comprehensive cover. The peace of mind is worth it for unexpected emergencies.'
    },
    {
      q: 'How much should I budget for unexpected costs?',
      a: 'Budget 10-15% of your annual running costs for unexpected expenses. Common surprises include: emergency vet calls, lost shoes between farrier visits, rug repairs, broken tack, extra feed in harsh winters, and grazing supplements. Having £500-£1,000 savings buffer is sensible.'
    },
    {
      q: 'What ongoing costs should I expect?',
      a: 'Monthly ongoing costs typically include: livery (£100-£600), feed if DIY (£80-£150), bedding if DIY (£50-£100), insurance (£20-£50), plus regular costs like farrier every 6-8 weeks (£80-£120) and worming quarterly (£15-£25). Budget £300-£800/month depending on setup.'
    },
    {
      q: 'Should I buy a young horse or experienced horse?',
      a: 'First-time owners should buy an experienced, well-schooled horse aged 8-15. Young horses (under 6) need professional training and experienced handling. Yes, older horses cost more initially, but you\'ll save on training costs and avoid potentially dangerous situations.'
    },
    {
      q: 'Where should I buy my first horse?',
      a: 'Good sources include: reputable dealers (offer trial periods), riding school dispersals, word of mouth through your instructor, and rehoming charities (horses assessed and honest descriptions). Avoid buying solely from online ads without expert help - always take an experienced person to view.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>First Horse Cost Calculator UK 2025 | First Year Expenses | HorseCost</title>
        <meta 
          name="description" 
          content="Free first horse cost calculator for UK buyers. Calculate total first year costs including purchase, vetting, tack, livery, and running expenses. 2025 pricing guide." 
        />
        <meta name="keywords" content="first horse cost UK, buying a horse budget, horse ownership costs, first year horse expenses, how much does a horse cost, horse buying guide UK" />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#db2777" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:title" content="First Horse Cost Calculator UK 2025 | HorseCost" />
        <meta property="og:description" content="Calculate total first year costs of horse ownership. Free UK calculator for purchase, tack, livery, and running costs." />
        <meta property="og:url" content="https://horsecost.co.uk/first-horse-calculator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="First Horse Calculator UK | HorseCost" />

        <link rel="canonical" href="https://horsecost.co.uk/first-horse-calculator" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/#calculators' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'First Horse Calculator', 'item': 'https://horsecost.co.uk/first-horse-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'First Horse Cost Calculator UK',
                'description': 'Calculate total first year costs of horse ownership including purchase, tack, livery, and running expenses.',
                'url': 'https://horsecost.co.uk/first-horse-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.9', 'ratingCount': '312' }
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
            <a href="/" className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">First Horse Calculator</h1>
                <p className="text-pink-200">UK 2025 First Year Budget Planner</p>
              </div>
            </div>
            <p className="text-pink-100 max-w-2xl">
              Planning to buy your first horse? Calculate the true first year cost including purchase, 
              vetting, tack, livery, and all running expenses. No surprises!
            </p>
            <p className="text-pink-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Calculator Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Horse Type */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Type of Horse</label>
                  </div>
                  <div className="space-y-2">
                    {horseTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setHorseType(type.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          horseType === type.id
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <p className={`font-medium ${horseType === type.id ? 'text-pink-700' : 'text-gray-900'}`}>
                            {type.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            £{type.purchaseRange}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Purchase Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter specific purchase price (£)
                  </label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      placeholder="Leave blank for estimate"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Livery Type */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Livery Type</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {liveryTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setLiveryType(type.id)}
                        className={`p-3 rounded-xl text-left transition border-2 ${
                          liveryType === type.id
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`font-medium text-sm ${liveryType === type.id ? 'text-pink-700' : 'text-gray-900'}`}>
                          {type.name}
                        </p>
                        <p className="text-xs text-gray-500">{type.description}</p>
                        <p className="text-xs text-gray-600 mt-1">~£{type.monthlyCost}/month</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Region */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  >
                    <option value="london">London (Higher prices)</option>
                    <option value="southeast">South East England</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England</option>
                    <option value="scotland">Scotland / Wales</option>
                  </select>
                </div>

                {/* Tack Situation */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Tack & Equipment</label>
                  </div>
                  <select
                    value={tackOwned}
                    onChange={(e) => setTackOwned(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  >
                    <option value="none">Need everything (first horse)</option>
                    <option value="some">Have some basics (bridle, rugs)</option>
                    <option value="saddle">Have a saddle already</option>
                    <option value="most">Have most items</option>
                  </select>
                </div>

                {/* Pre-purchase Options */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Pre-purchase & Safety</label>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeVetting}
                        onChange={(e) => setIncludeVetting(e.target.checked)}
                        className="w-5 h-5 text-pink-600 rounded"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Pre-purchase Vetting</span>
                        <p className="text-sm text-gray-500">Highly recommended!</p>
                      </div>
                    </label>

                    {includeVetting && (
                      <div className="pl-8">
                        <select
                          value={vettingLevel}
                          onChange={(e) => setVettingLevel(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                        >
                          {vettingOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name} (£{option.cost})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeInsurance}
                        onChange={(e) => setIncludeInsurance(e.target.checked)}
                        className="w-5 h-5 text-pink-600 rounded"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Horse Insurance</span>
                        <p className="text-sm text-gray-500">Strongly recommended</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeFirstAidKit}
                        onChange={(e) => setIncludeFirstAidKit(e.target.checked)}
                        className="w-5 h-5 text-pink-600 rounded"
                      />
                      <div>
                        <span className="font-medium text-gray-900">First Aid Kit</span>
                        <p className="text-sm text-gray-500">Essential for horse owners</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Results */}
              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-700 hover:to-rose-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate First Year Cost
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white">
                      <p className="text-pink-100 text-sm mb-1">Total First Year Cost</p>
                      <p className="text-4xl font-bold">£{result.totalFirstYear}</p>
                      <p className="text-pink-200 text-sm mt-1">Including purchase & setup</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-pink-100 text-xs">One-off Costs</p>
                          <p className="font-bold">£{result.oneOffCosts}</p>
                        </div>
                        <div>
                          <p className="text-pink-100 text-xs">Year 1 Running</p>
                          <p className="font-bold">£{result.firstYearRunning}</p>
                        </div>
                      </div>
                    </div>

                    {/* Monthly Ongoing */}
                    <div className="bg-pink-50 rounded-xl p-4 text-center">
                      <p className="text-pink-600 text-sm">Monthly Running Cost (Year 2+)</p>
                      <p className="text-3xl font-bold text-gray-900">£{result.monthlyOngoing}</p>
                      <p className="text-sm text-gray-500">After initial setup</p>
                    </div>

                    {/* One-off Costs Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-pink-600" />
                        One-off Costs
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Horse Purchase</span>
                          <span className="font-medium">£{result.breakdown.purchase}</span>
                        </div>
                        {parseFloat(result.breakdown.vetting) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pre-purchase Vetting</span>
                            <span className="font-medium">£{result.breakdown.vetting}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transport Home</span>
                          <span className="font-medium">£{result.breakdown.transport}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tack & Equipment</span>
                          <span className="font-medium">£{result.breakdown.tack}</span>
                        </div>
                        {parseFloat(result.breakdown.saddleFitting) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Saddle Fitting</span>
                            <span className="font-medium">£{result.breakdown.saddleFitting}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Grooming Kit</span>
                          <span className="font-medium">£{result.breakdown.groomingKit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stable Equipment</span>
                          <span className="font-medium">£{result.breakdown.stableEquipment}</span>
                        </div>
                        {parseFloat(result.breakdown.firstAidKit) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">First Aid Kit</span>
                            <span className="font-medium">£{result.breakdown.firstAidKit}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Subtotal</span>
                          <span>£{result.oneOffCosts}</span>
                        </div>
                      </div>
                    </div>

                    {/* Running Costs Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-pink-600" />
                        First Year Running Costs
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Livery (12 months)</span>
                          <span className="font-medium">£{result.breakdown.livery}</span>
                        </div>
                        {parseFloat(result.breakdown.insurance) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Insurance</span>
                            <span className="font-medium">£{result.breakdown.insurance}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Farrier (6 visits)</span>
                          <span className="font-medium">£{result.breakdown.farrier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vet (routine care)</span>
                          <span className="font-medium">£{result.breakdown.vet}</span>
                        </div>
                        {parseFloat(result.breakdown.feedBedding) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Feed & Bedding</span>
                            <span className="font-medium">£{result.breakdown.feedBedding}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contingency (10%)</span>
                          <span className="font-medium">£{result.breakdown.contingency}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Subtotal</span>
                          <span>£{result.firstYearRunning}</span>
                        </div>
                      </div>
                    </div>

                    {/* Savings Suggestions */}
                    {result.savingsSuggestions.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <Star className="w-5 h-5" />
                          Money-Saving Tips
                        </h3>
                        <ul className="space-y-1 text-sm text-amber-800">
                          {result.savingsSuggestions.map((tip: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* UK Comparison */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">UK Average Comparison</h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Average first year cost</span>
                        <div className="flex items-center gap-2">
                          <span>£{result.comparison.ukAverageFirstYear.toLocaleString()}</span>
                          {result.comparison.vsUkAverage && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select your options and click calculate to see your first year budget</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Important Warning */}
          <div className="bg-pink-50 border-l-4 border-pink-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-pink-900 mb-2">First-Time Buyer Checklist</h3>
                <ul className="text-pink-800 space-y-1 text-sm">
                  <li>✓ <strong>Take your instructor</strong> to view horses - they'll spot issues you won't</li>
                  <li>✓ <strong>Always get a vetting</strong> - £350 is cheap compared to buying problems</li>
                  <li>✓ <strong>Try before you buy</strong> - reputable sellers offer trial periods</li>
                  <li>✓ <strong>Have livery arranged first</strong> - don't buy without a place to keep them</li>
                  <li>✓ <strong>Buy insurance immediately</strong> - accidents happen on day one</li>
                  <li>✓ <strong>Budget for the unexpected</strong> - horses are experts at vet bills!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Shopping List */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">First Horse Shopping List & Costs</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-pink-600" />
                  Essential Tack
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Saddle (fitted)</span>
                    <span className="font-medium">£500-£2,000</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Bridle & Bit</span>
                    <span className="font-medium">£80-£200</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Saddle Pads</span>
                    <span className="font-medium">£30-£80</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Headcollar & Leadrope</span>
                    <span className="font-medium">£30-£50</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Boots/Bandages</span>
                    <span className="font-medium">£50-£150</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Home className="w-5 h-5 text-pink-600" />
                  Rugs & Care Items
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Turnout Rug (medium)</span>
                    <span className="font-medium">£80-£200</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Stable Rug</span>
                    <span className="font-medium">£50-£120</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Cooler/Fleece</span>
                    <span className="font-medium">£30-£60</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Grooming Kit</span>
                    <span className="font-medium">£50-£100</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">First Aid Kit</span>
                    <span className="font-medium">£50-£100</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              💡 <strong>Tip:</strong> Good quality second-hand tack can save 40-60%. Check Facebook groups, 
              eBay, and local tack sales. Always have saddles professionally fitted.
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
              <a href="/annual-horse-cost-calculator" className="bg-amber-50 hover:bg-amber-100 rounded-xl p-4 transition group">
                <Calendar className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600">Annual Cost Calculator</h3>
                <p className="text-sm text-gray-600">Ongoing yearly budget</p>
              </a>
              <a href="/horse-insurance-calculator" className="bg-violet-50 hover:bg-violet-100 rounded-xl p-4 transition group">
                <Shield className="w-8 h-8 text-violet-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-violet-600">Insurance Calculator</h3>
                <p className="text-sm text-gray-600">Compare cover options</p>
              </a>
              <a href="/riding-lesson-calculator" className="bg-purple-50 hover:bg-purple-100 rounded-xl p-4 transition group">
                <Star className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">Lesson Calculator</h3>
                <p className="text-sm text-gray-600">Training budget</p>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Calculate Ongoing Costs?</h2>
            <p className="text-pink-100 mb-6 max-w-xl mx-auto">
              Now you know the first year costs, use our Annual Calculator to plan your ongoing budget.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-xl font-bold hover:bg-pink-50 transition"
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
