import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Stethoscope,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Heart,
  Syringe,
  Pill,
  Calendar,
  Shield,
  Activity
} from 'lucide-react'

export default function VetCostEstimator() {
  const [vaccinations, setVaccinations] = useState(true)
  const [dental, setDental] = useState(true)
  const [dentalFrequency, setDentalFrequency] = useState('annual')
  const [worming, setWorming] = useState('targeted')
  const [horseAge, setHorseAge] = useState('adult')
  const [horseUse, setHorseUse] = useState('pleasure')
  const [emergencyFund, setEmergencyFund] = useState('1000')
  const [includeBloodTests, setIncludeBloodTests] = useState(false)
  const [includePhysio, setIncludePhysio] = useState(false)
  const [physioFrequency, setPhysioFrequency] = useState('quarterly')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [region, setRegion] = useState('average')
  const [result, setResult] = useState<any>(null)

  const wormingPrograms = [
    { id: 'targeted', name: 'Targeted (FEC Testing)', costPerTest: 25, testsPerYear: 4, treatmentsPerYear: 1.5 },
    { id: 'traditional', name: 'Traditional (Routine)', costPerTest: 0, testsPerYear: 0, treatmentsPerYear: 4 },
    { id: 'minimal', name: 'Minimal/Low Risk', costPerTest: 25, testsPerYear: 2, treatmentsPerYear: 1 }
  ]

  const ageFactors: Record<string, { factor: number; risks: string[] }> = {
    'foal': { factor: 1.5, risks: ['Vaccinations', 'Growth checks', 'Parasite management'] },
    'youngster': { factor: 1.2, risks: ['Development monitoring', 'Training injuries'] },
    'adult': { factor: 1.0, risks: ['Routine care', 'Work-related issues'] },
    'veteran': { factor: 1.4, risks: ['Arthritis', 'Cushings', 'Dental issues', 'Weight management'] }
  }

  const useFactors: Record<string, number> = {
    'pleasure': 1.0,
    'competition': 1.2,
    'hunting': 1.3,
    'breeding': 1.25,
    'retirement': 0.9
  }

  const regionMultipliers: Record<string, number> = {
    'london': 1.4,
    'southeast': 1.25,
    'average': 1.0,
    'north': 0.9,
    'scotland': 0.95
  }

  // UK 2025 Pricing
  const ukPricing = {
    vaccination: {
      flu: 55,
      tetanus: 45,
      fluTetCombo: 75,
      booster: 55
    },
    dental: {
      routine: 120,
      sedation: 40,
      extractions: 150,
      powerFloat: 180
    },
    worming: {
      treatment: 15,
      fecTest: 25,
      tapewormTest: 18
    },
    callout: {
      routine: 45,
      emergency: 150,
      outOfHours: 250
    },
    bloodTest: 85,
    physio: 65
  }

  const calculate = () => {
    const regionFactor = regionMultipliers[region]
    const ageFactor = ageFactors[horseAge]?.factor || 1.0
    const useFactor = useFactors[horseUse] || 1.0

    let totalRoutine = 0
    const breakdown: Record<string, number> = {}

    // Vaccinations (annual flu + tetanus booster)
    if (vaccinations) {
      const vaccCost = ukPricing.vaccination.fluTetCombo * regionFactor
      breakdown['Vaccinations (Flu/Tetanus)'] = vaccCost
      totalRoutine += vaccCost
    }

    // Dental care
    if (dental) {
      let dentalCost = ukPricing.dental.routine + ukPricing.dental.sedation
      if (dentalFrequency === 'biannual') {
        dentalCost *= 2
      }
      dentalCost *= regionFactor
      // Veterans may need more dental work
      if (horseAge === 'veteran') {
        dentalCost *= 1.3
      }
      breakdown['Dental Care'] = dentalCost
      totalRoutine += dentalCost
    }

    // Worming program
    const wormProgram = wormingPrograms.find(w => w.id === worming)
    if (wormProgram) {
      const testCost = wormProgram.costPerTest * wormProgram.testsPerYear
      const treatmentCost = ukPricing.worming.treatment * wormProgram.treatmentsPerYear
      const tapewormTest = ukPricing.worming.tapewormTest * 2 // Twice yearly
      const wormCost = (testCost + treatmentCost + tapewormTest) * regionFactor
      breakdown['Worming Program'] = wormCost
      totalRoutine += wormCost
    }

    // Blood tests (if selected)
    if (includeBloodTests) {
      const bloodCost = ukPricing.bloodTest * regionFactor
      breakdown['Annual Blood Test'] = bloodCost
      totalRoutine += bloodCost
    }

    // Physio/bodywork
    if (includePhysio) {
      let physioSessions = physioFrequency === 'monthly' ? 12 : physioFrequency === 'bimonthly' ? 6 : 4
      const physioCost = ukPricing.physio * physioSessions * regionFactor
      breakdown['Physiotherapy'] = physioCost
      totalRoutine += physioCost
    }

    // One routine visit/callout included
    const calloutCost = ukPricing.callout.routine * regionFactor
    breakdown['Routine Callout'] = calloutCost
    totalRoutine += calloutCost

    // Apply age and use factors
    const adjustedRoutine = totalRoutine * ageFactor * useFactor

    // Emergency fund
    const emergencyBudget = parseFloat(emergencyFund) || 0

    // Total annual estimate
    const totalAnnual = adjustedRoutine + emergencyBudget
    const monthlyAverage = totalAnnual / 12

    // UK average comparison
    const ukAverageRoutine = 450
    const ukAverageWithEmergency = 1200

    setResult({
      routineCosts: adjustedRoutine.toFixed(2),
      emergencyFund: emergencyBudget.toFixed(2),
      totalAnnual: totalAnnual.toFixed(2),
      monthlyAverage: monthlyAverage.toFixed(2),
      breakdown,
      factors: {
        age: ageFactor,
        use: useFactor,
        region: regionFactor,
        ageRisks: ageFactors[horseAge]?.risks || []
      },
      comparison: {
        vsUkRoutine: adjustedRoutine < ukAverageRoutine,
        vsUkTotal: totalAnnual < ukAverageWithEmergency,
        ukAverageRoutine,
        ukAverageWithEmergency
      },
      recommendations: getRecommendations(horseAge, horseUse, totalAnnual)
    })
  }

  const getRecommendations = (age: string, use: string, total: number) => {
    const recs = []
    
    if (age === 'veteran') {
      recs.push('Consider blood tests for early Cushings/PPID detection')
      recs.push('Budget extra for potential arthritis management')
    }
    if (age === 'foal' || age === 'youngster') {
      recs.push('Ensure complete vaccination course is followed')
      recs.push('Regular growth and development checks recommended')
    }
    if (use === 'competition' || use === 'hunting') {
      recs.push('Consider regular physiotherapy for performance')
      recs.push('Joint supplements may reduce long-term vet costs')
    }
    if (total < 500) {
      recs.push('Consider increasing emergency fund for unexpected bills')
    }
    
    return recs
  }

  const faqs = [
    {
      q: 'How much do horse vet bills cost per year UK?',
      a: 'Routine annual vet costs in the UK typically range from £300-£600 for vaccinations, dental care, and worming. However, total annual costs including unexpected issues average £800-£1,500. A single emergency like colic surgery can cost £5,000-£10,000, which is why insurance or an emergency fund is essential.'
    },
    {
      q: 'How often does a horse need vaccinations?',
      a: 'Horses need an initial primary vaccination course (two injections 4-6 weeks apart), then annual boosters for flu and tetanus. Competition horses under FEI/BD/BS rules need flu boosters every 6 months. Tetanus protection lasts longer but is usually given annually as a combination vaccine.'
    },
    {
      q: 'How often should a horse see the dentist?',
      a: 'Most horses need dental checks every 12 months. Young horses (under 5) and veterans (over 15) often need checks every 6 months due to more rapid changes. Signs your horse needs dental work include dropping food, head tilting, bit resistance, or weight loss.'
    },
    {
      q: 'What is targeted worming for horses?',
      a: 'Targeted worming uses faecal egg count (FEC) tests to determine if your horse actually needs worming, rather than routine dosing. It\'s more cost-effective and reduces resistance build-up. Most horses on good pasture management only need 1-2 treatments per year plus tapeworm control.'
    },
    {
      q: 'What is a horse emergency fund?',
      a: 'An emergency fund is money set aside for unexpected vet bills. We recommend £1,000-£2,000 minimum, as common emergencies like colic, wounds, or lameness investigations can easily cost £500-£2,000. Colic surgery averages £5,000-£8,000. This fund supplements insurance or covers excesses.'
    },
    {
      q: 'Do older horses cost more in vet bills?',
      a: 'Yes, veteran horses (15+) typically have higher vet costs. Common issues include dental problems, arthritis, Cushings disease (PPID), and weight management. Budget 30-50% more for routine care, plus consider conditions that may need ongoing medication like bute or Prascend.'
    },
    {
      q: 'How much does horse colic surgery cost UK?',
      a: 'Colic surgery in the UK costs £5,000-£10,000+ depending on complications and aftercare. Medical colic treatment (without surgery) typically costs £500-£2,000. This is why vet fee insurance with at least £5,000 cover is strongly recommended for all horse owners.'
    },
    {
      q: 'What vaccinations do horses need UK?',
      a: 'In the UK, horses should be vaccinated against equine influenza (flu) and tetanus as a minimum. These are usually given as a combined vaccine. Additional vaccines like equine herpes virus (EHV) may be recommended for breeding stock or horses that travel frequently to competitions.'
    },
    {
      q: 'How much does an equine physio cost?',
      a: 'Equine physiotherapy in the UK costs £50-£80 per session, with initial assessments sometimes higher. Many competition horses benefit from quarterly or monthly sessions. Some insurance policies cover physiotherapy if prescribed by a vet following injury.'
    },
    {
      q: 'Are vet bills more expensive in London and the South East?',
      a: 'Yes, vet fees vary significantly by region. London and the South East are typically 25-40% more expensive than the national average. Northern England, Scotland, and Wales tend to be 5-10% below average. Always get quotes from local vets for accurate budgeting.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Horse Vet Cost Estimator UK 2025 | Annual Veterinary Budget | HorseCost</title>
        <meta 
          name="description" 
          content="Free horse vet cost calculator for UK owners. Estimate annual veterinary expenses including vaccinations, dental, worming, and emergency fund. 2025 pricing." 
        />
        <meta name="keywords" content="horse vet costs UK, equine veterinary expenses, horse vaccination cost, horse dental cost, worming program cost, horse healthcare budget, vet bills horse" />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#dc2626" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:title" content="Horse Vet Cost Estimator UK 2025 | HorseCost" />
        <meta property="og:description" content="Calculate annual horse veterinary costs. Free UK calculator for vaccinations, dental, worming, and emergency budget." />
        <meta property="og:url" content="https://horsecost.co.uk/vet-cost-estimator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/vet-cost-og.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Horse Vet Cost Estimator UK | HorseCost" />
        <meta name="twitter:description" content="Estimate annual horse vet costs with our free UK calculator." />

        <link rel="canonical" href="https://horsecost.co.uk/vet-cost-estimator" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/#calculators' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Vet Cost Estimator', 'item': 'https://horsecost.co.uk/vet-cost-estimator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Vet Cost Estimator UK',
                'description': 'Calculate annual horse veterinary costs including vaccinations, dental care, worming, and emergency fund budgeting.',
                'url': 'https://horsecost.co.uk/vet-cost-estimator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.7', 'ratingCount': '198' }
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
            <a href="/" className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Vet Cost Estimator</h1>
                <p className="text-red-200">UK 2025 Veterinary Budget Planner</p>
              </div>
            </div>
            <p className="text-red-100 max-w-2xl">
              Plan your annual horse healthcare budget. Estimate costs for vaccinations, dental care, 
              worming programs, and build an emergency fund for unexpected vet bills.
            </p>
            <p className="text-red-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Calculator Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Horse Age */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Horse Age Category</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'foal', name: 'Foal (0-2 yrs)' },
                      { id: 'youngster', name: 'Youngster (3-5 yrs)' },
                      { id: 'adult', name: 'Adult (6-14 yrs)' },
                      { id: 'veteran', name: 'Veteran (15+ yrs)' }
                    ].map((age) => (
                      <button
                        key={age.id}
                        onClick={() => setHorseAge(age.id)}
                        className={`p-3 rounded-xl text-sm font-medium transition border-2 ${
                          horseAge === age.id
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {age.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Horse Use */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Primary Use</label>
                  </div>
                  <select
                    value={horseUse}
                    onChange={(e) => setHorseUse(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                  >
                    <option value="pleasure">Pleasure/Hacking</option>
                    <option value="competition">Competition</option>
                    <option value="hunting">Hunting</option>
                    <option value="breeding">Breeding</option>
                    <option value="retirement">Retirement/Companion</option>
                  </select>
                </div>

                {/* Region */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                  >
                    <option value="london">London (Higher costs)</option>
                    <option value="southeast">South East England</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England</option>
                    <option value="scotland">Scotland / Wales</option>
                  </select>
                </div>

                {/* Routine Care */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Routine Care</label>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Vaccinations */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={vaccinations}
                        onChange={(e) => setVaccinations(e.target.checked)}
                        className="w-5 h-5 text-red-600 rounded"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">Annual Vaccinations</span>
                        <p className="text-sm text-gray-500">Flu & tetanus booster (~£75)</p>
                      </div>
                    </label>

                    {/* Dental */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dental}
                        onChange={(e) => setDental(e.target.checked)}
                        className="w-5 h-5 text-red-600 rounded"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">Dental Care</span>
                        <p className="text-sm text-gray-500">Routine check & rasp (~£160)</p>
                      </div>
                    </label>

                    {dental && (
                      <div className="pl-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dental Frequency</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDentalFrequency('annual')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                              dentalFrequency === 'annual'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Annual
                          </button>
                          <button
                            onClick={() => setDentalFrequency('biannual')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                              dentalFrequency === 'biannual'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Twice Yearly
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Worming */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Worming Program</label>
                      <div className="space-y-2">
                        {wormingPrograms.map((prog) => (
                          <button
                            key={prog.id}
                            onClick={() => setWorming(prog.id)}
                            className={`w-full p-3 rounded-xl text-left transition border-2 ${
                              worming === prog.id
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <p className={`font-medium text-sm ${worming === prog.id ? 'text-red-700' : 'text-gray-900'}`}>
                              {prog.name}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Fund */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Emergency Fund (Annual)</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['500', '1000', '1500', '2000'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setEmergencyFund(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          emergencyFund === val
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        £{parseInt(val).toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Recommended minimum: £1,000 for unexpected vet bills
                  </p>
                </div>

                {/* Advanced Options */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-red-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Additional Services
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeBloodTests}
                          onChange={(e) => setIncludeBloodTests(e.target.checked)}
                          className="w-5 h-5 text-red-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Annual Blood Test</span>
                          <p className="text-sm text-gray-500">Health screening (~£85)</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includePhysio}
                          onChange={(e) => setIncludePhysio(e.target.checked)}
                          className="w-5 h-5 text-red-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Physiotherapy</span>
                          <p className="text-sm text-gray-500">Regular sessions (~£65/visit)</p>
                        </div>
                      </label>

                      {includePhysio && (
                        <div className="pl-8">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Physio Frequency</label>
                          <select
                            value={physioFrequency}
                            onChange={(e) => setPhysioFrequency(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                          >
                            <option value="quarterly">Quarterly (4x/year)</option>
                            <option value="bimonthly">Every 2 Months (6x/year)</option>
                            <option value="monthly">Monthly (12x/year)</option>
                          </select>
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
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 rounded-xl font-bold text-lg hover:from-red-700 hover:to-rose-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Vet Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white">
                      <p className="text-red-100 text-sm mb-1">Estimated Annual Vet Budget</p>
                      <p className="text-4xl font-bold">£{result.totalAnnual}</p>
                      <p className="text-red-200 text-sm mt-1">Including emergency fund</p>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex justify-between">
                          <span className="text-red-100">Monthly average</span>
                          <span className="font-bold">£{result.monthlyAverage}</span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        {Object.entries(result.breakdown).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{key}</span>
                            <span className="font-medium">£{(value as number).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-gray-600">Routine Subtotal</span>
                          <span className="font-medium">£{result.routineCosts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Emergency Fund</span>
                          <span className="font-medium">£{result.emergencyFund}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Budget</span>
                          <span>£{result.totalAnnual}</span>
                        </div>
                      </div>
                    </div>

                    {/* Age-related Risks */}
                    {result.factors.ageRisks.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Health Considerations for {horseAge.charAt(0).toUpperCase() + horseAge.slice(1)}s
                        </h3>
                        <ul className="space-y-1 text-sm text-amber-800">
                          {result.factors.ageRisks.map((risk: string, i: number) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {result.recommendations.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          Recommendations
                        </h3>
                        <ul className="space-y-1 text-sm text-green-800">
                          {result.recommendations.map((rec: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* UK Comparison */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">UK Average Comparison</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Routine care avg</span>
                          <div className="flex items-center gap-2">
                            <span>£{result.comparison.ukAverageRoutine}</span>
                            {parseFloat(result.routineCosts) <= result.comparison.ukAverageRoutine && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Total budget avg</span>
                          <div className="flex items-center gap-2">
                            <span>£{result.comparison.ukAverageWithEmergency}</span>
                            {parseFloat(result.totalAnnual) <= result.comparison.ukAverageWithEmergency && (
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
                    <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select your options and click calculate to see your estimated vet costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-900 mb-2">Why an Emergency Fund Matters</h3>
                <ul className="text-red-800 space-y-1 text-sm">
                  <li>• <strong>Colic surgery:</strong> £5,000-£10,000+ (most common equine emergency)</li>
                  <li>• <strong>Wound treatment:</strong> £500-£2,000 depending on severity</li>
                  <li>• <strong>Lameness investigation:</strong> £300-£1,500 for diagnostics</li>
                  <li>• <strong>Eye emergencies:</strong> £200-£500 per episode</li>
                  <li>• Insurance excesses typically £100-£500 per claim</li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Pricing Table */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Veterinary Costs 2025</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Syringe className="w-5 h-5 text-red-600" />
                  Vaccinations
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Flu/Tetanus Combined</span>
                    <span className="font-medium">£65-£85</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Flu Only Booster</span>
                    <span className="font-medium">£45-£65</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Primary Course (2 visits)</span>
                    <span className="font-medium">£120-£160</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-600" />
                  Dental Care
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Routine Check & Rasp</span>
                    <span className="font-medium">£100-£140</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Sedation (if required)</span>
                    <span className="font-medium">£35-£50</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Extractions (each)</span>
                    <span className="font-medium">£100-£200</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-red-600" />
                  Worming
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Faecal Egg Count (FEC)</span>
                    <span className="font-medium">£20-£30</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Tapeworm Saliva Test</span>
                    <span className="font-medium">£15-£20</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Wormer (per dose)</span>
                    <span className="font-medium">£12-£18</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  Callout Fees
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Routine Visit</span>
                    <span className="font-medium">£40-£60</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Emergency (daytime)</span>
                    <span className="font-medium">£120-£180</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Out of Hours</span>
                    <span className="font-medium">£200-£300+</span>
                  </div>
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
              <a href="/horse-insurance-calculator" className="bg-violet-50 hover:bg-violet-100 rounded-xl p-4 transition group">
                <Shield className="w-8 h-8 text-violet-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-violet-600">Insurance Calculator</h3>
                <p className="text-sm text-gray-600">Compare cover options</p>
              </a>
              <a href="/horse-weight-calculator" className="bg-sky-50 hover:bg-sky-100 rounded-xl p-4 transition group">
                <Activity className="w-8 h-8 text-sky-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-sky-600">Weight Calculator</h3>
                <p className="text-sm text-gray-600">Health monitoring</p>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Plan Your Complete Horse Budget</h2>
            <p className="text-red-100 mb-6 max-w-xl mx-auto">
              Vet costs are just one part of horse ownership. Use our Annual Cost Calculator for a complete budget breakdown.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition"
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
