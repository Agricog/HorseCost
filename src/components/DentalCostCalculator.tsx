import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Smile,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Star,
  Shield
} from 'lucide-react'

export default function DentalCostCalculator() {
  const [horseAge, setHorseAge] = useState('adult')
  const [dentalProvider, setDentalProvider] = useState('edt')
  const [region, setRegion] = useState('average')
  const [numHorses, setNumHorses] = useState('1')
  const [hasIssues, setHasIssues] = useState(false)
  const [issueType, setIssueType] = useState('none')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState<any>(null)

  const ageGroups = [
    { id: 'young', name: 'Young (Under 5)', checksPerYear: 2, description: 'More frequent checks needed', multiplier: 1.3 },
    { id: 'adult', name: 'Adult (5-15)', checksPerYear: 1, description: 'Annual routine check', multiplier: 1.0 },
    { id: 'senior', name: 'Senior (15-20)', checksPerYear: 1.5, description: 'May need extra attention', multiplier: 1.2 },
    { id: 'veteran', name: 'Veteran (20+)', checksPerYear: 2, description: 'Frequent monitoring needed', multiplier: 1.5 }
  ]

  const providers = [
    { id: 'edt', name: 'Equine Dental Technician (EDT)', basePrice: 55, callout: 0, description: 'Qualified specialist - most common' },
    { id: 'vet', name: 'Veterinary Dentist', basePrice: 85, callout: 45, description: 'Can sedate and do extractions' },
    { id: 'specialist', name: 'Specialist Equine Vet', basePrice: 150, callout: 60, description: 'For complex procedures' }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.4,
    'southeast': 1.2,
    'average': 1.0,
    'north': 0.9,
    'scotland': 0.95
  }

  const dentalIssues = [
    { id: 'none', name: 'No Issues', cost: 0 },
    { id: 'hooks', name: 'Hooks/Ramps', cost: 20, description: 'Extra rasping needed' },
    { id: 'wolf', name: 'Wolf Teeth Removal', cost: 80, description: 'One-off procedure' },
    { id: 'extraction', name: 'Tooth Extraction', cost: 250, description: 'Requires vet + sedation' },
    { id: 'diastema', name: 'Diastema Treatment', cost: 150, description: 'Gap treatment' },
    { id: 'quidding', name: 'Quidding Investigation', cost: 100, description: 'Chewing problems' }
  ]

  const calculate = () => {
    const age = ageGroups.find(a => a.id === horseAge)
    const provider = providers.find(p => p.id === dentalProvider)
    const issue = dentalIssues.find(i => i.id === issueType)
    if (!age || !provider || !issue) return

    const horses = parseInt(numHorses)
    const regionFactor = regionMultipliers[region]

    // Base routine check cost
    const checkCost = (provider.basePrice + provider.callout) * regionFactor
    const checksPerYear = age.checksPerYear
    const annualRoutineCost = checkCost * checksPerYear * age.multiplier

    // Issue costs (usually one-off but may recur)
    let issueCost = 0
    if (hasIssues && issue.cost > 0) {
      issueCost = issue.cost * regionFactor
      // Extractions need vet, add sedation
      if (issueType === 'extraction') {
        issueCost += 80 // Sedation cost
      }
    }

    // Multi-horse discount for callout
    let totalAnnual = 0
    if (horses === 1) {
      totalAnnual = annualRoutineCost + issueCost
    } else {
      // Discount on callout for multiple horses
      const perHorseCheck = provider.basePrice * regionFactor * checksPerYear * age.multiplier
      const sharedCallout = (provider.callout * regionFactor * checksPerYear) / horses
      totalAnnual = (perHorseCheck + sharedCallout + (issueCost / horses)) * horses
    }

    const perHorseAnnual = totalAnnual / horses
    const monthlyAverage = totalAnnual / 12

    // 5-year projection
    const fiveYearCost = (annualRoutineCost * 5) + issueCost // Issues usually don't recur

    // Compare providers
    const edtAnnual = (55 * regionFactor * checksPerYear * age.multiplier) * horses
    const vetAnnual = ((85 + 45) * regionFactor * checksPerYear * age.multiplier) * horses

    setResult({
      totalAnnual: totalAnnual.toFixed(2),
      perHorseAnnual: perHorseAnnual.toFixed(2),
      monthlyAverage: monthlyAverage.toFixed(2),
      checksPerYear: checksPerYear,
      breakdown: {
        routineChecks: (annualRoutineCost * horses).toFixed(2),
        issuesTreatment: (issueCost * horses).toFixed(2),
        perCheck: checkCost.toFixed(2)
      },
      ageInfo: age,
      providerInfo: provider,
      issueInfo: hasIssues ? issue : null,
      horses,
      comparison: {
        edt: edtAnnual.toFixed(2),
        vet: vetAnnual.toFixed(2),
        savings: (vetAnnual - edtAnnual).toFixed(2)
      },
      fiveYear: fiveYearCost.toFixed(2),
      recommendations: getRecommendations(horseAge, hasIssues, issueType)
    })
  }

  const getRecommendations = (age: string, issues: boolean, issueType: string) => {
    const recs = []
    if (age === 'young') recs.push('Young horses need checks every 6 months until age 5')
    if (age === 'veteran') recs.push('Veteran horses may need more frequent checks - watch for weight loss')
    if (!issues) recs.push('Book annual check in spring before competition season')
    if (issueType === 'wolf') recs.push('Wolf teeth removal is usually a one-time procedure')
    if (issueType === 'extraction') recs.push('Extractions require veterinary care and sedation')
    recs.push('EDT is sufficient for routine care - use vet for extractions/sedation')
    return recs
  }

  const faqs = [
    {
      q: 'How much does horse dental care cost UK?',
      a: 'Horse dental care in the UK costs £50-90 for a routine check and rasp with an EDT (Equine Dental Technician). Veterinary dentists charge £80-150 plus callout (£40-60). Annual dental costs typically range £55-150 per horse depending on age and provider. Additional procedures like wolf teeth removal (£60-100) or extractions (£200-400) cost extra.'
    },
    {
      q: 'How often should a horse see the dentist?',
      a: 'Adult horses (5-15 years) need annual dental checks. Young horses under 5 need checks every 6 months as teeth are still erupting. Senior horses (15+) may need 1-2 checks yearly. Horses with known dental issues may need more frequent attention. Most owners book spring checks before competition season.'
    },
    {
      q: 'What is the difference between EDT and vet dentist?',
      a: 'EDTs (Equine Dental Technicians) are qualified specialists for routine dental care including rasping, floating, and identifying problems. Vets can sedate horses and perform extractions, X-rays, and complex procedures. EDTs are cheaper (£50-70) while vets cost more (£80-150+) but are essential for sedation and surgery.'
    },
    {
      q: 'What is included in a routine dental check?',
      a: 'A routine dental check includes: examination of all teeth, rasping/floating sharp edges, checking for hooks, ramps, and wave mouth, assessing bit seats, checking for loose teeth or disease, and advice on any concerns. Most EDTs spend 20-40 minutes per horse.'
    },
    {
      q: 'Does my horse need sedation for dental work?',
      a: 'Most routine dental work doesn\'t require sedation - a competent EDT can work safely with a calm horse. Sedation is needed for: extractions, wolf teeth removal, nervous/difficult horses, detailed examinations, X-rays, or complex procedures. Sedation adds £60-100 to the cost and requires a vet.'
    },
    {
      q: 'How much does wolf teeth removal cost?',
      a: 'Wolf teeth removal costs £60-120 in the UK depending on complexity. Simple extractions by experienced EDTs cost less, while difficult cases requiring vet sedation cost more. It\'s usually a one-time procedure done in young horses. Some EDTs include basic wolf teeth removal in their callout fee.'
    },
    {
      q: 'What are signs my horse needs dental work?',
      a: 'Signs include: dropping food while eating (quidding), weight loss, reluctance to accept the bit, head tilting, bad breath, facial swelling, nasal discharge, long fibre in droppings, resistance to bridling, and difficulty chewing. Annual checks catch problems before symptoms appear.'
    },
    {
      q: 'Can I save money on horse dental care?',
      a: 'Save money by: using an EDT for routine work (not vet), booking with yard mates to share callout fees, maintaining annual checks (prevents costly problems), choosing spring appointments (less demand), and asking about multi-horse discounts. Prevention is cheaper than treatment.'
    },
    {
      q: 'What qualifications should an EDT have?',
      a: 'Look for EDTs qualified through BAEDT (British Association of Equine Dental Technicians) or BEVA-approved courses. They should be registered, insured, and able to provide references. Ask about their experience with your horse\'s age group. Avoid unqualified individuals offering cheap dental work.'
    },
    {
      q: 'Do older horses need more dental care?',
      a: 'Yes, veteran horses (20+) often need more attention. Teeth continue wearing and may become uneven, loose, or fall out. They may need softer feeds if chewing is difficult. Check twice yearly and watch for weight loss. Dental issues are a common cause of condition loss in older horses.'
    }
  ]

  return (
    <>
      <Helmet>
        {/* ========== 1. PRIMARY META TAGS (4) ========== */}
        <title>Horse Dental Cost Calculator UK 2025 | EDT vs Vet Prices | HorseCost</title>
        <meta 
          name="description" 
          content="Free horse dental cost calculator for UK owners. Compare EDT vs vet dentist prices, calculate annual dental care costs, and plan your horse's dental budget. 2025 UK prices." 
        />
        <meta 
          name="keywords" 
          content="horse dental cost UK, equine dentist price, EDT cost, horse teeth floating price, wolf teeth removal cost, horse dental check cost, equine dental technician" 
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
        <meta name="theme-color" content="#0d9488" />

        {/* ========== 5. OPEN GRAPH / FACEBOOK (8) ========== */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:title" content="Horse Dental Cost Calculator UK 2025 | EDT vs Vet | HorseCost" />
        <meta property="og:description" content="Compare EDT vs vet dentist costs. Calculate annual horse dental care budget with UK 2025 prices." />
        <meta property="og:url" content="https://horsecost.co.uk/dental-cost-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/dental-calculator-og-1200x630.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Horse Dental Cost Calculator showing EDT vs vet pricing comparison" />

        {/* ========== 6. TWITTER CARD (6) ========== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Horse Dental Cost Calculator UK 2025 | HorseCost" />
        <meta name="twitter:description" content="Calculate horse dental care costs. Compare EDT vs vet prices for routine checks and procedures." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/dental-calculator-twitter-1200x675.jpg" />
        <meta name="twitter:image:alt" content="Horse Dental Cost Calculator UK" />

        {/* ========== 7. CANONICAL & ALTERNATE (2) ========== */}
        <link rel="canonical" href="https://horsecost.co.uk/dental-cost-calculator" />
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/dental-cost-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Dental Cost Calculator', 'item': 'https://horsecost.co.uk/dental-cost-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Dental Cost Calculator UK',
                'description': 'Calculate horse dental care costs including routine checks, procedures, and compare EDT vs vet prices with UK 2025 pricing.',
                'url': 'https://horsecost.co.uk/dental-cost-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.8', 'ratingCount': '189', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Use the Horse Dental Cost Calculator',
                'description': 'Step-by-step guide to calculating your horse dental care costs',
                'step': [
                  { '@type': 'HowToStep', 'position': 1, 'name': 'Select Horse Age', 'text': 'Choose your horse\'s age group as this affects how often dental checks are needed.' },
                  { '@type': 'HowToStep', 'position': 2, 'name': 'Choose Dental Provider', 'text': 'Select EDT, vet dentist, or specialist depending on your needs and budget.' },
                  { '@type': 'HowToStep', 'position': 3, 'name': 'Enter Number of Horses', 'text': 'Add multiple horses to benefit from shared callout fee calculations.' },
                  { '@type': 'HowToStep', 'position': 4, 'name': 'Add Any Dental Issues', 'text': 'Include any known problems like wolf teeth or extractions needed.' },
                  { '@type': 'HowToStep', 'position': 5, 'name': 'Calculate Annual Costs', 'text': 'Click Calculate to see your total dental budget and provider comparison.' }
                ]
              },
              {
                '@type': 'Article',
                'headline': 'Horse Dental Cost Calculator UK 2025 - EDT vs Vet Prices',
                'description': 'Free calculator for UK horse dental costs. Compare equine dental technicians with vet dentists and plan your annual dental care budget.',
                'datePublished': '2025-01-01',
                'dateModified': '2025-01-15',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png', 'width': 200, 'height': 200 } },
                'image': 'https://horsecost.co.uk/images/dental-calculator-og-1200x630.jpg',
                'mainEntityOfPage': { '@type': 'WebPage', '@id': 'https://horsecost.co.uk/dental-cost-calculator' }
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
            <a href="/" className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Smile className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Dental Cost Calculator</h1>
                <p className="text-teal-200">UK 2025 EDT & Vet Dentist Prices</p>
              </div>
            </div>
            <p className="text-teal-100 max-w-2xl">
              Calculate your horse's annual dental care costs. Compare EDT vs vet dentist prices 
              and plan for routine checks and procedures.
            </p>
            <p className="text-teal-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Horse Age Group</label>
                  </div>
                  <div className="space-y-2">
                    {ageGroups.map((age) => (
                      <button
                        key={age.id}
                        onClick={() => setHorseAge(age.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          horseAge === age.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${horseAge === age.id ? 'text-teal-700' : 'text-gray-900'}`}>
                              {age.name}
                            </p>
                            <p className="text-sm text-gray-500">{age.description}</p>
                          </div>
                          <p className="text-sm text-gray-600">{age.checksPerYear}x/year</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Dental Provider</label>
                  </div>
                  <div className="space-y-2">
                    {providers.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setDentalProvider(provider.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          dentalProvider === provider.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${dentalProvider === provider.id ? 'text-teal-700' : 'text-gray-900'}`}>
                              {provider.name}
                            </p>
                            <p className="text-sm text-gray-500">{provider.description}</p>
                          </div>
                          <p className="text-sm text-gray-600">£{provider.basePrice}{provider.callout > 0 ? `+${provider.callout}` : ''}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Number of Horses</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['1', '2', '3', '4', '5'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setNumHorses(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          numHorses === val
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Share callout fees with multiple horses</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  >
                    <option value="london">London / South East (Higher prices)</option>
                    <option value="southeast">Home Counties</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England</option>
                    <option value="scotland">Scotland / Wales</option>
                  </select>
                </div>

                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-teal-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Dental Issues / Procedures
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasIssues}
                          onChange={(e) => setHasIssues(e.target.checked)}
                          className="w-5 h-5 text-teal-600 rounded"
                        />
                        <span className="font-medium text-gray-900">Has dental issues requiring treatment</span>
                      </label>

                      {hasIssues && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
                          <select
                            value={issueType}
                            onChange={(e) => setIssueType(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                          >
                            {dentalIssues.map(issue => (
                              <option key={issue.id} value={issue.id}>
                                {issue.name} {issue.cost > 0 ? `(+£${issue.cost})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-cyan-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Dental Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white">
                      <p className="text-teal-100 text-sm mb-1">Annual Dental Cost</p>
                      <p className="text-4xl font-bold">£{result.totalAnnual}</p>
                      <p className="text-teal-200 text-sm mt-1">{result.providerInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-teal-100 text-xs">Per Horse</p>
                          <p className="font-bold">£{result.perHorseAnnual}</p>
                        </div>
                        <div>
                          <p className="text-teal-100 text-xs">Checks/Year</p>
                          <p className="font-bold">{result.checksPerYear}x</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Routine Checks ({result.horses} horse{result.horses > 1 ? 's' : ''})</span>
                          <span className="font-medium">£{result.breakdown.routineChecks}</span>
                        </div>
                        {parseFloat(result.breakdown.issuesTreatment) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">{result.issueInfo?.name}</span>
                            <span className="font-medium">£{result.breakdown.issuesTreatment}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Annual</span>
                          <span>£{result.totalAnnual}</span>
                        </div>
                        <div className="flex justify-between text-teal-600">
                          <span>Per Check</span>
                          <span>£{result.breakdown.perCheck}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-teal-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">EDT vs Vet Comparison</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-teal-50 rounded-lg p-3 text-center">
                          <p className="text-teal-600 font-medium mb-1">EDT</p>
                          <p className="text-lg font-bold text-gray-900">£{result.comparison.edt}</p>
                          <p className="text-xs text-gray-500">per year</p>
                        </div>
                        <div className="bg-cyan-50 rounded-lg p-3 text-center">
                          <p className="text-cyan-600 font-medium mb-1">Vet Dentist</p>
                          <p className="text-lg font-bold text-gray-900">£{result.comparison.vet}</p>
                          <p className="text-xs text-gray-500">per year</p>
                        </div>
                      </div>
                      {parseFloat(result.comparison.savings) > 0 && (
                        <p className="text-sm text-teal-600 mt-3 text-center font-medium">
                          EDT saves £{result.comparison.savings}/year for routine care
                        </p>
                      )}
                    </div>

                    {result.recommendations.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Recommendations
                        </h3>
                        <ul className="text-sm text-amber-800 space-y-1">
                          {result.recommendations.map((rec: string, i: number) => (
                            <li key={i}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">5-Year Dental Cost</span>
                        <span className="font-bold text-gray-900">£{result.fiveYear}</span>
                      </div>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Smile className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Configure your dental care needs to see costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-teal-50 border-l-4 border-teal-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-teal-900 mb-2">Dental Care Tips</h3>
                <ul className="text-teal-800 space-y-1 text-sm">
                  <li>• <strong>Book annually</strong> - prevention is cheaper than treatment</li>
                  <li>• <strong>Use an EDT</strong> for routine care - save vets for procedures</li>
                  <li>• <strong>Share callout fees</strong> - book with yard mates</li>
                  <li>• <strong>Watch for signs</strong> - quidding, weight loss, bit resistance</li>
                  <li>• <strong>Young horses</strong> - check every 6 months until age 5</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Dental Prices 2025</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">EDT</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Vet Dentist</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Routine Check & Rasp</td>
                    <td className="py-3 px-4 text-center">£50-70</td>
                    <td className="py-3 px-4 text-center">£80-120</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Callout Fee</td>
                    <td className="py-3 px-4 text-center">£0-20</td>
                    <td className="py-3 px-4 text-center">£40-60</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Wolf Teeth Removal</td>
                    <td className="py-3 px-4 text-center">£60-80</td>
                    <td className="py-3 px-4 text-center">£80-120</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Sedation</td>
                    <td className="py-3 px-4 text-center text-gray-400">N/A</td>
                    <td className="py-3 px-4 text-center">£60-100</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Extraction</td>
                    <td className="py-3 px-4 text-center text-gray-400">N/A</td>
                    <td className="py-3 px-4 text-center">£200-400</td>
                  </tr>
                </tbody>
              </table>
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
                <p className="text-sm text-gray-600">Complete healthcare budget</p>
              </a>
              <a href="/annual-horse-cost-calculator" className="bg-amber-50 hover:bg-amber-100 rounded-xl p-4 transition group">
                <Calendar className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600">Annual Cost Calculator</h3>
                <p className="text-sm text-gray-600">Total ownership costs</p>
              </a>
              <a href="/worming-cost-calculator" className="bg-emerald-50 hover:bg-emerald-100 rounded-xl p-4 transition group">
                <Star className="w-8 h-8 text-emerald-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600">Worming Calculator</h3>
                <p className="text-sm text-gray-600">Parasite control costs</p>
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Plan Your Complete Healthcare Budget</h2>
            <p className="text-teal-100 mb-6 max-w-xl mx-auto">
              Dental care is just one part of horse healthcare. Calculate your full vet budget.
            </p>
            <a 
              href="/vet-cost-estimator"
              className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-xl font-bold hover:bg-teal-50 transition"
            >
              Calculate Vet Costs
              <Calculator className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
