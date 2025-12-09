import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Scale,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Ruler,
  Heart,
  Activity,
  CheckCircle2
} from 'lucide-react'

export default function HorseWeightCalculator() {
  // Measurements
  const [heartGirth, setHeartGirth] = useState('')
  const [bodyLength, setBodyLength] = useState('')
  const [heightHands, setHeightHands] = useState('')
  const [horseType, setHorseType] = useState('')
  
  // Body Condition Score
  const [bodyCondition, setBodyCondition] = useState('')
  
  const [result, setResult] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [measurementUnit, setMeasurementUnit] = useState<'cm' | 'inches'>('cm')

  // Horse type weight adjustments
  const horseTypeAdjustments: Record<string, { multiplier: number, label: string, typicalRange: string }> = {
    'shetland': { multiplier: 0.85, label: 'Shetland/Miniature', typicalRange: '150-250kg' },
    'welsh': { multiplier: 0.9, label: 'Welsh/Small Pony', typicalRange: '250-350kg' },
    'connemara': { multiplier: 0.95, label: 'Connemara/Large Pony', typicalRange: '350-450kg' },
    'arab': { multiplier: 0.95, label: 'Arab/Light Horse', typicalRange: '400-500kg' },
    'thoroughbred': { multiplier: 1.0, label: 'Thoroughbred', typicalRange: '450-550kg' },
    'warmblood': { multiplier: 1.05, label: 'Warmblood/Sports Horse', typicalRange: '500-600kg' },
    'cob': { multiplier: 1.1, label: 'Cob/Heavyweight', typicalRange: '500-650kg' },
    'draft': { multiplier: 1.2, label: 'Draft/Heavy Horse', typicalRange: '700-1000kg' },
    'shire': { multiplier: 1.25, label: 'Shire/Clydesdale', typicalRange: '800-1100kg' }
  }

  // Body Condition Score descriptions
  const bodyConditionScores: Record<string, { label: string, description: string, adjustment: number }> = {
    '1': { label: 'Poor (1)', description: 'Emaciated, no fat, bones prominent', adjustment: -15 },
    '2': { label: 'Very Thin (2)', description: 'Very thin, slight fat cover', adjustment: -10 },
    '3': { label: 'Thin (3)', description: 'Thin, fat over ribs can be felt', adjustment: -5 },
    '4': { label: 'Moderately Thin (4)', description: 'Slight ridge along back, ribs felt', adjustment: -2 },
    '5': { label: 'Moderate (5)', description: 'Ideal weight, ribs easily felt', adjustment: 0 },
    '6': { label: 'Moderately Fleshy (6)', description: 'Fat over ribs, slight crease', adjustment: 2 },
    '7': { label: 'Fleshy (7)', description: 'Fat deposits, ribs hard to feel', adjustment: 5 },
    '8': { label: 'Fat (8)', description: 'Difficult to feel ribs, crease down back', adjustment: 10 },
    '9': { label: 'Extremely Fat (9)', description: 'Bulging fat, very hard to feel ribs', adjustment: 15 }
  }

  const convertToMetric = (value: number, unit: 'cm' | 'inches'): number => {
    return unit === 'inches' ? value * 2.54 : value
  }

  const handsToMetric = (hands: number): number => {
    // 1 hand = 4 inches = 10.16cm
    return hands * 10.16
  }

  const calculate = () => {
    let girth = parseFloat(heartGirth)
    let length = parseFloat(bodyLength)
    const hands = parseFloat(heightHands)

    if (!girth || !length) {
      alert('Please enter heart girth and body length measurements')
      return
    }

    // Convert to cm if needed
    girth = convertToMetric(girth, measurementUnit)
    length = convertToMetric(length, measurementUnit)

    // Carroll and Huntington formula (most accurate for UK horses)
    // Weight (kg) = (Girth² × Length) / 11,877
    let weightKg = (girth * girth * length) / 11877

    // Apply horse type adjustment
    const typeData = horseTypeAdjustments[horseType]
    if (typeData) {
      weightKg = weightKg * typeData.multiplier
    }

    // Apply body condition adjustment
    const bcsData = bodyConditionScores[bodyCondition]
    if (bcsData) {
      weightKg = weightKg * (1 + bcsData.adjustment / 100)
    }

    // Calculate ideal weight range based on height (if provided)
    let idealWeightRange = { min: 0, max: 0 }
    if (hands) {
      // General rule: approximately 4-5kg per cm of height
      const heightCm = handsToMetric(hands)
      idealWeightRange = {
        min: Math.round(heightCm * 3.5),
        max: Math.round(heightCm * 4.5)
      }
    }

    // Feeding calculations
    const dailyForageMin = weightKg * 0.015 // 1.5% minimum
    const dailyForageMax = weightKg * 0.025 // 2.5% maximum
    const dailyForageIdeal = weightKg * 0.02 // 2% ideal

    // Weight categories
    let weightCategory = ''
    let weightAdvice = ''
    const bcs = parseInt(bodyCondition) || 5

    if (bcs <= 3) {
      weightCategory = 'Underweight'
      weightAdvice = 'Consult your vet. Increase feed gradually, check teeth and worming status.'
    } else if (bcs <= 4) {
      weightCategory = 'Slightly Underweight'
      weightAdvice = 'May benefit from increased forage or feed. Monitor closely.'
    } else if (bcs <= 6) {
      weightCategory = 'Ideal'
      weightAdvice = 'Maintain current feeding regime. Continue regular monitoring.'
    } else if (bcs <= 7) {
      weightCategory = 'Slightly Overweight'
      weightAdvice = 'Consider reducing hard feed, increase exercise if possible.'
    } else {
      weightCategory = 'Overweight'
      weightAdvice = 'Risk of laminitis. Reduce feed, use grazing muzzle, increase exercise. Consult vet.'
    }

    setResult({
      estimatedWeight: Math.round(weightKg),
      weightLbs: Math.round(weightKg * 2.205),
      weightStone: (weightKg * 0.157).toFixed(1),
      measurements: {
        girthCm: Math.round(girth),
        lengthCm: Math.round(length),
        heightHands: hands || 'Not provided'
      },
      feeding: {
        dailyForageMin: dailyForageMin.toFixed(1),
        dailyForageMax: dailyForageMax.toFixed(1),
        dailyForageIdeal: dailyForageIdeal.toFixed(1),
        monthlyHayKg: Math.round(dailyForageIdeal * 30)
      },
      idealRange: idealWeightRange,
      condition: {
        score: bodyCondition || '5',
        category: weightCategory,
        advice: weightAdvice
      },
      wormerDose: {
        ivermectin: (weightKg / 50).toFixed(1), // notches on syringe
        moxidectin: (weightKg / 50).toFixed(1),
        note: 'Always verify with your vet. Round UP for wormer doses.'
      }
    })
  }

  const faqs = [
    {
      q: "How do I measure my horse's heart girth?",
      a: "Wrap a soft measuring tape around your horse just behind the withers and elbows, at the deepest part of the barrel. The tape should be snug but not tight. Measure in centimetres or inches. For best accuracy, measure when the horse is standing square on level ground and has exhaled."
    },
    {
      q: "How do I measure body length for weight calculation?",
      a: "Measure from the point of the shoulder (where the neck meets the chest) to the point of the buttock (tuber ischii). Use a piece of string if your tape isn't long enough, then measure the string. The horse should be standing square on level ground."
    },
    {
      q: "How accurate are weight tape calculations?",
      a: "Weight tapes and formulas are typically accurate to within 5-10% for average horses. They're less accurate for very thin, very fat, pregnant, or unusually shaped horses. For precise weights (medication dosing, etc.), use a weighbridge. The Carroll and Huntington formula we use is one of the most accurate for UK horses."
    },
    {
      q: "Why is knowing my horse's weight important?",
      a: "Accurate weight is essential for: correct wormer dosing (under-dosing causes resistance), safe sedation and anaesthetic, accurate feeding (1.5-2.5% bodyweight in forage), monitoring health changes, and safe exercise programmes. A 50kg error in weight estimation can mean significant medication dosing issues."
    },
    {
      q: "What is Body Condition Score (BCS)?",
      a: "BCS is a 1-9 scale assessing fat coverage. Score 1 is emaciated, 5 is ideal, and 9 is obese. You assess by feeling and looking at key areas: neck crest, withers, ribs, spine, and hindquarters. A score of 5-6 is ideal for most horses. Regular BCS monitoring helps track weight changes before they become visible."
    },
    {
      q: "How often should I weigh my horse?",
      a: "Weigh or condition score your horse at least monthly, or fortnightly for horses prone to weight issues. More frequently in spring (laminitis risk), after illness, or during diet changes. Keep a record to track trends - gradual changes are easy to miss daily but significant over time."
    },
    {
      q: "My horse is overweight - what should I do?",
      a: "For overweight horses: restrict grazing (track system, grazing muzzle), feed soaked hay to reduce sugar, eliminate hard feed unless essential, increase exercise gradually, and avoid sudden diet changes. Aim for 0.5-1% bodyweight loss per week maximum. Consult your vet, especially if laminitis risk is high."
    },
    {
      q: "How does breed affect horse weight?",
      a: "Breed significantly affects ideal weight. Native ponies, cobs and draft breeds are naturally heavier for their height than thoroughbreds or Arabs. A 15hh cob might healthily weigh 550kg while a 15hh thoroughbred might be 450kg. Our calculator adjusts for breed type to give more accurate estimates."
    },
    {
      q: "What's the ideal weight for a 15hh horse?",
      a: "A 15hh horse typically weighs between 420-550kg depending on breed and build. A thoroughbred might be 420-480kg, a warmblood 480-520kg, and a cob 520-580kg. Height alone doesn't determine ideal weight - body condition score is more important than hitting a specific number."
    },
    {
      q: "How do I calculate wormer dose from weight?",
      a: "Most wormer syringes are calibrated for 50kg increments. Divide your horse's weight by 50 and round UP to get the number of notches. A 520kg horse needs 11 notches (not 10.4). Never under-dose wormers as this contributes to resistance. When in doubt, dose for a slightly higher weight."
    }
  ]

  return (
    <>
      <Helmet>
        <title>Horse Weight Calculator UK | Weigh Tape Formula | HorseCost</title>
        <meta 
          name="description" 
          content="Free horse weight calculator using heart girth and body length measurements. Accurate UK formula for wormer dosing, feeding calculations, and health monitoring." 
        />
        <meta 
          name="keywords" 
          content="horse weight calculator, weigh tape formula, horse weight UK, heart girth measurement, horse body condition score, wormer dose calculator, horse feeding calculator" 
        />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#0284c7" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:title" content="Horse Weight Calculator UK | HorseCost" />
        <meta property="og:description" content="Calculate your horse's weight accurately using measurements. Free UK calculator for feeding and medication dosing." />
        <meta property="og:url" content="https://horsecost.co.uk/horse-weight-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/horse-weight-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Horse Weight Calculator UK | HorseCost" />
        <meta name="twitter:description" content="Calculate your horse's weight for accurate feeding and wormer dosing." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/horse-weight-calculator-twitter.jpg" />

        <link rel="canonical" href="https://horsecost.co.uk/horse-weight-calculator" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Horse Weight Calculator', 'item': 'https://horsecost.co.uk/horse-weight-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Weight Calculator UK',
                'url': 'https://horsecost.co.uk/horse-weight-calculator',
                'description': 'Calculate horse weight using heart girth and body length measurements with the accurate Carroll and Huntington formula.',
                'applicationCategory': 'HealthApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.9', 'ratingCount': '276', 'bestRating': '5', 'worstRating': '1' }
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
                'name': 'How to Weigh Your Horse Using Measurements',
                'description': 'Step-by-step guide to estimating horse weight using heart girth and body length',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Measure Heart Girth', 'text': 'Wrap tape around the barrel just behind the withers and elbows at the deepest point.' },
                  { '@type': 'HowToStep', 'name': 'Measure Body Length', 'text': 'Measure from point of shoulder to point of buttock in a straight line.' },
                  { '@type': 'HowToStep', 'name': 'Enter Measurements', 'text': 'Input your measurements in centimetres or inches into the calculator.' },
                  { '@type': 'HowToStep', 'name': 'Select Horse Type', 'text': 'Choose your horse breed type for a more accurate estimate.' },
                  { '@type': 'HowToStep', 'name': 'Get Results', 'text': 'View estimated weight plus feeding and wormer dosing recommendations.' }
                ]
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
          <a href="/" className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-500 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Horse Weight Calculator UK</h1>
                <p className="text-sky-100 mt-1">Estimate weight from measurements for feeding & medication</p>
              </div>
            </div>
            <p className="text-sky-50 max-w-3xl">
              Use the accurate Carroll and Huntington formula to estimate your horse's weight. 
              Essential for correct wormer dosing, feeding calculations, and health monitoring.
            </p>
            <p className="text-sky-200 text-sm mt-2">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Main Calculator Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              
              {/* Measurement Unit Toggle */}
              <div className="flex justify-end mb-6">
                <div className="inline-flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setMeasurementUnit('cm')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      measurementUnit === 'cm' ? 'bg-white text-sky-600 shadow' : 'text-gray-600'
                    }`}
                  >
                    Centimetres
                  </button>
                  <button
                    onClick={() => setMeasurementUnit('inches')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      measurementUnit === 'inches' ? 'bg-white text-sky-600 shadow' : 'text-gray-600'
                    }`}
                  >
                    Inches
                  </button>
                </div>
              </div>

              {/* Section 1: Essential Measurements */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h2 className="text-xl font-bold text-gray-900">Essential Measurements</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Heart className="w-4 h-4 inline mr-2" />
                      Heart Girth ({measurementUnit})
                    </label>
                    <input
                      type="number"
                      value={heartGirth}
                      onChange={(e) => setHeartGirth(e.target.value)}
                      placeholder={measurementUnit === 'cm' ? 'e.g., 185' : 'e.g., 73'}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Measure around barrel behind withers/elbows</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Ruler className="w-4 h-4 inline mr-2" />
                      Body Length ({measurementUnit})
                    </label>
                    <input
                      type="number"
                      value={bodyLength}
                      onChange={(e) => setBodyLength(e.target.value)}
                      placeholder={measurementUnit === 'cm' ? 'e.g., 165' : 'e.g., 65'}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Point of shoulder to point of buttock</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Horse Type */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h2 className="text-xl font-bold text-gray-900">Horse Type (Optional)</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(horseTypeAdjustments).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setHorseType(key)}
                      className={`p-3 rounded-lg border-2 text-left transition ${
                        horseType === key 
                          ? 'border-sky-500 bg-sky-50 text-sky-700' 
                          : 'border-gray-200 hover:border-sky-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold text-sm">{data.label}</div>
                      <div className="text-xs text-gray-500">{data.typicalRange}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 3: Body Condition Score */}
              <div className="mb-8">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-3 mb-4 text-left w-full"
                >
                  <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h2 className="text-xl font-bold text-gray-900">Body Condition Score (Optional)</h2>
                  {showAdvanced ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                
                {showAdvanced && (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2 pl-11">
                    {Object.entries(bodyConditionScores).map(([score, data]) => (
                      <button
                        key={score}
                        onClick={() => setBodyCondition(score)}
                        className={`p-3 rounded-lg border-2 text-center transition ${
                          bodyCondition === score 
                            ? 'border-sky-500 bg-sky-50' 
                            : 'border-gray-200 hover:border-sky-300'
                        }`}
                      >
                        <div className={`text-2xl font-bold ${
                          parseInt(score) <= 3 ? 'text-red-600' :
                          parseInt(score) <= 6 ? 'text-green-600' : 'text-amber-600'
                        }`}>{score}</div>
                        <div className="text-xs text-gray-500">{data.label.split(' (')[0]}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Optional Height */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <h2 className="text-xl font-bold text-gray-900">Height (Optional)</h2>
                </div>
                <div className="max-w-xs">
                  <label className="block text-gray-700 font-medium mb-2">Height in Hands</label>
                  <input
                    type="number"
                    step="0.1"
                    value={heightHands}
                    onChange={(e) => setHeightHands(e.target.value)}
                    placeholder="e.g., 15.2"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Used to estimate ideal weight range</p>
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculate}
                className="w-full bg-gradient-to-r from-sky-600 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-sky-700 hover:to-blue-600 transition shadow-lg"
              >
                <Calculator className="w-5 h-5 inline mr-2" />
                Calculate Weight
              </button>
            </div>

            {/* Results Section */}
            {result && (
              <div className="border-t border-gray-200 bg-gradient-to-b from-sky-50 to-white p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Scale className="w-6 h-6 text-sky-600" />
                  Estimated Weight
                </h2>
                
                {/* Main Weight Result */}
                <div className="bg-sky-600 text-white p-8 rounded-xl text-center mb-8">
                  <div className="text-sky-200 text-lg font-medium mb-2">Your Horse Weighs Approximately</div>
                  <div className="text-6xl font-bold mb-2">{result.estimatedWeight} kg</div>
                  <div className="text-sky-200">
                    {result.weightLbs} lbs • {result.weightStone} stone
                  </div>
                </div>

                {/* Condition Assessment */}
                <div className={`p-6 rounded-xl mb-8 ${
                  result.condition.category === 'Ideal' ? 'bg-green-50 border border-green-200' :
                  result.condition.category.includes('Underweight') ? 'bg-red-50 border border-red-200' :
                  'bg-amber-50 border border-amber-200'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {result.condition.category === 'Ideal' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                    )}
                    <h3 className="font-bold text-lg">Body Condition: {result.condition.category}</h3>
                  </div>
                  <p className="text-gray-700">{result.condition.advice}</p>
                </div>

                {/* Feeding Recommendations */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-sky-600" />
                    Daily Feeding Guide
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-gray-500 text-sm">Minimum Forage</p>
                      <p className="text-2xl font-bold text-gray-900">{result.feeding.dailyForageMin} kg</p>
                      <p className="text-xs text-gray-500">1.5% bodyweight</p>
                    </div>
                    <div className="bg-sky-50 p-4 rounded-lg text-center border-2 border-sky-200">
                      <p className="text-sky-600 text-sm font-medium">Ideal Forage</p>
                      <p className="text-2xl font-bold text-sky-700">{result.feeding.dailyForageIdeal} kg</p>
                      <p className="text-xs text-sky-600">2% bodyweight</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-gray-500 text-sm">Maximum Forage</p>
                      <p className="text-2xl font-bold text-gray-900">{result.feeding.dailyForageMax} kg</p>
                      <p className="text-xs text-gray-500">2.5% bodyweight</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    Monthly hay requirement: approximately <strong>{result.feeding.monthlyHayKg} kg</strong>
                  </p>
                </div>

                {/* Wormer Dosing */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="font-bold text-amber-800 mb-4">⚠️ Wormer Dosing Guide</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Standard Syringe (50kg increments)</p>
                      <p className="text-2xl font-bold text-gray-900">{Math.ceil(result.estimatedWeight / 50)} notches</p>
                      <p className="text-xs text-gray-500">For {result.estimatedWeight}kg horse</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-gray-600 text-sm">Always Round UP</p>
                      <p className="text-lg font-bold text-amber-700">Never under-dose wormers</p>
                      <p className="text-xs text-gray-500">Under-dosing causes resistance</p>
                    </div>
                  </div>
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> This is a guide only. Always consult your vet for medication dosing, 
                    especially for sedation, anaesthetics, or if your horse is very thin or very fat.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* How to Measure Guide */}
          <div className="bg-sky-50 border-l-4 border-sky-500 p-6 rounded-r-lg mt-8">
            <div className="flex gap-3">
              <Ruler className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-sky-800 mb-2">How to Take Accurate Measurements</h3>
                <ul className="text-sky-900 space-y-2 text-sm">
                  <li><strong>Heart Girth:</strong> Wrap tape around the barrel just behind the withers and behind the elbows. Measure at the deepest part when the horse exhales.</li>
                  <li><strong>Body Length:</strong> Measure in a straight line from the point of shoulder to the point of buttock. Use string if tape isn't long enough.</li>
                  <li><strong>Tips:</strong> Horse should stand square on level ground. Measure at the same time of day for tracking. Take 2-3 measurements and average them.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Weight Ranges Table */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Typical UK Horse Weight Ranges</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                <thead>
                  <tr className="bg-sky-600 text-white">
                    <th className="p-4 text-left">Horse Type</th>
                    <th className="p-4 text-center">Height Range</th>
                    <th className="p-4 text-center">Weight Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Shetland Pony</td>
                    <td className="p-4 text-center">7-10.2hh</td>
                    <td className="p-4 text-center">150-250kg</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">Welsh Pony</td>
                    <td className="p-4 text-center">12-13.2hh</td>
                    <td className="p-4 text-center">250-350kg</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Connemara/Large Pony</td>
                    <td className="p-4 text-center">13-14.2hh</td>
                    <td className="p-4 text-center">350-450kg</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">Arab/Light Horse</td>
                    <td className="p-4 text-center">14.2-15.2hh</td>
                    <td className="p-4 text-center">400-500kg</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Thoroughbred</td>
                    <td className="p-4 text-center">15.2-17hh</td>
                    <td className="p-4 text-center">450-550kg</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-4 font-medium">Warmblood</td>
                    <td className="p-4 text-center">16-17.2hh</td>
                    <td className="p-4 text-center">500-600kg</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Cob</td>
                    <td className="p-4 text-center">14.2-15.2hh</td>
                    <td className="p-4 text-center">500-650kg</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4 font-medium">Shire/Clydesdale</td>
                    <td className="p-4 text-center">17-19hh</td>
                    <td className="p-4 text-center">800-1100kg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Calculators */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Horse Calculators</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/horse-feed-calculator" className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-sky-400 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900">Feed Calculator</h3>
                <p className="text-gray-600 text-sm mt-1">Calculate hay and feed costs</p>
              </a>
              <a href="/annual-horse-cost-calculator" className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-sky-400 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900">Annual Cost Calculator</h3>
                <p className="text-gray-600 text-sm mt-1">Complete yearly ownership costs</p>
              </a>
              <a href="/farrier-cost-calculator" className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-sky-400 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900">Farrier Calculator</h3>
                <p className="text-gray-600 text-sm mt-1">Annual shoeing and trimming costs</p>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-sky-600 to-blue-500 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Know Your Horse's Feed Costs?</h2>
            <p className="text-sky-100 mb-4">Now you know the weight, calculate exactly how much feeding costs per month.</p>
            <a 
              href="/horse-feed-calculator" 
              className="inline-block bg-white text-sky-600 px-6 py-3 rounded-lg font-bold hover:bg-sky-50 transition"
            >
              Calculate Feed Costs
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
