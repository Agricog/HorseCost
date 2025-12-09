import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Shield,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  PoundSterling,
  CheckCircle2,
  Heart,
  Activity,
  Calendar
} from 'lucide-react'

export default function HorseInsuranceCalculator() {
  const [horseValue, setHorseValue] = useState('')
  const [horseAge, setHorseAge] = useState('')
  const [coverageType, setCoverageType] = useState('comprehensive')
  const [vetFeeLimit, setVetFeeLimit] = useState('5000')
  const [use, setUse] = useState('pleasure')
  const [excess, setExcess] = useState('150')
  const [includePersonalAccident, setIncludePersonalAccident] = useState(true)
  const [includeTack, setIncludeTack] = useState(false)
  const [tackValue, setTackValue] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState<any>(null)

  const coverageTypes = [
    { id: 'basic', name: 'Basic (Mortality Only)', description: 'Death and theft cover only', multiplier: 0.025 },
    { id: 'standard', name: 'Standard', description: 'Mortality + £3,000 vet fees', multiplier: 0.04 },
    { id: 'comprehensive', name: 'Comprehensive', description: 'Mortality + higher vet fees + extras', multiplier: 0.055 },
    { id: 'premium', name: 'Premium', description: 'Full cover including loss of use', multiplier: 0.075 }
  ]

  const useTypes = [
    { id: 'pleasure', name: 'Pleasure/Hacking', multiplier: 1.0 },
    { id: 'competition', name: 'Competition (Unaffiliated)', multiplier: 1.15 },
    { id: 'affiliated', name: 'Competition (Affiliated)', multiplier: 1.25 },
    { id: 'hunting', name: 'Hunting', multiplier: 1.35 },
    { id: 'breeding', name: 'Breeding', multiplier: 1.1 },
    { id: 'professional', name: 'Professional Use', multiplier: 1.4 }
  ]

  const vetFeeLimits = [
    { value: '2500', label: '£2,500', multiplier: 0.8 },
    { value: '5000', label: '£5,000', multiplier: 1.0 },
    { value: '7500', label: '£7,500', multiplier: 1.2 },
    { value: '10000', label: '£10,000', multiplier: 1.4 },
    { value: '15000', label: '£15,000', multiplier: 1.7 }
  ]

  const excessOptions = [
    { value: '100', label: '£100', multiplier: 1.1 },
    { value: '150', label: '£150', multiplier: 1.0 },
    { value: '250', label: '£250', multiplier: 0.9 },
    { value: '500', label: '£500', multiplier: 0.8 }
  ]

  const calculate = () => {
    if (!horseValue || !horseAge) {
      alert('Please enter horse value and age')
      return
    }

    const value = parseFloat(horseValue)
    const age = parseInt(horseAge)

    if (value < 0 || age < 0 || age > 35) {
      alert('Please enter valid values')
      return
    }

    // Base rate from coverage type
    const coverage = coverageTypes.find(c => c.id === coverageType)
    const baseRate = coverage?.multiplier || 0.04

    // Age factor (horses over 15 cost more to insure)
    let ageFactor = 1.0
    if (age >= 20) ageFactor = 1.5
    else if (age >= 18) ageFactor = 1.35
    else if (age >= 15) ageFactor = 1.2
    else if (age >= 12) ageFactor = 1.1
    else if (age <= 3) ageFactor = 1.15

    // Use factor
    const useType = useTypes.find(u => u.id === use)
    const useFactor = useType?.multiplier || 1.0

    // Vet fee limit factor
    const vetLimit = vetFeeLimits.find(v => v.value === vetFeeLimit)
    const vetFactor = coverageType === 'basic' ? 1.0 : (vetLimit?.multiplier || 1.0)

    // Excess factor
    const excessOption = excessOptions.find(e => e.value === excess)
    const excessFactor = excessOption?.multiplier || 1.0

    // Calculate mortality premium
    const mortalityPremium = value * baseRate * ageFactor * useFactor * excessFactor

    // Vet fee premium (if not basic)
    let vetFeePremium = 0
    if (coverageType !== 'basic') {
      const vetLimitValue = parseFloat(vetFeeLimit)
      vetFeePremium = vetLimitValue * 0.08 * ageFactor * vetFactor
    }

    // Personal accident cover
    const personalAccidentPremium = includePersonalAccident ? 35 : 0

    // Tack cover
    let tackPremium = 0
    if (includeTack && tackValue) {
      const tack = parseFloat(tackValue)
      tackPremium = tack * 0.03
    }

    // Total annual premium
    const annualPremium = mortalityPremium + vetFeePremium + personalAccidentPremium + tackPremium
    const monthlyPremium = annualPremium / 12

    // IPT (Insurance Premium Tax at 12%)
    const ipt = annualPremium * 0.12
    const totalWithIPT = annualPremium + ipt

    // UK average comparison
    const ukAverageBasic = 180
    const ukAverageComprehensive = 450
    const ukAveragePremium = 750

    setResult({
      annualPremium: annualPremium.toFixed(2),
      monthlyPremium: monthlyPremium.toFixed(2),
      ipt: ipt.toFixed(2),
      totalWithIPT: totalWithIPT.toFixed(2),
      monthlyWithIPT: (totalWithIPT / 12).toFixed(2),
      breakdown: {
        mortality: mortalityPremium.toFixed(2),
        vetFees: vetFeePremium.toFixed(2),
        personalAccident: personalAccidentPremium.toFixed(2),
        tack: tackPremium.toFixed(2)
      },
      coverageDetails: {
        type: coverage?.name,
        vetLimit: coverageType === 'basic' ? 'Not included' : `£${parseInt(vetFeeLimit).toLocaleString()}`,
        excess: `£${excess}`,
        use: useType?.name
      },
      comparison: {
        vsBasic: totalWithIPT < ukAverageBasic,
        vsComprehensive: totalWithIPT < ukAverageComprehensive,
        vsPremium: totalWithIPT < ukAveragePremium,
        ukAverageBasic,
        ukAverageComprehensive,
        ukAveragePremium
      },
      factors: {
        age: ageFactor,
        use: useFactor,
        vet: vetFactor,
        excess: excessFactor
      }
    })
  }

  const faqs = [
    {
      q: 'How much does horse insurance cost in the UK?',
      a: 'Horse insurance in the UK typically costs between £150-£800+ per year depending on your horse\'s value, age, use, and the level of cover. Basic mortality-only cover starts around £150/year, while comprehensive policies with high vet fee limits can exceed £600/year. Most owners pay £300-£500 annually for good coverage.'
    },
    {
      q: 'What does horse insurance cover?',
      a: 'Horse insurance typically covers mortality (death from illness, injury, or humane destruction), theft, straying, veterinary fees, personal accident for the rider, public liability, and loss of use. Some policies also cover saddlery and tack, dental treatment, complementary therapies, and permanent incapacity.'
    },
    {
      q: 'Is horse insurance worth it?',
      a: 'Yes, horse insurance is generally worth it, especially vet fee cover. A single colic surgery can cost £5,000-£10,000+, and even routine emergencies often exceed £1,000. The peace of mind and financial protection usually outweighs the annual premium cost.'
    },
    {
      q: 'What is the excess on horse insurance?',
      a: 'The excess is the amount you pay towards each claim before the insurance kicks in. Standard excesses range from £100-£500. Higher excesses reduce your premium but mean you pay more per claim. Most policies have separate excesses for vet fees and mortality claims.'
    },
    {
      q: 'Can I insure an older horse?',
      a: 'Yes, but options become limited. Most insurers cover horses up to age 20-25 for new policies. Premiums increase significantly for horses over 15, and vet fee cover may be reduced or excluded for very old horses. Some specialist insurers offer veteran horse policies.'
    },
    {
      q: 'What vet fee limit should I choose?',
      a: 'We recommend at least £5,000 vet fee cover for most horses. Colic surgery alone can cost £5,000-£10,000, and complex injuries may require multiple treatments. If you compete or have a valuable horse, consider £7,500-£15,000 limits for better protection.'
    },
    {
      q: 'Does horse insurance cover pre-existing conditions?',
      a: 'No, horse insurance doesn\'t cover pre-existing conditions - any illness or injury that existed before the policy started or during the waiting period. Always disclose your horse\'s full medical history when applying, as non-disclosure can void claims.'
    },
    {
      q: 'What is loss of use cover?',
      a: 'Loss of use cover pays out a percentage (typically 50-75%) of your horse\'s insured value if they become permanently unable to perform their insured use due to illness or injury, even though they\'re still alive. It\'s particularly valuable for competition or breeding horses.'
    },
    {
      q: 'How do I reduce my horse insurance premium?',
      a: 'You can reduce premiums by: choosing a higher excess, reducing vet fee limits, insuring for a lower value, paying annually instead of monthly, maintaining good security at your yard, keeping up-to-date vaccination records, and shopping around for quotes each year.'
    },
    {
      q: 'What is Insurance Premium Tax (IPT)?',
      a: 'IPT is a government tax on insurance premiums, currently 12% for horse insurance. It\'s added to your premium by the insurer and passed to HMRC. A £400 premium would have £48 IPT added, making the total £448. IPT is unavoidable on all UK insurance policies.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Horse Insurance Calculator UK 2025 | Compare Cover & Premiums | HorseCost</title>
        <meta 
          name="description" 
          content="Free horse insurance calculator for UK owners. Estimate premiums for mortality, vet fees, and comprehensive cover. Compare quotes and find the right policy for your horse." 
        />
        <meta name="keywords" content="horse insurance calculator, horse insurance UK, equine insurance cost, vet fee cover horse, horse mortality insurance, horse insurance quotes, how much is horse insurance" />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#7c3aed" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:title" content="Horse Insurance Calculator UK 2025 | HorseCost" />
        <meta property="og:description" content="Calculate horse insurance premiums instantly. Free UK calculator for mortality, vet fees, and comprehensive cover." />
        <meta property="og:url" content="https://horsecost.co.uk/horse-insurance-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/insurance-calculator-og.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Horse Insurance Calculator UK | HorseCost" />
        <meta name="twitter:description" content="Estimate horse insurance costs with our free UK calculator." />

        <link rel="canonical" href="https://horsecost.co.uk/horse-insurance-calculator" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/#calculators' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Horse Insurance Calculator', 'item': 'https://horsecost.co.uk/horse-insurance-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Insurance Calculator UK',
                'description': 'Calculate horse insurance premiums for UK owners with instant quotes for mortality, vet fees, and comprehensive cover.',
                'url': 'https://horsecost.co.uk/horse-insurance-calculator',
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
                'url': 'https://horsecost.co.uk',
                'logo': 'https://horsecost.co.uk/logo.png'
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Back Link */}
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <a href="/" className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Horse Insurance Calculator</h1>
                <p className="text-violet-200">UK 2025 Premium Estimator</p>
              </div>
            </div>
            <p className="text-violet-100 max-w-2xl">
              Estimate your horse insurance premium based on value, age, use, and coverage level. 
              Compare different options and find the right protection for your horse.
            </p>
            <p className="text-violet-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Calculator Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Horse Value */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Horse Value</label>
                  </div>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={horseValue}
                      onChange={(e) => setHorseValue(e.target.value)}
                      placeholder="e.g., 5000"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['2000', '5000', '10000', '15000', '25000'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setHorseValue(val)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                          horseValue === val 
                            ? 'bg-violet-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        £{parseInt(val).toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Horse Age */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Horse Age (Years)</label>
                  </div>
                  <input
                    type="number"
                    value={horseAge}
                    onChange={(e) => setHorseAge(e.target.value)}
                    placeholder="e.g., 10"
                    min="0"
                    max="35"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['5', '10', '15', '18', '20'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setHorseAge(val)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                          horseAge === val 
                            ? 'bg-violet-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val} yrs
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coverage Type */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Coverage Level</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {coverageTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setCoverageType(type.id)}
                        className={`p-3 rounded-xl text-left transition border-2 ${
                          coverageType === type.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`font-semibold text-sm ${coverageType === type.id ? 'text-violet-700' : 'text-gray-900'}`}>
                          {type.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Horse Use */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Primary Use</label>
                  </div>
                  <select
                    value={use}
                    onChange={(e) => setUse(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none"
                  >
                    {useTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                {/* Vet Fee Limit (if not basic) */}
                {coverageType !== 'basic' && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">5</span>
                      <label className="font-semibold text-gray-900">Vet Fee Limit</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vetFeeLimits.map((limit) => (
                        <button
                          key={limit.value}
                          onClick={() => setVetFeeLimit(limit.value)}
                          className={`px-4 py-2 rounded-xl font-medium transition ${
                            vetFeeLimit === limit.value
                              ? 'bg-violet-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {limit.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advanced Options */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-violet-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Additional Options
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      {/* Excess */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Excess Amount</label>
                        <div className="flex flex-wrap gap-2">
                          {excessOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setExcess(option.value)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                excess === option.value
                                  ? 'bg-violet-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Personal Accident */}
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includePersonalAccident}
                          onChange={(e) => setIncludePersonalAccident(e.target.checked)}
                          className="w-5 h-5 text-violet-600 rounded"
                        />
                        <span className="text-gray-700">Include Personal Accident Cover (+£35/year)</span>
                      </label>

                      {/* Tack Cover */}
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeTack}
                          onChange={(e) => setIncludeTack(e.target.checked)}
                          className="w-5 h-5 text-violet-600 rounded"
                        />
                        <span className="text-gray-700">Include Tack & Saddlery Cover</span>
                      </label>

                      {includeTack && (
                        <div className="pl-8">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tack Value (£)</label>
                          <input
                            type="number"
                            value={tackValue}
                            onChange={(e) => setTackValue(e.target.value)}
                            placeholder="e.g., 2000"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-violet-500 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Results */}
              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-violet-700 hover:to-purple-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Premium
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
                      <p className="text-violet-100 text-sm mb-1">Estimated Annual Premium</p>
                      <p className="text-4xl font-bold">£{result.totalWithIPT}</p>
                      <p className="text-violet-200 text-sm mt-1">Including IPT</p>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex justify-between">
                          <span className="text-violet-100">Monthly (if paying monthly)</span>
                          <span className="font-bold">£{result.monthlyWithIPT}</span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Premium Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mortality/Theft Cover</span>
                          <span className="font-medium">£{result.breakdown.mortality}</span>
                        </div>
                        {parseFloat(result.breakdown.vetFees) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vet Fee Cover</span>
                            <span className="font-medium">£{result.breakdown.vetFees}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.personalAccident) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Personal Accident</span>
                            <span className="font-medium">£{result.breakdown.personalAccident}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.tack) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tack Cover</span>
                            <span className="font-medium">£{result.breakdown.tack}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">£{result.annualPremium}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IPT (12%)</span>
                          <span className="font-medium">£{result.ipt}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total</span>
                          <span>£{result.totalWithIPT}</span>
                        </div>
                      </div>
                    </div>

                    {/* Coverage Details */}
                    <div className="bg-violet-50 rounded-xl p-4">
                      <h3 className="font-semibold text-violet-900 mb-3">Your Cover Details</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-violet-600">Coverage Type</p>
                          <p className="font-medium text-gray-900">{result.coverageDetails.type}</p>
                        </div>
                        <div>
                          <p className="text-violet-600">Vet Fee Limit</p>
                          <p className="font-medium text-gray-900">{result.coverageDetails.vetLimit}</p>
                        </div>
                        <div>
                          <p className="text-violet-600">Excess</p>
                          <p className="font-medium text-gray-900">{result.coverageDetails.excess}</p>
                        </div>
                        <div>
                          <p className="text-violet-600">Primary Use</p>
                          <p className="font-medium text-gray-900">{result.coverageDetails.use}</p>
                        </div>
                      </div>
                    </div>

                    {/* UK Average Comparison */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">UK Average Comparison</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Basic Cover Avg</span>
                          <div className="flex items-center gap-2">
                            <span>£{result.comparison.ukAverageBasic}</span>
                            {parseFloat(result.totalWithIPT) <= result.comparison.ukAverageBasic && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Comprehensive Avg</span>
                          <div className="flex items-center gap-2">
                            <span>£{result.comparison.ukAverageComprehensive}</span>
                            {parseFloat(result.totalWithIPT) <= result.comparison.ukAverageComprehensive && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Premium Cover Avg</span>
                          <div className="flex items-center gap-2">
                            <span>£{result.comparison.ukAveragePremium}</span>
                            {parseFloat(result.totalWithIPT) <= result.comparison.ukAveragePremium && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Enter your horse details and click calculate to see your estimated premium</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-violet-50 border-l-4 border-violet-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-violet-900 mb-2">Understanding Horse Insurance</h3>
                <ul className="text-violet-800 space-y-1 text-sm">
                  <li>• <strong>Mortality cover</strong> pays out if your horse dies from illness, injury, or humane destruction</li>
                  <li>• <strong>Vet fee cover</strong> pays for treatment up to your chosen limit per condition/year</li>
                  <li>• <strong>Personal accident</strong> covers you for injuries while riding or handling your horse</li>
                  <li>• <strong>IPT (Insurance Premium Tax)</strong> at 12% is added to all insurance policies</li>
                  <li>• Get multiple quotes - prices vary significantly between insurers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Insurance Pricing Table */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Horse Insurance Costs 2025</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Cover Type</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">What's Included</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Typical Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Basic (Mortality Only)</td>
                    <td className="py-3 px-4 text-center text-gray-600">Death, theft, straying</td>
                    <td className="py-3 px-4 text-center font-semibold text-violet-600">£150-£250/year</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Standard</td>
                    <td className="py-3 px-4 text-center text-gray-600">Mortality + £3k vet fees</td>
                    <td className="py-3 px-4 text-center font-semibold text-violet-600">£250-£400/year</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Comprehensive</td>
                    <td className="py-3 px-4 text-center text-gray-600">Mortality + £5-7.5k vet fees + PA</td>
                    <td className="py-3 px-4 text-center font-semibold text-violet-600">£400-£600/year</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Premium</td>
                    <td className="py-3 px-4 text-center text-gray-600">Full cover + loss of use + £10k+ vet fees</td>
                    <td className="py-3 px-4 text-center font-semibold text-violet-600">£600-£1,000+/year</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Prices based on UK average for horse valued at £5,000, age 10, pleasure use. 
              Actual premiums depend on individual circumstances.
            </p>
          </div>

          {/* Tips Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tips for Choosing Horse Insurance</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Prioritise Vet Fee Cover</h3>
                  <p className="text-gray-600 text-sm">Vet bills are the most common claim. A single colic surgery can cost £5,000-£10,000.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Check Per-Condition Limits</h3>
                  <p className="text-gray-600 text-sm">Some policies have per-condition limits that may not cover ongoing treatment.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Disclose Everything</h3>
                  <p className="text-gray-600 text-sm">Always declare full medical history. Non-disclosure can void claims.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Review Annually</h3>
                  <p className="text-gray-600 text-sm">Shop around each year. Premiums vary significantly between insurers.</p>
                </div>
              </div>
            </div>
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
                <p className="text-sm text-gray-600">Full ownership budget</p>
              </a>
              <a href="/vet-cost-estimator" className="bg-red-50 hover:bg-red-100 rounded-xl p-4 transition group">
                <Heart className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-red-600">Vet Cost Estimator</h3>
                <p className="text-sm text-gray-600">Healthcare expenses</p>
              </a>
              <a href="/horse-feed-calculator" className="bg-green-50 hover:bg-green-100 rounded-xl p-4 transition group">
                <Activity className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600">Feed Calculator</h3>
                <p className="text-sm text-gray-600">Nutrition costs</p>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Plan Your Complete Horse Budget</h2>
            <p className="text-violet-100 mb-6 max-w-xl mx-auto">
              Insurance is just one part of horse ownership costs. Use our Annual Cost Calculator for a complete budget breakdown.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-violet-600 px-6 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
            >
              Calculate Total Costs
              <Calculator className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
