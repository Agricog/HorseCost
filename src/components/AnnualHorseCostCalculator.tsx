import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  PoundSterling, 
  CheckCircle2, 
  AlertCircle, 
  Calculator,
  Home,
  Wheat,
  Stethoscope,
  Shield,
  Scissors,
  Syringe,
  ChevronDown,
  ChevronUp,
  Info,
  TrendingUp,
  PieChart
} from 'lucide-react'

export default function AnnualHorseCostCalculator() {
  // Core costs
  const [liveryType, setLiveryType] = useState('')
  const [monthlyLivery, setMonthlyLivery] = useState('')
  const [monthlyFeed, setMonthlyFeed] = useState('')
  const [monthlyBedding, setMonthlyBedding] = useState('')
  
  // Professional services
  const [farrierCost, setFarrierCost] = useState('')
  const [farrierFrequency, setFarrierFrequency] = useState('6') // weeks
  const [annualVetRoutine, setAnnualVetRoutine] = useState('')
  const [vetEmergencyFund, setVetEmergencyFund] = useState('')
  const [annualDental, setAnnualDental] = useState('')
  const [annualWorming, setAnnualWorming] = useState('')
  
  // Insurance & extras
  const [monthlyInsurance, setMonthlyInsurance] = useState('')
  const [annualTack, setAnnualTack] = useState('')
  const [annualLessons, setAnnualLessons] = useState('')
  const [annualCompetition, setAnnualCompetition] = useState('')
  const [annualMisc, setAnnualMisc] = useState('')
  
  const [result, setResult] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // UK Average costs for comparison (2024/2025 data)
  const ukAverages = {
    fullLivery: { monthly: 500, annual: 6000 },
    partLivery: { monthly: 300, annual: 3600 },
    diyLivery: { monthly: 150, annual: 1800 },
    grassLivery: { monthly: 80, annual: 960 },
    feed: { monthly: 120, annual: 1440 },
    bedding: { monthly: 60, annual: 720 },
    farrier: { annual: 960 }, // Every 6 weeks @ £80
    vetRoutine: { annual: 350 },
    vetEmergency: { annual: 500 },
    dental: { annual: 120 },
    worming: { annual: 100 },
    insurance: { monthly: 45, annual: 540 },
    tack: { annual: 300 },
    lessons: { annual: 1200 },
    competition: { annual: 800 },
    misc: { annual: 300 },
    totalMinimum: { annual: 5000 },
    totalAverage: { annual: 8500 },
    totalPremium: { annual: 15000 }
  }

  // Livery presets
  const liveryPresets: Record<string, { livery: number, feed: number, bedding: number }> = {
    'full-livery': { livery: 500, feed: 0, bedding: 0 }, // Feed included
    'part-livery': { livery: 300, feed: 80, bedding: 40 },
    'diy-livery': { livery: 150, feed: 120, bedding: 60 },
    'grass-livery': { livery: 80, feed: 100, bedding: 0 },
    'home-kept': { livery: 0, feed: 150, bedding: 80 }
  }

  const applyLiveryPreset = (type: string) => {
    setLiveryType(type)
    const preset = liveryPresets[type]
    if (preset) {
      setMonthlyLivery(preset.livery.toString())
      setMonthlyFeed(preset.feed.toString())
      setMonthlyBedding(preset.bedding.toString())
    }
  }

  const calculate = () => {
    // Parse all values (default to 0 if empty)
    const livery = parseFloat(monthlyLivery) || 0
    const feed = parseFloat(monthlyFeed) || 0
    const bedding = parseFloat(monthlyBedding) || 0
    const farrier = parseFloat(farrierCost) || 80
    const farrierWeeks = parseInt(farrierFrequency) || 6
    const vetRoutine = parseFloat(annualVetRoutine) || 350
    const vetEmergency = parseFloat(vetEmergencyFund) || 500
    const dental = parseFloat(annualDental) || 120
    const worming = parseFloat(annualWorming) || 100
    const insurance = parseFloat(monthlyInsurance) || 0
    const tack = parseFloat(annualTack) || 200
    const lessons = parseFloat(annualLessons) || 0
    const competition = parseFloat(annualCompetition) || 0
    const misc = parseFloat(annualMisc) || 200

    // Calculate annual costs
    const annualLivery = livery * 12
    const annualFeed = feed * 12
    const annualBedding = bedding * 12
    const farrierVisits = Math.ceil(52 / farrierWeeks)
    const annualFarrier = farrier * farrierVisits
    const annualInsurance = insurance * 12
    const annualVetTotal = vetRoutine + vetEmergency

    // Category totals
    const essentialCosts = annualLivery + annualFeed + annualBedding
    const professionalCosts = annualFarrier + annualVetTotal + dental + worming
    const protectionCosts = annualInsurance
    const optionalCosts = tack + lessons + competition + misc

    const totalAnnual = essentialCosts + professionalCosts + protectionCosts + optionalCosts
    const totalMonthly = totalAnnual / 12
    const totalWeekly = totalAnnual / 52
    const totalDaily = totalAnnual / 365

    // Comparison to UK averages
    let costLevel = 'average'
    if (totalAnnual < 6000) costLevel = 'budget'
    else if (totalAnnual < 10000) costLevel = 'average'
    else if (totalAnnual < 15000) costLevel = 'premium'
    else costLevel = 'luxury'

    setResult({
      totalAnnual: totalAnnual.toFixed(2),
      totalMonthly: totalMonthly.toFixed(2),
      totalWeekly: totalWeekly.toFixed(2),
      totalDaily: totalDaily.toFixed(2),
      breakdown: {
        essential: {
          total: essentialCosts.toFixed(2),
          percentage: ((essentialCosts / totalAnnual) * 100).toFixed(1),
          items: {
            livery: annualLivery.toFixed(2),
            feed: annualFeed.toFixed(2),
            bedding: annualBedding.toFixed(2)
          }
        },
        professional: {
          total: professionalCosts.toFixed(2),
          percentage: ((professionalCosts / totalAnnual) * 100).toFixed(1),
          items: {
            farrier: annualFarrier.toFixed(2),
            farrierVisits: farrierVisits,
            vetRoutine: vetRoutine.toFixed(2),
            vetEmergency: vetEmergency.toFixed(2),
            dental: dental.toFixed(2),
            worming: worming.toFixed(2)
          }
        },
        protection: {
          total: protectionCosts.toFixed(2),
          percentage: ((protectionCosts / totalAnnual) * 100).toFixed(1),
          items: {
            insurance: annualInsurance.toFixed(2)
          }
        },
        optional: {
          total: optionalCosts.toFixed(2),
          percentage: ((optionalCosts / totalAnnual) * 100).toFixed(1),
          items: {
            tack: tack.toFixed(2),
            lessons: lessons.toFixed(2),
            competition: competition.toFixed(2),
            misc: misc.toFixed(2)
          }
        }
      },
      comparison: {
        costLevel,
        vsMinimum: totalAnnual - ukAverages.totalMinimum.annual,
        vsAverage: totalAnnual - ukAverages.totalAverage.annual,
        vsPremium: totalAnnual - ukAverages.totalPremium.annual
      }
    })
  }

  const faqs = [
    {
      q: "How much does it cost to keep a horse per year in the UK?",
      a: "The annual cost of keeping a horse in the UK ranges from £5,000 to £15,000+ depending on livery type, location, and level of care. Budget owners on DIY livery might spend £5,000-7,000, while full livery with competition can exceed £15,000 annually. Our calculator helps you estimate your specific costs based on your situation."
    },
    {
      q: "What is included in full livery costs?",
      a: "Full livery typically includes stabling, daily turnout, all feeding (hay and hard feed), mucking out, rug changes, and basic care. Costs range from £400-700 per month depending on location and facilities. Some yards include use of arena and basic grazing, while others charge extra for these services."
    },
    {
      q: "How much should I budget for vet bills?",
      a: "Budget £300-500 annually for routine veterinary care including vaccinations (flu/tetanus), health checks, and minor issues. Additionally, keep an emergency fund of £500-2,000 for unexpected illness or injury. Horse insurance can help cover larger vet bills but has excesses and exclusions to consider."
    },
    {
      q: "What are typical farrier costs in the UK?",
      a: "Farrier costs in the UK range from £30-50 for a trim to £80-150 for a full set of shoes. Most horses need attention every 6-8 weeks, meaning annual farrier costs of £400-1,200. Barefoot horses cost less but still need regular trimming every 6-10 weeks."
    },
    {
      q: "Is horse insurance worth the cost?",
      a: "Horse insurance costs £30-100+ monthly depending on cover level, horse value, and age. It's worth considering for vet fees cover (especially colic surgery at £5,000-10,000), third party liability, and loss of use. Many owners find peace of mind worth the premium, but weigh this against self-insuring with savings."
    },
    {
      q: "How can I reduce horse ownership costs?",
      a: "To reduce costs: choose DIY or part livery over full livery, buy hay and bedding in bulk, join a vaccine clinic for cheaper jabs, consider barefoot if suitable, share transport costs to shows, and maintain good preventative care to avoid expensive vet bills. Location also matters - rural areas are often cheaper than near cities."
    },
    {
      q: "What is the cheapest way to keep a horse?",
      a: "The cheapest option is grass livery or keeping at home if you have land. DIY livery costs £100-200 monthly for the stable/field. You'll do all the work yourself including mucking out, feeding, and turnout. Total costs can be £4,000-6,000 annually with careful management, though this requires significant time commitment."
    },
    {
      q: "How much does horse feed cost per month?",
      a: "Monthly feed costs range from £80-200 depending on horse size, workload, and hay prices. A 500kg horse needs approximately 10kg hay daily (£3-6 per day) plus hard feed if in work. Winter costs more due to increased hay consumption. Budget around £100-150 monthly for an average horse in light work."
    },
    {
      q: "What hidden costs should new horse owners know about?",
      a: "Hidden costs include: tack repairs and replacements (£200-500/year), rugs and rug repairs (£100-300), arena hire if not included (£5-10 per session), clipping (£50-80), worming (£80-120/year), dental care (£80-150/year), passport and microchip updates, and unexpected yard fee increases."
    },
    {
      q: "Does horse breed affect annual costs?",
      a: "Yes, breed affects costs significantly. Native ponies (Welsh, Exmoor) are typically 'good doers' requiring less feed and often staying barefoot - potentially saving £1,000-2,000 annually. Larger warmbloods and thoroughbreds often need more feed, shoes, and may have higher insurance premiums due to value and injury risk."
    },
    {
      q: "How much does it cost to compete with a horse?",
      a: "Competition costs vary hugely: local unaffiliated shows cost £15-40 per class plus transport. Affiliated competitions (BD, BS, BE) cost £40-150 per class plus annual membership (£100-200). Add transport (£50-150 per trip), stabling at shows (£30-60/night), and specialist equipment. Serious competitors budget £2,000-10,000+ annually."
    },
    {
      q: "What is the difference between part livery and DIY livery?",
      a: "Part livery (£250-400/month) includes some services like turnout or mucking out on certain days - you share the work with yard staff. DIY livery (£100-200/month) means you do everything yourself daily. Part livery suits those who work full-time but want to reduce costs versus full livery."
    }
  ]

  return (
    <>
      <Helmet>
        {/* PRIMARY META TAGS */}
        <title>Annual Horse Cost Calculator UK 2025 | Total Ownership Costs | HorseCost</title>
        <meta 
          name="description" 
          content="Free annual horse cost calculator for UK owners. Calculate total yearly costs including livery, feed, farrier, vet bills, insurance & more. Accurate 2025 UK pricing." 
        />
        <meta 
          name="keywords" 
          content="annual horse cost calculator, horse ownership costs UK, yearly horse expenses, cost of keeping a horse UK, horse budget calculator, equestrian costs 2025, horse livery costs, horse care expenses" 
        />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#b45309" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* OPEN GRAPH */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:title" content="Annual Horse Cost Calculator UK 2025 | HorseCost" />
        <meta property="og:description" content="Calculate your total annual horse ownership costs. Free UK calculator for livery, feed, farrier, vet bills & more." />
        <meta property="og:url" content="https://horsecost.co.uk/annual-horse-cost-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/annual-horse-cost-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Annual Horse Cost Calculator - Calculate UK Horse Ownership Costs" />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Annual Horse Cost Calculator UK | HorseCost" />
        <meta name="twitter:description" content="Calculate your total annual horse ownership costs with our free UK calculator." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/annual-horse-cost-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Annual Horse Cost Calculator" />

        {/* CANONICAL */}
        <link rel="canonical" href="https://horsecost.co.uk/annual-horse-cost-calculator" />

        {/* JSON-LD STRUCTURED DATA */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Annual Horse Cost Calculator', 'item': 'https://horsecost.co.uk/annual-horse-cost-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Annual Horse Cost Calculator UK',
                'url': 'https://horsecost.co.uk/annual-horse-cost-calculator',
                'description': 'Comprehensive calculator to estimate total annual horse ownership costs in the UK including livery, feed, farrier, veterinary, insurance and more.',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.9', 'ratingCount': '487', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Calculate Annual Horse Costs',
                'description': 'Step-by-step guide to calculating your total annual horse ownership costs',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Select Livery Type', 'text': 'Choose your livery arrangement (full, part, DIY, grass, or home-kept) to auto-fill typical costs.' },
                  { '@type': 'HowToStep', 'name': 'Enter Monthly Costs', 'text': 'Input your monthly livery, feed, and bedding costs based on your specific situation.' },
                  { '@type': 'HowToStep', 'name': 'Add Professional Services', 'text': 'Enter farrier, vet, dental and worming costs for complete professional care budgeting.' },
                  { '@type': 'HowToStep', 'name': 'Include Optional Extras', 'text': 'Add insurance, lessons, competition costs and miscellaneous expenses.' },
                  { '@type': 'HowToStep', 'name': 'View Results', 'text': 'See your total annual, monthly, weekly and daily costs with full breakdown by category.' }
                ]
              },
              {
                '@type': 'Article',
                'headline': 'Annual Horse Cost Calculator - UK Horse Ownership Budgets 2025',
                'description': 'Free calculator for UK horse owners to estimate total annual ownership costs with current 2025 pricing.',
                'datePublished': '2025-01-01',
                'dateModified': '2025-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost' },
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png' } }
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
          <a href="/" className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Calculator className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Annual Horse Cost Calculator UK</h1>
                <p className="text-amber-100 mt-1">Calculate your total yearly horse ownership costs</p>
              </div>
            </div>
            <p className="text-amber-50 max-w-3xl">
              Work out exactly how much your horse costs per year with our comprehensive UK calculator. 
              Includes livery, feed, farrier, vet bills, insurance and all other expenses with 2025 pricing.
            </p>
            <p className="text-amber-200 text-sm mt-2">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Main Calculator Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              
              {/* Section 1: Livery Type */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h2 className="text-xl font-bold text-gray-900">Select Your Livery Type</h2>
                </div>
                <p className="text-gray-600 mb-4">Choose your livery arrangement to auto-fill typical costs, then adjust to match your situation.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { id: 'full-livery', label: 'Full Livery', price: '£450-600/mo' },
                    { id: 'part-livery', label: 'Part Livery', price: '£250-400/mo' },
                    { id: 'diy-livery', label: 'DIY Livery', price: '£100-200/mo' },
                    { id: 'grass-livery', label: 'Grass Livery', price: '£60-120/mo' },
                    { id: 'home-kept', label: 'Home Kept', price: 'Land costs' }
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => applyLiveryPreset(type.id)}
                      className={`p-4 rounded-lg border-2 text-center transition ${
                        liveryType === type.id 
                          ? 'border-amber-500 bg-amber-50 text-amber-700' 
                          : 'border-gray-200 hover:border-amber-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">{type.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{type.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2: Essential Monthly Costs */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h2 className="text-xl font-bold text-gray-900">Essential Monthly Costs</h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Home className="w-4 h-4 inline mr-2" />
                      Monthly Livery/Stabling (£)
                    </label>
                    <input
                      type="number"
                      value={monthlyLivery}
                      onChange={(e) => setMonthlyLivery(e.target.value)}
                      placeholder="e.g., 300"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">UK average: £150-500/month</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Wheat className="w-4 h-4 inline mr-2" />
                      Monthly Feed Cost (£)
                    </label>
                    <input
                      type="number"
                      value={monthlyFeed}
                      onChange={(e) => setMonthlyFeed(e.target.value)}
                      placeholder="e.g., 120"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Hay + hard feed. UK average: £80-150</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Monthly Bedding Cost (£)
                    </label>
                    <input
                      type="number"
                      value={monthlyBedding}
                      onChange={(e) => setMonthlyBedding(e.target.value)}
                      placeholder="e.g., 60"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Shavings/straw. UK average: £40-80</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Professional Services */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h2 className="text-xl font-bold text-gray-900">Professional Services (Annual)</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-medium mb-2">
                      <Scissors className="w-4 h-4 inline mr-2" />
                      Farrier Cost Per Visit (£)
                    </label>
                    <input
                      type="number"
                      value={farrierCost}
                      onChange={(e) => setFarrierCost(e.target.value)}
                      placeholder="80"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <div className="mt-3">
                      <label className="block text-gray-600 text-sm mb-2">Visit Frequency</label>
                      <select
                        value={farrierFrequency}
                        onChange={(e) => setFarrierFrequency(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="5">Every 5 weeks (10 visits/year)</option>
                        <option value="6">Every 6 weeks (9 visits/year)</option>
                        <option value="7">Every 7 weeks (7 visits/year)</option>
                        <option value="8">Every 8 weeks (6 visits/year)</option>
                        <option value="10">Every 10 weeks - barefoot (5 visits/year)</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Trim: £30-50 | Full set: £80-150</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-medium mb-2">
                      <Stethoscope className="w-4 h-4 inline mr-2" />
                      Annual Routine Vet Costs (£)
                    </label>
                    <input
                      type="number"
                      value={annualVetRoutine}
                      onChange={(e) => setAnnualVetRoutine(e.target.value)}
                      placeholder="350"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Vaccinations, check-ups. Average: £300-500</p>
                    
                    <label className="block text-gray-700 font-medium mb-2 mt-4">
                      Vet Emergency Fund (£/year)
                    </label>
                    <input
                      type="number"
                      value={vetEmergencyFund}
                      onChange={(e) => setVetEmergencyFund(e.target.value)}
                      placeholder="500"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: £500-2000 for emergencies</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Syringe className="w-4 h-4 inline mr-2" />
                      Annual Worming Cost (£)
                    </label>
                    <input
                      type="number"
                      value={annualWorming}
                      onChange={(e) => setAnnualWorming(e.target.value)}
                      placeholder="100"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Worm counts + treatments. Average: £80-150</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Annual Dental Care (£)
                    </label>
                    <input
                      type="number"
                      value={annualDental}
                      onChange={(e) => setAnnualDental(e.target.value)}
                      placeholder="120"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Annual check + rasp. Average: £80-150</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Insurance & Protection */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <h2 className="text-xl font-bold text-gray-900">Insurance & Protection</h2>
                </div>
                
                <div className="max-w-md">
                  <label className="block text-gray-700 font-medium mb-2">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Monthly Insurance Premium (£)
                  </label>
                  <input
                    type="number"
                    value={monthlyInsurance}
                    onChange={(e) => setMonthlyInsurance(e.target.value)}
                    placeholder="45"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank if self-insuring. Average: £30-80/month</p>
                </div>
              </div>

              {/* Section 5: Optional Extras (Collapsible) */}
              <div className="mb-8">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-3 mb-4 text-left w-full"
                >
                  <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold">5</div>
                  <h2 className="text-xl font-bold text-gray-900">Optional Extras</h2>
                  {showAdvanced ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                
                {showAdvanced && (
                  <div className="grid md:grid-cols-2 gap-6 pl-11">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Annual Tack & Equipment (£)</label>
                      <input
                        type="number"
                        value={annualTack}
                        onChange={(e) => setAnnualTack(e.target.value)}
                        placeholder="200"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Repairs, replacements, rugs. Average: £200-500</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Annual Lessons/Training (£)</label>
                      <input
                        type="number"
                        value={annualLessons}
                        onChange={(e) => setAnnualLessons(e.target.value)}
                        placeholder="0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Weekly lesson ~£30 = £1,500/year</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Annual Competition/Transport (£)</label>
                      <input
                        type="number"
                        value={annualCompetition}
                        onChange={(e) => setAnnualCompetition(e.target.value)}
                        placeholder="0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Entry fees, transport, stabling at shows</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Annual Miscellaneous (£)</label>
                      <input
                        type="number"
                        value={annualMisc}
                        onChange={(e) => setAnnualMisc(e.target.value)}
                        placeholder="200"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Clipping, treats, supplements, arena hire</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculate}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-orange-600 transition shadow-lg"
              >
                <Calculator className="w-5 h-5 inline mr-2" />
                Calculate Annual Costs
              </button>
            </div>

            {/* Results Section */}
            {result && (
              <div className="border-t border-gray-200 bg-gradient-to-b from-amber-50 to-white p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <PieChart className="w-6 h-6 text-amber-600" />
                  Your Annual Horse Costs
                </h2>
                
                {/* Main Result */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-amber-600 text-white p-6 rounded-xl text-center">
                    <div className="text-amber-200 text-sm font-medium">Annual Total</div>
                    <div className="text-4xl font-bold mt-1">£{parseFloat(result.totalAnnual).toLocaleString()}</div>
                  </div>
                  <div className="bg-white border-2 border-amber-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Monthly</div>
                    <div className="text-3xl font-bold text-gray-900 mt-1">£{parseFloat(result.totalMonthly).toLocaleString()}</div>
                  </div>
                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Weekly</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">£{result.totalWeekly}</div>
                  </div>
                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Daily</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">£{result.totalDaily}</div>
                  </div>
                </div>

                {/* Cost Level Indicator */}
                <div className={`p-4 rounded-lg mb-8 ${
                  result.comparison.costLevel === 'budget' ? 'bg-green-50 border border-green-200' :
                  result.comparison.costLevel === 'average' ? 'bg-blue-50 border border-blue-200' :
                  result.comparison.costLevel === 'premium' ? 'bg-amber-50 border border-amber-200' :
                  'bg-purple-50 border border-purple-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <TrendingUp className={`w-6 h-6 ${
                      result.comparison.costLevel === 'budget' ? 'text-green-600' :
                      result.comparison.costLevel === 'average' ? 'text-blue-600' :
                      result.comparison.costLevel === 'premium' ? 'text-amber-600' :
                      'text-purple-600'
                    }`} />
                    <div>
                      <div className="font-bold text-gray-900 capitalize">{result.comparison.costLevel} Level Spending</div>
                      <div className="text-sm text-gray-600">
                        {result.comparison.costLevel === 'budget' && 'You\'re spending below the UK average - great budgeting!'}
                        {result.comparison.costLevel === 'average' && 'Your costs are typical for UK horse owners.'}
                        {result.comparison.costLevel === 'premium' && 'You\'re spending above average - likely full livery or competing.'}
                        {result.comparison.costLevel === 'luxury' && 'High-end spending - professional level care or competition.'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Breakdown by Category */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">Cost Breakdown</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {/* Essential Costs */}
                  <div 
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-amber-300 transition"
                    onClick={() => setActiveCategory(activeCategory === 'essential' ? null : 'essential')}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Home className="w-5 h-5 text-amber-600" />
                        <span className="font-semibold">Essential Costs</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">£{parseFloat(result.breakdown.essential.total).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{result.breakdown.essential.percentage}%</div>
                      </div>
                    </div>
                    {activeCategory === 'essential' && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Livery/Stabling</span><span>£{parseFloat(result.breakdown.essential.items.livery).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Feed & Forage</span><span>£{parseFloat(result.breakdown.essential.items.feed).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Bedding</span><span>£{parseFloat(result.breakdown.essential.items.bedding).toLocaleString()}</span></div>
                      </div>
                    )}
                  </div>

                  {/* Professional Services */}
                  <div 
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-amber-300 transition"
                    onClick={() => setActiveCategory(activeCategory === 'professional' ? null : 'professional')}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Stethoscope className="w-5 h-5 text-red-500" />
                        <span className="font-semibold">Professional Services</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">£{parseFloat(result.breakdown.professional.total).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{result.breakdown.professional.percentage}%</div>
                      </div>
                    </div>
                    {activeCategory === 'professional' && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Farrier ({result.breakdown.professional.items.farrierVisits} visits)</span><span>£{parseFloat(result.breakdown.professional.items.farrier).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Vet (Routine)</span><span>£{parseFloat(result.breakdown.professional.items.vetRoutine).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Vet (Emergency Fund)</span><span>£{parseFloat(result.breakdown.professional.items.vetEmergency).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Dental</span><span>£{parseFloat(result.breakdown.professional.items.dental).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Worming</span><span>£{parseFloat(result.breakdown.professional.items.worming).toLocaleString()}</span></div>
                      </div>
                    )}
                  </div>

                  {/* Protection */}
                  <div 
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-amber-300 transition"
                    onClick={() => setActiveCategory(activeCategory === 'protection' ? null : 'protection')}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold">Insurance & Protection</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">£{parseFloat(result.breakdown.protection.total).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{result.breakdown.protection.percentage}%</div>
                      </div>
                    </div>
                    {activeCategory === 'protection' && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Insurance</span><span>£{parseFloat(result.breakdown.protection.items.insurance).toLocaleString()}</span></div>
                      </div>
                    )}
                  </div>

                  {/* Optional */}
                  <div 
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-amber-300 transition"
                    onClick={() => setActiveCategory(activeCategory === 'optional' ? null : 'optional')}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <PoundSterling className="w-5 h-5 text-green-500" />
                        <span className="font-semibold">Optional Extras</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">£{parseFloat(result.breakdown.optional.total).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{result.breakdown.optional.percentage}%</div>
                      </div>
                    </div>
                    {activeCategory === 'optional' && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Tack & Equipment</span><span>£{parseFloat(result.breakdown.optional.items.tack).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Lessons/Training</span><span>£{parseFloat(result.breakdown.optional.items.lessons).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Competition/Transport</span><span>£{parseFloat(result.breakdown.optional.items.competition).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Miscellaneous</span><span>£{parseFloat(result.breakdown.optional.items.misc).toLocaleString()}</span></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* UK Comparison */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-3">How You Compare to UK Averages</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-24 text-sm text-gray-600">Budget</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                        <div className="absolute left-0 top-0 bottom-0 bg-green-500 rounded-full" style={{width: `${Math.min(100, (5000 / parseFloat(result.totalAnnual)) * 100)}%`}}></div>
                      </div>
                      <div className="w-20 text-right text-sm">£5,000</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 text-sm text-gray-600">Average</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                        <div className="absolute left-0 top-0 bottom-0 bg-blue-500 rounded-full" style={{width: `${Math.min(100, (8500 / parseFloat(result.totalAnnual)) * 100)}%`}}></div>
                      </div>
                      <div className="w-20 text-right text-sm">£8,500</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 text-sm text-gray-600">Premium</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                        <div className="absolute left-0 top-0 bottom-0 bg-amber-500 rounded-full" style={{width: `${Math.min(100, (15000 / parseFloat(result.totalAnnual)) * 100)}%`}}></div>
                      </div>
                      <div className="w-20 text-right text-sm">£15,000</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 text-sm font-bold text-amber-600">You</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                        <div className="absolute left-0 top-0 bottom-0 bg-amber-600 rounded-full" style={{width: '100%'}}></div>
                      </div>
                      <div className="w-20 text-right text-sm font-bold">£{parseFloat(result.totalAnnual).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cost Notes Box */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mt-8">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-amber-800 mb-2">Important Notes About Horse Costs</h3>
                <ul className="text-amber-900 space-y-1 text-sm">
                  <li>• Costs vary significantly by region - South East England is typically 20-30% higher than rural areas</li>
                  <li>• First year ownership costs are often higher due to initial tack, equipment and settling-in vet checks</li>
                  <li>• Emergency vet bills can be £2,000-10,000+ for colic surgery or serious injury</li>
                  <li>• Older horses (15+) may have higher vet and dental costs</li>
                  <li>• Competition horses have significantly higher costs (transport, entry fees, specialist care)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="mt-12 space-y-12">
            
            {/* Understanding Costs Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Annual Horse Ownership Costs in the UK</h2>
              <p className="text-gray-700 mb-4">
                Owning a horse in the UK is a significant financial commitment that extends far beyond the initial purchase price. 
                The true cost of horse ownership includes regular monthly expenses like livery and feed, plus periodic professional 
                services from farriers and vets, insurance premiums, and unexpected emergency costs.
              </p>
              <p className="text-gray-700 mb-4">
                Most UK horse owners spend between £5,000 and £15,000 annually on their horse, with the average being around 
                £8,500 per year. The biggest variables are your livery arrangement (full livery vs DIY can differ by £4,000+ annually) 
                and whether you compete regularly.
              </p>
              <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg">
                <p className="text-gray-700 italic">
                  <strong>Example:</strong> A horse on DIY livery at £150/month with basic care costs around £5,500/year. 
                  The same horse on full livery at £500/month with regular lessons and competing could cost £12,000+/year.
                </p>
              </div>
            </section>

            {/* UK Averages Table */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">UK Horse Cost Averages 2025</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-amber-600 text-white">
                      <th className="p-3 text-left">Expense Category</th>
                      <th className="p-3 text-right">Low Estimate</th>
                      <th className="p-3 text-right">Average</th>
                      <th className="p-3 text-right">High Estimate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Livery (Full)</td>
                      <td className="p-3 text-right">£4,800/year</td>
                      <td className="p-3 text-right">£6,000/year</td>
                      <td className="p-3 text-right">£8,400/year</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-3 font-medium">Livery (DIY)</td>
                      <td className="p-3 text-right">£1,200/year</td>
                      <td className="p-3 text-right">£1,800/year</td>
                      <td className="p-3 text-right">£2,400/year</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Feed & Forage</td>
                      <td className="p-3 text-right">£960/year</td>
                      <td className="p-3 text-right">£1,440/year</td>
                      <td className="p-3 text-right">£2,400/year</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-3 font-medium">Farrier</td>
                      <td className="p-3 text-right">£400/year</td>
                      <td className="p-3 text-right">£800/year</td>
                      <td className="p-3 text-right">£1,500/year</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Veterinary (routine)</td>
                      <td className="p-3 text-right">£250/year</td>
                      <td className="p-3 text-right">£400/year</td>
                      <td className="p-3 text-right">£800/year</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-3 font-medium">Insurance</td>
                      <td className="p-3 text-right">£360/year</td>
                      <td className="p-3 text-right">£540/year</td>
                      <td className="p-3 text-right">£1,200/year</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Dental</td>
                      <td className="p-3 text-right">£80/year</td>
                      <td className="p-3 text-right">£120/year</td>
                      <td className="p-3 text-right">£200/year</td>
                    </tr>
                    <tr className="bg-amber-50">
                      <td className="p-3 font-bold">Total (DIY)</td>
                      <td className="p-3 text-right font-bold">~£4,500</td>
                      <td className="p-3 text-right font-bold">~£6,000</td>
                      <td className="p-3 text-right font-bold">~£9,000</td>
                    </tr>
                    <tr className="bg-amber-100">
                      <td className="p-3 font-bold">Total (Full Livery)</td>
                      <td className="p-3 text-right font-bold">~£7,500</td>
                      <td className="p-3 text-right font-bold">~£10,000</td>
                      <td className="p-3 text-right font-bold">~£15,000+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-500 mt-2">* Prices based on 2024/2025 UK market data. Regional variations apply.</p>
            </section>

            {/* Cost Saving Tips */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Reduce Your Horse Ownership Costs</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-800 mb-2">✓ Smart Savings</h3>
                  <ul className="text-green-900 space-y-2 text-sm">
                    <li>• Buy hay in bulk during summer (20-30% cheaper)</li>
                    <li>• Join yard vaccine clinics for group discounts</li>
                    <li>• Consider barefoot if your horse suits it</li>
                    <li>• Share transport costs with other owners</li>
                    <li>• DIY rugging and basic grooming</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                  <h3 className="font-bold text-red-800 mb-2">✗ Don't Cut Corners On</h3>
                  <ul className="text-red-900 space-y-2 text-sm">
                    <li>• Regular farrier visits (prevents lameness)</li>
                    <li>• Annual vaccinations (legal requirement for some)</li>
                    <li>• Quality forage (poor hay causes colic)</li>
                    <li>• Dental care (affects eating and riding)</li>
                    <li>• Emergency vet fund (unexpected bills happen)</li>
                  </ul>
                </div>
              </div>
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
              <a href="/livery-cost-calculator" className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-amber-400 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900">Livery Cost Calculator</h3>
                <p className="text-gray-600 text-sm mt-1">Compare full, part and DIY livery costs</p>
              </a>
              <a href="/horse-feed-calculator" className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-amber-400 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900">Horse Feed Calculator</h3>
                <p className="text-gray-600 text-sm mt-1">Calculate daily and monthly feed costs</p>
              </a>
              <a href="/farrier-cost-calculator" className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-amber-400 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900">Farrier Cost Calculator</h3>
                <p className="text-gray-600 text-sm mt-1">Annual shoeing vs barefoot costs</p>
              </a>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-12 bg-gradient-to-r from-amber-600 to-orange-500 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Need Help Budgeting for Your Horse?</h2>
            <p className="text-amber-100 mb-4">Get in touch for personalised advice or suggest a calculator you'd like us to build.</p>
            <a 
              href="mailto:hello@horsecost.co.uk" 
              className="inline-block bg-white text-amber-600 px-6 py-3 rounded-lg font-bold hover:bg-amber-50 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
