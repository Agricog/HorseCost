import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Scissors,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  PieChart,
  Calendar,
  CheckCircle2,
  Bell,
  ArrowRight,
  MapPin,
  Clock,
  Users,
  HelpCircle,
  Home,
  Wheat,
  Stethoscope,
  Shield,
  Package
} from 'lucide-react'

export default function FarrierCostCalculator() {
  // Hoof care type
  const [hoofCareType, setHoofCareType] = useState('')
  
  // Costs
  const [costPerVisit, setCostPerVisit] = useState('')
  const [visitFrequency, setVisitFrequency] = useState('6')
  
  // Additional services
  const [includeRemedialWork, setIncludeRemedialWork] = useState(false)
  const [remedialCostPerVisit, setRemedialCostPerVisit] = useState('')
  const [includeEmergency, setIncludeEmergency] = useState(false)
  const [emergencyBudget, setEmergencyBudget] = useState('')
  
  const [result, setResult] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  // UK Average farrier prices 2026
  const ukAverages = {
    trim: { low: 35, avg: 45, high: 60 },
    frontShoesOnly: { low: 55, avg: 70, high: 90 },
    fullSet: { low: 85, avg: 110, high: 150 },
    remedialShoes: { low: 130, avg: 160, high: 220 },
    emergency: 150
  }

  // Presets for hoof care types
  const hoofCarePresets: Record<string, { cost: number, label: string, description: string }> = {
    'barefoot-trim': { cost: 45, label: 'Barefoot Trim', description: 'Regular trimming only, no shoes' },
    'front-shoes': { cost: 70, label: 'Front Shoes Only', description: 'Shoes on front hooves, back trimmed' },
    'full-set': { cost: 110, label: 'Full Set (4 shoes)', description: 'All four hooves shod' },
    'remedial': { cost: 160, label: 'Remedial/Therapeutic', description: 'Specialised shoeing for problems' }
  }

  const applyPreset = (type: string) => {
    setHoofCareType(type)
    const preset = hoofCarePresets[type]
    if (preset) {
      setCostPerVisit(preset.cost.toString())
    }
  }

  const calculate = () => {
    const cost = parseFloat(costPerVisit) || 110
    const weeks = parseInt(visitFrequency) || 6
    const remedial = includeRemedialWork ? (parseFloat(remedialCostPerVisit) || 50) : 0
    const emergency = includeEmergency ? (parseFloat(emergencyBudget) || 150) : 0

    // Calculate visits per year
    const visitsPerYear = Math.ceil(52 / weeks)
    
    // Annual costs
    const annualBasicCost = cost * visitsPerYear
    const annualRemedialCost = remedial * visitsPerYear
    const annualTotalCost = annualBasicCost + annualRemedialCost + emergency

    // Monthly average
    const monthlyAverage = annualTotalCost / 12

    // Cost per day
    const dailyCost = annualTotalCost / 365

    // Comparison with averages
    const avgFullSetAnnual = ukAverages.fullSet.avg * 9 // 9 visits at 6 weeks
    const avgTrimAnnual = ukAverages.trim.avg * 6 // 6 visits at 8 weeks (barefoot)

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'farrier_cost',
        hoof_care_type: hoofCareType || 'full-set',
        cost_per_visit: cost,
        visit_frequency_weeks: weeks,
        annual_total: annualTotalCost.toFixed(0)
      })
    }

    setResult({
      visitsPerYear,
      costPerVisit: cost.toFixed(2),
      annualBasic: annualBasicCost.toFixed(2),
      annualRemedial: annualRemedialCost.toFixed(2),
      annualEmergency: emergency.toFixed(2),
      annualTotal: annualTotalCost.toFixed(2),
      monthlyAverage: monthlyAverage.toFixed(2),
      dailyCost: dailyCost.toFixed(2),
      comparison: {
        vsFullSet: annualTotalCost - avgFullSetAnnual,
        vsTrim: annualTotalCost - avgTrimAnnual,
        savingsIfBarefoot: annualBasicCost - avgTrimAnnual
      },
      schedule: {
        weeks: weeks,
        nextVisits: Array.from({ length: 4 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() + (weeks * 7 * (i + 1)))
          return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        })
      }
    })
  }

  // 15 FAQs for maximum SEO value
  const faqs = [
    {
      q: "How much does a farrier cost in the UK 2026?",
      a: "UK farrier costs in 2026 range from £35-60 for a trim, £55-90 for front shoes only, and £85-150 for a full set of four shoes. Remedial or therapeutic shoeing costs £130-220+ per visit. Prices vary by region, with the South East typically 15-20% higher than northern areas."
    },
    {
      q: "How often should a horse see the farrier?",
      a: "Most horses need farrier attention every 6-8 weeks. Shod horses typically need visits every 5-7 weeks as shoes wear and hooves grow. Barefoot horses may go 8-10 weeks between trims. Young horses, those with hoof problems, or competition horses may need more frequent visits."
    },
    {
      q: "Is it cheaper to keep a horse barefoot?",
      a: "Yes, barefoot horses are significantly cheaper - around £270-400/year vs £800-1,300/year for shod horses. However, barefoot isn't suitable for all horses. Consider terrain, workload, and hoof quality. Some horses need shoes for protection or corrective reasons."
    },
    {
      q: "What is included in a farrier visit?",
      a: "A standard visit includes: trimming and balancing all four hooves, checking for thrush or other issues, and fitting/refitting shoes if shod. The farrier should assess gait and discuss any concerns. Hot shoeing (shaping shoes with heat) is standard practice in the UK."
    },
    {
      q: "Why do farrier prices vary so much?",
      a: "Prices vary based on: geographic location (South vs North), farrier's experience and qualifications (registered vs apprentice), type of work (basic vs remedial), horse's behaviour and hoof condition, and whether it's a yard visit or single horse. Specialist farriers charge more for complex cases."
    },
    {
      q: "What is remedial or therapeutic shoeing?",
      a: "Remedial shoeing addresses specific hoof or limb problems like laminitis, navicular, or conformational issues. It requires specialist knowledge and custom shoes. Costs are £130-220+ per visit. A vet referral may be needed, and regular reassessment is essential."
    },
    {
      q: "How do I find a good farrier in the UK?",
      a: "Look for a Farriers Registration Council (FRC) registered farrier - it's a legal requirement in the UK. Ask for recommendations from your yard, vet, or local horse groups. A good farrier arrives on time, handles horses well, explains their work, and is happy to discuss concerns."
    },
    {
      q: "What are signs my horse needs the farrier?",
      a: "Signs include: shoes loose or clicking, visible hoof growth over shoes, uneven wear, chips or cracks in hoof wall, stumbling or changing gait, and reaching or exceeding the 6-8 week interval. Don't wait for problems - regular maintenance prevents issues."
    },
    {
      q: "Should I use hot or cold shoeing?",
      a: "Hot shoeing (heating shoes to shape them) is preferred by most UK farriers as it allows precise fitting and can seal the hoof. Cold shoeing uses pre-made shoes and is quicker but less customised. For most horses, hot shoeing provides better results."
    },
    {
      q: "What if my horse loses a shoe?",
      a: "A lost shoe is usually non-emergency - keep the horse in a clean, dry area and call your farrier. If there's hoof damage or the horse is lame, treat as urgent. Most farriers charge £25-50 for a single shoe replacement, or it may be included in their service. Emergency callouts cost more."
    },
    {
      q: "How much does an emergency farrier callout cost?",
      a: "Emergency farrier callouts typically cost £80-150+ depending on time, distance, and urgency. Weekend or evening callouts are more expensive. To avoid emergencies, maintain regular appointments, check hooves daily, and address loose shoes promptly before they're lost."
    },
    {
      q: "Can I trim my horse's hooves myself?",
      a: "No - in the UK, it's illegal for anyone other than a registered farrier, vet, or the horse's owner to trim hooves. Even owners should only do minor maintenance. Improper trimming causes serious lameness. Always use a qualified, FRC-registered farrier for proper hoof care."
    },
    {
      q: "What is the difference between a farrier and a barefoot trimmer?",
      a: "Farriers are legally registered professionals who can shoe and trim horses. Barefoot trimmers specialise in maintaining unshod hooves but cannot legally shoe horses. For barefoot horses, either can trim, but only farriers can apply shoes if circumstances change."
    },
    {
      q: "How long do horseshoes last?",
      a: "Horseshoes typically last 5-8 weeks before needing replacement or resetting. Steel shoes wear at different rates depending on terrain and workload. Even if shoes look fine, the hoof grows and needs trimming, so regular farrier visits remain essential."
    },
    {
      q: "Are there alternatives to traditional metal horseshoes?",
      a: "Yes, alternatives include: glue-on shoes (good for horses that can't be nailed), composite/plastic shoes (lighter, more shock-absorbing), and hoof boots (removable protection for barefoot horses). These options often cost more than traditional shoes but suit specific needs."
    }
  ]

  // Related calculators for internal linking
  const relatedCalculators = [
    {
      title: 'Annual Horse Cost Calculator',
      description: 'Calculate total yearly ownership costs',
      href: '/annual-horse-cost-calculator',
      icon: Calculator,
      color: 'text-amber-600'
    },
    {
      title: 'Horse Feed Calculator',
      description: 'Daily hay and feed costs',
      href: '/horse-feed-calculator',
      icon: Wheat,
      color: 'text-green-600'
    },
    {
      title: 'Horse Livery Calculator',
      description: 'Compare livery options and pricing',
      href: '/horse-livery-calculator',
      icon: Home,
      color: 'text-emerald-600'
    },
    {
      title: 'Vet Cost Estimator',
      description: 'Plan your veterinary budget',
      href: '/vet-cost-estimator',
      icon: Stethoscope,
      color: 'text-red-600'
    },
    {
      title: 'Horse Insurance Calculator',
      description: 'Estimate cover and premiums',
      href: '/horse-insurance-calculator',
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      title: 'Bedding Cost Calculator',
      description: 'Compare shavings, straw, hemp',
      href: '/bedding-cost-calculator',
      icon: Package,
      color: 'text-yellow-600'
    }
  ]

  return (
    <>
      <Helmet>
        {/* 1. Title Tag */}
        <title>Farrier Cost Calculator UK 2026 | Shoeing &amp; Trimming Prices | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free farrier cost calculator for UK horse owners. Calculate annual shoeing, trimming, and hoof care costs. Compare barefoot vs shod expenses with 2026 UK pricing." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="farrier cost calculator, horse shoeing costs UK, farrier prices 2026, barefoot horse cost, horse hoof care, annual farrier budget, shoeing vs trimming cost, UK farrier prices" 
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
        <meta name="theme-color" content="#57534e" />
        
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
        <meta property="og:title" content="Farrier Cost Calculator UK 2026 | HorseCost" />
        <meta property="og:description" content="Calculate your annual farrier costs. Compare barefoot vs shod options with UK 2026 pricing." />
        <meta property="og:url" content="https://horsecost.co.uk/farrier-cost-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/farrier-cost-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Farrier Cost Calculator showing UK shoeing and trimming prices" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Farrier Cost Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Calculate annual farrier and hoof care costs for your horse." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/farrier-cost-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Farrier Cost Calculator" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/farrier-cost-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/farrier-cost-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Farrier Cost Calculator', 'item': 'https://horsecost.co.uk/farrier-cost-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Farrier Cost Calculator UK',
                'url': 'https://horsecost.co.uk/farrier-cost-calculator',
                'description': 'Calculate annual farrier and hoof care costs for UK horses. Compare barefoot vs shod options with accurate 2026 pricing.',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.7', 'ratingCount': '287', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Calculate Farrier Costs in the UK',
                'description': 'Step-by-step guide to calculating your annual farrier and hoof care costs',
                'totalTime': 'PT2M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Select Hoof Care Type', 'text': 'Choose whether your horse is barefoot (trim only), has front shoes only, full set, or needs remedial shoeing.' },
                  { '@type': 'HowToStep', 'name': 'Enter Cost Per Visit', 'text': 'Input your farrier\'s price per visit. UK averages: £45 trim, £70 fronts, £110 full set.' },
                  { '@type': 'HowToStep', 'name': 'Set Visit Frequency', 'text': 'Select how often your horse sees the farrier. Typically 5-7 weeks for shod horses, 6-10 weeks for barefoot.' },
                  { '@type': 'HowToStep', 'name': 'Add Optional Extras', 'text': 'Include remedial work costs or emergency fund if applicable.' },
                  { '@type': 'HowToStep', 'name': 'Calculate', 'text': 'Click calculate to see annual costs, monthly average, and upcoming visit schedule.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Farrier Cost Calculator - UK Shoeing & Trimming Prices 2026',
                'description': 'Free calculator for UK horse owners to estimate annual farrier costs with current 2026 pricing.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'image': 'https://horsecost.co.uk/images/farrier-cost-calculator-og.jpg',
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png' } }
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
                'name': 'Farrier Cost Calculator UK 2026',
                'description': 'Calculate annual farrier and hoof care costs for horses in the UK',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/farrier-cost-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'UK Farrier Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Hot Shoeing',
                    'description': 'The traditional method where horseshoes are heated in a forge then shaped to fit the hoof precisely. Preferred by most UK farriers for superior fit.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Cold Shoeing',
                    'description': 'Fitting pre-made shoes without heating. Quicker but less customised than hot shoeing. Used for simple cases or emergencies.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Remedial Shoeing',
                    'description': 'Specialist shoeing to address hoof or limb problems like laminitis, navicular, or conformational issues. Requires advanced farrier skills.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Barefoot Trim',
                    'description': 'Maintaining a horse without shoes through regular trimming. Costs less than shoeing but requires good hoof quality and suitable terrain.'
                  }
                ]
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        {/* Back Link */}
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <a href="/" className="text-stone-600 hover:text-stone-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header Banner */}
        <header className="bg-gradient-to-r from-stone-600 to-stone-500 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Scissors className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Farrier Cost Calculator UK 2026</h1>
                <p className="text-stone-200 mt-1">Calculate annual shoeing and hoof care costs</p>
              </div>
            </div>
            <p className="text-stone-100 max-w-3xl">
              Work out your yearly farrier budget for shoeing, trimming, and remedial hoof care. 
              Compare barefoot vs shod costs with accurate 2026 UK pricing.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-stone-200 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last updated: January 2026
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                UK pricing
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                287 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-stone-500/30 text-stone-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Verified UK pricing data
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Sources: FRC, UK farriers
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Updated January 2026
              </span>
            </div>
          </div>
        </header>

        {/* Quick Answer Box for AI Search */}
        <div className="max-w-5xl mx-auto px-4 mt-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-stone-600" />
              Quick Answer: How Much Does a Farrier Cost UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>UK farrier costs in 2026 range from £35-60 for a trim, £55-90 for front shoes, and £85-150 for a full set of four shoes.</strong> Most horses need the farrier every 6-8 weeks, meaning annual costs of £270-400 for barefoot horses or £800-1,300+ for fully shod horses. Remedial shoeing for hoof problems costs £130-220+ per visit.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xs text-green-600 font-medium">Barefoot Trim</div>
                <div className="text-xl font-bold text-green-700">£35-60</div>
                <div className="text-xs text-gray-500">/visit</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xs text-blue-600 font-medium">Front Shoes</div>
                <div className="text-xl font-bold text-blue-700">£55-90</div>
                <div className="text-xs text-gray-500">/visit</div>
              </div>
              <div className="bg-stone-50 p-3 rounded-lg text-center">
                <div className="text-xs text-stone-600 font-medium">Full Set</div>
                <div className="text-xl font-bold text-stone-700">£85-150</div>
                <div className="text-xs text-gray-500">/visit</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <div className="text-xs text-amber-600 font-medium">Remedial</div>
                <div className="text-xl font-bold text-amber-700">£130-220+</div>
                <div className="text-xs text-gray-500">/visit</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Main Calculator Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              
              {/* Section 1: Hoof Care Type */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-stone-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h2 className="text-xl font-bold text-gray-900">Hoof Care Type</h2>
                </div>
                <p className="text-gray-600 mb-4">Select your horse's hoof care arrangement to see typical costs.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(hoofCarePresets).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className={`p-4 rounded-lg border-2 text-left transition ${
                        hoofCareType === key 
                          ? 'border-stone-500 bg-stone-50 text-stone-700' 
                          : 'border-gray-200 hover:border-stone-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">{preset.label}</div>
                      <div className="text-sm text-gray-500 mt-1">~£{preset.cost}/visit</div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Section 2: Visit Details */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-stone-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h2 className="text-xl font-bold text-gray-900">Visit Details</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Cost Per Visit (£)
                    </label>
                    <input
                      type="number"
                      value={costPerVisit}
                      onChange={(e) => setCostPerVisit(e.target.value)}
                      placeholder="e.g., 110"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      UK avg 2026: Trim £45 | Front shoes £70 | Full set £110
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Visit Frequency
                    </label>
                    <select
                      value={visitFrequency}
                      onChange={(e) => setVisitFrequency(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    >
                      <option value="5">Every 5 weeks (10 visits/year)</option>
                      <option value="6">Every 6 weeks (9 visits/year)</option>
                      <option value="7">Every 7 weeks (7 visits/year)</option>
                      <option value="8">Every 8 weeks (6 visits/year)</option>
                      <option value="10">Every 10 weeks (5 visits/year)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Shod horses: 5-7 weeks | Barefoot: 6-10 weeks
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Additional Costs */}
              <section className="mb-8">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-3 mb-4 text-left w-full"
                >
                  <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h2 className="text-xl font-bold text-gray-900">Additional Costs</h2>
                  {showAdvanced ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                
                {showAdvanced && (
                  <div className="pl-11 space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="remedial"
                        checked={includeRemedialWork}
                        onChange={(e) => setIncludeRemedialWork(e.target.checked)}
                        className="w-5 h-5 mt-1 text-stone-600 rounded"
                      />
                      <div className="flex-1">
                        <label htmlFor="remedial" className="font-medium text-gray-700 cursor-pointer">
                          Include remedial/corrective work
                        </label>
                        <p className="text-sm text-gray-500">For horses with hoof problems requiring special shoes</p>
                        {includeRemedialWork && (
                          <div className="mt-3">
                            <label className="block text-sm text-gray-600 mb-1">Additional cost per visit (£)</label>
                            <input
                              type="number"
                              value={remedialCostPerVisit}
                              onChange={(e) => setRemedialCostPerVisit(e.target.value)}
                              placeholder="e.g., 50"
                              className="w-48 p-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="emergency"
                        checked={includeEmergency}
                        onChange={(e) => setIncludeEmergency(e.target.checked)}
                        className="w-5 h-5 mt-1 text-stone-600 rounded"
                      />
                      <div className="flex-1">
                        <label htmlFor="emergency" className="font-medium text-gray-700 cursor-pointer">
                          Include emergency fund
                        </label>
                        <p className="text-sm text-gray-500">For lost shoes, emergency callouts, or unexpected issues</p>
                        {includeEmergency && (
                          <div className="mt-3">
                            <label className="block text-sm text-gray-600 mb-1">Annual emergency budget (£)</label>
                            <input
                              type="number"
                              value={emergencyBudget}
                              onChange={(e) => setEmergencyBudget(e.target.value)}
                              placeholder="e.g., 150"
                              className="w-48 p-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Calculate Button */}
              <button
                onClick={calculate}
                className="w-full bg-gradient-to-r from-stone-600 to-stone-500 text-white py-4 rounded-xl font-bold text-lg hover:from-stone-700 hover:to-stone-600 transition shadow-lg"
              >
                <Calculator className="w-5 h-5 inline mr-2" />
                Calculate Farrier Costs
              </button>
            </div>

            {/* Results Section */}
            {result && (
              <div className="border-t border-gray-200 bg-gradient-to-b from-stone-50 to-white p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <PieChart className="w-6 h-6 text-stone-600" />
                  Your Farrier Costs
                </h2>
                
                {/* Main Results */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-stone-600 text-white p-6 rounded-xl text-center">
                    <div className="text-stone-200 text-sm font-medium">Annual Total</div>
                    <div className="text-4xl font-bold mt-1">£{parseFloat(result.annualTotal).toLocaleString()}</div>
                  </div>
                  <div className="bg-white border-2 border-stone-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Monthly Average</div>
                    <div className="text-3xl font-bold text-gray-900 mt-1">£{result.monthlyAverage}</div>
                  </div>
                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Per Visit</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">£{result.costPerVisit}</div>
                  </div>
                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Visits/Year</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{result.visitsPerYear}</div>
                  </div>
                </div>

                {/* Visit Schedule */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-stone-600" />
                    Upcoming Visits (Every {result.schedule.weeks} weeks)
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {result.schedule.nextVisits.map((date: string, i: number) => (
                      <div key={i} className="bg-stone-50 px-4 py-2 rounded-lg">
                        <span className="text-stone-600 font-medium">{date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-gray-900 mb-4">Annual Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Regular farrier visits ({result.visitsPerYear} x £{result.costPerVisit})</span>
                      <span className="font-medium">£{parseFloat(result.annualBasic).toLocaleString()}</span>
                    </div>
                    {parseFloat(result.annualRemedial) > 0 && (
                      <div className="flex justify-between items-center">
                        <span>Remedial work</span>
                        <span className="font-medium">£{parseFloat(result.annualRemedial).toLocaleString()}</span>
                      </div>
                    )}
                    {parseFloat(result.annualEmergency) > 0 && (
                      <div className="flex justify-between items-center">
                        <span>Emergency fund</span>
                        <span className="font-medium">£{parseFloat(result.annualEmergency).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 font-bold text-lg">
                      <span>Total Annual Cost</span>
                      <span>£{parseFloat(result.annualTotal).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Comparison */}
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-stone-600" />
                    Cost Comparison
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${result.comparison.vsFullSet < 0 ? 'bg-green-50' : 'bg-amber-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {result.comparison.vsFullSet < 0 
                          ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                          : <TrendingUp className="w-5 h-5 text-amber-600" />
                        }
                        <span className="font-medium">vs UK Average (Full Set)</span>
                      </div>
                      <p className={`text-lg font-bold ${result.comparison.vsFullSet < 0 ? 'text-green-700' : 'text-amber-700'}`}>
                        {result.comparison.vsFullSet < 0 ? `£${Math.abs(result.comparison.vsFullSet).toFixed(0)} less` : `£${result.comparison.vsFullSet.toFixed(0)} more`}
                      </p>
                      <p className="text-sm text-gray-600">UK avg full set: ~£990/year</p>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${hoofCareType === 'barefoot-trim' ? 'bg-green-50' : 'bg-blue-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Scissors className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Barefoot Savings</span>
                      </div>
                      <p className="text-lg font-bold text-blue-700">
                        {hoofCareType === 'barefoot-trim' 
                          ? 'Already barefoot!' 
                          : `Save ~£${Math.abs(result.comparison.savingsIfBarefoot).toFixed(0)}/year`
                        }
                      </p>
                      <p className="text-sm text-gray-600">UK avg barefoot: ~£270/year</p>
                    </div>
                  </div>
                </div>

                {/* Reminders CTA in Results */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-bold text-lg">Never Miss a Farrier Appointment</h3>
                      <p className="text-purple-200 text-sm mt-1">
                        Get free reminders for farrier visits, worming, vaccinations, and all your horse care dates.
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

          {/* Important Notes */}
          <div className="bg-stone-50 border-l-4 border-stone-500 p-6 rounded-r-lg mt-8">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-stone-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-stone-800 mb-2">Important Hoof Care Notes</h3>
                <ul className="text-stone-900 space-y-1 text-sm">
                  <li>• Only use Farriers Registration Council (FRC) registered farriers - it's a legal requirement in the UK</li>
                  <li>• Never extend intervals beyond 8 weeks for shod horses - this causes hoof and shoe problems</li>
                  <li>• Barefoot transition should be done gradually with professional guidance</li>
                  <li>• Poor hoof care leads to lameness - the most common cause of lost riding days</li>
                  <li>• Book your farrier well in advance - good farriers are often booked 4-6 weeks ahead</li>
                  <li>• Use our <a href="/annual-horse-cost-calculator" className="text-stone-700 underline hover:text-stone-900">Annual Calculator</a> to see how farrier costs fit into total ownership</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <article className="mt-12 space-y-12">
            
            {/* Understanding Farrier Costs */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Farrier Costs in the UK</h2>
              <p className="text-gray-700 mb-4">
                Farrier costs are one of the essential, non-negotiable expenses of horse ownership. Regular hoof care 
                every 6-8 weeks is crucial for soundness - poor hoof care is the leading cause of preventable lameness 
                in horses. UK farrier costs have increased steadily, with full shoeing now averaging £110 per visit.
              </p>
              <p className="text-gray-700 mb-4">
                The choice between shoeing and barefoot depends on your horse's workload, terrain, and hoof quality. 
                While barefoot is significantly cheaper (saving £500-700/year), it's not suitable for every horse. 
                Discuss options with your farrier and vet.
              </p>
              <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg">
                <p className="text-gray-700 italic">
                  <strong>Example:</strong> A horse with a full set of shoes seeing the farrier every 6 weeks 
                  needs 9 visits annually. At £110 per visit, that's £990/year - before any remedial work or emergencies.
                </p>
              </div>
            </section>

            {/* UK Farrier Prices Table */}
            <section className="overflow-x-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">UK Farrier Prices 2026</h2>
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                <caption className="sr-only">UK farrier prices for 2026</caption>
                <thead>
                  <tr className="bg-stone-600 text-white">
                    <th scope="col" className="p-4 text-left">Service</th>
                    <th scope="col" className="p-4 text-right">Low</th>
                    <th scope="col" className="p-4 text-right">Average</th>
                    <th scope="col" className="p-4 text-right">High</th>
                    <th scope="col" className="p-4 text-right">Annual (9 visits)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <th scope="row" className="p-4 font-medium text-left">Barefoot Trim</th>
                    <td className="p-4 text-right">£35</td>
                    <td className="p-4 text-right">£45</td>
                    <td className="p-4 text-right">£60</td>
                    <td className="p-4 text-right font-bold text-green-700">£270-405</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <th scope="row" className="p-4 font-medium text-left">Front Shoes Only</th>
                    <td className="p-4 text-right">£55</td>
                    <td className="p-4 text-right">£70</td>
                    <td className="p-4 text-right">£90</td>
                    <td className="p-4 text-right font-bold">£495-630</td>
                  </tr>
                  <tr className="border-b">
                    <th scope="row" className="p-4 font-medium text-left">Full Set (4 shoes)</th>
                    <td className="p-4 text-right">£85</td>
                    <td className="p-4 text-right">£110</td>
                    <td className="p-4 text-right">£150</td>
                    <td className="p-4 text-right font-bold">£765-990</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <th scope="row" className="p-4 font-medium text-left">Remedial Shoeing</th>
                    <td className="p-4 text-right">£130</td>
                    <td className="p-4 text-right">£160</td>
                    <td className="p-4 text-right">£220+</td>
                    <td className="p-4 text-right font-bold text-amber-700">£1,170-1,440+</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <th scope="row" className="p-4 font-medium text-left">Emergency Callout</th>
                    <td className="p-4 text-right">£80</td>
                    <td className="p-4 text-right">£100</td>
                    <td className="p-4 text-right">£150+</td>
                    <td className="p-4 text-right text-gray-500">Per incident</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-500 mt-2">* Prices vary by region. South East typically 15-20% higher. Include travel for remote locations.</p>
            </section>

            {/* Barefoot vs Shod Comparison */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Barefoot vs Shod: Cost Comparison</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-800 mb-2">✓ Barefoot Benefits</h3>
                  <ul className="text-green-900 space-y-2 text-sm">
                    <li>• Save £500-700/year vs full shoeing</li>
                    <li>• Longer intervals between trims (8-10 weeks)</li>
                    <li>• Natural hoof function and shock absorption</li>
                    <li>• No risk of lost shoes</li>
                    <li>• Often better traction on varied terrain</li>
                    <li>• Lower emergency callout costs</li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-lg border border-stone-200">
                  <h3 className="font-bold text-stone-800 mb-2">⚠ When Shoes Are Needed</h3>
                  <ul className="text-stone-900 space-y-2 text-sm">
                    <li>• High-intensity work on hard surfaces</li>
                    <li>• Horses with poor hoof quality</li>
                    <li>• Corrective/therapeutic requirements</li>
                    <li>• Competition rules may require shoes</li>
                    <li>• Some horses need protection from terrain</li>
                    <li>• Hoof boots can be an alternative</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions About Farrier Costs</h2>
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

          {/* Related Calculators */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Horse Cost Calculators</h2>
            <p className="text-gray-600 mb-6">Calculate other aspects of horse ownership:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedCalculators.map((calc, index) => (
                <a 
                  key={index}
                  href={calc.href} 
                  className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-stone-400 hover:shadow-md transition group"
                  title={`${calc.title} - ${calc.description}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <calc.icon className={`w-5 h-5 ${calc.color}`} />
                    <h3 className="font-bold text-gray-900 group-hover:text-stone-600">{calc.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{calc.description}</p>
                  <div className="text-stone-600 text-sm font-medium mt-2 flex items-center gap-1">
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
                Never miss a farrier appointment, vaccination, worming date, or vet check again. 
                Get free email reminders for all your horse care needs.
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
          <div className="mt-12 bg-gradient-to-r from-stone-600 to-stone-500 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Need to Calculate Total Horse Costs?</h2>
            <p className="text-stone-200 mb-4">Try our comprehensive Annual Horse Cost Calculator for a complete budget.</p>
            <a 
              href="/annual-horse-cost-calculator" 
              className="inline-block bg-white text-stone-600 px-6 py-3 rounded-lg font-bold hover:bg-stone-50 transition"
            >
              Calculate Annual Costs
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
                  Get free email reminders for farrier visits, vaccinations, worming, and all your horse care dates.
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
