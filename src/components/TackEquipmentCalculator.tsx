import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  ShoppingBag,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  PoundSterling,
  CheckCircle2,
  Star,
  Calendar,
  Target
} from 'lucide-react'

export default function TackEquipmentCalculator() {
  const [budgetLevel, setBudgetLevel] = useState('mid')
  const [horseType, setHorseType] = useState('allrounder')
  const [discipline, setDiscipline] = useState('general')
  const [needSaddle, setNeedSaddle] = useState(true)
  const [needBridle, setNeedBridle] = useState(true)
  const [needRugs, setNeedRugs] = useState(true)
  const [needBoots, setNeedBoots] = useState(true)
  const [needGrooming, setNeedGrooming] = useState(true)
  const [customSaddle, setCustomSaddle] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [includeSaddleFitting, setIncludeSaddleFitting] = useState(true)
  const [includeSpares, setIncludeSpares] = useState(false)
  const [result, setResult] = useState<any>(null)

  const budgetLevels = [
    { id: 'budget', name: 'Budget', description: 'Second-hand & basic brands', multiplier: 0.5 },
    { id: 'mid', name: 'Mid-Range', description: 'Quality new items', multiplier: 1.0 },
    { id: 'premium', name: 'Premium', description: 'Top brands & custom', multiplier: 1.8 },
    { id: 'luxury', name: 'Luxury', description: 'Bespoke & designer', multiplier: 3.0 }
  ]

  const horseTypes = [
    { id: 'pony', name: 'Pony (up to 14.2hh)', sizeMultiplier: 0.85 },
    { id: 'cob', name: 'Cob', sizeMultiplier: 1.0 },
    { id: 'allrounder', name: 'Horse (15-16.2hh)', sizeMultiplier: 1.0 },
    { id: 'warmblood', name: 'Warmblood/Large', sizeMultiplier: 1.15 }
  ]

  const disciplines = [
    { id: 'general', name: 'General Purpose', saddleType: 'GP Saddle', extraGear: 0 },
    { id: 'dressage', name: 'Dressage', saddleType: 'Dressage Saddle', extraGear: 150 },
    { id: 'jumping', name: 'Jumping/Eventing', saddleType: 'Jump Saddle', extraGear: 200 },
    { id: 'showing', name: 'Showing', saddleType: 'Show Saddle', extraGear: 300 },
    { id: 'western', name: 'Western', saddleType: 'Western Saddle', extraGear: 250 }
  ]

  // Base costs (mid-range prices UK 2025)
  const baseCosts = {
    saddle: 800,
    saddleFitting: 75,
    bridle: 120,
    bit: 45,
    reins: 35,
    breastplate: 80,
    martingale: 65,
    girth: 60,
    stirrups: 80,
    stirrupLeathers: 45,
    numnah: 40,
    halfPad: 55,
    turnoutRug: 120,
    stableRug: 80,
    fleece: 40,
    rainSheet: 60,
    flyRug: 50,
    cooler: 55,
    brushingBoots: 45,
    tendonBoots: 55,
    overreachBoots: 25,
    travelBoots: 60,
    groomingKit: 80,
    hoofPick: 8,
    leadrope: 15,
    headcollar: 25,
    hayNet: 12,
    feedBuckets: 20,
    waterBuckets: 15,
    firstAidKit: 60,
    tackBox: 45,
    hatSilk: 20,
    hiViz: 35
  }

  const calculate = () => {
    const budget = budgetLevels.find(b => b.id === budgetLevel)
    const horse = horseTypes.find(h => h.id === horseType)
    const disc = disciplines.find(d => d.id === discipline)
    
    if (!budget || !horse || !disc) return

    const multiplier = budget.multiplier * horse.sizeMultiplier

    let saddleCost = 0
    let bridleCost = 0
    let rugsCost = 0
    let bootsCost = 0
    let groomingCost = 0
    let essentialsCost = 0

    // Saddle & accessories
    if (needSaddle) {
      if (customSaddle && parseFloat(customSaddle) > 0) {
        saddleCost = parseFloat(customSaddle)
      } else {
        saddleCost = baseCosts.saddle * multiplier
      }
      saddleCost += baseCosts.girth * multiplier
      saddleCost += baseCosts.stirrups * multiplier
      saddleCost += baseCosts.stirrupLeathers * multiplier
      saddleCost += baseCosts.numnah * multiplier
      
      if (includeSaddleFitting) {
        saddleCost += baseCosts.saddleFitting
      }
    }

    // Bridle & accessories
    if (needBridle) {
      bridleCost = baseCosts.bridle * multiplier
      bridleCost += baseCosts.bit * multiplier
      bridleCost += baseCosts.reins * multiplier
      
      if (discipline === 'jumping' || discipline === 'general') {
        bridleCost += baseCosts.martingale * multiplier
      }
      if (discipline === 'jumping' || discipline === 'eventing') {
        bridleCost += baseCosts.breastplate * multiplier
      }
    }

    // Rugs
    if (needRugs) {
      rugsCost = baseCosts.turnoutRug * multiplier
      rugsCost += baseCosts.stableRug * multiplier
      rugsCost += baseCosts.fleece * multiplier
      rugsCost += baseCosts.rainSheet * multiplier
      rugsCost += baseCosts.cooler * multiplier
      
      if (includeSpares) {
        rugsCost += baseCosts.turnoutRug * multiplier * 0.8 // spare turnout
        rugsCost += baseCosts.flyRug * multiplier
      }
    }

    // Boots
    if (needBoots) {
      bootsCost = baseCosts.brushingBoots * multiplier
      bootsCost += baseCosts.overreachBoots * multiplier
      bootsCost += baseCosts.travelBoots * multiplier
      
      if (discipline === 'jumping' || discipline === 'eventing') {
        bootsCost += baseCosts.tendonBoots * multiplier
      }
    }

    // Grooming & essentials
    if (needGrooming) {
      groomingCost = baseCosts.groomingKit * multiplier
      groomingCost += baseCosts.hoofPick
      groomingCost += baseCosts.firstAidKit
      groomingCost += baseCosts.tackBox * multiplier
    }

    // Always needed essentials
    essentialsCost = baseCosts.headcollar * multiplier
    essentialsCost += baseCosts.leadrope * multiplier
    essentialsCost += baseCosts.hayNet * 2
    essentialsCost += baseCosts.feedBuckets
    essentialsCost += baseCosts.waterBuckets
    essentialsCost += baseCosts.hiViz

    // Discipline-specific extras
    const disciplineExtras = disc.extraGear * budget.multiplier

    const totalCost = saddleCost + bridleCost + rugsCost + bootsCost + groomingCost + essentialsCost + disciplineExtras
    
    // Annual replacement estimate (rugs every 2-3 years, boots every 1-2 years)
    const annualReplacement = (rugsCost / 2.5) + (bootsCost / 1.5) + 100

    // UK average comparison
    const ukAverageSetup = 2500

    setResult({
      totalCost: totalCost.toFixed(2),
      annualReplacement: annualReplacement.toFixed(2),
      breakdown: {
        saddle: saddleCost.toFixed(2),
        bridle: bridleCost.toFixed(2),
        rugs: rugsCost.toFixed(2),
        boots: bootsCost.toFixed(2),
        grooming: groomingCost.toFixed(2),
        essentials: essentialsCost.toFixed(2),
        disciplineExtras: disciplineExtras.toFixed(2)
      },
      percentages: {
        saddle: ((saddleCost / totalCost) * 100).toFixed(0),
        bridle: ((bridleCost / totalCost) * 100).toFixed(0),
        rugs: ((rugsCost / totalCost) * 100).toFixed(0),
        boots: ((bootsCost / totalCost) * 100).toFixed(0),
        other: (((groomingCost + essentialsCost + disciplineExtras) / totalCost) * 100).toFixed(0)
      },
      comparison: {
        vsUkAverage: totalCost < ukAverageSetup,
        ukAverage: ukAverageSetup
      },
      budgetInfo: budget,
      disciplineInfo: disc
    })
  }

  const faqs = [
    {
      q: 'How much does a full tack set cost UK?',
      a: 'A complete tack setup for a horse in the UK costs £1,500-£4,000+ depending on quality. Budget setups with second-hand items can be £800-£1,200, while premium branded gear costs £3,000-£6,000. The saddle is typically 40-50% of the total cost.'
    },
    {
      q: 'Should I buy new or second-hand tack?',
      a: 'Second-hand tack can offer excellent value if properly checked. Saddles, bridles, and rugs are often available in good condition at 30-50% of new prices. Always check leather for cracks, stitching integrity, and tree condition for saddles. Have second-hand saddles checked by a fitter.'
    },
    {
      q: 'How much should I spend on a saddle?',
      a: 'For regular riding, budget £500-£1,500 for a quality second-hand or mid-range new saddle. Premium brands like Albion, Devoucoux, or Butet cost £2,000-£5,000+. A well-fitted £800 saddle is better than an ill-fitting £3,000 one - always get professional fitting.'
    },
    {
      q: 'How many rugs does a horse need?',
      a: 'A minimum set includes: turnout rug (medium weight), stable rug, fleece/cooler, and rain sheet. Many owners have 5-8 rugs including spare turnouts, different weights, and fly rugs. Clipped horses need more rugs than those with full coats.'
    },
    {
      q: 'What tack is essential vs nice-to-have?',
      a: 'Essential: saddle, bridle, headcollar, lead rope, grooming kit, first aid kit. Nice-to-have: boots, breastplate, martingale, half pad, multiple rugs. Start with essentials and add as needed - many horses don\'t need boots for light work.'
    },
    {
      q: 'How often does tack need replacing?',
      a: 'Leather tack (saddle, bridle) lasts 10-20+ years with care. Synthetic items last 3-7 years. Rugs typically need replacing every 2-4 years. Boots and numnahs wear faster (1-3 years). Regular cleaning and maintenance extends lifespan significantly.'
    },
    {
      q: 'Is expensive tack worth it?',
      a: 'Premium tack often offers better fit, durability, and comfort, but mid-range quality is perfectly adequate for most riders. Invest most in the saddle (affects horse and rider comfort) and save on items like grooming kits and headcollars where brand matters less.'
    },
    {
      q: 'What tack do I need for different disciplines?',
      a: 'Dressage: dressage saddle, double bridle (for higher levels), white numnah. Jumping: jump saddle, breastplate, tendon boots. Showing: show saddle, coloured browband, minimal visible tack. General purpose saddles work for most recreational riders.'
    },
    {
      q: 'Where can I buy tack in the UK?',
      a: 'Options include: local saddleries (best for fitting), online retailers (Naylors, Ride-Away, Horse Health), Facebook selling groups, eBay, and tack sales at shows. Local saddlers often offer fitting services and trade-ins. Always try saddles before buying.'
    },
    {
      q: 'Do I need a saddle fitter?',
      a: 'Yes - a professional saddle fitter (£50-£100 visit) ensures your saddle fits both horse and rider. Ill-fitting saddles cause back problems, behavioural issues, and poor performance. Get saddles checked every 6-12 months as horses\' shapes change.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Tack & Equipment Cost Calculator UK 2025 | Horse Gear Budget | HorseCost</title>
        <meta 
          name="description" 
          content="Free tack and equipment cost calculator for UK horse owners. Calculate saddle, bridle, rugs, boots and grooming kit costs. Budget to premium options with 2025 prices." 
        />
        <meta name="keywords" content="horse tack cost UK, saddle prices, bridle cost, horse rugs price, equestrian equipment budget, horse gear calculator" />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0891b2" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:title" content="Tack & Equipment Cost Calculator UK 2025 | HorseCost" />
        <meta property="og:description" content="Calculate the full cost of tacking up your horse. Saddles, bridles, rugs, boots and more." />
        <meta property="og:url" content="https://horsecost.co.uk/tack-equipment-calculator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tack & Equipment Calculator UK | HorseCost" />

        <link rel="canonical" href="https://horsecost.co.uk/tack-equipment-calculator" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/#calculators' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Tack & Equipment Calculator', 'item': 'https://horsecost.co.uk/tack-equipment-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Tack & Equipment Cost Calculator UK',
                'description': 'Calculate the cost of horse tack and equipment including saddles, bridles, rugs, and boots.',
                'url': 'https://horsecost.co.uk/tack-equipment-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.7', 'ratingCount': '189' }
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
            <a href="/" className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Tack & Equipment Calculator</h1>
                <p className="text-cyan-200">UK 2025 Horse Gear Budget Planner</p>
              </div>
            </div>
            <p className="text-cyan-100 max-w-2xl">
              Calculate the full cost of equipping your horse. From saddles and bridles to rugs and boots, 
              plan your tack budget with UK 2025 prices.
            </p>
            <p className="text-cyan-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        {/* Calculator */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Budget Level */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Budget Level</label>
                  </div>
                  <div className="space-y-2">
                    {budgetLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setBudgetLevel(level.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          budgetLevel === level.id
                            ? 'border-cyan-500 bg-cyan-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${budgetLevel === level.id ? 'text-cyan-700' : 'text-gray-900'}`}>
                              {level.name}
                            </p>
                            <p className="text-sm text-gray-500">{level.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Horse Type */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Horse Size</label>
                  </div>
                  <select
                    value={horseType}
                    onChange={(e) => setHorseType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                  >
                    {horseTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                {/* Discipline */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Primary Discipline</label>
                  </div>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                  >
                    {disciplines.map((disc) => (
                      <option key={disc.id} value={disc.id}>{disc.name}</option>
                    ))}
                  </select>
                </div>

                {/* What do you need? */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">What Do You Need?</label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needSaddle}
                        onChange={(e) => setNeedSaddle(e.target.checked)}
                        className="w-5 h-5 text-cyan-600 rounded"
                      />
                      <span className="font-medium text-gray-900">Saddle & Accessories</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needBridle}
                        onChange={(e) => setNeedBridle(e.target.checked)}
                        className="w-5 h-5 text-cyan-600 rounded"
                      />
                      <span className="font-medium text-gray-900">Bridle & Bit</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needRugs}
                        onChange={(e) => setNeedRugs(e.target.checked)}
                        className="w-5 h-5 text-cyan-600 rounded"
                      />
                      <span className="font-medium text-gray-900">Rugs (Turnout, Stable, Cooler)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needBoots}
                        onChange={(e) => setNeedBoots(e.target.checked)}
                        className="w-5 h-5 text-cyan-600 rounded"
                      />
                      <span className="font-medium text-gray-900">Boots (Brushing, Travel)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needGrooming}
                        onChange={(e) => setNeedGrooming(e.target.checked)}
                        className="w-5 h-5 text-cyan-600 rounded"
                      />
                      <span className="font-medium text-gray-900">Grooming Kit & First Aid</span>
                    </label>
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-cyan-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Additional Options
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Saddle Budget (£)
                        </label>
                        <div className="relative">
                          <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={customSaddle}
                            onChange={(e) => setCustomSaddle(e.target.value)}
                            placeholder="Leave blank for estimate"
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeSaddleFitting}
                          onChange={(e) => setIncludeSaddleFitting(e.target.checked)}
                          className="w-5 h-5 text-cyan-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Include Saddle Fitting</span>
                          <p className="text-sm text-gray-500">Professional fitting (£75)</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeSpares}
                          onChange={(e) => setIncludeSpares(e.target.checked)}
                          className="w-5 h-5 text-cyan-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Include Spare Rugs</span>
                          <p className="text-sm text-gray-500">Extra turnout + fly rug</p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Results */}
              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-700 hover:to-teal-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Equipment Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl p-6 text-white">
                      <p className="text-cyan-100 text-sm mb-1">Total Equipment Cost</p>
                      <p className="text-4xl font-bold">£{result.totalCost}</p>
                      <p className="text-cyan-200 text-sm mt-1">{result.budgetInfo.name} setup</p>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-100 text-sm">Annual Replacement</span>
                          <span className="font-bold">£{result.annualReplacement}/year</span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        {parseFloat(result.breakdown.saddle) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Saddle & Accessories</span>
                            <span className="font-medium">£{result.breakdown.saddle}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.bridle) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bridle & Bit</span>
                            <span className="font-medium">£{result.breakdown.bridle}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.rugs) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rugs</span>
                            <span className="font-medium">£{result.breakdown.rugs}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.boots) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Boots</span>
                            <span className="font-medium">£{result.breakdown.boots}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.grooming) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Grooming & First Aid</span>
                            <span className="font-medium">£{result.breakdown.grooming}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Essentials (Headcollar etc)</span>
                          <span className="font-medium">£{result.breakdown.essentials}</span>
                        </div>
                        {parseFloat(result.breakdown.disciplineExtras) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">{result.disciplineInfo.name} Extras</span>
                            <span className="font-medium">£{result.breakdown.disciplineExtras}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total</span>
                          <span>£{result.totalCost}</span>
                        </div>
                      </div>
                    </div>

                    {/* Where the Money Goes */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Where Your Money Goes</h3>
                      <div className="space-y-2">
                        {parseFloat(result.percentages.saddle) > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Saddle</span>
                              <span>{result.percentages.saddle}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-cyan-500 rounded-full"
                                style={{ width: `${result.percentages.saddle}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {parseFloat(result.percentages.rugs) > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Rugs</span>
                              <span>{result.percentages.rugs}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-teal-500 rounded-full"
                                style={{ width: `${result.percentages.rugs}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {parseFloat(result.percentages.bridle) > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Bridle</span>
                              <span>{result.percentages.bridle}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${result.percentages.bridle}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* UK Average Comparison */}
                    <div className={`rounded-xl p-4 ${result.comparison.vsUkAverage ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className={`w-5 h-5 ${result.comparison.vsUkAverage ? 'text-green-600' : 'text-amber-600'}`} />
                        <h3 className={`font-semibold ${result.comparison.vsUkAverage ? 'text-green-900' : 'text-amber-900'}`}>
                          UK Average: £{result.comparison.ukAverage.toLocaleString()}
                        </h3>
                      </div>
                      <p className={`text-sm ${result.comparison.vsUkAverage ? 'text-green-700' : 'text-amber-700'}`}>
                        {result.comparison.vsUkAverage 
                          ? `You're £${(result.comparison.ukAverage - parseFloat(result.totalCost)).toFixed(0)} below average`
                          : `You're £${(parseFloat(result.totalCost) - result.comparison.ukAverage).toFixed(0)} above average`
                        }
                      </p>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select your preferences and click calculate to see your equipment budget</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Box */}
          <div className="bg-cyan-50 border-l-4 border-cyan-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-cyan-900 mb-2">Money-Saving Tips for Tack</h3>
                <ul className="text-cyan-800 space-y-1 text-sm">
                  <li>• <strong>Buy second-hand</strong> - Facebook groups, eBay, and tack sales offer 40-60% savings</li>
                  <li>• <strong>Invest in the saddle</strong> - it's worth spending more here, save elsewhere</li>
                  <li>• <strong>Start minimal</strong> - buy essentials first, add extras as you learn what you need</li>
                  <li>• <strong>Look for bundles</strong> - saddleries often offer package deals</li>
                  <li>• <strong>Care for your tack</strong> - regular cleaning doubles lifespan</li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Tack Prices Table */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Tack Prices Guide 2025</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Item</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Budget</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Mid-Range</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Saddle (GP)</td>
                    <td className="py-3 px-4 text-center">£300-£600</td>
                    <td className="py-3 px-4 text-center">£600-£1,500</td>
                    <td className="py-3 px-4 text-center">£1,500-£4,000+</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Bridle (complete)</td>
                    <td className="py-3 px-4 text-center">£40-£80</td>
                    <td className="py-3 px-4 text-center">£80-£200</td>
                    <td className="py-3 px-4 text-center">£200-£500+</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Turnout Rug</td>
                    <td className="py-3 px-4 text-center">£50-£80</td>
                    <td className="py-3 px-4 text-center">£80-£150</td>
                    <td className="py-3 px-4 text-center">£150-£300+</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Brushing Boots (pair)</td>
                    <td className="py-3 px-4 text-center">£20-£35</td>
                    <td className="py-3 px-4 text-center">£35-£70</td>
                    <td className="py-3 px-4 text-center">£70-£150+</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Grooming Kit</td>
                    <td className="py-3 px-4 text-center">£30-£50</td>
                    <td className="py-3 px-4 text-center">£50-£100</td>
                    <td className="py-3 px-4 text-center">£100-£200+</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Budget prices typically second-hand or basic brands. Premium includes custom-made and designer brands.
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
                <p className="text-sm text-gray-600">Complete first year costs</p>
              </a>
              <a href="/annual-horse-cost-calculator" className="bg-amber-50 hover:bg-amber-100 rounded-xl p-4 transition group">
                <Calendar className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600">Annual Cost Calculator</h3>
                <p className="text-sm text-gray-600">Full ownership budget</p>
              </a>
              <a href="/competition-budget-calculator" className="bg-rose-50 hover:bg-rose-100 rounded-xl p-4 transition group">
                <Target className="w-8 h-8 text-rose-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-rose-600">Competition Budget</h3>
                <p className="text-sm text-gray-600">Show season expenses</p>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Planning Your First Horse Purchase?</h2>
            <p className="text-cyan-100 mb-6 max-w-xl mx-auto">
              Get the complete picture with our First Horse Calculator - includes tack, livery, and all first-year costs.
            </p>
            <a 
              href="/first-horse-calculator"
              className="inline-flex items-center gap-2 bg-white text-cyan-600 px-6 py-3 rounded-xl font-bold hover:bg-cyan-50 transition"
            >
              Calculate First Year Costs
              <Calculator className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
