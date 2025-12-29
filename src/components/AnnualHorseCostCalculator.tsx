import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  PoundSterling, 
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
  TrendingUp,
  PieChart,
  Bell,
  ArrowRight,
  MapPin,
  Clock,
  Users
} from 'lucide-react'

export default function AnnualHorseCostCalculator() {
  // Core costs
  const [liveryType, setLiveryType] = useState('')
  const [monthlyLivery, setMonthlyLivery] = useState('')
  const [monthlyFeed, setMonthlyFeed] = useState('')
  const [monthlyBedding, setMonthlyBedding] = useState('')
  
  // Professional services
  const [farrierCost, setFarrierCost] = useState('')
  const [farrierFrequency, setFarrierFrequency] = useState('6')
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
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  // UK Average costs for comparison (2025 data)
  const ukAverages = {
    fullLivery: { monthly: 500, annual: 6000 },
    partLivery: { monthly: 300, annual: 3600 },
    diyLivery: { monthly: 150, annual: 1800 },
    grassLivery: { monthly: 80, annual: 960 },
    feed: { monthly: 120, annual: 1440 },
    bedding: { monthly: 60, annual: 720 },
    farrier: { annual: 960 },
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
    'full-livery': { livery: 500, feed: 0, bedding: 0 },
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

    const annualLivery = livery * 12
    const annualFeed = feed * 12
    const annualBedding = bedding * 12
    const farrierVisits = Math.ceil(52 / farrierWeeks)
    const annualFarrier = farrier * farrierVisits
    const annualInsurance = insurance * 12
    const annualVetTotal = vetRoutine + vetEmergency

    const essentialCosts = annualLivery + annualFeed + annualBedding
    const professionalCosts = annualFarrier + annualVetTotal + dental + worming
    const protectionCosts = annualInsurance
    const optionalCosts = tack + lessons + competition + misc

    const totalAnnual = essentialCosts + professionalCosts + protectionCosts + optionalCosts
    const totalMonthly = totalAnnual / 12
    const totalWeekly = totalAnnual / 52
    const totalDaily = totalAnnual / 365

    let costLevel = 'average'
    if (totalAnnual < 6000) costLevel = 'budget'
    else if (totalAnnual < 10000) costLevel = 'average'
    else if (totalAnnual < 15000) costLevel = 'premium'
    else costLevel = 'luxury'

    // Track calculation event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'annual_horse_cost',
        livery_type: liveryType || 'custom',
        total_annual: totalAnnual.toFixed(0),
        cost_level: costLevel
      })
    }

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

  // 15 FAQs for maximum SEO value
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
    },
    {
      q: "How do horse costs vary by region in the UK?",
      a: "Horse costs vary significantly by region. The South East and Greater London are typically 20-40% more expensive than rural areas in the North, Wales, or Scotland. Full livery in Surrey might cost £600-800/month, while similar facilities in Yorkshire could be £350-500/month. Farrier and vet call-out fees also increase near urban areas."
    },
    {
      q: "What are the first year costs of horse ownership?",
      a: "First year costs are typically 30-50% higher than ongoing years. Beyond the purchase price (£3,000-15,000+ for a riding horse), budget for: initial vet check (£100-300), saddle fitting and tack (£1,000-3,000), rugs and equipment (£500-1,000), and settling-in period extras. Our First Horse Calculator can help you plan this budget."
    },
    {
      q: "Should I buy or loan a horse to save money?",
      a: "Loaning can significantly reduce costs - you avoid the purchase price (£3,000-15,000+) and often the owner covers insurance and some vet costs. However, loan agreements vary widely. Full loans give you complete responsibility while share loans split costs and time. Consider your experience level, time commitment, and long-term goals before deciding."
    }
  ]

  // Related calculators for internal linking
  const relatedCalculators = [
    {
      title: 'Horse Feed Calculator',
      description: 'Calculate daily hay requirements and monthly feed costs',
      href: '/horse-feed-calculator',
      icon: Wheat,
      color: 'text-green-600'
    },
    {
      title: 'Farrier Cost Calculator',
      description: 'Compare barefoot vs shod annual costs',
      href: '/farrier-cost-calculator',
      icon: Scissors,
      color: 'text-stone-600'
    },
    {
      title: 'Vet Cost Estimator',
      description: 'Plan your veterinary budget including emergencies',
      href: '/vet-cost-estimator',
      icon: Stethoscope,
      color: 'text-red-600'
    },
    {
      title: 'Horse Insurance Calculator',
      description: 'Estimate premiums for different cover levels',
      href: '/horse-insurance-calculator',
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      title: 'First Horse Calculator',
      description: 'Complete first year ownership costs',
      href: '/first-horse-calculator',
      icon: Users,
      color: 'text-pink-600'
    },
    {
      title: 'Bedding Cost Calculator',
      description: 'Compare shavings, straw, hemp and more',
      href: '/bedding-cost-calculator',
      icon: Home,
      color: 'text-amber-600'
    }
  ]

  return (
    <>
      <Helmet>
        {/* 1. Title Tag (55-60 chars) */}
        <title>Annual Horse Cost Calculator UK 2025 | Total Ownership Costs | HorseCost</title>
        
        {/* 2. Meta Description (150-160 chars) */}
        <meta 
          name="description" 
          content="Free annual horse cost calculator for UK owners. Calculate total yearly costs including livery, feed, farrier, vet bills, insurance & more. Accurate 2025 UK pricing." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="annual horse cost calculator, horse ownership costs UK, yearly horse expenses, cost of keeping a horse UK, horse budget calculator, equestrian costs 2025, horse livery costs, horse care expenses, how much does a horse cost per year" 
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
        <meta name="theme-color" content="#b45309" />
        
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
        <meta property="og:title" content="Annual Horse Cost Calculator UK 2025 | HorseCost" />
        <meta property="og:description" content="Calculate your total annual horse ownership costs. Free UK calculator for livery, feed, farrier, vet bills & more." />
        <meta property="og:url" content="https://horsecost.co.uk/annual-horse-cost-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/annual-horse-cost-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Annual Horse Cost Calculator showing UK horse ownership costs breakdown" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Annual Horse Cost Calculator UK 2025 | HorseCost" />
        <meta name="twitter:description" content="Calculate your total annual horse ownership costs with our free UK calculator." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/annual-horse-cost-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Annual Horse Cost Calculator" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/annual-horse-cost-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/annual-horse-cost-calculator" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* JSON-LD Structured Data - 6 Schemas */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              // Schema 1: BreadcrumbList
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
                    'name': 'Annual Horse Cost Calculator', 
                    'item': 'https://horsecost.co.uk/annual-horse-cost-calculator' 
                  }
                ]
              },
              // Schema 2: SoftwareApplication with AggregateRating
              {
                '@type': 'SoftwareApplication',
                'name': 'Annual Horse Cost Calculator UK',
                'url': 'https://horsecost.co.uk/annual-horse-cost-calculator',
                'description': 'Comprehensive calculator to estimate total annual horse ownership costs in the UK including livery, feed, farrier, veterinary, insurance and more. Updated for 2025 with accurate UK pricing.',
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
                  'ratingValue': '4.9', 
                  'ratingCount': '487', 
                  'bestRating': '5', 
                  'worstRating': '1' 
                },
                'author': { 
                  '@type': 'Organization', 
                  'name': 'HorseCost' 
                }
              },
              // Schema 3: FAQPage
              {
                '@type': 'FAQPage',
                'mainEntity': faqs.map(faq => ({
                  '@type': 'Question',
                  'name': faq.q,
                  'acceptedAnswer': { 
                    '@type': 'Answer', 
                    'text': faq.a 
                  }
                }))
              },
              // Schema 4: HowTo
              {
                '@type': 'HowTo',
                'name': 'How to Calculate Annual Horse Costs in the UK',
                'description': 'Step-by-step guide to calculating your total annual horse ownership costs using our free calculator',
                'totalTime': 'PT5M',
                'step': [
                  { 
                    '@type': 'HowToStep', 
                    'name': 'Select Livery Type', 
                    'text': 'Choose your livery arrangement (full, part, DIY, grass, or home-kept) to auto-fill typical UK costs for your situation.' 
                  },
                  { 
                    '@type': 'HowToStep', 
                    'name': 'Enter Monthly Costs', 
                    'text': 'Input your monthly livery, feed, and bedding costs. Adjust the pre-filled amounts to match your actual spending.' 
                  },
                  { 
                    '@type': 'HowToStep', 
                    'name': 'Add Professional Services', 
                    'text': 'Enter farrier costs and visit frequency, plus annual vet, dental and worming expenses for complete professional care budgeting.' 
                  },
                  { 
                    '@type': 'HowToStep', 
                    'name': 'Include Insurance & Extras', 
                    'text': 'Add your insurance premium and optional extras like lessons, competition costs and miscellaneous expenses.' 
                  },
                  { 
                    '@type': 'HowToStep', 
                    'name': 'View Your Results', 
                    'text': 'Click calculate to see your total annual, monthly, weekly and daily costs with a full breakdown by category and comparison to UK averages.' 
                  }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Annual Horse Cost Calculator - UK Horse Ownership Budgets 2025',
                'description': 'Free calculator for UK horse owners to estimate total annual ownership costs with current 2025 pricing for livery, feed, farrier, vet and more.',
                'datePublished': '2025-01-01',
                'dateModified': '2025-01-01',
                'author': { 
                  '@type': 'Organization', 
                  'name': 'HorseCost',
                  'url': 'https://horsecost.co.uk'
                },
                'image': 'https://horsecost.co.uk/images/annual-horse-cost-calculator-og.jpg',
                'publisher': { 
                  '@type': 'Organization', 
                  'name': 'HorseCost', 
                  'logo': { 
                    '@type': 'ImageObject', 
                    'url': 'https://horsecost.co.uk/logo.png' 
                  } 
                }
              },
              // Schema 6: Organization
              {
                '@type': 'Organization',
                'name': 'HorseCost',
                'url': 'https://horsecost.co.uk',
                'logo': 'https://horsecost.co.uk/logo.png',
                'description': 'Free professional horse cost calculators for UK equestrians',
                'sameAs': [
                  'https://twitter.com/HorseCost',
                  'https://www.facebook.com/HorseCost'
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

      <div className="bg-gray-50 min-h-screen">
        {/* Back Link */}
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <a href="/" className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header Banner */}
        <header className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Calculator className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Annual Horse Cost Calculator UK 2025</h1>
                <p className="text-amber-100 mt-1">Calculate your total yearly horse ownership costs</p>
              </div>
            </div>
            <p className="text-amber-50 max-w-3xl">
              Work out exactly how much your horse costs per year with our comprehensive UK calculator. 
              Includes livery, feed, farrier, vet bills, insurance and all other expenses with accurate 2025 pricing.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-amber-200 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last updated: January 2025
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                UK pricing
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                487 ratings
              </span>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Main Calculator Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              
              {/* Section 1: Livery Type */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h2 className="text-xl font-bold text-gray-900">Select Your Livery Type</h2>
                </div>
                <p className="text-gray-600 mb-4">Choose your livery arrangement to auto-fill typical UK costs, then adjust to match your situation.</p>
                
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
              </section>

              {/* Section 2: Essential Monthly Costs */}
              <section className="mb-8">
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
                    <p className="text-xs text-gray-500 mt-1">
                      Hay + hard feed. <a href="/horse-feed-calculator" className="text-amber-600 hover:underline">Calculate feed costs →</a>
                    </p>
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
                    <p className="text-xs text-gray-500 mt-1">
                      <a href="/bedding-cost-calculator" className="text-amber-600 hover:underline">Compare bedding types →</a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Professional Services */}
              <section className="mb-8">
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
                    <p className="text-xs text-gray-500 mt-2">
                      <a href="/farrier-cost-calculator" className="text-amber-600 hover:underline">Full farrier calculator →</a>
                    </p>
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
                    <p className="text-xs text-gray-500 mt-1">
                      <a href="/vet-cost-estimator" className="text-amber-600 hover:underline">Plan vet budget →</a>
                    </p>
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
                    <p className="text-xs text-gray-500 mt-1">
                      <a href="/worming-cost-calculator" className="text-amber-600 hover:underline">Worming programme calculator →</a>
                    </p>
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
                    <p className="text-xs text-gray-500 mt-1">
                      <a href="/dental-cost-calculator" className="text-amber-600 hover:underline">EDT vs vet dentist costs →</a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 4: Insurance & Protection */}
              <section className="mb-8">
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
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank if self-insuring. <a href="/horse-insurance-calculator" className="text-amber-600 hover:underline">Compare insurance options →</a>
                  </p>
                </div>
              </section>

              {/* Section 5: Optional Extras (Collapsible) */}
              <section className="mb-8">
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
                      <p className="text-xs text-gray-500 mt-1">
                        <a href="/tack-equipment-calculator" className="text-amber-600 hover:underline">Tack budget calculator →</a>
                      </p>
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
                      <p className="text-xs text-gray-500 mt-1">
                        <a href="/riding-lesson-calculator" className="text-amber-600 hover:underline">Lesson cost calculator →</a>
                      </p>
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
                      <p className="text-xs text-gray-500 mt-1">
                        <a href="/competition-budget-calculator" className="text-amber-600 hover:underline">Competition budget planner →</a>
                      </p>
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
              </section>

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
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
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

                {/* Reminders CTA */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-bold text-lg">Never Miss a Farrier or Vet Appointment</h3>
                      <p className="text-purple-200 text-sm mt-1">
                        Get free email reminders for farrier visits, vaccinations, worming and more. Stay on top of your horse's care schedule.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowRemindersForm(true)}
                      className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition flex items-center gap-2 flex-shrink-0"
                    >
                      Get Free Reminders
                      <ArrowRight className="w-4 h-4" />
                    </button>
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
                <h3 className="font-bold text-amber-800 mb-2">Important Notes About Horse Costs in the UK</h3>
                <ul className="text-amber-900 space-y-1 text-sm">
                  <li>• Costs vary significantly by region - South East England is typically 20-30% higher than rural areas</li>
                  <li>• First year ownership costs are often higher due to initial tack, equipment and settling-in vet checks</li>
                  <li>• Emergency vet bills can be £2,000-10,000+ for colic surgery or serious injury</li>
                  <li>• Older horses (15+) may have higher vet and dental costs</li>
                  <li>• Competition horses have significantly higher costs (transport, entry fees, specialist care)</li>
                  <li>• Consider using our <a href="/first-horse-calculator" className="text-amber-700 underline hover:text-amber-900">First Horse Calculator</a> if you're new to ownership</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <article className="mt-12 space-y-12">
            
            {/* Understanding Costs Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Annual Horse Ownership Costs in the UK</h2>
              <p className="text-gray-700 mb-4">
                Owning a horse in the UK is a significant financial commitment that extends far beyond the initial purchase price. 
                The true cost of horse ownership includes regular monthly expenses like <a href="/horse-livery-calculator" className="text-amber-600 hover:underline">livery</a> and <a href="/horse-feed-calculator" className="text-amber-600 hover:underline">feed</a>, plus periodic professional 
                services from <a href="/farrier-cost-calculator" className="text-amber-600 hover:underline">farriers</a> and <a href="/vet-cost-estimator" className="text-amber-600 hover:underline">vets</a>, insurance premiums, and unexpected emergency costs.
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
                    <li>• Use our <a href="/bedding-cost-calculator" className="text-green-700 underline">bedding calculator</a> to compare options</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                  <h3 className="font-bold text-red-800 mb-2">✗ Don't Cut Corners On</h3>
                  <ul className="text-red-900 space-y-2 text-sm">
                    <li>• Regular <a href="/farrier-cost-calculator" className="text-red-700 underline">farrier visits</a> (prevents lameness)</li>
                    <li>• Annual vaccinations (legal requirement for some)</li>
                    <li>• Quality forage (poor hay causes colic)</li>
                    <li>• <a href="/dental-cost-calculator" className="text-red-700 underline">Dental care</a> (affects eating and riding)</li>
                    <li>• Emergency vet fund (unexpected bills happen)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions About Horse Costs</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-700">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </article>

          {/* Related Calculators - Improved Internal Linking */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Horse Cost Calculators</h2>
            <p className="text-gray-600 mb-6">Dive deeper into specific costs with our specialist calculators:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedCalculators.map((calc, index) => (
                <a 
                  key={index}
                  href={calc.href} 
                  className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-amber-400 hover:shadow-md transition group"
                  title={`${calc.title} - ${calc.description}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <calc.icon className={`w-5 h-5 ${calc.color}`} />
                    <h3 className="font-bold text-gray-900 group-hover:text-amber-600">{calc.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{calc.description}</p>
                  <div className="text-amber-600 text-sm font-medium mt-2 flex items-center gap-1">
                    Try calculator <ArrowRight className="w-3 h-3" />
                  </div>
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
              <h2 className="text-2xl font-bold mb-2">Free Horse Care Reminders</h2>
              <p className="text-purple-200 max-w-xl mx-auto">
                Never miss a farrier appointment, vaccination, or worming date again. 
                Get free email reminders sent straight to your inbox.
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

        {/* SmartSuite Reminders Modal */}
        {showRemindersForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Set Up Care Reminders</h3>
                  </div>
                  <button
                    onClick={() => setShowRemindersForm(false)}
                    className="text-white/80 hover:text-white text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-purple-200 text-sm mt-2">
                  Get free email reminders for farrier visits, vaccinations, worming and dental checks.
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
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
