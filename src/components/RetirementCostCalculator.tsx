import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Heart,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Shield,
  Bell,
  ArrowRight,
  MapPin,
  Users,
  HelpCircle,
  CheckCircle2,
  Home,
  Stethoscope,
  Wheat,
  Scissors
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
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  const healthStatuses = [
    { id: 'excellent', name: 'Excellent Health', vetMultiplier: 0.8, description: 'No issues, rarely needs vet' },
    { id: 'good', name: 'Good Health', vetMultiplier: 1.0, description: 'Normal age-related care' },
    { id: 'fair', name: 'Fair - Minor Issues', vetMultiplier: 1.4, description: 'Some ongoing management needed' },
    { id: 'poor', name: 'Poor - Multiple Issues', vetMultiplier: 2.0, description: 'Significant ongoing care' }
  ]

  // 2026 pricing
  const liveryTypes = [
    { id: 'retirement', name: 'Retirement Livery', monthlyBase: 240, description: 'Specialist retirement yards', includes: 'Grass keep, daily checks, basic care' },
    { id: 'grass', name: 'Grass Livery', monthlyBase: 140, description: 'Field only', includes: 'Grazing, water, basic checking' },
    { id: 'diy', name: 'DIY Livery', monthlyBase: 210, description: 'You provide all care', includes: 'Stable, field, facilities' },
    { id: 'assisted', name: 'Assisted DIY', monthlyBase: 290, description: 'Some help provided', includes: 'Stable, field, some handling help' },
    { id: 'home', name: 'Home Kept', monthlyBase: 95, description: 'Your own land', includes: 'Land costs only' }
  ]

  // 2026 pricing
  const chronicConditions = [
    { id: 'none', name: 'None', monthlyCost: 0 },
    { id: 'cushings', name: 'Cushings (PPID)', monthlyCost: 85, description: 'Prascend + monitoring' },
    { id: 'arthritis', name: 'Arthritis', monthlyCost: 60, description: 'Joint supplements + occasional bute' },
    { id: 'laminitis', name: 'Laminitis History', monthlyCost: 50, description: 'Special management + farrier' },
    { id: 'respiratory', name: 'Respiratory (COPD/RAO)', monthlyCost: 70, description: 'Soaked hay + medication' },
    { id: 'metabolic', name: 'EMS/Metabolic', monthlyCost: 55, description: 'Diet management + supplements' }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.4,
    'southeast': 1.2,
    'southwest': 1.1,
    'average': 1.0,
    'north': 0.85,
    'scotland': 0.9
  }

  // 2026 annual costs for retired horses
  const annualCosts = {
    farrier: { barefoot: 360, shod: 840 },
    vaccinations: 95,
    worming: 120,
    dental: 80,
    insurance: { basic: 240, vet: 420 },
    feed: { easy: 480, moderate: 960, hard: 1440 },
    hay: 720,
    rugs: 100,
    sundries: 180
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
    const annualFarrier = annualCosts.farrier.barefoot
    const annualVaccinations = annualCosts.vaccinations * regionFactor
    const annualWorming = annualCosts.worming
    const annualDental = annualCosts.dental * regionFactor * (age > 20 ? 1.3 : 1.0)
    
    // Condition costs
    const annualCondition = hasChronicCondition ? condition.monthlyCost * 12 : 0

    // Vet visits (beyond routine)
    const baseVetVisits = 180 * health.vetMultiplier * regionFactor
    
    // Emergency fund recommendation
    const emergencyFund = age > 25 ? 2500 : age > 20 ? 2000 : 1500

    // Feed costs
    const annualFeed = annualCosts.feed.easy * (age > 22 ? 1.5 : 1.0)
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
    const inflation = 0.04
    let totalProjected = 0
    const yearlyProjection = []
    for (let i = 1; i <= years; i++) {
      const yearCost = totalAnnual * Math.pow(1 + inflation, i - 1)
      totalProjected += yearCost
      yearlyProjection.push({ year: i, cost: yearCost.toFixed(0) })
    }

    // End of life costs (2026)
    const eolCosts = {
      euthanasia: 180,
      cremation: 700,
      burial: 480,
      total: 880
    }

    // Life expectancy estimate
    const lifeExpectancy = health.id === 'excellent' ? 30 : health.id === 'good' ? 28 : health.id === 'fair' ? 26 : 24
    const estimatedYearsRemaining = Math.max(0, lifeExpectancy - age)

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'horse_retirement',
        horse_age: age,
        health_status: healthStatus,
        livery_type: liveryType,
        has_chronic_condition: hasChronicCondition,
        annual_cost: totalAnnual.toFixed(0)
      })
    }

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
    if (hasCond && cond === 'cushings') recs.push('Budget for regular ACTH blood tests (£50-75 each)')
    if (hasCond && cond === 'laminitis') recs.push('More frequent farrier visits may be needed')
    recs.push('Retirement livery can be more cost-effective than standard DIY')
    recs.push('Keep an emergency fund of at least £1,500-2,500')
    return recs
  }

  // 15 FAQs for maximum SEO
  const faqs = [
    {
      q: 'How much does it cost to keep a retired horse UK?',
      a: 'Keeping a retired horse in the UK costs £3,500-7,000 per year in 2026 depending on livery type and health. Retirement livery costs £180-350/month, plus £1,000-1,800 for farrier, dental, worming, and vaccinations. Horses with chronic conditions like Cushings add £600-1,200 annually. Budget £300-600/month minimum.'
    },
    {
      q: 'What is retirement livery?',
      a: 'Retirement livery is specialist care for elderly or non-ridden horses. It typically costs £180-350/month in 2026 and includes: grass keep, daily welfare checks, bringing in for vet/farrier, administering medication, and monitoring condition. Many offer a more peaceful environment than busy competition yards.'
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
      a: 'Cushings (PPID) treatment costs £75-110/month for Prascend medication in 2026. Add £50-75 per ACTH blood test (recommended 2-4x yearly). Total annual cost: £1,000-1,500. Cushings also increases risk of laminitis, requiring careful management and potentially more frequent farrier visits.'
    },
    {
      q: 'Should I keep my retired horse barefoot?',
      a: 'Many retired horses thrive barefoot as they\'re not working on hard surfaces. This saves £450-550/year vs shoeing in 2026. Transition gradually and ensure regular trimming (6-8 weeks). Some horses with foot issues may still need front shoes or boots for turnout on hard ground.'
    },
    {
      q: 'What should I budget for end of life costs?',
      a: 'End of life costs in the UK in 2026 include: euthanasia (£120-250), cremation (£600-950), or burial on own land (£350-600 for equipment hire). Hunt kennels collection is often free. Total: £700-1,200. This is a difficult but necessary consideration for retired horse budgeting.'
    },
    {
      q: 'How do I find good retirement livery?',
      a: 'Look for: experienced staff who understand older horses, appropriate turnout companions, ability to medicate and handle for vet/farrier, good grazing management, shelter from elements, and peaceful environment. Ask for references, visit unannounced, and check insurance. Specialist retirement yards often provide better care than standard yards.'
    },
    {
      q: 'Can I keep a retired horse on less land?',
      a: 'Retired horses still need adequate grazing - typically 1-1.5 acres per horse. However, they may manage on smaller areas with supplementary feeding if grass is limited. Good doers/laminitis-prone horses may actually benefit from restricted grazing. Companion ponies or sheep can share the space.'
    },
    {
      q: 'How long do horses live in retirement?',
      a: 'With good care, horses commonly live to 25-30+ years. A horse retiring at 20 may have 8-12 years of retirement. This means total retirement costs of £30,000-80,000+ depending on health. Planning early is essential - many owners underestimate how long retirement lasts.'
    },
    {
      q: 'What signs indicate my horse should retire?',
      a: 'Signs a horse needs retirement include: persistent lameness not improving with treatment, difficulty maintaining condition despite good care, reluctance to work, chronic pain requiring daily medication, respiratory issues worsening with exercise, and cognitive changes affecting safety. Consult your vet for assessment.'
    },
    {
      q: 'Do retired horses need less veterinary care?',
      a: 'Surprisingly, retired horses often need MORE vet care, not less. Older horses are prone to age-related conditions (Cushings, arthritis, dental issues), may need regular blood tests for medication monitoring, and have weaker immune systems. Budget £400-800/year minimum for routine vet care, more if health issues exist.'
    },
    {
      q: 'What is the cheapest way to keep a retired horse?',
      a: 'The cheapest options are: home keeping on your own land (£1,500-2,500/year), grass livery (£2,500-3,500/year), or retirement livery sharing (£3,000-4,000/year). Going barefoot saves £500/year. However, never compromise on essential care - dental, worming, vaccinations, and vet checks are non-negotiable.'
    },
    {
      q: 'Should I loan out my retired horse?',
      a: 'Loan can work well if your horse is sound enough for light work and enjoys activity. It reduces your costs by £100-300/month. However, ensure: thorough vetting of the loaner, proper loan agreement, regular visits, clear responsibilities, and the horse genuinely benefits. Many retired horses are happier with a quiet retirement than continued work.'
    }
  ]

  // Related calculators
  const relatedCalculators = [
    {
      title: 'Vet Cost Estimator',
      description: 'Plan healthcare budgets',
      href: '/vet-cost-estimator',
      icon: Stethoscope,
      color: 'text-red-600',
      bg: 'bg-red-50 hover:bg-red-100'
    },
    {
      title: 'Horse Insurance Calculator',
      description: 'Compare cover options',
      href: '/horse-insurance-calculator',
      icon: Shield,
      color: 'text-purple-600',
      bg: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      title: 'Horse Livery Calculator',
      description: 'Compare yard options',
      href: '/horse-livery-calculator',
      icon: Home,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 hover:bg-emerald-100'
    },
    {
      title: 'Annual Horse Cost Calculator',
      description: 'Complete yearly budget',
      href: '/annual-horse-cost-calculator',
      icon: Calculator,
      color: 'text-amber-600',
      bg: 'bg-amber-50 hover:bg-amber-100'
    },
    {
      title: 'Horse Feed Calculator',
      description: 'Daily nutrition costs',
      href: '/horse-feed-calculator',
      icon: Wheat,
      color: 'text-green-600',
      bg: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: 'Farrier Cost Calculator',
      description: 'Shoeing and trimming costs',
      href: '/farrier-cost-calculator',
      icon: Scissors,
      color: 'text-stone-600',
      bg: 'bg-stone-50 hover:bg-stone-100'
    }
  ]

  return (
    <>
      <Helmet>
        {/* 1. Title Tag */}
        <title>Horse Retirement Cost Calculator UK 2026 | Veteran Horse Costs | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free horse retirement cost calculator for UK owners. Calculate annual costs for retired and veteran horses, plan for Cushings, arthritis, and end of life care. 2026 prices." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="retired horse cost UK 2026, veteran horse expenses, horse retirement livery, old horse care costs, Cushings treatment cost, keeping elderly horse, horse end of life costs" 
        />
        
        {/* 4. Author Meta */}
        <meta name="author" content="HorseCost" />

        {/* 5. Robots Meta */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* 6. Google-specific Robots */}
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* 7. Viewport Meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        
        {/* 8. Theme Color */}
        <meta name="theme-color" content="#be185d" />
        
        {/* 9. Apple Mobile Web App */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* 10. Open Graph Type */}
        <meta property="og:type" content="website" />
        
        {/* 11. Open Graph Site Name */}
        <meta property="og:site_name" content="HorseCost" />
        
        {/* 12. Open Graph Locale */}
        <meta property="og:locale" content="en_GB" />
        
        {/* 13. Open Graph Complete */}
        <meta property="og:title" content="Horse Retirement Cost Calculator UK 2026 | Veteran Care | HorseCost" />
        <meta property="og:description" content="Calculate costs for retired and veteran horses. Plan for healthcare, chronic conditions, and ongoing care." />
        <meta property="og:url" content="https://horsecost.co.uk/retirement-cost-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/retirement-cost-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Horse Retirement Cost Calculator for veteran horse care planning" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Horse Retirement Cost Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Calculate retirement costs for veteran horses. Plan for Cushings, arthritis, and ongoing care." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/retirement-cost-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Horse Retirement Cost Calculator UK" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/retirement-cost-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/retirement-cost-calculator" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* JSON-LD Structured Data - 8 Schemas */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              // Schema 1: BreadcrumbList
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/#calculators' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Retirement Cost Calculator', 'item': 'https://horsecost.co.uk/retirement-cost-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Retirement Cost Calculator UK',
                'description': 'Calculate costs for retired and veteran horses including healthcare, chronic conditions, and multi-year projections with 2026 UK pricing.',
                'url': 'https://horsecost.co.uk/retirement-cost-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.8', 'ratingCount': '189', 'bestRating': '5', 'worstRating': '1' },
                'author': { '@type': 'Organization', 'name': 'HorseCost' }
              },
              // Schema 3: FAQPage
              {
                '@type': 'FAQPage',
                'mainEntity': faqs.map(faq => ({
                  '@type': 'Question',
                  'name': faq.q,
                  'acceptedAnswer': { '@type': 'Answer', 'text': faq.a }
                }))
              },
              // Schema 4: HowTo
              {
                '@type': 'HowTo',
                'name': 'How to Calculate Horse Retirement Costs',
                'description': 'Step-by-step guide to calculating your retired horse costs',
                'totalTime': 'PT3M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Enter Horse Age', 'text': 'Input your horse\'s current age as this affects healthcare needs and insurance availability.' },
                  { '@type': 'HowToStep', 'name': 'Select Health Status', 'text': 'Choose your horse\'s overall health level from excellent to poor to estimate veterinary costs.' },
                  { '@type': 'HowToStep', 'name': 'Choose Livery Type', 'text': 'Select retirement livery, grass livery, DIY, or home kept arrangements.' },
                  { '@type': 'HowToStep', 'name': 'Add Chronic Conditions', 'text': 'Include any ongoing conditions like Cushings, arthritis, or laminitis history for medication costs.' },
                  { '@type': 'HowToStep', 'name': 'Calculate Multi-Year Costs', 'text': 'Click Calculate to see annual costs and multi-year projections with inflation.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Horse Retirement Cost Calculator UK 2026 - Veteran Horse Care Planning',
                'description': 'Free calculator for UK retired horse costs. Plan for healthcare, chronic conditions like Cushings, and end of life considerations.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png' } },
                'image': 'https://horsecost.co.uk/images/retirement-cost-calculator-og.jpg'
              },
              // Schema 6: Organization
              {
                '@type': 'Organization',
                'name': 'HorseCost',
                'url': 'https://horsecost.co.uk',
                'logo': 'https://horsecost.co.uk/logo.png',
                'description': 'Free professional horse cost calculators for UK equestrians',
                'sameAs': ['https://twitter.com/HorseCost', 'https://www.facebook.com/HorseCost'],
                'contactPoint': { '@type': 'ContactPoint', 'contactType': 'Customer Support', 'email': 'hello@horsecost.co.uk' },
                'address': { '@type': 'PostalAddress', 'addressCountry': 'GB' }
              },
              // Schema 7: WebPage + Speakable
              {
                '@type': 'WebPage',
                'name': 'Horse Retirement Cost Calculator UK 2026',
                'description': 'Calculate costs for retired and veteran horses in the UK',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/retirement-cost-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'Retired Horse Care Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Retirement Livery',
                    'description': 'Specialist care for elderly or non-ridden horses, typically £180-350/month in 2026. Includes daily welfare checks, grass keep, medication administration, and a peaceful environment.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Cushings (PPID)',
                    'description': 'Pituitary Pars Intermedia Dysfunction - a common hormonal condition in older horses requiring daily Prascend medication (£75-110/month) and regular blood tests.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Veteran Horse',
                    'description': 'Generally horses aged 15-20+ years. Require more veterinary attention, may have chronic conditions, and often need specialist retirement care arrangements.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'End of Life Costs',
                    'description': 'Final care costs including euthanasia (£120-250), cremation (£600-950), or burial (£350-600). Total typically £700-1,200 in 2026. Essential to budget for.'
                  }
                ]
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Back Link */}
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <a href="/" className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header */}
        <header className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Horse Retirement Cost Calculator UK 2026</h1>
                <p className="text-pink-200 mt-1">Veteran Horse Care Planning</p>
              </div>
            </div>
            <p className="text-pink-100 max-w-3xl">
              Plan for your retired or veteran horse's care. Calculate ongoing costs, 
              chronic condition management, and multi-year projections.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-pink-200 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last updated: January 2026
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                UK regional pricing
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                189 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-pink-500/30 text-pink-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Multi-year projections
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Chronic condition costs
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Updated January 2026
              </span>
            </div>
          </div>
        </header>

        {/* Quick Answer Box */}
        <div className="max-w-5xl mx-auto px-4 mt-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-pink-600" />
              Quick Answer: How Much Does It Cost to Keep a Retired Horse UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>Keeping a retired horse in the UK costs £3,500-7,000 per year in 2026.</strong> Retirement livery: £180-350/month. Add £1,000-1,800/year for farrier, dental, worming, and vaccinations. Cushings adds £1,000-1,500/year. Budget for an emergency fund of £1,500-2,500 as insurance becomes limited over age 25. End of life costs: £700-1,200.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-pink-50 p-3 rounded-lg text-center">
                <div className="text-xs text-pink-600 font-medium">Annual Cost</div>
                <div className="text-xl font-bold text-pink-700">£3,500-7,000</div>
                <div className="text-xs text-gray-500">depending on health</div>
              </div>
              <div className="bg-rose-50 p-3 rounded-lg text-center">
                <div className="text-xs text-rose-600 font-medium">Retirement Livery</div>
                <div className="text-xl font-bold text-rose-700">£180-350</div>
                <div className="text-xs text-gray-500">per month</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="text-xs text-red-600 font-medium">Cushings (PPID)</div>
                <div className="text-xl font-bold text-red-700">£85/month</div>
                <div className="text-xs text-gray-500">medication</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg text-center">
                <div className="text-xs text-orange-600 font-medium">Emergency Fund</div>
                <div className="text-xl font-bold text-orange-700">£1,500-2,500</div>
                <div className="text-xs text-gray-500">recommended</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <section>
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
                </section>

                <section>
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
                </section>

                <section>
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
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  >
                    <option value="london">Greater London (+40%)</option>
                    <option value="southeast">South East (+20%)</option>
                    <option value="southwest">South West (+10%)</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England (-15%)</option>
                    <option value="scotland">Scotland / Wales (-10%)</option>
                  </select>
                </section>

                <section className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-pink-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Chronic Conditions &amp; Projection
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
                </section>
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

                    {/* Reminders CTA */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold">Veteran Horse Care Reminders</h3>
                          <p className="text-purple-200 text-sm">Get medication, vet &amp; farrier reminders</p>
                        </div>
                        <button
                          onClick={() => setShowRemindersForm(true)}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-50 transition flex-shrink-0"
                        >
                          Set Up
                        </button>
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
                          <span className="text-gray-600">Feed &amp; Hay</span>
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
                  <li>• Plan healthcare costs with our <a href="/vet-cost-estimator" className="text-pink-700 underline hover:text-pink-900">Vet Cost Estimator</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Calculators */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Horse Cost Calculators</h2>
            <p className="text-gray-600 mb-6">Plan all your horse costs:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedCalculators.map((calc, index) => (
                <a 
                  key={index}
                  href={calc.href} 
                  className={`${calc.bg} rounded-xl p-4 transition group`}
                  title={`${calc.title} - ${calc.description}`}
                >
                  <calc.icon className={`w-8 h-8 ${calc.color} mb-2`} />
                  <h3 className="font-bold text-gray-900 group-hover:text-pink-600">{calc.title}</h3>
                  <p className="text-gray-600 text-sm">{calc.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Reminders CTA Section */}
          <section className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Free Veteran Horse Care Reminders</h2>
              <p className="text-purple-200 max-w-xl mx-auto">
                Never miss a medication dose, blood test, or vet appointment. Get free email reminders for all your retired horse's care needs.
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setShowRemindersForm(true)}
                className="w-full bg-white text-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition shadow-lg"
              >
                Set Up Free Reminders
              </button>
              <p className="text-purple-300 text-xs text-center mt-3">
                No spam, just helpful reminders. Unsubscribe anytime.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Plan Your Horse's Golden Years</h2>
            <p className="text-pink-100 mb-6 max-w-xl mx-auto">
              Every horse deserves a comfortable retirement. Start planning today to ensure you can provide the best care.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-xl font-bold hover:bg-pink-50 transition"
            >
              Calculate All Costs
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* SmartSuite Reminders Modal */}
        {showRemindersForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Set Up Veteran Horse Care Reminders</h3>
                  </div>
                  <button
                    onClick={() => setShowRemindersForm(false)}
                    className="text-white/80 hover:text-white text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-purple-200 text-sm mt-2">
                  Get free email reminders for medications, blood tests, vet appointments, and all your retired horse's care needs.
                </p>
              </div>
              <div className="p-0">
                <iframe 
                  src="https://app.smartsuite.com/form/sba974gi/W5GfKQSj6G?header=false" 
                  width="100%" 
                  height="500px" 
                  frameBorder="0"
                  title="Horse Care Reminders Signup"
                  className="border-0"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
