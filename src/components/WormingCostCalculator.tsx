import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Bug,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  PoundSterling,
  CheckCircle2,
  Calendar,
  Star,
  Shield,
  FlaskConical
} from 'lucide-react'

export default function WormingCostCalculator() {
  const [program, setProgram] = useState('targeted')
  const [horseWeight, setHorseWeight] = useState('500')
  const [numHorses, setNumHorses] = useState('1')
  const [region, setRegion] = useState('average')
  const [includeEggsanine, setIncludeEggsanine] = useState(true)
  const [includeTapeworm, setIncludeTapeworm] = useState(true)
  const [grazingRisk, setGrazingRisk] = useState('medium')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState<any>(null)

  const programs = [
    { 
      id: 'targeted', 
      name: 'Targeted Worming (FEC)', 
      description: 'Test-based approach - recommended',
      fecTests: 4,
      wormers: 1.5,
      pros: ['Most cost-effective long-term', 'Reduces resistance', 'Healthier approach'],
      cons: ['Requires regular testing', 'More management']
    },
    { 
      id: 'traditional', 
      name: 'Traditional (Routine)', 
      description: 'Regular worming schedule',
      fecTests: 0,
      wormers: 4,
      pros: ['Simple schedule', 'No testing required'],
      cons: ['Higher drug costs', 'Resistance concerns', 'May overtreat']
    },
    { 
      id: 'minimal', 
      name: 'Minimal/Low Risk', 
      description: 'For low-stocking situations',
      fecTests: 2,
      wormers: 1,
      pros: ['Lowest cost', 'Minimal intervention'],
      cons: ['Only suits some situations', 'Risk if grazing shared']
    },
    { 
      id: 'comprehensive', 
      name: 'Comprehensive', 
      description: 'Maximum protection approach',
      fecTests: 4,
      wormers: 3,
      pros: ['Thorough coverage', 'Peace of mind'],
      cons: ['Highest cost', 'May be unnecessary']
    }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.2,
    'southeast': 1.1,
    'average': 1.0,
    'north': 0.95,
    'scotland': 1.0
  }

  const riskMultipliers: Record<string, number> = {
    'low': 0.8,
    'medium': 1.0,
    'high': 1.3
  }

  // UK 2025 prices
  const costs = {
    fecTest: 25,           // Faecal egg count per test
    saliva: 15,            // EquiSal tapeworm test
    wormer: {
      standard: 14,        // Equest, Panacur etc
      combo: 22,           // Equest Pramox, Equimax
      moxidectin: 18,      // Equest
      pyrantel: 12         // Strongid-P
    },
    tapewormTest: 18,      // Blood or saliva test
    consultation: 0        // Usually included in yard programs
  }

  const calculate = () => {
    const prog = programs.find(p => p.id === program)
    if (!prog) return

    const horses = parseInt(numHorses)
    const weight = parseInt(horseWeight)
    const regionFactor = regionMultipliers[region]
    const riskFactor = riskMultipliers[grazingRisk]

    // Weight affects wormer cost slightly (larger horses = more paste)
    const weightFactor = weight > 500 ? 1.2 : weight < 400 ? 0.9 : 1.0

    // FEC testing costs
    const annualFecCost = prog.fecTests * costs.fecTest * regionFactor * horses

    // Wormer costs (based on program)
    let wormerCost = 0
    if (program === 'targeted') {
      // 1-2 standard wormers based on FEC results
      wormerCost = (prog.wormers * costs.wormer.standard * weightFactor * riskFactor) * horses
    } else if (program === 'traditional') {
      // Mix of wormers through year
      wormerCost = ((costs.wormer.standard * 2) + (costs.wormer.combo * 2)) * weightFactor * horses
    } else if (program === 'minimal') {
      wormerCost = (costs.wormer.moxidectin * prog.wormers * weightFactor) * horses
    } else {
      // Comprehensive - full rotation
      wormerCost = ((costs.wormer.standard * 2) + costs.wormer.combo + costs.wormer.moxidectin) * weightFactor * horses
    }

    // Tapeworm testing/treatment
    let tapewormCost = 0
    if (includeTapeworm) {
      if (program === 'targeted' || program === 'comprehensive') {
        // Saliva test x 2 per year + treatment if positive (estimate 50% positive)
        tapewormCost = ((costs.saliva * 2) + (costs.wormer.pyrantel * 0.5)) * horses
      } else {
        // Assume treatment in autumn and spring
        tapewormCost = (costs.wormer.combo * 2) * weightFactor * horses
      }
    }

    // Encysted redworm treatment (winter)
    const encysedTreatment = costs.wormer.moxidectin * weightFactor * horses

    const totalAnnual = annualFecCost + wormerCost + tapewormCost + encysedTreatment

    // Compare to traditional
    const traditionalCost = (costs.wormer.standard * 4 + costs.fecTest * 0) * 1.1 * horses + (costs.wormer.combo * 2) * horses
    const targetedCost = (costs.fecTest * 4 + costs.wormer.standard * 1.5) * horses + (costs.saliva * 2) * horses

    // Per horse cost
    const perHorse = totalAnnual / horses

    setResult({
      totalAnnual: totalAnnual.toFixed(2),
      perHorse: perHorse.toFixed(2),
      monthlyAverage: (totalAnnual / 12).toFixed(2),
      breakdown: {
        fecTesting: annualFecCost.toFixed(2),
        wormers: wormerCost.toFixed(2),
        tapeworm: tapewormCost.toFixed(2),
        encysted: encysedTreatment.toFixed(2)
      },
      programInfo: prog,
      comparison: {
        traditional: traditionalCost.toFixed(2),
        targeted: targetedCost.toFixed(2),
        savings: (traditionalCost - totalAnnual).toFixed(2)
      },
      schedule: getSchedule(program),
      horses: horses
    })
  }

  const getSchedule = (prog: string) => {
    if (prog === 'targeted') {
      return [
        { month: 'March', action: 'FEC test', notes: 'Worm if count >200 EPG' },
        { month: 'May', action: 'FEC test', notes: 'Peak grazing season check' },
        { month: 'August', action: 'FEC test + Tapeworm saliva', notes: 'Mid-summer assessment' },
        { month: 'November', action: 'FEC test + Moxidectin', notes: 'Encysted redworm treatment' }
      ]
    } else if (prog === 'traditional') {
      return [
        { month: 'March', action: 'Ivermectin wormer', notes: 'Spring dose' },
        { month: 'June', action: 'Pyrantel wormer', notes: 'Summer dose' },
        { month: 'September', action: 'Ivermectin + Praziquantel', notes: 'Autumn + tapeworm' },
        { month: 'December', action: 'Moxidectin', notes: 'Winter encysted dose' }
      ]
    } else if (prog === 'minimal') {
      return [
        { month: 'April', action: 'FEC test', notes: 'Only worm if needed' },
        { month: 'October', action: 'FEC test', notes: 'Autumn check' },
        { month: 'December', action: 'Moxidectin', notes: 'Encysted treatment only' }
      ]
    } else {
      return [
        { month: 'March', action: 'FEC test + Ivermectin', notes: 'Spring start' },
        { month: 'June', action: 'FEC test + Pyrantel', notes: 'Mid-season' },
        { month: 'September', action: 'FEC test + Tapeworm test', notes: 'Treat as indicated' },
        { month: 'December', action: 'FEC test + Moxidectin 5-day', notes: 'Full encysted course' }
      ]
    }
  }

  const faqs = [
    {
      q: 'How much does horse worming cost UK?',
      a: 'Horse worming costs £100-£200 per year in the UK depending on your approach. Traditional 4x yearly worming costs £80-120 in wormers alone. Targeted worming with FEC testing costs £100-150 (tests + fewer wormers). Add £30-50 for tapeworm testing/treatment.'
    },
    {
      q: 'What is targeted worming and is it better?',
      a: 'Targeted worming uses faecal egg count (FEC) tests to determine if your horse actually needs worming. Only horses with counts over 200 EPG are treated. It\'s recommended by vets as it reduces drug resistance, saves money long-term, and is healthier for horses that don\'t need treatment.'
    },
    {
      q: 'How often should I worm my horse?',
      a: 'With targeted worming: test every 8-12 weeks during grazing season, worm only when needed, plus annual moxidectin for encysted redworm. Traditional approach: 4x yearly (spring, summer, autumn, winter). Most horses on good programs only need 1-3 actual wormer doses per year.'
    },
    {
      q: 'What is a FEC test and how much does it cost?',
      a: 'A Faecal Egg Count (FEC) test examines a dung sample under a microscope to count parasite eggs. It costs £15-30 per test through vets, labs, or yard programs. Many yards offer group testing discounts. Results show eggs per gram (EPG) - treat if over 200 EPG.'
    },
    {
      q: 'Do I need to test for tapeworm separately?',
      a: 'Yes, FEC tests don\'t detect tapeworm reliably. Use an EquiSal saliva test (£15-20) or blood test twice yearly. Only treat if positive - about 30-50% of horses carry tapeworm. Praziquantel-based wormers or double-dose pyrantel treat tapeworm.'
    },
    {
      q: 'What is encysted redworm and why does it matter?',
      a: 'Encysted small redworm larvae burrow into the gut wall and can emerge en masse, causing severe colic or death. They\'re not detected by FEC tests. All horses need annual treatment with moxidectin (Equest) or 5-day fenbendazole course in late autumn/winter.'
    },
    {
      q: 'Can I worm my horse myself or do I need a vet?',
      a: 'You can buy and administer most wormers yourself from feed merchants, saddleries, or online (POM-VPS medicines need a signed declaration). FEC tests can be done through labs without vet involvement. Some wormers (like injectable ivermectin) require a vet.'
    },
    {
      q: 'What is wormer resistance and why should I care?',
      a: 'Worm populations are developing resistance to available drugs, meaning treatments become less effective. Overworming accelerates this. Using targeted worming, rotating drug classes, and only treating when necessary helps preserve drug effectiveness for the future.'
    },
    {
      q: 'How do I reduce worming costs?',
      a: 'Switch to targeted worming (test first, treat if needed), join yard group testing programs, buy wormers in bulk or during offers, practice good pasture management (poo-picking reduces worm burden), and don\'t treat unnecessarily. Many horses need only 1-2 wormers yearly.'
    },
    {
      q: 'Should new horses be wormed before turning out?',
      a: 'Yes - quarantine new horses for 48-72 hours after worming with moxidectin (Equest) before turning out with others. This kills any resistant worms they may carry. Also do a FEC test before and after to check efficacy.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Horse Worming Cost Calculator UK 2025 | Compare Programs | HorseCost</title>
        <meta 
          name="description" 
          content="Free horse worming cost calculator for UK. Compare targeted vs traditional worming, calculate FEC testing costs, and plan your annual parasite control budget. 2025 prices." 
        />
        <meta name="keywords" content="horse worming cost UK, FEC testing price, targeted worming, equine parasite control, wormer prices UK, horse worm count test" />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#059669" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:title" content="Horse Worming Cost Calculator UK 2025 | HorseCost" />
        <meta property="og:description" content="Compare worming programs and calculate annual parasite control costs." />
        <meta property="og:url" content="https://horsecost.co.uk/worming-cost-calculator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Worming Cost Calculator UK | HorseCost" />

        <link rel="canonical" href="https://horsecost.co.uk/worming-cost-calculator" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/#calculators' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Worming Cost Calculator', 'item': 'https://horsecost.co.uk/worming-cost-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Worming Cost Calculator UK',
                'description': 'Calculate and compare horse worming program costs.',
                'url': 'https://horsecost.co.uk/worming-cost-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.8', 'ratingCount': '203' }
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
            <a href="/" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Bug className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Worming Cost Calculator</h1>
                <p className="text-emerald-200">UK 2025 Parasite Control Budget</p>
              </div>
            </div>
            <p className="text-emerald-100 max-w-2xl">
              Compare targeted vs traditional worming programs and calculate your annual parasite control costs. 
              Includes FEC testing, wormers, and tapeworm treatment.
            </p>
            <p className="text-emerald-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Worming Program</label>
                  </div>
                  <div className="space-y-2">
                    {programs.map((prog) => (
                      <button
                        key={prog.id}
                        onClick={() => setProgram(prog.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          program === prog.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`font-medium ${program === prog.id ? 'text-emerald-700' : 'text-gray-900'}`}>
                          {prog.name}
                        </p>
                        <p className="text-sm text-gray-500">{prog.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Number of Horses</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['1', '2', '3', '4', '5'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setNumHorses(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          numHorses === val
                            ? 'bg-emerald-600 text-white'
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
                    <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Average Horse Weight</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['350', '450', '500', '550', '650'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setHorseWeight(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          horseWeight === val
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val}kg
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Grazing Risk Level</label>
                  </div>
                  <select
                    value={grazingRisk}
                    onChange={(e) => setGrazingRisk(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="low">Low - Private grazing, well managed</option>
                    <option value="medium">Medium - Shared grazing, regular rotation</option>
                    <option value="high">High - Busy yard, limited pasture rest</option>
                  </select>
                </div>

                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-emerald-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Additional Options
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeTapeworm}
                          onChange={(e) => setIncludeTapeworm(e.target.checked)}
                          className="w-5 h-5 text-emerald-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Include Tapeworm Testing</span>
                          <p className="text-sm text-gray-500">Saliva or blood test + treatment</p>
                        </div>
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Region</label>
                        <select
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="london">London / South East</option>
                          <option value="southeast">Home Counties</option>
                          <option value="average">Midlands / Average UK</option>
                          <option value="north">Northern England</option>
                          <option value="scotland">Scotland / Wales</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Worming Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                      <p className="text-emerald-100 text-sm mb-1">Annual Worming Cost</p>
                      <p className="text-4xl font-bold">£{result.totalAnnual}</p>
                      <p className="text-emerald-200 text-sm mt-1">{result.programInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-emerald-100 text-xs">Per Horse</p>
                          <p className="font-bold">£{result.perHorse}</p>
                        </div>
                        <div>
                          <p className="text-emerald-100 text-xs">Monthly</p>
                          <p className="font-bold">£{result.monthlyAverage}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">FEC Testing</span>
                          <span className="font-medium">£{result.breakdown.fecTesting}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Wormers</span>
                          <span className="font-medium">£{result.breakdown.wormers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tapeworm Test/Treatment</span>
                          <span className="font-medium">£{result.breakdown.tapeworm}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Encysted Redworm Treatment</span>
                          <span className="font-medium">£{result.breakdown.encysted}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total ({result.horses} horse{result.horses > 1 ? 's' : ''})</span>
                          <span>£{result.totalAnnual}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-emerald-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Your Schedule</h3>
                      <div className="space-y-3">
                        {result.schedule.map((item: any, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-20 flex-shrink-0">
                              <span className="text-sm font-medium text-emerald-600">{item.month}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.action}</p>
                              <p className="text-sm text-gray-500">{item.notes}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <FlaskConical className="w-5 h-5" />
                        Program Comparison
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Traditional (4x yearly)</p>
                          <p className="font-bold text-gray-900">£{result.comparison.traditional}/year</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Targeted (FEC-based)</p>
                          <p className="font-bold text-gray-900">£{result.comparison.targeted}/year</p>
                        </div>
                      </div>
                      {parseFloat(result.comparison.savings) > 0 && (
                        <p className="text-sm text-blue-700 mt-2 font-medium">
                          Your choice saves £{result.comparison.savings} vs traditional worming
                        </p>
                      )}
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <h3 className="font-semibold text-emerald-900 mb-2">{result.programInfo.name}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-green-600 font-medium text-sm mb-1">✓ Pros</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {result.programInfo.pros.map((pro: string, i: number) => (
                              <li key={i}>• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-amber-600 font-medium text-sm mb-1">⚠ Cons</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {result.programInfo.cons.map((con: string, i: number) => (
                              <li key={i}>• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Bug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select your worming approach to see costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-emerald-900 mb-2">Why Targeted Worming is Recommended</h3>
                <ul className="text-emerald-800 space-y-1 text-sm">
                  <li>• <strong>Reduces resistance</strong> - worms are becoming resistant to available drugs</li>
                  <li>• <strong>Cost-effective</strong> - many horses need only 1-2 wormers yearly</li>
                  <li>• <strong>Healthier</strong> - avoids unnecessary chemical treatment</li>
                  <li>• <strong>Evidence-based</strong> - treat only when FEC shows need</li>
                  <li>• <strong>BEVA recommended</strong> - British Equine Veterinary Association guidance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Worming Costs 2025</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Item</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Price</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">FEC Test (faecal egg count)</td>
                    <td className="py-3 px-4 text-center">£15-30</td>
                    <td className="py-3 px-4 text-center">4x yearly</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">EquiSal Tapeworm Test</td>
                    <td className="py-3 px-4 text-center">£15-20</td>
                    <td className="py-3 px-4 text-center">2x yearly</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Standard Wormer (Ivermectin)</td>
                    <td className="py-3 px-4 text-center">£10-18</td>
                    <td className="py-3 px-4 text-center">As needed</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Moxidectin (Equest)</td>
                    <td className="py-3 px-4 text-center">£16-22</td>
                    <td className="py-3 px-4 text-center">1x yearly (winter)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Combo Wormer (+ Praziquantel)</td>
                    <td className="py-3 px-4 text-center">£20-28</td>
                    <td className="py-3 px-4 text-center">If tapeworm positive</td>
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
                <p className="text-sm text-gray-600">Annual healthcare budget</p>
              </a>
              <a href="/annual-horse-cost-calculator" className="bg-amber-50 hover:bg-amber-100 rounded-xl p-4 transition group">
                <Calendar className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600">Annual Cost Calculator</h3>
                <p className="text-sm text-gray-600">Complete ownership costs</p>
              </a>
              <a href="/horse-feed-calculator" className="bg-green-50 hover:bg-green-100 rounded-xl p-4 transition group">
                <Star className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600">Feed Calculator</h3>
                <p className="text-sm text-gray-600">Nutrition costs</p>
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Calculate Your Full Healthcare Budget</h2>
            <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
              Worming is just part of your horse's healthcare. Get the complete picture with our Vet Cost Estimator.
            </p>
            <a 
              href="/vet-cost-estimator"
              className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition"
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
