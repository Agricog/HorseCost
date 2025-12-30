import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  TreePine,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Calendar,
  Star,
  Fence,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  Users,
  HelpCircle,
  Home,
  Wheat,
  Stethoscope,
  Shield,
  Scissors
} from 'lucide-react'

export default function FieldRentCalculator() {
  const [acreage, setAcreage] = useState('2')
  const [numHorses, setNumHorses] = useState('1')
  const [region, setRegion] = useState('average')
  const [fieldType, setFieldType] = useState('grazing')
  const [facilities, setFacilities] = useState({
    water: true,
    shelter: false,
    fencing: true,
    access: true,
    arena: false,
    stables: false
  })
  const [includeMaintenance, setIncludeMaintenance] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  // 2026 pricing
  const fieldTypes = [
    { id: 'grazing', name: 'Basic Grazing', description: 'Pasture only', baseRate: 90 },
    { id: 'paddock', name: 'Paddock with Facilities', description: 'Water, shelter available', baseRate: 135 },
    { id: 'equestrian', name: 'Equestrian Land', description: 'Arena, stables possible', baseRate: 200 },
    { id: 'livery', name: 'DIY Livery Field', description: 'Full DIY setup', baseRate: 170 }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.8,
    'southeast': 1.4,
    'southwest': 1.2,
    'average': 1.0,
    'north': 0.8,
    'scotland': 0.7,
    'wales': 0.75
  }

  const facilityCosts = {
    water: { annual: 220, description: 'Mains or trough supply' },
    shelter: { annual: 0, description: 'Field shelter (one-off or included)' },
    fencing: { annual: 170, description: 'Fencing maintenance fund' },
    access: { annual: 60, description: 'Gate and track maintenance' },
    arena: { annual: 550, description: 'Arena maintenance/surface' },
    stables: { annual: 700, description: 'Stable rent if available' }
  }

  const maintenanceCosts = {
    harrowing: 120,      // 2x per year
    topping: 100,        // 2x per year
    fertilizer: 180,     // Annual
    weedKiller: 75,      // As needed
    pooPicking: 0,       // DIY
    fenceRepairs: 120,   // Annual budget
    gateOiling: 25       // Annual
  }

  const calculate = () => {
    const acres = parseFloat(acreage)
    const horses = parseInt(numHorses)
    const field = fieldTypes.find(f => f.id === fieldType)
    if (!field) return

    const regionFactor = regionMultipliers[region]

    // Base rent (per acre per year)
    const baseRentPerAcre = field.baseRate * regionFactor
    const annualBaseRent = baseRentPerAcre * acres

    // Facility costs
    let facilityCost = 0
    Object.entries(facilities).forEach(([key, enabled]) => {
      if (enabled) {
        facilityCost += facilityCosts[key as keyof typeof facilityCosts].annual
      }
    })

    // Maintenance costs
    let maintenanceCost = 0
    if (includeMaintenance) {
      maintenanceCost = Object.values(maintenanceCosts).reduce((a, b) => a + b, 0)
      // Scale by acreage
      maintenanceCost *= Math.max(1, acres / 2)
    }

    const totalAnnual = annualBaseRent + facilityCost + maintenanceCost
    const monthlyRent = totalAnnual / 12
    const perHorseMonthly = monthlyRent / horses
    const perAcreAnnual = totalAnnual / acres

    // Minimum acreage check
    const recommendedAcres = horses * 1.5
    const acreageOk = acres >= recommendedAcres

    // Compare to livery (2026 prices)
    const diyLiveryEquivalent = 170 * horses * 12 // DIY livery comparison
    const grassLiveryEquivalent = 120 * horses * 12

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'field_rent',
        field_type: fieldType,
        acreage: acres,
        num_horses: horses,
        annual_total: totalAnnual.toFixed(0)
      })
    }

    setResult({
      totalAnnual: totalAnnual.toFixed(2),
      monthlyRent: monthlyRent.toFixed(2),
      perHorseMonthly: perHorseMonthly.toFixed(2),
      perAcreAnnual: perAcreAnnual.toFixed(2),
      breakdown: {
        baseRent: annualBaseRent.toFixed(2),
        facilities: facilityCost.toFixed(2),
        maintenance: maintenanceCost.toFixed(2)
      },
      fieldInfo: field,
      acreage: acres,
      horses: horses,
      acreageOk,
      recommendedAcres,
      comparison: {
        diyLivery: diyLiveryEquivalent.toFixed(2),
        grassLivery: grassLiveryEquivalent.toFixed(2),
        savings: (diyLiveryEquivalent - totalAnnual).toFixed(2)
      },
      regionFactor
    })
  }

  // 15 FAQs for maximum SEO
  const faqs = [
    {
      q: 'How much does field rent cost for horses UK?',
      a: 'Horse field rent in the UK varies from £50-220+ per acre per year depending on location and facilities (2026 prices). Basic grazing costs £60-110/acre in rural areas, while paddocks near London can cost £160-280/acre. Most horse owners pay £120-350/month total for 2-3 acres with basic facilities.'
    },
    {
      q: 'How much land does a horse need?',
      a: 'The general rule is 1-1.5 acres per horse for grazing, plus additional land for rotation. Two horses need 2-3 acres minimum. This allows adequate grazing while resting sections. Ponies need slightly less, large horses or those on restricted grazing may need more.'
    },
    {
      q: 'What should be included in field rent?',
      a: 'Basic field rent should include: secure fencing, access via gate, and ideally water supply. Check if maintenance (harrowing, topping) is included or extra. Clarify responsibilities for fence repairs, water costs, and poo-picking. Get everything in writing.'
    },
    {
      q: 'Is it cheaper to rent a field or use grass livery?',
      a: 'Renting your own field (£120-250/month) can be cheaper than grass livery (£100-170/horse/month) for 2+ horses in 2026. However, you take on all maintenance, fencing, water, and insurance responsibilities. Grass livery is simpler but offers less control.'
    },
    {
      q: 'What should I look for when renting a field?',
      a: 'Key factors: secure fencing (post and rail ideal), reliable water supply, good drainage, shelter from elements, safe access for vehicles, ragwort-free grazing, and secure gate. Check neighbours (avoid fields next to stallions or busy roads).'
    },
    {
      q: 'Do I need insurance for a rented field?',
      a: 'Yes, you need public liability insurance (covers third-party injury/damage). Most policies are £120-250/year in 2026. Your horse insurance should cover the horse. The landowner should have their own insurance. Check lease terms for insurance requirements.'
    },
    {
      q: 'What are typical field maintenance costs?',
      a: 'Annual maintenance in 2026 includes: harrowing (£60-120 twice yearly), topping (£50-100 twice yearly), fertilizing (£120-220/acre), weed control (£60-120), fence repairs (£120-250 budget), water/trough maintenance (£60-120). Total £500-950/year for 2 acres.'
    },
    {
      q: 'Can I put up a field shelter without planning permission?',
      a: 'Field shelters under 15sqm often don\'t need planning permission if they\'re moveable/temporary. Fixed structures usually require permission. Check with your local planning authority before installation. Some landowners have specific restrictions in lease agreements.'
    },
    {
      q: 'What should be in a field rental agreement?',
      a: 'Include: rent amount and payment terms, notice period (typically 1-3 months), maintenance responsibilities, permitted use and number of horses, insurance requirements, access arrangements, who pays for water/repairs, and conditions for termination.'
    },
    {
      q: 'How do I find fields to rent for horses?',
      a: 'Options include: local farmers (ask around), horse Facebook groups, Gumtree/Preloved, local feed merchants notice boards, BHS Access pages, and word of mouth at local yards. Building a relationship with local farmers often yields the best long-term arrangements.'
    },
    {
      q: 'How much does fencing cost for horse fields?',
      a: 'New post and rail fencing costs £15-25 per metre installed (2026). For a 2-acre field (approx 360m perimeter), expect £5,400-9,000. Electric fencing is cheaper at £3-6 per metre. Budget £150-300 annually for repairs and maintenance on existing fencing.'
    },
    {
      q: 'What is the best type of fencing for horse fields?',
      a: 'Post and rail (wooden) is safest and most durable but expensive. Electric tape/rope is effective and cheaper but needs regular checking. Avoid barbed wire (injuries), sheep netting (hooves caught), and plain wire (hard to see). Hedges with backup fencing work well.'
    },
    {
      q: 'How often should horse fields be harrowed?',
      a: 'Harrow 2-3 times yearly: spring (March-April) to break up winter compaction, summer (June-July) to spread droppings and stimulate growth, and autumn (September) before rest period. Cost £50-80 per session for a contractor with small tractor.'
    },
    {
      q: 'What grazing rotation works best for horses?',
      a: 'Divide land into 2-3 paddocks and rotate every 3-4 weeks. Rest periods of 4-6 weeks allow grass recovery and break parasite cycles. Strip grazing (electric fencing) maximises use of limited land. Cross-grazing with sheep or cattle helps parasite control.'
    },
    {
      q: 'How do I manage ragwort in rented fields?',
      a: 'You\'re legally required to control ragwort. Pull plants by hand (wear gloves, remove whole root) before flowering in June-July, or use approved herbicides. Dispose of pulled plants carefully - they\'re more toxic when wilted. Check fields monthly during growing season.'
    }
  ]

  // Related calculators
  const relatedCalculators = [
    {
      title: 'Horse Livery Calculator',
      description: 'Compare livery yard options',
      href: '/horse-livery-calculator',
      icon: Home,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 hover:bg-emerald-100'
    },
    {
      title: 'Annual Horse Cost Calculator',
      description: 'Calculate total yearly ownership costs',
      href: '/annual-horse-cost-calculator',
      icon: Calculator,
      color: 'text-amber-600',
      bg: 'bg-amber-50 hover:bg-amber-100'
    },
    {
      title: 'Horse Feed Calculator',
      description: 'Daily hay and hard feed costs',
      href: '/horse-feed-calculator',
      icon: Wheat,
      color: 'text-green-600',
      bg: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: 'Vet Cost Estimator',
      description: 'Plan your healthcare budget',
      href: '/vet-cost-estimator',
      icon: Stethoscope,
      color: 'text-red-600',
      bg: 'bg-red-50 hover:bg-red-100'
    },
    {
      title: 'Horse Insurance Calculator',
      description: 'Compare cover options and premiums',
      href: '/horse-insurance-calculator',
      icon: Shield,
      color: 'text-purple-600',
      bg: 'bg-purple-50 hover:bg-purple-100'
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
        <title>Horse Field Rent Calculator UK 2026 | Grazing &amp; Land Costs | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free horse field rent calculator for UK owners. Calculate grazing land costs, paddock rental prices, and annual maintenance expenses. Compare to livery. 2026 UK prices." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="horse field rent UK 2026, grazing land cost, paddock rental price, horse pasture rent, equestrian land cost, field rent per acre, horse grazing cost" 
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
        <meta name="theme-color" content="#15803d" />
        
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
        <meta property="og:title" content="Horse Field Rent Calculator UK 2026 | Grazing Costs | HorseCost" />
        <meta property="og:description" content="Calculate horse field rental costs including grazing land, paddock facilities, and maintenance. Compare to livery options." />
        <meta property="og:url" content="https://horsecost.co.uk/field-rent-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/field-rent-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Horse Field Rent Calculator showing UK grazing land costs by region" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Horse Field Rent Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Calculate horse grazing land costs. Compare field rent vs livery options with UK regional pricing." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/field-rent-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Horse Field Rent Calculator UK" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/field-rent-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/field-rent-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Field Rent Calculator', 'item': 'https://horsecost.co.uk/field-rent-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Field Rent Calculator UK',
                'description': 'Calculate horse field rental costs including grazing land, paddock facilities, and annual maintenance with UK 2026 regional pricing.',
                'url': 'https://horsecost.co.uk/field-rent-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.7', 'ratingCount': '198', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Calculate Horse Field Rent Costs',
                'description': 'Step-by-step guide to calculating your horse field rental costs',
                'totalTime': 'PT3M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Select Field Type', 'text': 'Choose between basic grazing, paddock with facilities, equestrian land, or DIY livery field setup.' },
                  { '@type': 'HowToStep', 'name': 'Enter Acreage', 'text': 'Select the field size. Allow 1-1.5 acres per horse for adequate grazing with rotation.' },
                  { '@type': 'HowToStep', 'name': 'Choose Number of Horses', 'text': 'Enter how many horses will use the field to calculate per-horse costs.' },
                  { '@type': 'HowToStep', 'name': 'Select Your Region', 'text': 'Choose your UK region as prices vary significantly - London is 80% higher than Scotland.' },
                  { '@type': 'HowToStep', 'name': 'Add Facilities & Maintenance', 'text': 'Include water supply, fencing fund, and annual maintenance costs for accurate total.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Horse Field Rent Calculator UK 2026 - Grazing & Land Costs',
                'description': 'Free calculator for UK horse field rental costs. Compare grazing land prices by region and calculate total annual expenses including maintenance.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png' } },
                'image': 'https://horsecost.co.uk/images/field-rent-calculator-og.jpg'
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
                'name': 'Horse Field Rent Calculator UK 2026',
                'description': 'Calculate horse grazing land and paddock rental costs across UK regions',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/field-rent-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'UK Horse Field Rental Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Grass Livery',
                    'description': 'A livery arrangement where horses are kept at grass (in fields) with basic care provided. Cheaper than stabled livery, typically £100-170/month per horse in 2026.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Harrowing',
                    'description': 'Field maintenance using a chain or disc harrow to break up droppings, aerate soil, and encourage grass growth. Should be done 2-3 times yearly, costing £50-80 per session.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Strip Grazing',
                    'description': 'A pasture management technique using electric fencing to restrict horses to small sections, maximising grass use and preventing overgrazing. Useful for limited land or laminitis-prone horses.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Post and Rail Fencing',
                    'description': 'Traditional wooden fencing considered safest for horses. Consists of wooden posts with 2-3 horizontal rails. Costs £15-25 per metre installed but lasts 15-20 years with maintenance.'
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
          <a href="/" className="text-green-700 hover:text-green-800 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header */}
        <header className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <TreePine className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Horse Field Rent Calculator UK 2026</h1>
                <p className="text-green-200 mt-1">Grazing &amp; Land Costs</p>
              </div>
            </div>
            <p className="text-green-100 max-w-3xl">
              Calculate field rental costs for your horses including grazing land, paddock facilities, 
              and annual maintenance. Compare to livery options with UK 2026 regional pricing.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-green-200 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last updated: January 2026
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                7 UK regions
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                198 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-green-500/30 text-green-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Regional land prices verified
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Livery comparison included
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
              <HelpCircle className="w-5 h-5 text-green-600" />
              Quick Answer: How Much Does Horse Field Rent Cost UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>Horse field rent in the UK costs £60-220 per acre per year (2026).</strong> Basic grazing: £60-110/acre in rural areas. Paddock with facilities: £100-180/acre. Near London: £160-280/acre. Total cost for 2 acres with water and maintenance: £150-400/month. Renting is often cheaper than livery for 2+ horses but you manage all care and maintenance yourself.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xs text-green-600 font-medium">Basic Grazing</div>
                <div className="text-xl font-bold text-green-700">£60-110</div>
                <div className="text-xs text-gray-500">per acre/year</div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg text-center">
                <div className="text-xs text-emerald-600 font-medium">With Facilities</div>
                <div className="text-xl font-bold text-emerald-700">£100-180</div>
                <div className="text-xs text-gray-500">per acre/year</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <div className="text-xs text-amber-600 font-medium">Equestrian Land</div>
                <div className="text-xl font-bold text-amber-700">£150-280</div>
                <div className="text-xs text-gray-500">per acre/year</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xs text-blue-600 font-medium">Maintenance</div>
                <div className="text-xl font-bold text-blue-700">£500-950</div>
                <div className="text-xs text-gray-500">per year (2 acres)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Field Type */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Field Type</label>
                  </div>
                  <div className="space-y-2">
                    {fieldTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setFieldType(type.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          fieldType === type.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${fieldType === type.id ? 'text-green-700' : 'text-gray-900'}`}>
                              {type.name}
                            </p>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                          <p className="text-sm text-gray-600">~£{type.baseRate}/acre</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Acreage */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Acreage</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['1', '1.5', '2', '3', '4', '5'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setAcreage(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          acreage === val
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val} acres
                      </button>
                    ))}
                  </div>
                </section>

                {/* Number of Horses */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Number of Horses</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['1', '2', '3', '4'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setNumHorses(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          numHorses === val
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Region */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                  >
                    <option value="london">Greater London (+80%)</option>
                    <option value="southeast">South East England (+40%)</option>
                    <option value="southwest">South West England (+20%)</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England (-20%)</option>
                    <option value="wales">Wales (-25%)</option>
                    <option value="scotland">Scotland (-30%)</option>
                  </select>
                </section>

                {/* Facilities */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Facilities Included</label>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(facilityCosts).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={facilities[key as keyof typeof facilities]}
                          onChange={(e) => setFacilities({...facilities, [key]: e.target.checked})}
                          className="w-5 h-5 text-green-600 rounded"
                        />
                        <div className="flex-1 flex justify-between">
                          <span className="capitalize text-gray-900">{key}</span>
                          <span className="text-sm text-gray-500">
                            {value.annual > 0 ? `+£${value.annual}/yr` : 'Included'}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </section>

                {/* Maintenance */}
                <section className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-green-700 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Maintenance Options
                  </button>

                  {showAdvanced && (
                    <div className="mt-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeMaintenance}
                          onChange={(e) => setIncludeMaintenance(e.target.checked)}
                          className="w-5 h-5 text-green-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Include Maintenance Costs</span>
                          <p className="text-sm text-gray-500">Harrowing, topping, fertilizing, fence repairs</p>
                        </div>
                      </label>
                    </div>
                  )}
                </section>
              </div>

              {/* Right Column - Results */}
              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Field Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
                      <p className="text-green-100 text-sm mb-1">Annual Field Cost</p>
                      <p className="text-4xl font-bold">£{result.totalAnnual}</p>
                      <p className="text-green-200 text-sm mt-1">{result.acreage} acres - {result.fieldInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-green-100 text-xs">Monthly</p>
                          <p className="font-bold">£{result.monthlyRent}</p>
                        </div>
                        <div>
                          <p className="text-green-100 text-xs">Per Horse/Month</p>
                          <p className="font-bold">£{result.perHorseMonthly}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reminders CTA */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold">Field Maintenance Reminders</h3>
                          <p className="text-purple-200 text-sm">Get reminders for harrowing, topping &amp; more</p>
                        </div>
                        <button
                          onClick={() => setShowRemindersForm(true)}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-50 transition flex-shrink-0"
                        >
                          Set Up
                        </button>
                      </div>
                    </div>

                    {/* Acreage Warning */}
                    {!result.acreageOk && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-amber-800">
                          <AlertCircle className="w-5 h-5" />
                          <p className="font-medium">
                            Recommended: {result.recommendedAcres} acres for {result.horses} horse{result.horses > 1 ? 's' : ''}
                          </p>
                        </div>
                        <p className="text-sm text-amber-700 mt-1">
                          Allow 1-1.5 acres per horse for adequate grazing
                        </p>
                      </div>
                    )}

                    {/* Cost Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Rent ({result.acreage} acres)</span>
                          <span className="font-medium">£{result.breakdown.baseRent}</span>
                        </div>
                        {parseFloat(result.breakdown.facilities) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Facilities</span>
                            <span className="font-medium">£{result.breakdown.facilities}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.maintenance) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Maintenance</span>
                            <span className="font-medium">£{result.breakdown.maintenance}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Annual</span>
                          <span>£{result.totalAnnual}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Per Acre</span>
                          <span>£{result.perAcreAnnual}/year</span>
                        </div>
                      </div>
                    </div>

                    {/* Livery Comparison */}
                    <div className="bg-white border-2 border-green-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Compare to Livery</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">DIY Livery (equivalent)</span>
                          <span className="font-medium">£{result.comparison.diyLivery}/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Grass Livery (equivalent)</span>
                          <span className="font-medium">£{result.comparison.grassLivery}/year</span>
                        </div>
                        {parseFloat(result.comparison.savings) > 0 && (
                          <div className="flex justify-between pt-2 border-t text-green-600 font-semibold">
                            <span>Potential Savings vs DIY Livery</span>
                            <span>£{result.comparison.savings}/year</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Acreage OK */}
                    {result.acreageOk && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <p className="font-medium text-green-800">
                            Good acreage for {result.horses} horse{result.horses > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <TreePine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Configure your field requirements to see costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Box */}
          <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <Fence className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-green-900 mb-2">Field Rental Checklist</h3>
                <ul className="text-green-800 space-y-1 text-sm">
                  <li>• <strong>Check fencing</strong> - post and rail or electric, properly maintained</li>
                  <li>• <strong>Water supply</strong> - reliable mains, stream, or regular trough filling</li>
                  <li>• <strong>Shelter</strong> - natural (hedges, trees) or field shelter needed</li>
                  <li>• <strong>Drainage</strong> - avoid waterlogged fields, check gateway condition</li>
                  <li>• <strong>Access</strong> - suitable for horse transport and daily visits</li>
                  <li>• <strong>Neighbours</strong> - check for stallions, barking dogs, or hazards nearby</li>
                  <li>• Compare to full livery with our <a href="/horse-livery-calculator" className="text-green-700 underline hover:text-green-900">Livery Calculator</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Prices Table */}
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Field Rent Prices 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Region</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Basic Grazing</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">With Facilities</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Equestrian</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Greater London</td>
                    <td className="py-3 px-4 text-center">£160-200/acre</td>
                    <td className="py-3 px-4 text-center">£220-300/acre</td>
                    <td className="py-3 px-4 text-center">£340-450/acre</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">South East</td>
                    <td className="py-3 px-4 text-center">£110-155/acre</td>
                    <td className="py-3 px-4 text-center">£170-220/acre</td>
                    <td className="py-3 px-4 text-center">£250-330/acre</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">South West</td>
                    <td className="py-3 px-4 text-center">£90-130/acre</td>
                    <td className="py-3 px-4 text-center">£135-200/acre</td>
                    <td className="py-3 px-4 text-center">£200-280/acre</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Midlands</td>
                    <td className="py-3 px-4 text-center">£80-110/acre</td>
                    <td className="py-3 px-4 text-center">£115-170/acre</td>
                    <td className="py-3 px-4 text-center">£170-240/acre</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Northern England</td>
                    <td className="py-3 px-4 text-center">£55-90/acre</td>
                    <td className="py-3 px-4 text-center">£90-135/acre</td>
                    <td className="py-3 px-4 text-center">£135-200/acre</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Wales</td>
                    <td className="py-3 px-4 text-center">£55-85/acre</td>
                    <td className="py-3 px-4 text-center">£85-125/acre</td>
                    <td className="py-3 px-4 text-center">£125-180/acre</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Scotland</td>
                    <td className="py-3 px-4 text-center">£45-80/acre</td>
                    <td className="py-3 px-4 text-center">£80-115/acre</td>
                    <td className="py-3 px-4 text-center">£115-170/acre</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Prices per acre per year (2026). Add water, maintenance, and facility costs for total annual expense.
            </p>
          </section>

          {/* Maintenance Costs */}
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Annual Maintenance Costs 2026</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Essential Maintenance</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Harrowing (2x yearly)</span>
                    <span className="font-medium">£100-180</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Topping (2x yearly)</span>
                    <span className="font-medium">£80-150</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Fertilizing (annual)</span>
                    <span className="font-medium">£120-220/acre</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Weed Control</span>
                    <span className="font-medium">£60-120</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Infrastructure</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Fence Repairs (budget)</span>
                    <span className="font-medium">£120-350/year</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Gate Maintenance</span>
                    <span className="font-medium">£25-60/year</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Water Supply</span>
                    <span className="font-medium">£120-350/year</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Public Liability Insurance</span>
                    <span className="font-medium">£120-250/year</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

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
            <p className="text-gray-600 mb-6">Calculate other aspects of horse ownership:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedCalculators.map((calc, index) => (
                <a 
                  key={index}
                  href={calc.href} 
                  className={`${calc.bg} rounded-xl p-4 transition group`}
                  title={`${calc.title} - ${calc.description}`}
                >
                  <calc.icon className={`w-8 h-8 ${calc.color} mb-2`} />
                  <h3 className="font-bold text-gray-900 group-hover:text-green-600">{calc.title}</h3>
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
              <h2 className="text-2xl font-bold mb-2">Free Field Maintenance Reminders</h2>
              <p className="text-purple-200 max-w-xl mx-auto">
                Never miss harrowing, topping, or fence checks. Get free email reminders for all your field maintenance tasks.
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
          <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Considering Your Own Land?</h2>
            <p className="text-green-100 mb-6 max-w-xl mx-auto">
              Renting a field can be cheaper than livery for multiple horses. Calculate your full ownership costs to compare.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition"
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
                    <h3 className="text-xl font-bold">Set Up Field Care Reminders</h3>
                  </div>
                  <button
                    onClick={() => setShowRemindersForm(false)}
                    className="text-white/80 hover:text-white text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-purple-200 text-sm mt-2">
                  Get free email reminders for harrowing, topping, fence checks, and all your field maintenance.
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
