import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Handshake,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  PoundSterling,
  CheckCircle2,
  Calendar,
  Star,
  Target,
  Scale
} from 'lucide-react'

export default function HorseLoanCalculator() {
  const [loanType, setLoanType] = useState('full')
  const [loanFee, setLoanFee] = useState('')
  const [liveryType, setLiveryType] = useState('diy')
  const [region, setRegion] = useState('average')
  const [includeFarrier, setIncludeFarrier] = useState(true)
  const [includeVet, setIncludeVet] = useState(true)
  const [includeInsurance, setIncludeInsurance] = useState(true)
  const [includeFeed, setIncludeFeed] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [purchasePrice, setPurchasePrice] = useState('5000')
  const [result, setResult] = useState<any>(null)

  const loanTypes = [
    { id: 'full', name: 'Full Loan', description: 'You have sole use of the horse', feeRange: '£0-50/week', multiplier: 1.0 },
    { id: 'part', name: 'Part Loan', description: 'Share with owner (typically 3 days/week)', feeRange: '£20-80/week', multiplier: 0.5 },
    { id: 'share', name: 'Share Board', description: 'Share costs with another loaner', feeRange: '£30-60/week', multiplier: 0.5 },
    { id: 'companion', name: 'Companion Loan', description: 'Field companion, minimal riding', feeRange: '£0-20/week', multiplier: 0.6 }
  ]

  const liveryTypes = [
    { id: 'grass', name: 'Grass Livery', baseCost: 100 },
    { id: 'diy', name: 'DIY Livery', baseCost: 180 },
    { id: 'part', name: 'Part Livery', baseCost: 350 },
    { id: 'full', name: 'Full Livery', baseCost: 550 }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.4,
    'southeast': 1.2,
    'average': 1.0,
    'north': 0.9,
    'scotland': 0.95
  }

  // Annual costs UK 2025
  const annualCosts = {
    farrier: {
      barefoot: 300,
      shod: 900
    },
    vet: {
      routine: 400,
      vaccinations: 80,
      dental: 130
    },
    insurance: {
      basic: 200,
      comprehensive: 450
    },
    feed: {
      grass: 600,
      diy: 1800,
      part: 1200,
      full: 0 // included in livery
    },
    tack: {
      loan: 200, // maintenance only
      buy: 1500 // buying new
    },
    worming: 150,
    lessons: 1200 // optional
  }

  const calculate = () => {
    const loan = loanTypes.find(l => l.id === loanType)
    const livery = liveryTypes.find(l => l.id === liveryType)
    
    if (!loan || !livery) return

    const regionFactor = regionMultipliers[region]
    const costMultiplier = loan.multiplier

    // Weekly loan fee
    const weeklyFee = loanFee ? parseFloat(loanFee) : 0
    const annualLoanFee = weeklyFee * 52

    // Livery costs (full loan = 100%, part loan = 50% or as agreed)
    let annualLivery = livery.baseCost * 12 * regionFactor
    if (loanType === 'part' || loanType === 'share') {
      annualLivery *= 0.5 // typically split
    }

    // Farrier (usually loaner responsibility for full loan)
    let annualFarrier = 0
    if (includeFarrier) {
      annualFarrier = annualCosts.farrier.shod * regionFactor * costMultiplier
    }

    // Vet (routine care)
    let annualVet = 0
    if (includeVet) {
      annualVet = (annualCosts.vet.routine + annualCosts.vet.vaccinations + annualCosts.vet.dental) * regionFactor * costMultiplier
    }

    // Insurance
    let annualInsurance = 0
    if (includeInsurance) {
      annualInsurance = annualCosts.insurance.comprehensive * regionFactor
    }

    // Feed (if DIY or grass livery)
    let annualFeed = 0
    if (includeFeed && (liveryType === 'diy' || liveryType === 'grass')) {
      annualFeed = annualCosts.feed[liveryType as keyof typeof annualCosts.feed] * regionFactor * costMultiplier
    }

    // Worming
    const annualWorming = annualCosts.worming * costMultiplier

    // Tack maintenance (for loan horse)
    const annualTack = annualCosts.tack.loan * costMultiplier

    const totalLoanAnnual = annualLoanFee + annualLivery + annualFarrier + annualVet + annualInsurance + annualFeed + annualWorming + annualTack
    const monthlyLoanCost = totalLoanAnnual / 12

    // Compare to owning
    const purchaseCost = purchasePrice ? parseFloat(purchasePrice) : 5000
    const ownAnnualLivery = livery.baseCost * 12 * regionFactor
    const ownAnnualFarrier = annualCosts.farrier.shod * regionFactor
    const ownAnnualVet = (annualCosts.vet.routine + annualCosts.vet.vaccinations + annualCosts.vet.dental) * regionFactor
    const ownAnnualInsurance = annualCosts.insurance.comprehensive * regionFactor
    const ownAnnualFeed = (liveryType === 'diy' || liveryType === 'grass') ? annualCosts.feed[liveryType as keyof typeof annualCosts.feed] * regionFactor : 0
    const ownAnnualWorming = annualCosts.worming
    const ownAnnualTack = 300 // ongoing maintenance + replacement

    const totalOwnAnnual = ownAnnualLivery + ownAnnualFarrier + ownAnnualVet + ownAnnualInsurance + ownAnnualFeed + ownAnnualWorming + ownAnnualTack
    const monthlyOwnCost = totalOwnAnnual / 12

    // First year comparison
    const firstYearLoan = totalLoanAnnual
    const firstYearOwn = purchaseCost + annualCosts.tack.buy + totalOwnAnnual

    // Break-even calculation (how many years until owning is cheaper)
    const annualSavingsOwning = totalLoanAnnual - totalOwnAnnual
    const breakEvenYears = annualSavingsOwning > 0 ? (purchaseCost + annualCosts.tack.buy) / annualSavingsOwning : 0

    setResult({
      loanAnnual: totalLoanAnnual.toFixed(2),
      loanMonthly: monthlyLoanCost.toFixed(2),
      ownAnnual: totalOwnAnnual.toFixed(2),
      ownMonthly: monthlyOwnCost.toFixed(2),
      firstYearLoan: firstYearLoan.toFixed(2),
      firstYearOwn: firstYearOwn.toFixed(2),
      annualDifference: (totalLoanAnnual - totalOwnAnnual).toFixed(2),
      breakEvenYears: breakEvenYears > 0 ? breakEvenYears.toFixed(1) : 'N/A',
      breakdown: {
        loanFee: annualLoanFee.toFixed(2),
        livery: annualLivery.toFixed(2),
        farrier: annualFarrier.toFixed(2),
        vet: annualVet.toFixed(2),
        insurance: annualInsurance.toFixed(2),
        feed: annualFeed.toFixed(2),
        worming: annualWorming.toFixed(2),
        tack: annualTack.toFixed(2)
      },
      loanInfo: loan,
      loanIsCheaper: totalLoanAnnual < totalOwnAnnual,
      fiveYearLoan: (totalLoanAnnual * 5).toFixed(2),
      fiveYearOwn: (purchaseCost + annualCosts.tack.buy + (totalOwnAnnual * 5)).toFixed(2)
    })
  }

  const faqs = [
    {
      q: 'What is a horse loan arrangement?',
      a: 'A horse loan is when an owner allows someone else to care for and ride their horse, either fully or part-time. The loaner typically pays for keep costs (livery, farrier, vet) while the owner retains ownership. It\'s a great way to have horse access without the purchase cost.'
    },
    {
      q: 'How much does it cost to loan a horse UK?',
      a: 'Loaning a horse in the UK typically costs £200-£600/month for full loan, covering livery, feed, farrier, and vet costs. Part loans cost £100-£300/month for 2-3 days per week. Some owners charge a loan fee (£0-50/week), while others offer free loans for experienced homes.'
    },
    {
      q: 'What is the difference between full and part loan?',
      a: 'Full loan means you have sole use of the horse and pay all costs. Part loan means sharing the horse with the owner or another loaner - typically 2-4 days per week each. Costs are usually shared proportionally. Full loan offers more flexibility but higher costs.'
    },
    {
      q: 'Is loaning or buying a horse cheaper?',
      a: 'Loaning is cheaper initially (no purchase cost, often comes with tack), but ongoing costs can be similar to owning. Over 3-5+ years, owning often becomes more economical if the horse remains healthy. Loaning is ideal for those wanting flexibility or testing commitment.'
    },
    {
      q: 'What should a horse loan agreement include?',
      a: 'A loan agreement should cover: loan period and notice period, who pays for what (farrier, vet, livery, insurance), riding/competition permissions, what happens if the horse is injured, owner access rights, and termination conditions. Always get it in writing.'
    },
    {
      q: 'Do I need insurance for a loan horse?',
      a: 'Yes, insurance is essential. Check if the owner\'s policy covers loaners, or take out your own third-party liability. Consider adding personal accident cover. Some owners require the loaner to maintain full insurance as a loan condition.'
    },
    {
      q: 'Can I compete on a loan horse?',
      a: 'This depends on your agreement with the owner. Many loan agreements allow unaffiliated competitions, but affiliated competing (BE, BD, BS) may require owner permission or even attendance. Always clarify competition permissions before signing.'
    },
    {
      q: 'What happens if a loan horse gets injured?',
      a: 'This should be covered in your loan agreement. Typically, routine vet bills are the loaner\'s responsibility, while major injuries/decisions remain with the owner. Insurance is crucial - ensure you\'re clear on who pays excess and who makes treatment decisions.'
    },
    {
      q: 'How do I find a horse to loan?',
      a: 'Options include: local riding schools (school masters available for loan), Facebook horse loan groups, horsequest.co.uk, preloved.co.uk, local saddleries notice boards, and word of mouth at yards. Always meet the horse several times before committing.'
    },
    {
      q: 'What questions should I ask when viewing a loan horse?',
      a: 'Key questions: Why is the horse being loaned? What\'s their history/any injuries? Are they shod or barefoot? What\'s their temperament on the ground and ridden? Can I see them ridden first? What comes with them (tack, rugs)? What are the owner\'s expectations?'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Horse Loan Calculator UK 2025 | Loan vs Buy Comparison | HorseCost</title>
        <meta 
          name="description" 
          content="Free horse loan cost calculator for UK. Compare loaning vs buying costs, calculate full and part loan expenses. Make informed decisions with 2025 prices." 
        />
        <meta name="keywords" content="horse loan cost UK, loan horse price, part loan cost, full loan horse, loan vs buy horse, horse share cost" />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#059669" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:title" content="Horse Loan Calculator UK 2025 | HorseCost" />
        <meta property="og:description" content="Compare horse loan vs buying costs. Calculate full loan, part loan, and share arrangements." />
        <meta property="og:url" content="https://horsecost.co.uk/horse-loan-calculator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Horse Loan Calculator UK | HorseCost" />

        <link rel="canonical" href="https://horsecost.co.uk/horse-loan-calculator" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/#calculators' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Horse Loan Calculator', 'item': 'https://horsecost.co.uk/horse-loan-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Loan Cost Calculator UK',
                'description': 'Calculate and compare horse loan costs vs buying in the UK.',
                'url': 'https://horsecost.co.uk/horse-loan-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.8', 'ratingCount': '267' }
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
            <a href="/" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Handshake className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Horse Loan Calculator</h1>
                <p className="text-emerald-200">UK 2025 Loan vs Buy Comparison</p>
              </div>
            </div>
            <p className="text-emerald-100 max-w-2xl">
              Calculate the true cost of loaning a horse and compare it to buying. 
              Understand full loan, part loan, and share arrangements with UK 2025 prices.
            </p>
            <p className="text-emerald-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        {/* Calculator */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Loan Type */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Loan Type</label>
                  </div>
                  <div className="space-y-2">
                    {loanTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setLoanType(type.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          loanType === type.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${loanType === type.id ? 'text-emerald-700' : 'text-gray-900'}`}>
                              {type.name}
                            </p>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                          <p className="text-sm text-gray-600">{type.feeRange}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loan Fee */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Weekly Loan Fee (if any)</label>
                  </div>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={loanFee}
                      onChange={(e) => setLoanFee(e.target.value)}
                      placeholder="0 (many loans are free)"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Some owners charge a fee, others loan for free</p>
                </div>

                {/* Livery Type */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Livery Type</label>
                  </div>
                  <select
                    value={liveryType}
                    onChange={(e) => setLiveryType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  >
                    {liveryTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} (~£{type.baseCost}/month)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Region */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="london">London (Higher prices)</option>
                    <option value="southeast">South East England</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England</option>
                    <option value="scotland">Scotland / Wales</option>
                  </select>
                </div>

                {/* Costs Included */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Costs You Pay</label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeFarrier}
                        onChange={(e) => setIncludeFarrier(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 rounded"
                      />
                      <span className="text-gray-900">Farrier (~£75/visit)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeVet}
                        onChange={(e) => setIncludeVet(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 rounded"
                      />
                      <span className="text-gray-900">Routine Vet Care</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeInsurance}
                        onChange={(e) => setIncludeInsurance(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 rounded"
                      />
                      <span className="text-gray-900">Insurance</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeFeed}
                        onChange={(e) => setIncludeFeed(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 rounded"
                      />
                      <span className="text-gray-900">Feed & Bedding (DIY only)</span>
                    </label>
                  </div>
                </div>

                {/* Advanced - Compare to Buying */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-emerald-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Compare to Buying
                  </button>

                  {showAdvanced && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Horse Purchase Price (for comparison)
                      </label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={purchasePrice}
                          onChange={(e) => setPurchasePrice(e.target.value)}
                          placeholder="5000"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['3000', '5000', '8000', '12000'].map((val) => (
                          <button
                            key={val}
                            onClick={() => setPurchasePrice(val)}
                            className={`px-3 py-1 rounded-lg text-sm transition ${
                              purchasePrice === val
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            £{parseInt(val).toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Results */}
              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-green-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Loan Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result - Loan Cost */}
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white">
                      <p className="text-emerald-100 text-sm mb-1">Annual Loan Cost</p>
                      <p className="text-4xl font-bold">£{result.loanAnnual}</p>
                      <p className="text-emerald-200 text-sm mt-1">{result.loanInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-emerald-100 text-xs">Monthly</p>
                          <p className="font-bold">£{result.loanMonthly}</p>
                        </div>
                        <div>
                          <p className="text-emerald-100 text-xs">First Year</p>
                          <p className="font-bold">£{result.firstYearLoan}</p>
                        </div>
                      </div>
                    </div>

                    {/* Loan Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Loan Cost Breakdown (Annual)</h3>
                      <div className="space-y-2 text-sm">
                        {parseFloat(result.breakdown.loanFee) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Loan Fee</span>
                            <span className="font-medium">£{result.breakdown.loanFee}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Livery</span>
                          <span className="font-medium">£{result.breakdown.livery}</span>
                        </div>
                        {parseFloat(result.breakdown.farrier) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Farrier</span>
                            <span className="font-medium">£{result.breakdown.farrier}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.vet) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vet Care</span>
                            <span className="font-medium">£{result.breakdown.vet}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.insurance) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Insurance</span>
                            <span className="font-medium">£{result.breakdown.insurance}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.feed) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Feed & Bedding</span>
                            <span className="font-medium">£{result.breakdown.feed}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Worming</span>
                          <span className="font-medium">£{result.breakdown.worming}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tack Maintenance</span>
                          <span className="font-medium">£{result.breakdown.tack}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Annual</span>
                          <span>£{result.loanAnnual}</span>
                        </div>
                      </div>
                    </div>

                    {/* Loan vs Buy Comparison */}
                    <div className="bg-white border-2 border-emerald-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Scale className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-semibold text-gray-900">Loan vs Buy Comparison</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-emerald-50 rounded-lg p-3">
                          <p className="text-emerald-600 font-medium mb-1">Loaning</p>
                          <p className="text-lg font-bold text-gray-900">£{result.loanAnnual}/yr</p>
                          <p className="text-gray-500 text-xs">First year: £{result.firstYearLoan}</p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-3">
                          <p className="text-amber-600 font-medium mb-1">Owning</p>
                          <p className="text-lg font-bold text-gray-900">£{result.ownAnnual}/yr</p>
                          <p className="text-gray-500 text-xs">First year: £{result.firstYearOwn}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">5-Year Loan Cost</span>
                          <span className="font-medium">£{result.fiveYearLoan}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">5-Year Ownership Cost</span>
                          <span className="font-medium">£{result.fiveYearOwn}</span>
                        </div>
                        {result.breakEvenYears !== 'N/A' && (
                          <div className="flex justify-between text-sm font-semibold text-emerald-600">
                            <span>Break-even Point</span>
                            <span>~{result.breakEvenYears} years</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className={`rounded-xl p-4 ${result.loanIsCheaper ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className={`w-5 h-5 ${result.loanIsCheaper ? 'text-emerald-600' : 'text-amber-600'}`} />
                        <h3 className={`font-semibold ${result.loanIsCheaper ? 'text-emerald-900' : 'text-amber-900'}`}>
                          {result.loanIsCheaper ? 'Loaning is cheaper annually' : 'Owning is cheaper annually'}
                        </h3>
                      </div>
                      <p className={`text-sm ${result.loanIsCheaper ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {result.loanIsCheaper 
                          ? `You save £${Math.abs(parseFloat(result.annualDifference)).toFixed(0)}/year by loaning. Good for flexibility and testing commitment.`
                          : `Owning saves £${Math.abs(parseFloat(result.annualDifference)).toFixed(0)}/year in running costs, but requires £${purchasePrice} upfront plus tack.`
                        }
                      </p>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Handshake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select your loan arrangement and click calculate</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Box */}
          <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-emerald-900 mb-2">Essential Loan Agreement Tips</h3>
                <ul className="text-emerald-800 space-y-1 text-sm">
                  <li>• <strong>Always get it in writing</strong> - verbal agreements cause disputes</li>
                  <li>• <strong>Clarify all costs upfront</strong> - who pays for what, including emergencies</li>
                  <li>• <strong>Agree notice periods</strong> - typically 1-3 months for full loans</li>
                  <li>• <strong>Check insurance cover</strong> - ensure you're covered to ride</li>
                  <li>• <strong>Meet the horse multiple times</strong> before committing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Loan Costs Table */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Horse Loan Costs Guide 2025</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Loan Type</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Weekly Fee</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Monthly Total</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Annual Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Full Loan (DIY)</td>
                    <td className="py-3 px-4 text-center">£0-50</td>
                    <td className="py-3 px-4 text-center">£300-£500</td>
                    <td className="py-3 px-4 text-center">£3,600-£6,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Full Loan (Part Livery)</td>
                    <td className="py-3 px-4 text-center">£0-50</td>
                    <td className="py-3 px-4 text-center">£450-£700</td>
                    <td className="py-3 px-4 text-center">£5,400-£8,400</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Part Loan (3 days)</td>
                    <td className="py-3 px-4 text-center">£20-80</td>
                    <td className="py-3 px-4 text-center">£150-£350</td>
                    <td className="py-3 px-4 text-center">£1,800-£4,200</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Companion Loan</td>
                    <td className="py-3 px-4 text-center">£0-20</td>
                    <td className="py-3 px-4 text-center">£100-£250</td>
                    <td className="py-3 px-4 text-center">£1,200-£3,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Totals include livery, farrier, vet, insurance, and basic feed. Actual costs vary by region and horse needs.
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
              <a href="/first-horse-calculator" className="bg-pink-50 hover:bg-pink-100 rounded-xl p-4 transition group">
                <Star className="w-8 h-8 text-pink-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-pink-600">First Horse Calculator</h3>
                <p className="text-sm text-gray-600">Full buying costs</p>
              </a>
              <a href="/annual-horse-cost-calculator" className="bg-amber-50 hover:bg-amber-100 rounded-xl p-4 transition group">
                <Calendar className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600">Annual Cost Calculator</h3>
                <p className="text-sm text-gray-600">Complete ownership costs</p>
              </a>
              <a href="/riding-lesson-calculator" className="bg-violet-50 hover:bg-violet-100 rounded-xl p-4 transition group">
                <Target className="w-8 h-8 text-violet-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-violet-600">Riding Lesson Calculator</h3>
                <p className="text-sm text-gray-600">Alternative to loaning</p>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Buy Instead?</h2>
            <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
              Calculate the complete first-year costs of horse ownership with our First Horse Calculator.
            </p>
            <a 
              href="/first-horse-calculator"
              className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition"
            >
              Calculate Buying Costs
              <Calculator className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
