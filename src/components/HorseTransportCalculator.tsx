import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Truck,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Star,
  MapPin,
  Bell,
  ArrowRight,
  Clock,
  Users,
  HelpCircle,
  CheckCircle2,
  Home,
  Shield,
  Heart,
  Scissors,
  Trophy
} from 'lucide-react'

export default function HorseTransportCalculator() {
  const [journeyType, setJourneyType] = useState('oneoff')
  const [distance, setDistance] = useState('')
  const [numHorses, setNumHorses] = useState('1')
  const [vehicleType, setVehicleType] = useState('professional')
  const [region, setRegion] = useState('average')
  const [urgency, setUrgency] = useState('standard')
  const [includeReturn, setIncludeReturn] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [overnightStops, setOvernightStops] = useState('0')
  const [result, setResult] = useState<any>(null)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  const journeyTypes = [
    { id: 'oneoff', name: 'One-Off Move', description: 'Buying, selling, or relocating' },
    { id: 'show', name: 'Competition/Show', description: 'Regular event transport' },
    { id: 'clinic', name: 'Vet/Clinic Visit', description: 'Hospital or specialist visit' },
    { id: 'holiday', name: 'Holiday/Training', description: 'Extended stay transport' }
  ]

  // 2026 pricing
  const vehicleTypes = [
    { id: 'professional', name: 'Professional Transporter', baseRate: 2.80, minCharge: 95, description: 'Insured, experienced driver' },
    { id: 'local', name: 'Local Horse Taxi', baseRate: 2.25, minCharge: 60, description: 'Local journeys, often cheaper' },
    { id: 'friend', name: 'Friend/Yard Help', baseRate: 0.90, minCharge: 25, description: 'Fuel contribution only' },
    { id: 'self', name: 'Self-Transport', baseRate: 0.75, minCharge: 0, description: 'Your own vehicle' }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.35,
    'southeast': 1.2,
    'average': 1.0,
    'north': 0.9,
    'scotland': 1.1 // Higher due to distances
  }

  const urgencyMultipliers: Record<string, number> = {
    'emergency': 2.0,
    'urgent': 1.5,
    'standard': 1.0,
    'flexible': 0.9
  }

  const calculate = () => {
    if (!distance) {
      alert('Please enter the journey distance')
      return
    }

    const dist = parseFloat(distance)
    const horses = parseInt(numHorses)
    const vehicle = vehicleTypes.find(v => v.id === vehicleType)
    if (!vehicle) return

    const regionFactor = regionMultipliers[region]
    const urgencyFactor = urgencyMultipliers[urgency]

    // Calculate one-way distance cost
    let oneWayDist = dist
    if (includeReturn && vehicleType !== 'self') {
      oneWayDist = dist // Professional charges based on one-way, their return is their problem
    }

    // Base transport cost
    let baseCost = Math.max(vehicle.baseRate * oneWayDist, vehicle.minCharge)
    
    // Apply multipliers
    baseCost *= regionFactor * urgencyFactor

    // Multiple horses discount (not quite double)
    if (horses === 2) {
      baseCost *= 1.5
    } else if (horses > 2) {
      baseCost *= 1.5 + ((horses - 2) * 0.3)
    }

    // Self-transport is return journey
    if (vehicleType === 'self' && includeReturn) {
      baseCost *= 2
    }

    // Overnight stops (2026 pricing)
    const overnight = parseInt(overnightStops)
    const overnightCost = overnight * 175 * horses // Livery + your accommodation

    // Insurance/documentation for longer journeys
    let extraCosts = 0
    if (dist > 200) {
      extraCosts += 35 // Travel boots, hay nets, water
    }
    if (journeyType === 'holiday' || dist > 300) {
      extraCosts += 25 // Documentation check
    }

    const totalCost = baseCost + overnightCost + extraCosts

    // Calculate per mile rate
    const perMile = totalCost / (includeReturn && vehicleType === 'self' ? dist * 2 : dist)

    // Compare options (2026 pricing)
    const proQuote = Math.max(2.80 * dist, 95) * regionFactor * urgencyFactor
    const localQuote = Math.max(2.25 * dist, 60) * regionFactor * urgencyFactor
    const selfCost = 0.75 * dist * 2 // Return journey for self

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'horse_transport',
        journey_type: journeyType,
        distance_miles: dist,
        num_horses: horses,
        transport_method: vehicleType,
        total_cost: totalCost.toFixed(0)
      })
    }

    setResult({
      totalCost: totalCost.toFixed(2),
      baseCost: baseCost.toFixed(2),
      overnightCost: overnightCost.toFixed(2),
      extraCosts: extraCosts.toFixed(2),
      perMile: perMile.toFixed(2),
      distance: dist,
      horses: horses,
      vehicleInfo: vehicle,
      journeyInfo: journeyTypes.find(j => j.id === journeyType),
      comparison: {
        professional: proQuote.toFixed(2),
        local: localQuote.toFixed(2),
        self: selfCost.toFixed(2)
      },
      estimatedTime: getEstimatedTime(dist),
      tips: getTips(dist, journeyType, horses)
    })
  }

  const getEstimatedTime = (dist: number) => {
    // Average 40mph including stops
    const hours = dist / 40
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`
    } else if (hours < 2) {
      return `${hours.toFixed(1)} hours`
    } else {
      return `${Math.round(hours)} hours (with rest stops)`
    }
  }

  const getTips = (dist: number, journey: string, horses: number) => {
    const tips = []
    if (dist > 100) tips.push('Allow for comfort breaks every 2-3 hours')
    if (dist > 200) tips.push('Consider breaking the journey with an overnight stop')
    if (horses > 1) tips.push('Ensure horses are compatible travel companions')
    if (journey === 'show') tips.push('Add extra time for plaiting and preparation')
    if (journey === 'clinic') tips.push('Bring horse\'s medical records and passport')
    return tips
  }

  // 15 FAQs for maximum SEO
  const faqs = [
    {
      q: 'How much does horse transport cost UK?',
      a: 'Professional horse transport in the UK costs £2.50-3.50 per mile in 2026 with minimum charges of £60-120. A typical 50-mile journey costs £120-180, while 100 miles costs £250-350. Prices vary by region, urgency, and number of horses. DIY transport costs around £0.70-0.90 per mile in fuel and wear.'
    },
    {
      q: 'How do I find a horse transporter?',
      a: 'Options include: asking your yard for recommendations, Facebook horse transport groups, British Grooms Association lists, your vet clinic contacts, or transport directories. Always check insurance, reviews, and inspect vehicles if possible. Word of mouth recommendations are often best.'
    },
    {
      q: 'What should I check before booking transport?',
      a: 'Verify: valid insurance (goods in transit + public liability), DEFRA authorization if required, clean well-maintained vehicle, driver experience with horses, breakdown cover, and references. Ask about their loading approach for difficult loaders.'
    },
    {
      q: 'How far can a horse travel in one day?',
      a: 'Horses should rest every 4 hours and drink every 6 hours. Most experts recommend maximum 8-10 hours travel per day (300-400 miles). For longer journeys, overnight stops are advisable. Young, old, or unfit horses may need shorter travel times.'
    },
    {
      q: 'Do I need to travel with my horse?',
      a: 'Professional transporters typically travel alone unless you arrange to accompany. For valuable competition horses or nervous travellers, you may want to follow in your car. Some transporters charge extra if you travel with them.'
    },
    {
      q: 'What paperwork do I need for horse transport?',
      a: 'Required: horse\'s passport (legally required at all times). Recommended: vaccination records, ownership documents, destination livery agreement. For international transport, you\'ll need export health certificates and TRACES documentation.'
    },
    {
      q: 'Should I sedate my horse for travel?',
      a: 'Sedation is generally not recommended as it affects balance and stress response. Horses are safer travelling alert. If your horse is extremely difficult, discuss with your vet - they may recommend alternative calming approaches. Address loading training instead.'
    },
    {
      q: 'How do I prepare my horse for transport?',
      a: 'Fit travel boots or bandages (all four legs plus hock and knee boots), tail guard, light rug if needed. Provide hay net for longer journeys. Ensure horse is calm before loading. Remove shoes if travelling long distance (some choose to).'
    },
    {
      q: 'Is it cheaper to hire a trailer or use a transporter?',
      a: 'For occasional journeys, professional transport is usually cheaper and easier. Trailer hire costs £60-100/day in 2026 plus fuel (£0.70-0.90/mile), and you need a suitable towing vehicle. If you transport 10+ times yearly, owning makes more sense.'
    },
    {
      q: 'What insurance do I need for horse transport?',
      a: 'If using professionals, they should have goods in transit insurance. Your horse insurance should cover transport incidents. If self-transporting, check your trailer/horsebox insurance covers the horse\'s value. Always verify cover before travel.'
    },
    {
      q: 'How much notice do I need to book horse transport?',
      a: 'For standard bookings, 1-2 weeks notice is ideal. Busy periods (show season, hunting season) may need 3-4 weeks. Emergency same-day transport is available but costs 2x standard rates. Flexible dates often get better prices.'
    },
    {
      q: 'What size vehicle does my horse need?',
      a: 'Standard horses (up to 16.2hh) fit most trailers and 3.5t horseboxes. Larger horses (17hh+) need extra-height vehicles - check internal height is minimum 7\'6". Warmbloods and heavy horses often need larger 7.5t boxes for comfort.'
    },
    {
      q: 'Can difficult loaders be transported?',
      a: 'Yes, but be honest with transporters about loading issues. Experienced drivers have techniques for reluctant loaders. Allow extra time (and potentially extra cost). Some transporters specialise in difficult horses. Never sedate as an alternative to proper loading training.'
    },
    {
      q: 'What happens if my horse is injured during transport?',
      a: 'Professional transporters should have goods in transit insurance covering injury. Document the horse\'s condition before travel (photos). If injury occurs, contact the transporter immediately, get veterinary attention, and notify your own horse insurance. Keep all records and receipts.'
    },
    {
      q: 'Are there weight limits for horse transport?',
      a: 'Standard trailers safely carry 1-2 horses (approx 1,400kg payload). 3.5t horseboxes typically carry 2 horses. Heavier horses or multiple horses need 7.5t+ vehicles. Professional transporters know their vehicle limits and should advise appropriately.'
    }
  ]

  // Related calculators
  const relatedCalculators = [
    {
      title: 'Competition Budget Calculator',
      description: 'Plan your show season costs',
      href: '/competition-budget-calculator',
      icon: Trophy,
      color: 'text-rose-600',
      bg: 'bg-rose-50 hover:bg-rose-100'
    },
    {
      title: 'First Horse Calculator',
      description: 'Complete first year costs',
      href: '/first-horse-calculator',
      icon: Heart,
      color: 'text-pink-600',
      bg: 'bg-pink-50 hover:bg-pink-100'
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
      title: 'Horse Insurance Calculator',
      description: 'Compare cover options',
      href: '/horse-insurance-calculator',
      icon: Shield,
      color: 'text-purple-600',
      bg: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      title: 'Annual Horse Cost Calculator',
      description: 'Full yearly budget',
      href: '/annual-horse-cost-calculator',
      icon: Calculator,
      color: 'text-amber-600',
      bg: 'bg-amber-50 hover:bg-amber-100'
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
        <title>Horse Transport Cost Calculator UK 2026 | Moving &amp; Travel Prices | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free horse transport cost calculator for UK owners. Calculate professional transporter prices, DIY moving costs, and compare options for shows, moves, and vet visits. 2026 UK prices." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="horse transport cost UK 2026, horse transporter prices, moving horse cost, horse travel calculator, horsebox hire cost, equine transport quotes, horse taxi prices" 
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
        <meta name="theme-color" content="#0369a1" />
        
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
        <meta property="og:title" content="Horse Transport Cost Calculator UK 2026 | Moving Prices | HorseCost" />
        <meta property="og:description" content="Calculate horse transport costs for moves, shows, and vet visits. Compare professional transporters with DIY options." />
        <meta property="og:url" content="https://horsecost.co.uk/horse-transport-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/horse-transport-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Horse Transport Cost Calculator showing UK transporter prices by distance" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Horse Transport Cost Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Calculate horse moving costs. Compare professional transport, local taxi, and DIY options." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/horse-transport-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Horse Transport Cost Calculator UK" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/horse-transport-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/horse-transport-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Horse Transport Calculator', 'item': 'https://horsecost.co.uk/horse-transport-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Transport Cost Calculator UK',
                'description': 'Calculate horse transport and moving costs in the UK. Compare professional transporters, local horse taxis, and DIY options with 2026 prices.',
                'url': 'https://horsecost.co.uk/horse-transport-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.7', 'ratingCount': '203', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Calculate Horse Transport Costs',
                'description': 'Step-by-step guide to calculating your horse transport and moving costs',
                'totalTime': 'PT3M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Select Journey Type', 'text': 'Choose the purpose of your journey: one-off move (buying/relocating), competition/show, vet/clinic visit, or holiday/training.' },
                  { '@type': 'HowToStep', 'name': 'Enter Distance', 'text': 'Input the one-way journey distance in miles. Use Google Maps to calculate if unsure.' },
                  { '@type': 'HowToStep', 'name': 'Select Number of Horses', 'text': 'Choose how many horses are travelling. Multiple horses often get discounted rates.' },
                  { '@type': 'HowToStep', 'name': 'Choose Transport Method', 'text': 'Select your preferred option: professional transporter, local horse taxi, friend/yard help, or self-transport.' },
                  { '@type': 'HowToStep', 'name': 'Calculate and Compare', 'text': 'Click Calculate to see your estimated transport cost and comparison between options.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Horse Transport Cost Calculator UK 2026 - Moving & Travel Prices',
                'description': 'Free calculator for UK horse transport costs. Compare professional transporters, horse taxis, and DIY options.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png' } },
                'image': 'https://horsecost.co.uk/images/horse-transport-calculator-og.jpg'
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
                'name': 'Horse Transport Cost Calculator UK 2026',
                'description': 'Calculate horse transport costs for moves, shows, and vet visits in the UK',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/horse-transport-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'UK Horse Transport Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Professional Transporter',
                    'description': 'A licensed, insured horse transport service with experienced drivers and purpose-built vehicles. Typical cost £2.50-3.50 per mile in 2026 with minimum charges of £60-120.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Horse Taxi',
                    'description': 'A local horse transport service, often run by individuals with horse trailers. Usually cheaper than national transporters at £2-2.50 per mile. Best for shorter local journeys.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Goods in Transit Insurance',
                    'description': 'Insurance that covers horses during transport. Professional transporters should have this as standard. Covers injury or death during loading, travel, and unloading.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Travel Boots',
                    'description': 'Protective leg coverings worn by horses during transport to prevent injury. Cover from knee/hock to coronet band. Essential for all horse journeys regardless of distance.'
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
          <a href="/" className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header */}
        <header className="bg-gradient-to-r from-sky-600 to-blue-600 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Horse Transport Calculator UK 2026</h1>
                <p className="text-sky-200 mt-1">Moving &amp; Travel Costs</p>
              </div>
            </div>
            <p className="text-sky-100 max-w-3xl">
              Calculate horse transport costs for one-off moves, shows, vet visits, and more. 
              Compare professional transporters with DIY options.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sky-200 text-sm">
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
                203 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-sky-500/30 text-sky-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Price comparison included
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Journey time estimates
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
              <HelpCircle className="w-5 h-5 text-sky-600" />
              Quick Answer: How Much Does Horse Transport Cost UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>Horse transport in the UK costs £2.50-3.50 per mile in 2026.</strong> A 50-mile journey costs £120-180 (professional) or £60-90 (local taxi). 100 miles: £250-350. Self-transport costs £0.70-0.90/mile in fuel. Emergency same-day transport is typically double standard rates. Multiple horses get 30-50% discount on the second horse.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-sky-50 p-3 rounded-lg text-center">
                <div className="text-xs text-sky-600 font-medium">50 Miles</div>
                <div className="text-xl font-bold text-sky-700">£120-180</div>
                <div className="text-xs text-gray-500">professional</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xs text-blue-600 font-medium">100 Miles</div>
                <div className="text-xl font-bold text-blue-700">£250-350</div>
                <div className="text-xs text-gray-500">professional</div>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg text-center">
                <div className="text-xs text-cyan-600 font-medium">Local Taxi</div>
                <div className="text-xl font-bold text-cyan-700">£2-2.50</div>
                <div className="text-xs text-gray-500">per mile</div>
              </div>
              <div className="bg-teal-50 p-3 rounded-lg text-center">
                <div className="text-xs text-teal-600 font-medium">Self-Transport</div>
                <div className="text-xl font-bold text-teal-700">£0.75</div>
                <div className="text-xs text-gray-500">per mile (fuel)</div>
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
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Journey Type</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {journeyTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setJourneyType(type.id)}
                        className={`p-3 rounded-xl text-left transition border-2 ${
                          journeyType === type.id
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`font-medium text-sm ${journeyType === type.id ? 'text-sky-700' : 'text-gray-900'}`}>
                          {type.name}
                        </p>
                        <p className="text-xs text-gray-500">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Distance (one way, miles)</label>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['25', '50', '100', '150', '250'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setDistance(val)}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          distance === val
                            ? 'bg-sky-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val} miles
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Number of Horses</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['1', '2', '3', '4'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setNumHorses(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          numHorses === val
                            ? 'bg-sky-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Transport Method</label>
                  </div>
                  <div className="space-y-2">
                    {vehicleTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setVehicleType(type.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          vehicleType === type.id
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${vehicleType === type.id ? 'text-sky-700' : 'text-gray-900'}`}>
                              {type.name}
                            </p>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                          <p className="text-sm text-gray-600">~£{type.baseRate}/mile</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Urgency</label>
                  </div>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none"
                  >
                    <option value="emergency">Emergency (same day) - 2x cost</option>
                    <option value="urgent">Urgent (24-48 hours) - 1.5x cost</option>
                    <option value="standard">Standard (1 week+) - Normal rate</option>
                    <option value="flexible">Flexible (any time) - May get discount</option>
                  </select>
                </section>

                <section className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sky-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Additional Options
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeReturn}
                          onChange={(e) => setIncludeReturn(e.target.checked)}
                          className="w-5 h-5 text-sky-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Return Journey</span>
                          <p className="text-sm text-gray-500">For self-transport only</p>
                        </div>
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Overnight Stops</label>
                        <select
                          value={overnightStops}
                          onChange={(e) => setOvernightStops(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sky-500 focus:outline-none"
                        >
                          <option value="0">None</option>
                          <option value="1">1 night (+ ~£175/horse)</option>
                          <option value="2">2 nights (+ ~£350/horse)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Region</label>
                        <select
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sky-500 focus:outline-none"
                        >
                          <option value="london">London / South East (+35%)</option>
                          <option value="southeast">Home Counties (+20%)</option>
                          <option value="average">Midlands / Average UK</option>
                          <option value="north">Northern England (-10%)</option>
                          <option value="scotland">Scotland (+10% due to distances)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-sky-700 hover:to-blue-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Transport Cost
                </button>

                {result && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 text-white">
                      <p className="text-sky-100 text-sm mb-1">Estimated Transport Cost</p>
                      <p className="text-4xl font-bold">£{result.totalCost}</p>
                      <p className="text-sky-200 text-sm mt-1">{result.vehicleInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sky-100 text-xs">Per Mile</p>
                          <p className="font-bold">£{result.perMile}</p>
                        </div>
                        <div>
                          <p className="text-sky-100 text-xs">Est. Time</p>
                          <p className="font-bold">{result.estimatedTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reminders CTA */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold">Horse Care Reminders</h3>
                          <p className="text-purple-200 text-sm">Get reminders for farrier, vet &amp; passport renewals</p>
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
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transport ({result.distance} miles)</span>
                          <span className="font-medium">£{result.baseCost}</span>
                        </div>
                        {parseFloat(result.overnightCost) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Overnight Stops</span>
                            <span className="font-medium">£{result.overnightCost}</span>
                          </div>
                        )}
                        {parseFloat(result.extraCosts) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Travel Extras</span>
                            <span className="font-medium">£{result.extraCosts}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total</span>
                          <span>£{result.totalCost}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-sky-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Compare Options</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Professional Transporter</span>
                          <span className="font-medium">£{result.comparison.professional}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Local Horse Taxi</span>
                          <span className="font-medium">£{result.comparison.local}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Self-Transport (fuel)</span>
                          <span className="font-medium">£{result.comparison.self}</span>
                        </div>
                      </div>
                    </div>

                    {result.tips.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Journey Tips
                        </h3>
                        <ul className="text-sm text-amber-800 space-y-1">
                          {result.tips.map((tip: string, i: number) => (
                            <li key={i}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-sky-50 rounded-xl p-4">
                      <h3 className="font-semibold text-sky-900 mb-2">Journey Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Distance</p>
                          <p className="font-bold text-gray-900">{result.distance} miles</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Horses</p>
                          <p className="font-bold text-gray-900">{result.horses}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Journey Type</p>
                          <p className="font-bold text-gray-900">{result.journeyInfo?.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Est. Duration</p>
                          <p className="font-bold text-gray-900">{result.estimatedTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Enter journey details to see transport costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-sky-50 border-l-4 border-sky-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-sky-900 mb-2">Before Booking Transport</h3>
                <ul className="text-sky-800 space-y-1 text-sm">
                  <li>• <strong>Check insurance</strong> - ensure transporter has goods in transit cover</li>
                  <li>• <strong>Have passport ready</strong> - legally required for all horse movements</li>
                  <li>• <strong>Prepare your horse</strong> - travel boots, rug if needed, hay net</li>
                  <li>• <strong>Arrange timing</strong> - avoid rush hour and allow for delays</li>
                  <li>• <strong>Exchange contacts</strong> - transporter, destination yard, emergency contact</li>
                  <li>• Plan your costs with our <a href="/competition-budget-calculator" className="text-sky-700 underline hover:text-sky-900">Competition Budget Calculator</a></li>
                </ul>
              </div>
            </div>
          </div>

          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Horse Transport Prices 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Distance</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Professional</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Local Taxi</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Self (fuel)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">25 miles</td>
                    <td className="py-3 px-4 text-center">£95-120</td>
                    <td className="py-3 px-4 text-center">£60-85</td>
                    <td className="py-3 px-4 text-center">£35-50</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">50 miles</td>
                    <td className="py-3 px-4 text-center">£140-180</td>
                    <td className="py-3 px-4 text-center">£95-130</td>
                    <td className="py-3 px-4 text-center">£60-85</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">100 miles</td>
                    <td className="py-3 px-4 text-center">£260-330</td>
                    <td className="py-3 px-4 text-center">£210-260</td>
                    <td className="py-3 px-4 text-center">£120-150</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">200 miles</td>
                    <td className="py-3 px-4 text-center">£470-580</td>
                    <td className="py-3 px-4 text-center">£400-520</td>
                    <td className="py-3 px-4 text-center">£240-300</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">300+ miles</td>
                    <td className="py-3 px-4 text-center">£700-950+</td>
                    <td className="py-3 px-4 text-center">£580-800+</td>
                    <td className="py-3 px-4 text-center">£350-450</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * 2026 prices for 1 horse. Add 50% for 2 horses, 80% for 3 horses. Emergency/same-day transport typically double.
            </p>
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
            <p className="text-gray-600 mb-6">Plan your horse costs:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedCalculators.map((calc, index) => (
                <a 
                  key={index}
                  href={calc.href} 
                  className={`${calc.bg} rounded-xl p-4 transition group`}
                  title={`${calc.title} - ${calc.description}`}
                >
                  <calc.icon className={`w-8 h-8 ${calc.color} mb-2`} />
                  <h3 className="font-bold text-gray-900 group-hover:text-sky-600">{calc.title}</h3>
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
              <h2 className="text-2xl font-bold mb-2">Free Horse Care Reminders</h2>
              <p className="text-purple-200 max-w-xl mx-auto">
                Never miss a passport renewal, vaccination, or farrier appointment. Get free email reminders for all your horse care needs.
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
          <div className="mt-12 bg-gradient-to-r from-sky-600 to-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Planning Regular Transport?</h2>
            <p className="text-sky-100 mb-6 max-w-xl mx-auto">
              If you compete regularly, plan your full show season budget including transport, entries, and accommodation.
            </p>
            <a 
              href="/competition-budget-calculator"
              className="inline-flex items-center gap-2 bg-white text-sky-600 px-6 py-3 rounded-xl font-bold hover:bg-sky-50 transition"
            >
              Plan Competition Budget
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
                    <h3 className="text-xl font-bold">Set Up Horse Care Reminders</h3>
                  </div>
                  <button
                    onClick={() => setShowRemindersForm(false)}
                    className="text-white/80 hover:text-white text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-purple-200 text-sm mt-2">
                  Get free email reminders for passport renewals, vaccinations, farrier visits, and all your horse care needs.
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
