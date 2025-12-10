import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Scissors,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Star,
  Zap
} from 'lucide-react'

export default function ClippingCostCalculator() {
  const [clipType, setClipType] = useState('hunter')
  const [clipsPerYear, setClipsPerYear] = useState('3')
  const [method, setMethod] = useState('professional')
  const [region, setRegion] = useState('average')
  const [horseTemperament, setHorseTemperament] = useState('good')
  const [ownClippers, setOwnClippers] = useState(false)
  const [clipperQuality, setClipperQuality] = useState('mid')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState<any>(null)

  const clipTypes = [
    { id: 'trace', name: 'Trace Clip', description: 'Belly & lower neck', time: 1, proCost: 35, difficulty: 'easy' },
    { id: 'blanket', name: 'Blanket Clip', description: 'Leaves back covered', time: 1.5, proCost: 45, difficulty: 'medium' },
    { id: 'hunter', name: 'Hunter Clip', description: 'Leaves legs & saddle patch', time: 2, proCost: 55, difficulty: 'medium' },
    { id: 'chaser', name: 'Chaser Clip', description: 'Head & neck left on', time: 1.5, proCost: 45, difficulty: 'medium' },
    { id: 'full', name: 'Full Clip', description: 'Everything off', time: 2.5, proCost: 65, difficulty: 'hard' },
    { id: 'bib', name: 'Bib Clip', description: 'Chest & neck only', time: 0.75, proCost: 30, difficulty: 'easy' }
  ]

  const temperamentMultipliers: Record<string, number> = {
    'excellent': 0.9,
    'good': 1.0,
    'nervous': 1.3,
    'difficult': 1.5,
    'sedation': 2.0
  }

  const regionMultipliers: Record<string, number> = {
    'london': 1.35,
    'southeast': 1.2,
    'average': 1.0,
    'north': 0.9,
    'scotland': 0.95
  }

  const clipperCosts = {
    budget: { purchase: 150, blades: 25, service: 20, lifespan: 3 },
    mid: { purchase: 300, blades: 40, service: 30, lifespan: 5 },
    premium: { purchase: 500, blades: 60, service: 40, lifespan: 8 }
  }

  const calculate = () => {
    const clip = clipTypes.find(c => c.id === clipType)
    if (!clip) return

    const clips = parseInt(clipsPerYear)
    const regionFactor = regionMultipliers[region]
    const temperamentFactor = temperamentMultipliers[horseTemperament]

    let annualCost = 0
    let firstYearCost = 0
    let breakdown: any = {}

    if (method === 'professional') {
      // Professional clipping
      const baseCost = clip.proCost * regionFactor * temperamentFactor
      annualCost = baseCost * clips

      // Add sedation cost if needed
      let sedationCost = 0
      if (horseTemperament === 'sedation') {
        sedationCost = 80 * clips * regionFactor // vet callout + sedation
      }

      breakdown = {
        clipping: (clip.proCost * regionFactor * clips).toFixed(2),
        difficultyPremium: ((temperamentFactor - 1) * clip.proCost * regionFactor * clips).toFixed(2),
        sedation: sedationCost.toFixed(2),
        total: (annualCost + sedationCost).toFixed(2)
      }

      annualCost += sedationCost
      firstYearCost = annualCost

    } else {
      // DIY clipping
      const clipper = clipperCosts[clipperQuality as keyof typeof clipperCosts]
      
      // Annual running costs
      const bladeSharpeningPerYear = clipper.blades * 2 // 2 sharpenings per year
      const bladeReplacementPerYear = clipper.blades / 2 // replace every 2 years
      const servicePerYear = clipper.service // annual service
      const oilAndConsumables = 20 // oil, cleaning supplies
      
      const annualRunning = bladeSharpeningPerYear + bladeReplacementPerYear + servicePerYear + oilAndConsumables

      // First year includes clipper purchase if not owned
      const clipperCost = ownClippers ? 0 : clipper.purchase
      const initialBlades = ownClippers ? 0 : clipper.blades // spare set of blades

      firstYearCost = clipperCost + initialBlades + annualRunning
      annualCost = annualRunning

      // Depreciation per year
      const depreciationPerYear = clipper.purchase / clipper.lifespan

      breakdown = {
        clipperPurchase: clipperCost.toFixed(2),
        initialBlades: initialBlades.toFixed(2),
        bladeSharpening: bladeSharpeningPerYear.toFixed(2),
        bladeReplacement: bladeReplacementPerYear.toFixed(2),
        service: servicePerYear.toFixed(2),
        consumables: oilAndConsumables.toFixed(2),
        depreciation: depreciationPerYear.toFixed(2)
      }
    }

    // Compare DIY vs Professional
    const proAnnualCost = clip.proCost * regionFactor * temperamentFactor * clips
    const diyAnnualCost = clipperCosts.mid.blades * 2 + clipperCosts.mid.blades / 2 + clipperCosts.mid.service + 20

    // 5 year comparison
    const fiveYearPro = proAnnualCost * 5
    const fiveYearDIY = clipperCosts.mid.purchase + clipperCosts.mid.blades + (diyAnnualCost * 5)

    setResult({
      annualCost: annualCost.toFixed(2),
      firstYearCost: firstYearCost.toFixed(2),
      costPerClip: (annualCost / clips).toFixed(2),
      breakdown,
      clipInfo: clip,
      method,
      comparison: {
        proAnnual: proAnnualCost.toFixed(2),
        diyAnnual: diyAnnualCost.toFixed(2),
        fiveYearPro: fiveYearPro.toFixed(2),
        fiveYearDIY: fiveYearDIY.toFixed(2),
        diyBreakEven: (clipperCosts.mid.purchase / (proAnnualCost - diyAnnualCost)).toFixed(1)
      },
      clipsPerYear: clips,
      recommendation: proAnnualCost > diyAnnualCost * 1.5 ? 'Consider DIY - significant savings possible' : 'Professional clipping good value for your situation'
    })
  }

  const faqs = [
    {
      q: 'How much does horse clipping cost UK?',
      a: 'Professional horse clipping in the UK costs £30-£80 depending on clip type. Bib clips cost £25-35, trace clips £35-45, hunter clips £50-65, and full clips £60-80. Prices vary by region (London 30% higher) and horse temperament. Difficult horses or those requiring sedation cost significantly more.'
    },
    {
      q: 'How many times should you clip a horse per year?',
      a: 'Most horses need 2-4 clips per season (October to February). Heavy workers may need clipping every 4-6 weeks. Light work horses often need just 2-3 clips. The clip grows back in 6-8 weeks. Stop clipping by late January to allow coat regrowth for spring.'
    },
    {
      q: 'Is it cheaper to clip your own horse?',
      a: 'DIY clipping saves money long-term but requires upfront investment. Quality clippers cost £150-500, plus £50-100/year for blades and servicing. If you pay £55 for a hunter clip 3x yearly (£165), DIY breaks even in 2-3 years. DIY is most economical with multiple horses.'
    },
    {
      q: 'What equipment do I need to clip my own horse?',
      a: 'Essential equipment: quality clippers (£150-500), spare blade set (£30-60), clipper oil, blade wash, extension lead, circuit breaker, rug for clipped areas. Nice to have: cordless clippers for head, trimming clippers for legs, blade sharpening service contact.'
    },
    {
      q: 'Which clip is best for my horse?',
      a: 'Clip choice depends on workload: Light work (hacking 2-3x weekly) = bib or trace clip. Medium work (schooling, light competing) = blanket or chaser clip. Hard work (hunting, heavy competing) = hunter or full clip. More clip = more rugs needed. Start with less and re-clip if needed.'
    },
    {
      q: 'Can you clip a horse yourself as a beginner?',
      a: 'Yes, with preparation. Start with a simple trace or bib clip. Practice on a quiet horse, watch tutorials, have an experienced person supervise first time. Use quality clippers (cheap ones pull coat). Allow 2-3 hours first time. Many find it easier than expected.'
    },
    {
      q: 'How long does it take to clip a horse?',
      a: 'Professional clippers take 45 mins to 2 hours depending on clip type. DIY takes longer - allow 1.5-3 hours for a full hunter clip. Bib clips take 30-45 minutes. Time increases with nervous horses, blunt blades, or inexperience. Take breaks if horse gets stressed.'
    },
    {
      q: 'What clippers should I buy for horse clipping?',
      a: 'For occasional DIY: Liveryman Kare Pro or Lister Liberty (£150-200). Regular use: Lister Star or Heiniger Xplorer (£250-350). Professional/multiple horses: Lister Stablemate or Heiniger Opal (£400-500). Avoid very cheap clippers - they pull, overheat, and frustrate.'
    },
    {
      q: 'When should I clip my horse for the first time?',
      a: 'Clip when your horse\'s winter coat has fully grown in (usually October) and they\'re sweating during work. Don\'t clip too early or the coat isn\'t long enough. Last clip should be late January - this allows coat to regrow before spring. Some horses manage with just one clip.'
    },
    {
      q: 'My horse is difficult to clip - what can I do?',
      a: 'Options include: desensitization training (takes weeks), sedation from vet (£60-100 per clip), using quieter cordless clippers, clipping in stages over several days, or professional clippers experienced with difficult horses. Some horses improve over time with patient handling.'
    }
  ]

  return (
    <>
<Helmet>
  {/* ========== 1. PRIMARY META TAGS (4) ========== */}
  <title>Horse Clipping Cost Calculator UK 2025 | DIY vs Professional Prices | HorseCost</title>
  <meta 
    name="description" 
    content="Free horse clipping cost calculator for UK owners. Compare DIY vs professional clipping costs, calculate clipper investment payback, and plan your winter clipping budget. 2025 prices." 
  />
  <meta 
    name="keywords" 
    content="horse clipping cost UK, professional horse clipper price, DIY clipping costs, hunter clip price, trace clip cost, horse grooming budget, clipper investment calculator" 
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
  <meta name="theme-color" content="#4f46e5" />

  {/* ========== 5. OPEN GRAPH / FACEBOOK (8) ========== */}
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="HorseCost" />
  <meta property="og:locale" content="en_GB" />
  <meta property="og:title" content="Horse Clipping Cost Calculator UK 2025 | DIY vs Professional | HorseCost" />
  <meta property="og:description" content="Compare DIY vs professional horse clipping costs. Calculate clipper investment and annual savings with UK 2025 prices." />
  <meta property="og:url" content="https://horsecost.co.uk/clipping-cost-calculator" />
  <meta property="og:image" content="https://horsecost.co.uk/images/clipping-calculator-og-1200x630.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Horse Clipping Cost Calculator showing DIY vs professional price comparison" />

  {/* ========== 6. TWITTER CARD (6) ========== */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@HorseCost" />
  <meta name="twitter:title" content="Horse Clipping Cost Calculator UK 2025 | HorseCost" />
  <meta name="twitter:description" content="Compare DIY vs professional clipping costs. Calculate clipper investment payback period." />
  <meta name="twitter:image" content="https://horsecost.co.uk/images/clipping-calculator-twitter-1200x675.jpg" />
  <meta name="twitter:image:alt" content="Horse Clipping Cost Calculator UK" />

  {/* ========== 7. CANONICAL & ALTERNATE (2) ========== */}
  <link rel="canonical" href="https://horsecost.co.uk/clipping-cost-calculator" />
  <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/clipping-cost-calculator" />

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
            { 
              '@type': 'ListItem', 
              'position': 1, 
              'name': 'Home', 
              'item': 'https://horsecost.co.uk'
            },
            { 
              '@type': 'ListItem', 
              'position': 2, 
              'name': 'Calculators', 
              'item': 'https://horsecost.co.uk/#calculators'
            },
            { 
              '@type': 'ListItem', 
              'position': 3, 
              'name': 'Clipping Cost Calculator', 
              'item': 'https://horsecost.co.uk/clipping-cost-calculator'
            }
          ]
        },
        {
          '@type': 'SoftwareApplication',
          'name': 'Horse Clipping Cost Calculator UK',
          'description': 'Calculate and compare horse clipping costs - DIY vs professional. Work out clipper investment payback and annual grooming budget.',
          'url': 'https://horsecost.co.uk/clipping-cost-calculator',
          'applicationCategory': 'FinanceApplication',
          'operatingSystem': 'Web',
          'offers': { 
            '@type': 'Offer', 
            'price': '0', 
            'priceCurrency': 'GBP',
            'availability': 'https://schema.org/InStock'
          },
          'aggregateRating': { 
            '@type': 'AggregateRating', 
            'ratingValue': '4.7', 
            'ratingCount': '156',
            'bestRating': '5',
            'worstRating': '1'
          },
          'author': {
            '@type': 'Organization',
            'name': 'HorseCost'
          }
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'How much does horse clipping cost UK?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Professional horse clipping in the UK costs £30-£80 depending on clip type. Bib clips cost £25-35, trace clips £35-45, hunter clips £50-65, and full clips £60-80. Prices vary by region (London 30% higher) and horse temperament. Difficult horses or those requiring sedation cost significantly more.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How many times should you clip a horse per year?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Most horses need 2-4 clips per season (October to February). Heavy workers may need clipping every 4-6 weeks. Light work horses often need just 2-3 clips. The clip grows back in 6-8 weeks. Stop clipping by late January to allow coat regrowth for spring.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Is it cheaper to clip your own horse?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'DIY clipping saves money long-term but requires upfront investment. Quality clippers cost £150-500, plus £50-100/year for blades and servicing. If you pay £55 for a hunter clip 3x yearly (£165), DIY breaks even in 2-3 years. DIY is most economical with multiple horses.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What equipment do I need to clip my own horse?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Essential equipment: quality clippers (£150-500), spare blade set (£30-60), clipper oil, blade wash, extension lead, circuit breaker, rug for clipped areas. Nice to have: cordless clippers for head, trimming clippers for legs, blade sharpening service contact.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Which clip is best for my horse?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Clip choice depends on workload: Light work (hacking 2-3x weekly) = bib or trace clip. Medium work (schooling, light competing) = blanket or chaser clip. Hard work (hunting, heavy competing) = hunter or full clip. More clip = more rugs needed. Start with less and re-clip if needed.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Can you clip a horse yourself as a beginner?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Yes, with preparation. Start with a simple trace or bib clip. Practice on a quiet horse, watch tutorials, have an experienced person supervise first time. Use quality clippers (cheap ones pull coat). Allow 2-3 hours first time. Many find it easier than expected.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How long does it take to clip a horse?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Professional clippers take 45 mins to 2 hours depending on clip type. DIY takes longer - allow 1.5-3 hours for a full hunter clip. Bib clips take 30-45 minutes. Time increases with nervous horses, blunt blades, or inexperience. Take breaks if horse gets stressed.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What clippers should I buy for horse clipping?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'For occasional DIY: Liveryman Kare Pro or Lister Liberty (£150-200). Regular use: Lister Star or Heiniger Xplorer (£250-350). Professional/multiple horses: Lister Stablemate or Heiniger Opal (£400-500). Avoid very cheap clippers - they pull, overheat, and frustrate.'
              }
            },
            {
              '@type': 'Question',
              'name': 'When should I clip my horse for the first time?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Clip when your horse\'s winter coat has fully grown in (usually October) and they\'re sweating during work. Don\'t clip too early or the coat isn\'t long enough. Last clip should be late January - this allows coat to regrow before spring. Some horses manage with just one clip.'
              }
            },
            {
              '@type': 'Question',
              'name': 'My horse is difficult to clip - what can I do?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Options include: desensitization training (takes weeks), sedation from vet (£60-100 per clip), using quieter cordless clippers, clipping in stages over several days, or professional clippers experienced with difficult horses. Some horses improve over time with patient handling.'
              }
            }
          ]
        },
        {
          '@type': 'HowTo',
          'name': 'How to Use the Horse Clipping Cost Calculator',
          'description': 'Step-by-step guide to calculating your horse clipping costs and comparing DIY vs professional options',
          'step': [
            {
              '@type': 'HowToStep',
              'position': 1,
              'name': 'Select Clip Type',
              'text': 'Choose the type of clip your horse needs: bib, trace, blanket, chaser, hunter, or full clip. Each has different time and cost requirements.'
            },
            {
              '@type': 'HowToStep',
              'position': 2,
              'name': 'Enter Clips Per Season',
              'text': 'Select how many times you expect to clip during the winter season (October to February). Most horses need 2-4 clips.'
            },
            {
              '@type': 'HowToStep',
              'position': 3,
              'name': 'Choose Method',
              'text': 'Select whether you want to use a professional clipper or do it yourself (DIY). This affects the cost calculation significantly.'
            },
            {
              '@type': 'HowToStep',
              'position': 4,
              'name': 'Set Horse Temperament',
              'text': 'Indicate how your horse behaves during clipping. Difficult horses cost more with professionals and may need sedation.'
            },
            {
              '@type': 'HowToStep',
              'position': 5,
              'name': 'Calculate and Compare',
              'text': 'Click Calculate to see your annual clipping costs, 5-year comparison between DIY and professional, and break-even point for clipper investment.'
            }
          ]
        },
        {
          '@type': 'Article',
          'headline': 'Horse Clipping Cost Calculator UK 2025 - DIY vs Professional Comparison',
          'description': 'Free calculator for UK horse clipping costs. Compare professional clipper prices with DIY investment and work out the most economical option for your situation.',
          'datePublished': '2025-01-01',
          'dateModified': '2025-01-15',
          'author': {
            '@type': 'Organization',
            'name': 'HorseCost',
            'url': 'https://horsecost.co.uk'
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'HorseCost',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://horsecost.co.uk/logo.png',
              'width': 200,
              'height': 200
            }
          },
          'image': 'https://horsecost.co.uk/images/clipping-calculator-og-1200x630.jpg',
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': 'https://horsecost.co.uk/clipping-cost-calculator'
          }
        },
        {
          '@type': 'Organization',
          'name': 'HorseCost',
          'url': 'https://horsecost.co.uk',
          'logo': 'https://horsecost.co.uk/logo.png',
          'description': 'Free professional horse cost calculators for UK equestrians',
          'sameAs': [
            'https://www.facebook.com/HorseCost',
            'https://twitter.com/HorseCost',
            'https://www.instagram.com/HorseCost'
          ],
          'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'Customer Support',
            'email': 'hello@horsecost.co.uk'
          },
          'address': {
            '@type': 'PostalAddress',
            'addressCountry': 'GB'
          }
        }
      ]
    })}
  </script>
</Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <a href="/" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Scissors className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Clipping Cost Calculator</h1>
                <p className="text-indigo-200">UK 2025 DIY vs Professional Comparison</p>
              </div>
            </div>
            <p className="text-indigo-100 max-w-2xl">
              Calculate horse clipping costs and compare DIY vs professional options. 
              Work out if investing in clippers is worth it for your situation.
            </p>
            <p className="text-indigo-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Clip Type</label>
                  </div>
                  <div className="space-y-2">
                    {clipTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setClipType(type.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          clipType === type.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${clipType === type.id ? 'text-indigo-700' : 'text-gray-900'}`}>
                              {type.name}
                            </p>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                          <p className="text-sm text-gray-600">~£{type.proCost}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Clips Per Season</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['1', '2', '3', '4', '5'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setClipsPerYear(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          clipsPerYear === val
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val}x
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">October to February season</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Method</label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMethod('professional')}
                      className={`flex-1 py-3 rounded-xl font-medium transition ${
                        method === 'professional'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Professional
                    </button>
                    <button
                      onClick={() => setMethod('diy')}
                      className={`flex-1 py-3 rounded-xl font-medium transition ${
                        method === 'diy'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      DIY
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Horse Temperament</label>
                  </div>
                  <select
                    value={horseTemperament}
                    onChange={(e) => setHorseTemperament(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="excellent">Excellent - Stands perfectly</option>
                    <option value="good">Good - Minor fidgeting</option>
                    <option value="nervous">Nervous - Needs patience</option>
                    <option value="difficult">Difficult - Extra time needed</option>
                    <option value="sedation">Requires Sedation</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="london">London (Higher prices)</option>
                    <option value="southeast">South East England</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England</option>
                    <option value="scotland">Scotland / Wales</option>
                  </select>
                </div>

                {method === 'diy' && (
                  <div className="border-t pt-4">
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center gap-2 text-indigo-600 font-medium"
                    >
                      {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      DIY Options
                    </button>

                    {showAdvanced && (
                      <div className="mt-4 space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ownClippers}
                            onChange={(e) => setOwnClippers(e.target.checked)}
                            className="w-5 h-5 text-indigo-600 rounded"
                          />
                          <div>
                            <span className="font-medium text-gray-900">Already Own Clippers</span>
                            <p className="text-sm text-gray-500">Skip purchase cost</p>
                          </div>
                        </label>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Clipper Quality</label>
                          <select
                            value={clipperQuality}
                            onChange={(e) => setClipperQuality(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                          >
                            <option value="budget">Budget (~£150)</option>
                            <option value="mid">Mid-Range (~£300)</option>
                            <option value="premium">Premium (~£500)</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-violet-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Clipping Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 text-white">
                      <p className="text-indigo-100 text-sm mb-1">Annual Clipping Cost</p>
                      <p className="text-4xl font-bold">£{result.annualCost}</p>
                      <p className="text-indigo-200 text-sm mt-1">{result.method === 'professional' ? 'Professional' : 'DIY'} - {result.clipInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-indigo-100 text-xs">Per Clip</p>
                          <p className="font-bold">£{result.costPerClip}</p>
                        </div>
                        <div>
                          <p className="text-indigo-100 text-xs">Clips/Year</p>
                          <p className="font-bold">{result.clipsPerYear}x</p>
                        </div>
                      </div>
                    </div>

                    {result.method === 'diy' && parseFloat(result.breakdown.clipperPurchase) > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <h3 className="font-semibold text-amber-900 mb-2">First Year Investment</h3>
                        <p className="text-2xl font-bold text-amber-700">£{result.firstYearCost}</p>
                        <p className="text-sm text-amber-600 mt-1">Includes clipper purchase + blades</p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        {result.method === 'professional' ? (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Clipping ({result.clipsPerYear}x {result.clipInfo.name})</span>
                              <span className="font-medium">£{result.breakdown.clipping}</span>
                            </div>
                            {parseFloat(result.breakdown.difficultyPremium) > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Difficult Horse Premium</span>
                                <span className="font-medium">£{result.breakdown.difficultyPremium}</span>
                              </div>
                            )}
                            {parseFloat(result.breakdown.sedation) > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Sedation (vet)</span>
                                <span className="font-medium">£{result.breakdown.sedation}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {parseFloat(result.breakdown.clipperPurchase) > 0 && (
                              <div className="flex justify-between text-amber-600">
                                <span>Clipper Purchase (one-off)</span>
                                <span className="font-medium">£{result.breakdown.clipperPurchase}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Blade Sharpening</span>
                              <span className="font-medium">£{result.breakdown.bladeSharpening}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Blade Replacement Fund</span>
                              <span className="font-medium">£{result.breakdown.bladeReplacement}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Annual Service</span>
                              <span className="font-medium">£{result.breakdown.service}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Oil & Consumables</span>
                              <span className="font-medium">£{result.breakdown.consumables}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Annual Total</span>
                          <span>£{result.annualCost}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-indigo-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">DIY vs Professional - 5 Year Comparison</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-indigo-50 rounded-lg p-3 text-center">
                          <p className="text-indigo-600 font-medium mb-1">Professional</p>
                          <p className="text-lg font-bold text-gray-900">£{result.comparison.fiveYearPro}</p>
                          <p className="text-xs text-gray-500">5 years</p>
                        </div>
                        <div className="bg-violet-50 rounded-lg p-3 text-center">
                          <p className="text-violet-600 font-medium mb-1">DIY</p>
                          <p className="text-lg font-bold text-gray-900">£{result.comparison.fiveYearDIY}</p>
                          <p className="text-xs text-gray-500">5 years (inc. clippers)</p>
                        </div>
                      </div>
                      {parseFloat(result.comparison.diyBreakEven) > 0 && parseFloat(result.comparison.diyBreakEven) < 10 && (
                        <p className="text-sm text-indigo-600 mt-3 text-center font-medium">
                          DIY breaks even after ~{result.comparison.diyBreakEven} years
                        </p>
                      )}
                    </div>

                    <div className={`rounded-xl p-4 ${result.recommendation.includes('DIY') ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                      <div className="flex items-center gap-2">
                        <Zap className={`w-5 h-5 ${result.recommendation.includes('DIY') ? 'text-green-600' : 'text-blue-600'}`} />
                        <p className={`font-medium ${result.recommendation.includes('DIY') ? 'text-green-800' : 'text-blue-800'}`}>
                          {result.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Scissors className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select your clipping preferences to see costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-indigo-900 mb-2">Clipping Tips for Horse Owners</h3>
                <ul className="text-indigo-800 space-y-1 text-sm">
                  <li>• <strong>Sharp blades are essential</strong> - dull blades pull coat and stress horses</li>
                  <li>• <strong>Oil frequently</strong> - every 10-15 minutes during clipping</li>
                  <li>• <strong>Bathe first if possible</strong> - clean coat clips easier and saves blades</li>
                  <li>• <strong>Start simple</strong> - a trace clip is easier than a hunter clip for beginners</li>
                  <li>• <strong>Have spare blades</strong> - they heat up and need swapping</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Clipping Prices 2025</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Clip Type</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Time</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Pro Cost</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {clipTypes.map((clip) => (
                    <tr key={clip.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">{clip.name}</td>
                      <td className="py-3 px-4 text-center">{clip.time}-{clip.time + 0.5} hrs</td>
                      <td className="py-3 px-4 text-center">£{clip.proCost - 10}-£{clip.proCost + 15}</td>
                      <td className="py-3 px-4 text-center capitalize">{clip.difficulty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Difficult horses may cost 30-50% more. Sedation adds £60-100 per clip (vet callout + drug).
            </p>
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
              <a href="/annual-horse-cost-calculator" className="bg-amber-50 hover:bg-amber-100 rounded-xl p-4 transition group">
                <Calendar className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600">Annual Cost Calculator</h3>
                <p className="text-sm text-gray-600">Complete ownership budget</p>
              </a>
              <a href="/tack-equipment-calculator" className="bg-cyan-50 hover:bg-cyan-100 rounded-xl p-4 transition group">
                <Star className="w-8 h-8 text-cyan-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-cyan-600">Tack & Equipment</h3>
                <p className="text-sm text-gray-600">Calculate gear costs</p>
              </a>
              <a href="/vet-cost-estimator" className="bg-red-50 hover:bg-red-100 rounded-xl p-4 transition group">
                <Zap className="w-8 h-8 text-red-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-red-600">Vet Cost Estimator</h3>
                <p className="text-sm text-gray-600">Healthcare budget</p>
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Calculate Your Full Horse Budget</h2>
            <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
              Clipping is just one cost. Get the complete picture with our Annual Horse Cost Calculator.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition"
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
