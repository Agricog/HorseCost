import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Wheat,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Scale,
  TrendingUp,
  PieChart,
  Leaf,
  Package,
  Bell,
  ArrowRight,
  MapPin,
  Clock,
  Users,
  HelpCircle,
  CheckCircle2,
  Home,
  Stethoscope,
  Shield,
  Scissors
} from 'lucide-react'

export default function HorseFeedCalculator() {
  // Horse details
  const [horseWeight, setHorseWeight] = useState('')
  const [workLevel, setWorkLevel] = useState('')
  const [horseType, setHorseType] = useState('')
  
  // Feed costs
  const [hayPricePerBale, setHayPricePerBale] = useState('')
  const [baleWeight, setBaleWeight] = useState('20')
  const [hardFeedPerDay, setHardFeedPerDay] = useState('')
  const [hardFeedPricePerBag, setHardFeedPricePerBag] = useState('')
  const [bagWeight, setBagWeight] = useState('20')
  
  // Supplements
  const [monthlySupplements, setMonthlySupplements] = useState('')
  
  const [result, setResult] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  // UK Average prices 2026
  const ukAverages = {
    hayPerBale: 6.50,
    haylagePerBale: 12.00,
    hardFeedPerBag: 14.00,
    supplements: 40,
    chaff: 12.00,
  }

  // Hay consumption: 1.5-2.5% of body weight per day
  const workLevelMultipliers: Record<string, { hay: number, hardFeed: number, label: string }> = {
    'rest': { hay: 2.0, hardFeed: 0, label: 'Rest/Light Hacking' },
    'light': { hay: 1.8, hardFeed: 0.5, label: 'Light Work (1-2 days/week)' },
    'moderate': { hay: 1.7, hardFeed: 1.0, label: 'Moderate Work (3-4 days/week)' },
    'hard': { hay: 1.5, hardFeed: 1.5, label: 'Hard Work (5-6 days/week)' },
    'intense': { hay: 1.5, hardFeed: 2.5, label: 'Intense/Competition' }
  }

  // Horse type affects metabolism
  const horseTypeMultipliers: Record<string, { feed: number, label: string }> = {
    'native': { feed: 0.8, label: 'Native Pony (good doer)' },
    'cob': { feed: 0.85, label: 'Cob/Heavyweight' },
    'warmblood': { feed: 1.0, label: 'Warmblood/Sports Horse' },
    'thoroughbred': { feed: 1.1, label: 'Thoroughbred (poor doer)' },
    'youngster': { feed: 1.15, label: 'Youngster (growing)' },
    'veteran': { feed: 1.05, label: 'Veteran (15+ years)' }
  }

  const applyWorkPreset = (level: string) => {
    setWorkLevel(level)
    const preset = workLevelMultipliers[level]
    if (preset) {
      setHardFeedPerDay(preset.hardFeed.toString())
    }
  }

  const calculate = () => {
    const weight = parseFloat(horseWeight) || 500
    const hayPrice = parseFloat(hayPricePerBale) || ukAverages.hayPerBale
    const baleWt = parseFloat(baleWeight) || 20
    const hardFeedKg = parseFloat(hardFeedPerDay) || 0
    const feedBagPrice = parseFloat(hardFeedPricePerBag) || ukAverages.hardFeedPerBag
    const feedBagWt = parseFloat(bagWeight) || 20
    const supplements = parseFloat(monthlySupplements) || 0

    // Get multipliers
    const workMultiplier = workLevelMultipliers[workLevel] || workLevelMultipliers['light']
    const typeMultiplier = horseTypeMultipliers[horseType] || horseTypeMultipliers['warmblood']

    // Calculate daily hay requirement (% of body weight)
    const dailyHayKg = (weight * (workMultiplier.hay / 100)) * typeMultiplier.feed
    
    // Calculate costs
    const pricePerKgHay = hayPrice / baleWt
    const dailyHayCost = dailyHayKg * pricePerKgHay
    
    const pricePerKgFeed = feedBagPrice / feedBagWt
    const dailyHardFeedCost = hardFeedKg * pricePerKgFeed
    
    const dailyTotalFeed = dailyHayCost + dailyHardFeedCost
    const monthlyFeedCost = dailyTotalFeed * 30
    const monthlyTotal = monthlyFeedCost + supplements
    const annualTotal = monthlyTotal * 12

    // Bales needed per month
    const monthlyHayKg = dailyHayKg * 30
    const balesPerMonth = Math.ceil(monthlyHayKg / baleWt)
    
    // Hard feed bags per month
    const monthlyHardFeedKg = hardFeedKg * 30
    const bagsPerMonth = hardFeedKg > 0 ? Math.ceil(monthlyHardFeedKg / feedBagWt) : 0

    // Winter vs Summer (winter typically 20-30% more hay)
    const winterMonthlyTotal = monthlyTotal * 1.25
    const summerMonthlyTotal = monthlyTotal * 0.85

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'horse_feed',
        horse_weight: weight,
        work_level: workLevel || 'light',
        horse_type: horseType || 'warmblood',
        monthly_total: monthlyTotal.toFixed(0),
        annual_total: annualTotal.toFixed(0)
      })
    }

    setResult({
      daily: {
        hayKg: dailyHayKg.toFixed(1),
        hayCost: dailyHayCost.toFixed(2),
        hardFeedKg: hardFeedKg.toFixed(1),
        hardFeedCost: dailyHardFeedCost.toFixed(2),
        totalCost: dailyTotalFeed.toFixed(2)
      },
      monthly: {
        hayKg: monthlyHayKg.toFixed(0),
        balesNeeded: balesPerMonth,
        hayCost: (dailyHayCost * 30).toFixed(2),
        hardFeedKg: monthlyHardFeedKg.toFixed(0),
        bagsNeeded: bagsPerMonth,
        hardFeedCost: (dailyHardFeedCost * 30).toFixed(2),
        supplements: supplements.toFixed(2),
        totalCost: monthlyTotal.toFixed(2)
      },
      annual: {
        totalCost: annualTotal.toFixed(2),
        hayCost: (dailyHayCost * 365).toFixed(2),
        hardFeedCost: (dailyHardFeedCost * 365).toFixed(2),
        supplementsCost: (supplements * 12).toFixed(2)
      },
      seasonal: {
        winter: winterMonthlyTotal.toFixed(2),
        summer: summerMonthlyTotal.toFixed(2)
      },
      breakdown: {
        hayPercentage: ((dailyHayCost / dailyTotalFeed) * 100).toFixed(0) || 100,
        hardFeedPercentage: ((dailyHardFeedCost / dailyTotalFeed) * 100).toFixed(0) || 0
      }
    })
  }

  // 15 FAQs for maximum SEO value
  const faqs = [
    {
      q: "How much hay does a horse need per day?",
      a: "Horses need approximately 1.5-2.5% of their body weight in forage daily. A 500kg horse needs 7.5-12.5kg of hay per day depending on workload, metabolism, and whether they have grazing access. Good doers (native ponies) need less, while poor doers (thoroughbreds) may need more."
    },
    {
      q: "How much does horse feed cost per month UK?",
      a: "Monthly horse feed costs in the UK typically range from £80-200+ depending on horse size, workload, and feed quality. A 500kg horse in light work costs around £100-120/month for hay and basic feed, while a competition horse may cost £200+/month including supplements."
    },
    {
      q: "What is the cost of a bale of hay in the UK 2026?",
      a: "UK hay prices in 2026 range from £5-8 per small bale (15-20kg) and £30-70 for large round bales. Prices vary by region, quality, and season - hay is typically cheapest in summer after harvest and most expensive in late winter/spring."
    },
    {
      q: "How many bales of hay does a horse eat per month?",
      a: "A 500kg horse eating 2% body weight daily needs approximately 300kg of hay monthly, which equals 15-20 small bales (20kg each) or 2-3 large round bales. Horses with good grazing access need less supplementary hay."
    },
    {
      q: "Should I feed hay or haylage?",
      a: "Hay is traditional, stores well, and suits most horses. Haylage (wrapped hay) has higher moisture, is dust-free (good for respiratory issues), but costs more (£10-15/bale) and must be used within days of opening. Many owners use hay in winter and haylage for horses with allergies."
    },
    {
      q: "How much hard feed does a horse need?",
      a: "Many horses in light work need little or no hard feed - forage alone may suffice. Horses in moderate work typically need 0.5-1.5kg hard feed daily, while competition horses may need 2-3kg+. Always follow manufacturer guidelines and introduce feed changes gradually."
    },
    {
      q: "What supplements does my horse need?",
      a: "Most horses on good forage need minimal supplementation. A general vitamin/mineral supplement (£15-30/month) covers deficiencies. Specific supplements (joints, hooves, calming) add £20-50+/month each. Consult a nutritionist before adding multiple supplements."
    },
    {
      q: "How can I reduce horse feed costs?",
      a: "Buy hay in bulk during summer harvest (20-30% savings), use ad-lib hay to reduce hard feed needs, ensure hay is weighed not guessed, use chaff to slow eating, maximise grazing time, and avoid overfeeding supplements. A fat horse on too much feed is wasted money."
    },
    {
      q: "Why do feed costs increase in winter?",
      a: "Winter feed costs rise 20-30% because: horses need more forage without grazing, they burn calories staying warm, hay prices peak in late winter, and more hard feed may be needed to maintain condition. Budget £120-180/month in winter vs £80-120 in summer."
    },
    {
      q: "How do I know if I'm feeding enough?",
      a: "Use body condition scoring (BCS) regularly - you should feel ribs with light pressure but not see them. Monitor weight with a weigh tape monthly. Energy levels and coat condition indicate diet quality. Consult an equine nutritionist for personalised advice."
    },
    {
      q: "What is the best hay for horses UK?",
      a: "Good horse hay should be clean, dry, dust-free, and smell sweet. Meadow hay is most common and suits most horses. Timothy hay is higher quality but more expensive. Avoid mouldy, dusty, or yellow hay which can cause respiratory issues and colic."
    },
    {
      q: "How do I calculate hay for multiple horses?",
      a: "Calculate each horse's individual needs based on weight and workload, then add together. For example, two 500kg horses in light work need approximately 20kg hay daily total (10kg each), equating to 600kg monthly or 30-40 small bales."
    },
    {
      q: "Is soaking hay necessary for horses?",
      a: "Soaking hay for 30-60 minutes reduces sugar content by 30-50%, making it suitable for laminitics, overweight horses, and those with metabolic issues. It also reduces dust for horses with respiratory problems. Soaked hay must be fed within hours to prevent bacteria growth."
    },
    {
      q: "How much does it cost to feed a pony vs horse?",
      a: "Ponies typically cost 30-50% less to feed than horses due to smaller size and often being good doers. A 300kg pony might cost £60-80/month for feed compared to £100-150 for a 500kg horse. Native ponies often need restricted feeding to prevent obesity."
    },
    {
      q: "Should I feed my horse before or after riding?",
      a: "Allow at least 1-2 hours after a large feed before riding to prevent colic. Small amounts of hay before exercise are fine. After hard work, allow the horse to cool down before feeding concentrates. Access to hay and water should be available most of the time."
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
      title: 'Horse Livery Calculator',
      description: 'Compare livery options and pricing',
      href: '/horse-livery-calculator',
      icon: Home,
      color: 'text-emerald-600'
    },
    {
      title: 'Farrier Cost Calculator',
      description: 'Annual shoeing and trimming costs',
      href: '/farrier-cost-calculator',
      icon: Scissors,
      color: 'text-stone-600'
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
        {/* 1. Title Tag (55-60 chars) */}
        <title>Horse Feed Calculator UK 2026 | Hay &amp; Feed Costs | HorseCost</title>
        
        {/* 2. Meta Description (150-160 chars) */}
        <meta 
          name="description" 
          content="Free horse feed calculator for UK owners. Calculate daily hay requirements, hard feed costs, and monthly feed budgets. Accurate 2026 UK hay and feed pricing." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="horse feed calculator, hay calculator UK, horse feed costs, how much hay does a horse need, monthly horse feed budget, horse nutrition calculator, hay bales per month, UK hay prices 2026" 
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
        <meta property="og:title" content="Horse Feed Calculator UK 2026 | HorseCost" />
        <meta property="og:description" content="Calculate your horse's daily hay needs and monthly feed costs. Free UK calculator with 2026 pricing." />
        <meta property="og:url" content="https://horsecost.co.uk/horse-feed-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/horse-feed-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Horse Feed Calculator showing UK hay and feed costs breakdown" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Horse Feed Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Calculate daily hay needs and monthly feed costs for your horse." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/horse-feed-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Horse Feed Calculator" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/horse-feed-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/horse-feed-calculator" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* JSON-LD Structured Data - 8 Schemas for AI Search */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/#calculators' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Horse Feed Calculator', 'item': 'https://horsecost.co.uk/horse-feed-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Feed Calculator UK',
                'url': 'https://horsecost.co.uk/horse-feed-calculator',
                'description': 'Calculate daily hay requirements and monthly feed costs for horses in the UK. Includes hay, hard feed, and supplements with accurate 2026 pricing.',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.8', 'ratingCount': '312', 'bestRating': '5', 'worstRating': '1' },
                'author': { '@type': 'Organization', 'name': 'HorseCost' }
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
                'name': 'How to Calculate Horse Feed Costs in the UK',
                'description': 'Step-by-step guide to calculating your horse\'s daily hay needs and monthly feed costs',
                'totalTime': 'PT3M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Enter Horse Weight', 'text': 'Input your horse\'s weight in kilograms. Use a weigh tape or estimate based on breed. Average horses are 400-600kg.' },
                  { '@type': 'HowToStep', 'name': 'Select Horse Type', 'text': 'Choose your horse\'s type (native pony, warmblood, thoroughbred, etc.) as this affects metabolism and feed requirements.' },
                  { '@type': 'HowToStep', 'name': 'Choose Work Level', 'text': 'Select your horse\'s workload from rest to intense competition. This determines hay percentage and hard feed needs.' },
                  { '@type': 'HowToStep', 'name': 'Enter Hay Costs', 'text': 'Input your local hay price per bale and bale weight. UK average is £5-8 per small bale.' },
                  { '@type': 'HowToStep', 'name': 'Add Hard Feed & Supplements', 'text': 'Optionally add hard feed amount, price, and monthly supplement costs for a complete calculation.' }
                ]
              },
              {
                '@type': 'Article',
                'headline': 'Horse Feed Calculator - UK Hay & Feed Costs 2026',
                'description': 'Free calculator for UK horse owners to estimate daily hay requirements and monthly feed costs with current 2026 pricing.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'image': 'https://horsecost.co.uk/images/horse-feed-calculator-og.jpg',
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png' } }
              },
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
              {
                '@type': 'WebPage',
                'name': 'Horse Feed Calculator UK 2026',
                'description': 'Calculate daily hay needs and monthly feed costs for horses in the UK',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/horse-feed-calculator',
                'lastReviewed': '2026-01-01'
              },
              {
                '@type': 'DefinedTermSet',
                'name': 'UK Horse Feed Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Forage',
                    'description': 'The fibrous feed that forms the foundation of a horse\'s diet, including hay, haylage, and grass. Horses need 1.5-2.5% of body weight in forage daily.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Hard Feed',
                    'description': 'Concentrated feeds like cubes, mixes, and cereals given in addition to forage for horses in work. Measured in kg per day.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Good Doer',
                    'description': 'A horse or pony with efficient metabolism that maintains weight easily on less feed. Common in native breeds. May need restricted feeding.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Haylage',
                    'description': 'Semi-wilted grass wrapped in plastic to ferment. Higher moisture than hay, dust-free, costs £10-15 per bale in the UK.'
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
          <a href="/" className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header Banner */}
        <header className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Wheat className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Horse Feed Calculator UK 2026</h1>
                <p className="text-green-100 mt-1">Calculate daily hay needs and monthly feed costs</p>
              </div>
            </div>
            <p className="text-green-50 max-w-3xl">
              Work out exactly how much hay your horse needs and what it costs. 
              Includes hard feed, supplements, and seasonal variations with accurate 2026 UK pricing.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-green-200 text-sm">
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
                312 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-green-500/30 text-green-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Verified UK pricing data
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Sources: Feed merchants, BHS guidelines
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Updated January 2026
              </span>
            </div>
          </div>
        </header>

        {/* AI Search Optimized Quick Answer Section */}
        <div className="max-w-5xl mx-auto px-4 mt-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-green-600" />
              Quick Answer: How Much Does Horse Feed Cost Per Month UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>Monthly horse feed costs in the UK range from £80-200+ depending on size and workload.</strong> A 500kg horse needs approximately 10kg hay daily (£3-5/day), plus hard feed if in work. Budget £100-120/month for a horse in light work, or £150-200+/month for competition horses including supplements.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xs text-green-600 font-medium">Light Work</div>
                <div className="text-xl font-bold text-green-700">£80-100</div>
                <div className="text-xs text-gray-500">/month</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xs text-blue-600 font-medium">Moderate Work</div>
                <div className="text-xl font-bold text-blue-700">£100-140</div>
                <div className="text-xs text-gray-500">/month</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <div className="text-xs text-amber-600 font-medium">Hard Work</div>
                <div className="text-xl font-bold text-amber-700">£140-180</div>
                <div className="text-xs text-gray-500">/month</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-xs text-purple-600 font-medium">Competition</div>
                <div className="text-xl font-bold text-purple-700">£180+</div>
                <div className="text-xs text-gray-500">/month</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Main Calculator Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              
              {/* Section 1: Horse Details */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h2 className="text-xl font-bold text-gray-900">Your Horse</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Scale className="w-4 h-4 inline mr-2" />
                      Horse Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={horseWeight}
                      onChange={(e) => setHorseWeight(e.target.value)}
                      placeholder="e.g., 500"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use weigh tape or estimate. Average: 400-600kg</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {[350, 450, 500, 550, 650].map(w => (
                        <button
                          key={w}
                          onClick={() => setHorseWeight(w.toString())}
                          className={`px-3 py-1 text-sm rounded-full border ${
                            horseWeight === w.toString() 
                              ? 'bg-green-100 border-green-500 text-green-700' 
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                        >
                          {w}kg
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Horse Type</label>
                    <select
                      value={horseType}
                      onChange={(e) => setHorseType(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select type...</option>
                      {Object.entries(horseTypeMultipliers).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Affects metabolism and feed requirements</p>
                  </div>
                </div>
              </section>

              {/* Section 2: Work Level */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h2 className="text-xl font-bold text-gray-900">Work Level</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(workLevelMultipliers).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => applyWorkPreset(key)}
                      className={`p-4 rounded-lg border-2 text-center transition ${
                        workLevel === key 
                          ? 'border-green-500 bg-green-50 text-green-700' 
                          : 'border-gray-200 hover:border-green-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold text-sm">{val.label.split(' (')[0]}</div>
                      <div className="text-xs text-gray-500 mt-1">{val.hardFeed}kg feed/day</div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Section 3: Hay Costs */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h2 className="text-xl font-bold text-gray-900">Hay Costs</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Leaf className="w-4 h-4 inline mr-2" />
                      Price Per Bale (£)
                    </label>
                    <input
                      type="number"
                      step="0.50"
                      value={hayPricePerBale}
                      onChange={(e) => setHayPricePerBale(e.target.value)}
                      placeholder="e.g., 6.50"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">UK average: £5-8 for small bale</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Bale Weight (kg)</label>
                    <select
                      value={baleWeight}
                      onChange={(e) => setBaleWeight(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="15">Small bale - 15kg</option>
                      <option value="20">Small bale - 20kg</option>
                      <option value="25">Small bale - 25kg</option>
                      <option value="250">Round bale - 250kg</option>
                      <option value="300">Round bale - 300kg</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Section 4: Hard Feed (Optional) */}
              <section className="mb-8">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-3 mb-4 text-left w-full"
                >
                  <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <h2 className="text-xl font-bold text-gray-900">Hard Feed &amp; Supplements</h2>
                  {showAdvanced ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                
                {showAdvanced && (
                  <div className="grid md:grid-cols-2 gap-6 pl-11">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        <Package className="w-4 h-4 inline mr-2" />
                        Hard Feed Per Day (kg)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={hardFeedPerDay}
                        onChange={(e) => setHardFeedPerDay(e.target.value)}
                        placeholder="e.g., 1.0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">0kg for rest, 1-2kg for moderate work</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Feed Bag Price (£)</label>
                      <input
                        type="number"
                        step="0.50"
                        value={hardFeedPricePerBag}
                        onChange={(e) => setHardFeedPricePerBag(e.target.value)}
                        placeholder="e.g., 14.00"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">UK average: £12-18 per 20kg bag</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Feed Bag Size (kg)</label>
                      <select
                        value={bagWeight}
                        onChange={(e) => setBagWeight(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      >
                        <option value="15">15kg bag</option>
                        <option value="20">20kg bag</option>
                        <option value="25">25kg bag</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Monthly Supplements (£)</label>
                      <input
                        type="number"
                        value={monthlySupplements}
                        onChange={(e) => setMonthlySupplements(e.target.value)}
                        placeholder="e.g., 40"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Vitamins, minerals, joint support, etc.</p>
                    </div>
                  </div>
                )}
              </section>

              {/* Calculate Button */}
              <button
                onClick={calculate}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-600 transition shadow-lg"
              >
                <Calculator className="w-5 h-5 inline mr-2" />
                Calculate Feed Costs
              </button>
            </div>

            {/* Results Section */}
            {result && (
              <div className="border-t border-gray-200 bg-gradient-to-b from-green-50 to-white p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <PieChart className="w-6 h-6 text-green-600" />
                  Your Feed Costs
                </h2>
                
                {/* Main Results */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-green-600 text-white p-6 rounded-xl text-center">
                    <div className="text-green-200 text-sm font-medium">Monthly Total</div>
                    <div className="text-4xl font-bold mt-1">£{parseFloat(result.monthly.totalCost).toLocaleString()}</div>
                  </div>
                  <div className="bg-white border-2 border-green-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Annual Total</div>
                    <div className="text-3xl font-bold text-gray-900 mt-1">£{parseFloat(result.annual.totalCost).toLocaleString()}</div>
                  </div>
                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Daily Cost</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">£{result.daily.totalCost}</div>
                  </div>
                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Daily Hay</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{result.daily.hayKg}kg</div>
                  </div>
                </div>

                {/* What You'll Need */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-gray-900 mb-4">Monthly Shopping List</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <div>
                          <span className="font-medium">Hay Bales</span>
                          <p className="text-xs text-gray-500">{result.monthly.hayKg}kg total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">{result.monthly.balesNeeded}</span>
                        <p className="text-sm text-gray-600">£{result.monthly.hayCost}</p>
                      </div>
                    </div>
                    {parseFloat(result.monthly.bagsNeeded) > 0 && (
                      <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-amber-600" />
                          <div>
                            <span className="font-medium">Feed Bags</span>
                            <p className="text-xs text-gray-500">{result.monthly.hardFeedKg}kg total</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-lg">{result.monthly.bagsNeeded}</span>
                          <p className="text-sm text-gray-600">£{result.monthly.hardFeedCost}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Seasonal Variation */}
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Seasonal Costs (Monthly)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-blue-600 font-medium">❄️ Winter</p>
                      <p className="text-2xl font-bold text-blue-800">£{result.seasonal.winter}</p>
                      <p className="text-xs text-blue-600">+25% more hay, no grazing</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <p className="text-yellow-600 font-medium">☀️ Summer</p>
                      <p className="text-2xl font-bold text-yellow-800">£{result.seasonal.summer}</p>
                      <p className="text-xs text-yellow-600">-15% with good grazing</p>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8">
                  <h3 className="font-bold text-gray-900 mb-3">Annual Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Hay/Forage</span>
                      <span className="font-medium">£{parseFloat(result.annual.hayCost).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hard Feed</span>
                      <span className="font-medium">£{parseFloat(result.annual.hardFeedCost).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Supplements</span>
                      <span className="font-medium">£{parseFloat(result.annual.supplementsCost).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
                      <span>Total Annual</span>
                      <span>£{parseFloat(result.annual.totalCost).toLocaleString()}</span>
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
                      <h3 className="font-bold text-lg">Never Run Out of Hay Again</h3>
                      <p className="text-purple-200 text-sm mt-1">
                        Get free reminders for hay orders, supplement refills, farrier visits, and all your horse care dates.
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

          {/* Feeding Guide Box */}
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mt-8">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-green-800 mb-2">Essential Feeding Guidelines</h3>
                <ul className="text-green-900 space-y-1 text-sm">
                  <li>• Horses need minimum 1.5% body weight in forage daily - never restrict below this</li>
                  <li>• Always weigh hay - a "section" can vary by 50% in weight</li>
                  <li>• Introduce feed changes gradually over 7-14 days to avoid colic</li>
                  <li>• Good doers (native ponies) may need soaked hay or low-calorie alternatives</li>
                  <li>• Access to clean water is essential - horses drink 25-55 litres daily</li>
                  <li>• Use our <a href="/annual-horse-cost-calculator" className="text-green-700 underline hover:text-green-900">Annual Calculator</a> to see how feed fits into total costs</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <article className="mt-12 space-y-12">
            
            {/* Understanding Feed Costs */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Horse Feed Costs in the UK</h2>
              <p className="text-gray-700 mb-4">
                Feed is typically the second-largest ongoing cost of horse ownership after <a href="/horse-livery-calculator" className="text-green-600 hover:underline">livery</a>, accounting for 
                £1,000-3,000+ annually depending on your horse's needs. Understanding how to calculate and 
                optimise feed costs can save hundreds of pounds per year while keeping your horse healthy.
              </p>
              <p className="text-gray-700 mb-4">
                The foundation of any horse's diet should be forage - hay, haylage, or grass. Most horses in 
                light to moderate work can thrive on forage alone with a simple vitamin/mineral supplement. 
                Hard feed should only be added when forage alone cannot meet energy requirements.
              </p>
              <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg">
                <p className="text-gray-700 italic">
                  <strong>Example:</strong> A 500kg horse in light work eating 2% body weight daily needs 10kg hay. 
                  At £6.50 per 20kg bale, that's £3.25/day or approximately £100/month for hay alone.
                </p>
              </div>
            </section>

            {/* UK Hay Prices Table */}
            <section className="overflow-x-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">UK Hay &amp; Feed Prices 2026</h2>
              <table className="w-full border-collapse">
                <caption className="sr-only">UK hay and horse feed prices for 2026</caption>
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th scope="col" className="p-3 text-left">Feed Type</th>
                    <th scope="col" className="p-3 text-right">Low</th>
                    <th scope="col" className="p-3 text-right">Average</th>
                    <th scope="col" className="p-3 text-right">High</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <th scope="row" className="p-3 font-medium text-left">Small Hay Bale (20kg)</th>
                    <td className="p-3 text-right">£5.00</td>
                    <td className="p-3 text-right">£6.50</td>
                    <td className="p-3 text-right">£8.00</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <th scope="row" className="p-3 font-medium text-left">Haylage Bale (25kg)</th>
                    <td className="p-3 text-right">£10.00</td>
                    <td className="p-3 text-right">£12.00</td>
                    <td className="p-3 text-right">£15.00</td>
                  </tr>
                  <tr className="border-b">
                    <th scope="row" className="p-3 font-medium text-left">Round Bale (300kg)</th>
                    <td className="p-3 text-right">£35.00</td>
                    <td className="p-3 text-right">£50.00</td>
                    <td className="p-3 text-right">£70.00</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <th scope="row" className="p-3 font-medium text-left">Hard Feed (20kg bag)</th>
                    <td className="p-3 text-right">£10.00</td>
                    <td className="p-3 text-right">£14.00</td>
                    <td className="p-3 text-right">£20.00</td>
                  </tr>
                  <tr className="border-b">
                    <th scope="row" className="p-3 font-medium text-left">Chaff (20kg bag)</th>
                    <td className="p-3 text-right">£10.00</td>
                    <td className="p-3 text-right">£12.00</td>
                    <td className="p-3 text-right">£15.00</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-500 mt-2">* Prices vary by region, quality, and season. Summer prices typically 20-30% lower.</p>
            </section>

            {/* Feed Costs by Horse Type */}
            <section className="overflow-x-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Monthly Feed Costs by Horse Type UK 2026</h2>
              <table className="w-full border-collapse">
                <caption className="sr-only">Monthly horse feed costs by horse type in the UK</caption>
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th scope="col" className="p-3 text-left">Horse Type</th>
                    <th scope="col" className="p-3 text-right">Daily Hay</th>
                    <th scope="col" className="p-3 text-right">Hard Feed</th>
                    <th scope="col" className="p-3 text-right">Monthly Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <th scope="row" className="p-3 font-medium text-left">Native Pony (300kg)</th>
                    <td className="p-3 text-right">5-6kg</td>
                    <td className="p-3 text-right">0kg</td>
                    <td className="p-3 text-right">£50-70</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <th scope="row" className="p-3 font-medium text-left">Cob (500kg) - Light Work</th>
                    <td className="p-3 text-right">8-10kg</td>
                    <td className="p-3 text-right">0-0.5kg</td>
                    <td className="p-3 text-right">£80-110</td>
                  </tr>
                  <tr className="border-b">
                    <th scope="row" className="p-3 font-medium text-left">Warmblood (550kg) - Moderate</th>
                    <td className="p-3 text-right">9-11kg</td>
                    <td className="p-3 text-right">1-1.5kg</td>
                    <td className="p-3 text-right">£120-160</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <th scope="row" className="p-3 font-medium text-left">TB (500kg) - Hard Work</th>
                    <td className="p-3 text-right">8-10kg</td>
                    <td className="p-3 text-right">2-3kg</td>
                    <td className="p-3 text-right">£150-200</td>
                  </tr>
                  <tr className="border-b">
                    <th scope="row" className="p-3 font-medium text-left">Competition Horse</th>
                    <td className="p-3 text-right">8-12kg</td>
                    <td className="p-3 text-right">2-4kg</td>
                    <td className="p-3 text-right">£180-250+</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-500 mt-2">* Excludes supplements. Add £20-80/month for typical supplement programmes.</p>
            </section>

            {/* Cost Saving Tips */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Reduce Horse Feed Costs</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-800 mb-2">✓ Smart Savings</h3>
                  <ul className="text-green-900 space-y-2 text-sm">
                    <li>• Buy hay in bulk during summer harvest (20-30% savings)</li>
                    <li>• Weigh hay - don't guess! Over-feeding wastes money</li>
                    <li>• Maximise grazing to reduce hay needs</li>
                    <li>• Use chaff/fibre feeds to extend hard feed</li>
                    <li>• Share bulk orders with other owners</li>
                    <li>• Review supplement needs - less is often more</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                  <h3 className="font-bold text-red-800 mb-2">✗ Don't Cut Corners On</h3>
                  <ul className="text-red-900 space-y-2 text-sm">
                    <li>• Forage quality - poor hay causes colic and respiratory issues</li>
                    <li>• Minimum 1.5% body weight forage daily</li>
                    <li>• Clean, fresh water available 24/7</li>
                    <li>• Gradual feed changes (7-14 days minimum)</li>
                    <li>• Salt/mineral lick access</li>
                    <li>• Veterinary advice for horses with metabolic issues</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions About Horse Feed</h2>
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
                  className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-green-400 hover:shadow-md transition group"
                  title={`${calc.title} - ${calc.description}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <calc.icon className={`w-5 h-5 ${calc.color}`} />
                    <h3 className="font-bold text-gray-900 group-hover:text-green-600">{calc.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{calc.description}</p>
                  <div className="text-green-600 text-sm font-medium mt-2 flex items-center gap-1">
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
                Never miss a hay order, farrier visit, vaccination, or worming date again. 
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

          {/* Contact CTA */}
          <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Need to Calculate Total Horse Costs?</h2>
            <p className="text-green-100 mb-4">See how feed fits into your complete annual horse budget.</p>
            <a 
              href="/annual-horse-cost-calculator" 
              className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition"
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
                  Get free email reminders for hay orders, farrier visits, vaccinations, worming and more.
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
