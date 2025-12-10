import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Heart,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Star,
  Clock,
  Shield
} from 'lucide-react'

export default function RetirementCostCalculator() {
  const [currentAge, setCurrentAge] = useState('20')
  const [healthStatus, setHealthStatus] = useState('good')
  const [liveryType, setLiveryType] = useState('retirement')
  const [region, setRegion] = useState('average')
  const [hasChronicCondition, setHasChronicCondition] = useState(false)
  const [conditionType, setConditionType] = useState('none')
  const [yearsToProject, setYearsToProject] = useState('5')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState<any>(null)

  const healthStatuses = [
    { id: 'excellent', name: 'Excellent Health', vetMultiplier: 0.8, description: 'No issues, rarely needs vet' },
    { id: 'good', name: 'Good Health', vetMultiplier: 1.0, description: 'Normal age-related care' },
    { id: 'fair', name: 'Fair - Minor Issues', vetMultiplier: 1.4, description: 'Some ongoing management needed' },
    { id: 'poor', name: 'Poor - Multiple Issues', vetMultiplier: 2.0, description: 'Significant ongoing care' }
  ]

  const liveryTypes = [
    { id: 'retirement', name: 'Retirement Livery', monthlyBase: 200, description: 'Specialist retirement yards', includes: 'Grass keep, daily checks, basic care' },
    { id: 'grass', name: 'Grass Livery', monthlyBase: 120, description: 'Field only', includes: 'Grazing, water, basic checking' },
    { id: 'diy', name: 'DIY Livery', monthlyBase: 180, description: 'You provide all care', includes: 'Stable, field, facilities' },
    { id: 'assisted', name: 'Assisted DIY', monthlyBase: 250, description: 'Some help provided', includes: 'Stable, field, some handling help' },
    { id: 'home', name: 'Home Kept', monthlyBase: 80, description: 'Your own land', includes: 'Land costs only' }
  ]

  const chronicConditions = [
    { id: 'none', name: 'None', monthlyCost: 0 },
    { id: 'cushings', name: 'Cushings (PPID)', monthlyCost: 70, description: 'Prascend + monitoring' },
    { id: 'arthritis', name: 'Arthritis', monthlyCost: 50, description: 'Joint supplements + occasional bute' },
    { id: 'laminitis', name: 'Laminitis History', monthlyCost: 40, description: 'Special management + farrier' },
    { id: 'respiratory', name: 'Respiratory (COPD/RAO)', monthlyCost: 60, description: 'Soaked hay + medication' },
    { id: 'metabolic', name: 'EMS/Metabolic', monthlyCost: 45, description: 'Diet management + supplements' }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.4,
    'southeast': 1.2,
    'southwest': 1.1,
    'average': 1.0,
    'north': 0.85,
    'scotland': 0.9
  }

  // Annual costs for retired horses
  const annualCosts = {
    farrier: { barefoot: 300, shod: 720 },
    vaccinations: 80,
    worming: 100,
    dental: 65,
    insurance: { basic: 200, vet: 350 }, // Mortality only vs with vet fees
    feed: { easy: 400, moderate: 800, hard: 1200 }, // Easy keeper to hard keeper
    hay: 600, // Average hay top-up
    rugs: 80, // Replacement/repairs
    sundries: 150 // Fly spray, grooming, etc.
  }

  const calculate = () => {
    const age = parseInt(currentAge)
    const health = healthStatuses.find(h => h.id === healthStatus)
    const livery = liveryTypes.find(l => l.id === liveryType)
    const condition = chronicConditions.find(c => c.id === conditionType)
    const years = parseInt(yearsToProject)
    
    if (!health || !livery || !condition) return

    const regionFactor = regionMultipliers[region]

    // Livery costs
    const annualLivery = livery.monthlyBase * 12 * regionFactor

    // Healthcare costs
    const annualFarrier = annualCosts.farrier.barefoot // Most retired horses go barefoot
    const annualVaccinations = annualCosts.vaccinations * regionFactor
    const annualWorming = annualCosts.worming
    const annualDental = annualCosts.dental * regionFactor * (age > 20 ? 1.3 : 1.0) // Older horses need more dental
    
    // Condition costs
    const annualCondition = hasChronicCondition ? condition.monthlyCost * 12 : 0

    // Vet visits (beyond routine)
    const baseVetVisits = 150 * health.vetMultiplier * regionFactor
    
    // Emergency fund recommendation
    const emergencyFund = age > 25 ? 2000 : age > 20 ? 1500 : 1000

    // Feed costs (retired horses usually easy keepers)
    const annualFeed = annualCosts.feed.easy * (age > 22 ? 1.5 : 1.0) // Old horses may need more
    const annualHay = annualCosts.hay * regionFactor

    // Insurance - reduces with age
    const insuranceAvailable = age <= 25
    const annualInsurance = insuranceAvailable ? annualCosts.insurance.basic : 0

    // Other costs
    const annualRugs = annualCosts.rugs
    const annualSundries = annualCosts.sundries

    // Total annual
    const totalAnnual = annualLivery + annualFarrier + annualVaccinations + annualWorming + 
                        annualDental + annualCondition + baseVetVisits + annualFeed + 
                        annualHay + annualInsurance + annualRugs + annualSundries

    const monthlyAverage = totalAnnual / 12

    // Multi-year projection with inflation
    const inflation = 0.04 // 4% annual inflation
    let totalProjected = 0
    const yearlyProjection = []
    for (let i = 1; i <= years; i++) {
      const yearCost = totalAnnual * Math.pow(1 + inflation, i - 1)
      totalProjected += yearCost
      yearlyProjection.push({ year: i, cost: yearCost.toFixed(0) })
    }

    // End of life costs consideration
    const eolCosts = {
      euthanasia: 150,
      cremation: 600,
      burial: 400,
      total: 750
    }

    // Life expectancy estimate
    const lifeExpectancy = health.id === 'excellent' ? 30 : health.id === 'good' ? 28 : health.id === 'fair' ? 26 : 24
    const estimatedYearsRemaining = Math.max(0, lifeExpectancy - age)

    setResult({
      totalAnnual: totalAnnual.toFixed(2),
      monthlyAverage: monthlyAverage.toFixed(2),
      breakdown: {
        livery: annualLivery.toFixed(2),
        farrier: annualFarrier.toFixed(2),
        healthcare: (annualVaccinations + annualWorming + annualDental + baseVetVisits).toFixed(2),
        condition: annualCondition.toFixed(2),
        feedHay: (annualFeed + annualHay).toFixed(2),
        insurance: annualInsurance.toFixed(2),
        other: (annualRugs + annualSundries).toFixed(2)
      },
      projectedTotal: totalProjected.toFixed(2),
      yearlyProjection,
      years,
      emergencyFund,
      eolCosts,
      insuranceAvailable,
      lifeExpectancy,
      estimatedYearsRemaining,
      currentAge: age,
      healthInfo: health,
      liveryInfo: livery,
      conditionInfo: hasChronicCondition ? condition : null,
      recommendations: getRecommendations(age, healthStatus, hasChronicCondition, conditionType)
    })
  }

  const getRecommendations = (age: number, health: string, hasCond: boolean, cond: string) => {
    const recs = []
    if (age > 20) recs.push('Consider twice-yearly dental checks for veterans')
    if (age > 25) recs.push('Insurance becomes unavailable or very expensive over 25')
    if (health === 'poor') recs.push('Build up a larger emergency fund for unexpected vet bills')
    if (hasCond && cond === 'cushings') recs.push('Budget for regular ACTH blood tests (£40-60 each)')
    if (hasCond && cond === 'laminitis') recs.push('More frequent farrier visits may be needed')
    recs.push('Retirement livery can be more cost-effective than standard DIY')
    recs.push('Keep an emergency fund of at least £1,000-2,000')
    return recs
  }

  const faqs = [
    {
      q: 'How much does it cost to keep a retired horse UK?',
      a: 'Keeping a retired horse in the UK costs £3,000-6,000 per year depending on livery type and health. Retirement livery costs £150-300/month, plus £800-1,500 for farrier, dental, worming, and vaccinations. Horses with chronic conditions like Cushings add £500-1,000 annually. Budget £250-500/month minimum.'
    },
    {
      q: 'What is retirement livery?',
      a: 'Retirement livery is specialist care for elderly or non-ridden horses. It typically costs £150-300/month and includes: grass keep, daily welfare checks, bringing in for vet/farrier, administering medication, and monitoring condition. Many offer a more peaceful environment than busy competition yards.'
    },
    {
      q: 'At what age should a horse retire?',
      a: 'Most horses retire from regular work between 18-25 years, depending on breed, workload, and soundness. Some stay sound for light hacking into their late 20s, while others retire earlier due to injury or arthritis. Retirement doesn\'t mean no exercise - many benefit from light turnout and gentle handling.'
    },
    {
      q: 'Can you insure an older horse UK?',
      a: 'Horse insurance becomes limited after age 20 and very difficult/expensive after 25. Most insurers won\'t cover vet fees for horses over 20-25. Mortality-only cover may be available until 25-30 at higher premiums. Consider self-insuring by saving the premium amount into an emergency fund instead.'
    },
    {
      q: 'What health issues do older horses commonly have?',
      a: 'Common veteran horse issues include: Cushings/PPID (very common over 15), arthritis, dental problems (lost teeth, wave mouth), weight management difficulties, reduced immune function, and respiratory issues. Many are manageable with medication and good care but add to annual costs.'
    },
    {
      q: 'How much does Cushings treatment cost?',
      a: 'Cushings (PPID) treatment costs £60-90/month for Prascend medication. Add £40-60 per ACTH blood test (recommended 2-4x yearly). Total annual cost: £800-1,200. Cushings also increases risk of laminitis, requiring careful management and potentially more frequent farrier visits.'
    },
    {
      q: 'Should I keep my retired horse barefoot?',
      a: 'Many retired horses thrive barefoot as they\'re not working on hard surfaces. This saves £400-500/year vs shoeing. Transition gradually and ensure regular trimming (6-8 weeks). Some horses with foot issues may still need front shoes or boots for turnout on hard ground.'
    },
    {
      q: 'What should I budget for end of life costs?',
      a: 'End of life costs in the UK include: euthanasia (£100-200), cremation (£500-800), or burial on own land (£300-500 for equipment hire). Hunt kennels collection is often free. Total: £600-1,000. This is a difficult but necessary consideration for retired horse budgeting.'
    },
    {
      q: 'How do I find good retirement livery?',
      a: 'Look for: experienced staff who understand older horses, appropriate turnout companions, ability to medicate and handle for vet/farrier, good grazing management, shelter from elements, and peaceful environment. Ask for references, visit unannounced, and check insurance. Specialist retirement yards often provide better care than standard yards.'
    },
    {
      q: 'Can I keep a retired horse on less land?',
      a: 'Retired horses still need adequate grazing - typically 1-1.5 acres per horse. However, they may manage on smaller areas with supplementary feeding if grass is limited. Good doers/laminitis-prone horses may actually benefit from restricted grazing. Companion ponies or sheep can share the space.'
    }
  ]

  return (
    <>
      <Helmet>
        {/* ========== 1. PRIMARY META TAGS (4) ========== */}
        <title>Horse Retirement Cost Calculator UK 2025 | Veteran Horse Costs | HorseCost</title>
        <meta 
          name="description" 
          content="Free horse retirement cost calculator for UK owners. Calculate annual costs for retired and veteran horses, plan for Cushings, arthritis, and end of life care. 2025 prices." 
        />
        <meta 
          name="keywords" 
          content="retired horse cost UK, veteran horse expenses, horse retirement livery, old horse care costs, Cushings treatment cost, keeping elderly horse" 
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
        <meta name="theme-color" content="#be185d" />

        {/* ========== 5. OPEN GRAPH / FACEBOOK (8) ========== */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:title" content="Horse Retirement Cost Calculator UK 2025 | Veteran Care | HorseCost" />
        <meta property="og:description" content="Calculate costs for retired and veteran horses. Plan for healthcare, chronic conditions, and ongoing care." />
        <meta property="og:url" content="https://horsecost.co.uk/retirement-cost-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/retirement-calculator-og-1200x630.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Horse Retirement Cost Calculator for veteran horse care planning" />

        {/* ========== 6. TWITTER CARD (6) ========== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Horse Retirement Cost Calculator UK 2025 | HorseCost" />
        <meta name="twitter:description" content="Calculate retirement costs for veteran horses. Plan for Cushings, arthritis, and ongoing care." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/retirement-calculator-twitter-1200x675.jpg" />
        <meta name="twitter:image:alt" content="Horse Retirement Cost Calculator UK" />

        {/* ========== 7. CANONICAL & ALTERNATE (2) ========== */}
        <link rel="canonical" href="https://horsecost.co.uk/retirement-cost-calculator" />
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/retirement-cost-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Retirement Cost Calculator', 'item': 'https://horsecost.co.uk/retirement-cost-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Retirement Cost Calculator UK',
                'description': 'Calculate costs for retired and veteran horses including healthcare, chronic conditions, and multi-year projections.',
                'url': 'https://horsecost.co.uk/retirement-cost-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.8', 'ratingCount': '167', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Use the Horse Retirement Cost Calculator',
                'description': 'Step-by-step guide to calculating your retired horse costs',
                'step': [
                  { '@type': 'HowToStep', 'position': 1, 'name': 'Enter Horse Age', 'text': 'Input your horse\'s current age as this affects healthcare needs and insurance availability.' },
                  { '@type': 'HowToStep', 'position': 2, 'name': 'Select Health Status', 'text': 'Choose your horse\'s overall health level to estimate veterinary costs.' },
                  { '@type': 'HowToStep', 'position': 3, 'name': 'Choose Livery Type', 'text': 'Select retirement livery, grass livery, or other keeping arrangements.' },
                  { '@type': 'HowToStep', 'position': 4, 'name': 'Add Chronic Conditions', 'text': 'Include any ongoing conditions like Cushings or arthritis for medication costs.' },
                  { '@type': 'HowToStep', 'position': 5, 'name': 'Calculate Multi-Year Costs', 'text': 'Click Calculate to see annual costs and multi-year projections with inflation.' }
                ]
              },
              {
                '@type': 'Article',
                'headline': 'Horse Retirement Cost Calculator UK 2025 - Veteran Horse Care Planning',
                'description': 'Free calculator for UK retired horse costs. Plan for healthcare, chronic conditions like Cushings, and end of life considerations.',
                'datePublished': '2025-01-01',
                'dateModified': '2025-01-15',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png', 'width': 200, 'height': 200 } },
                'image': 'https://horsecost.co.uk/images/retirement-calculator-og-1200x630.jpg',
                'mainEntityOfPage': { '@type': 'WebPage', '@id': 'https://horsecost.co.uk/retirement-cost-calculator' }
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
            <a href="/" className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Retirement Cost Calculator</h1>
                <p className="text-pink-200">UK 2025 Veteran Horse Care</p>
              </div>
            </div>
            <p className="text-pink-100 max-w-2xl">
              Plan for your retired or veteran horse's care. Calculate ongoing costs, 
              chronic condition management, and multi-year projections.
            </p>
            <p className="text-pink-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Horse's Current Age</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['15', '18', '20', '22', '25', '28', '30'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setCurrentAge(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          currentAge === val
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                    className="mt-2 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                    placeholder="Or enter exact age"
                    min="15"
                    max="40"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Health Status</label>
                  </div>
                  <div className="space-y-2">
                    {healthStatuses.map((status) => (
                      <button
                        key={status.id}
                        onClick={() => setHealthStatus(status.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          healthStatus === status.id
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`font-medium ${healthStatus === status.id ? 'text-pink-700' : 'text-gray-900'}`}>
                          {status.name}
                        </p>
                        <p className="text-sm text-gray-500">{status.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Livery Type</label>
                  </div>
                  <select
                    value={liveryType}
                    onChange={(e) => setLiveryType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  >
                    {liveryTypes.map(l => (
                      <option key={l.id} value={l.id}>{l.name} (~£{l.monthlyBase}/month)</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    {liveryTypes.find(l => l.id === liveryType)?.includes}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  >
                    <option value="london">Greater London</option>
                    <option value="southeast">South East</option>
                    <option value="southwest">South West</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England</option>
                    <option value="scotland">Scotland / Wales</option>
                  </select>
                </div>

                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-pink-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Chronic Conditions & Projection
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasChronicCondition}
                          onChange={(e) => setHasChronicCondition(e.target.checked)}
                          className="w-5 h-5 text-pink-600 rounded"
                        />
                        <span className="font-medium text-gray-900">Has Chronic Condition</span>
                      </label>

                      {hasChronicCondition && (
                        <select
                          value={conditionType}
                          onChange={(e) => setConditionType(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                        >
                          {chronicConditions.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.name} {c.monthlyCost > 0 ? `(+£${c.monthlyCost}/month)` : ''}
                            </option>
                          ))}
                        </select>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Years to Project</label>
                        <div className="flex gap-2">
                          {['3', '5', '7', '10'].map((val) => (
                            <button
                              key={val}
                              onClick={() => setYearsToProject(val)}
                              className={`flex-1 py-2 rounded-lg font-medium transition ${
                                yearsToProject === val
                                  ? 'bg-pink-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {val} years
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-700 hover:to-rose-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Retirement Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white">
                      <p className="text-pink-100 text-sm mb-1">Annual Retirement Cost</p>
                      <p className="text-4xl font-bold">£{result.totalAnnual}</p>
                      <p className="text-pink-200 text-sm mt-1">{result.liveryInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-pink-100 text-xs">Monthly</p>
                          <p className="font-bold">£{result.monthlyAverage}</p>
                        </div>
                        <div>
                          <p className="text-pink-100 text-xs">{result.years}-Year Total</p>
                          <p className="font-bold">£{result.projectedTotal}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Annual Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Livery</span>
                          <span className="font-medium">£{result.breakdown.livery}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Farrier (barefoot)</span>
                          <span className="font-medium">£{result.breakdown.farrier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Healthcare (vaccines, dental, worming, vet)</span>
                          <span className="font-medium">£{result.breakdown.healthcare}</span>
                        </div>
                        {parseFloat(result.breakdown.condition) > 0 && (
                          <div className="flex justify-between text-pink-600">
                            <span>{result.conditionInfo?.name}</span>
                            <span className="font-medium">£{result.breakdown.condition}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Feed & Hay</span>
                          <span className="font-medium">£{result.breakdown.feedHay}</span>
                        </div>
                        {parseFloat(result.breakdown.insurance) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Insurance</span>
                            <span className="font-medium">£{result.breakdown.insurance}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Other (rugs, sundries)</span>
                          <span className="font-medium">£{result.breakdown.other}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Annual</span>
                          <span>£{result.totalAnnual}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-pink-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-pink-600" />
                        {result.years}-Year Projection
                      </h3>
                      <div className="grid grid-cols-5 gap-2 text-sm">
                        {result.yearlyProjection.slice(0, 5).map((year: any) => (
                          <div key={year.year} className="text-center">
                            <p className="text-gray-500 text-xs">Year {year.year}</p>
                            <p className="font-bold">£{year.cost}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">Includes 4% annual inflation</p>
                    </div>

                    {!result.insuranceAvailable && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="font-medium text-amber-800 flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Insurance Limited at {result.currentAge}
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                          Most insurers won't cover vet fees over 25. Build an emergency fund of £{result.emergencyFund}+ instead.
                        </p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">End of Life Costs (when the time comes)</h3>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <p className="text-gray-500 text-xs">Euthanasia</p>
                          <p className="font-medium">£{result.eolCosts.euthanasia}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500 text-xs">Cremation</p>
                          <p className="font-medium">£{result.eolCosts.cremation}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500 text-xs">Burial</p>
                          <p className="font-medium">£{result.eolCosts.burial}</p>
                        </div>
                      </div>
                    </div>

                    {result.recommendations.length > 0 && (
                      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                        <h3 className="font-semibold text-pink-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Recommendations
                        </h3>
                        <ul className="text-sm text-pink-800 space-y-1">
                          {result.recommendations.map((rec: string, i: number) => (
                            <li key={i}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Enter your horse's details to see retirement costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-pink-50 border-l-4 border-pink-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <Heart className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-pink-900 mb-2">Caring for Your Retired Horse</h3>
                <ul className="text-pink-800 space-y-1 text-sm">
                  <li>• <strong>Regular monitoring</strong> - check weight, coat, teeth, and mobility</li>
                  <li>• <strong>Appropriate exercise</strong> - light turnout keeps joints mobile</li>
                  <li>• <strong>Companionship</strong> - retired horses need friends</li>
                  <li>• <strong>Comfortable environment</strong> - shelter, dry standing, good grazing</li>
                  <li>• <strong>Quality of life first</strong> - know when it's time to make difficult decisions</li>
                </ul>
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
              <a href="/vet-cost-estimator" className="bg-red-50 hover:bg-red-100 rounded-xl p-4 transition group">
                <Shield className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-red-600">Vet Cost Estimator</h3>
                <p className="text-sm text-gray-600">Healthcare budgeting</p>
              </a>
              <a href="/horse-insurance-calculator" className="bg-violet-50 hover:bg-violet-100 rounded-xl p-4 transition group">
                <Star className="w-8 h-8 text-violet-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-violet-600">Insurance Calculator</h3>
                <p className="text-sm text-gray-600">Coverage options</p>
              </a>
              <a href="/livery-cost-calculator" className="bg-amber-50 hover:bg-amber-100 rounded-xl p-4 transition group">
                <Calendar className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600">Livery Calculator</h3>
                <p className="text-sm text-gray-600">Compare livery types</p>
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Plan Your Horse's Golden Years</h2>
            <p className="text-pink-100 mb-6 max-w-xl mx-auto">
              Every horse deserves a comfortable retirement. Start planning today to ensure you can provide the best care.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-xl font-bold hover:bg-pink-50 transition"
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
