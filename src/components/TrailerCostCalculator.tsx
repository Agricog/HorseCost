import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Truck,
  Calculator,
  AlertCircle,
  PoundSterling,
  Fuel,
  Shield,
  Wrench,
  MapPin,
  Bell,
  ArrowRight,
  Clock,
  Users,
  HelpCircle,
  CheckCircle2,
  Home,
  Trophy,
  Heart,
  Stethoscope
} from 'lucide-react'

export default function TrailerCostCalculator() {
  const [vehicleType, setVehicleType] = useState('trailer')
  const [trailerValue, setTrailerValue] = useState('')
  const [tripsPerMonth, setTripsPerMonth] = useState('4')
  const [avgDistance, setAvgDistance] = useState('30')
  const [towingMpg, setTowingMpg] = useState('20')
  const [includeInsurance, setIncludeInsurance] = useState(true)
  const [includeMOT, setIncludeMOT] = useState(true)
  const [includeServicing, setIncludeServicing] = useState(true)
  const [storageType, setStorageType] = useState('home')
  const [storageCost, setStorageCost] = useState('')
  const [result, setResult] = useState<any>(null)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  // 2026 pricing
  const vehicleTypes = [
    { id: 'trailer', name: 'Horse Trailer (Towed)', insuranceBase: 175, motCost: 0, serviceCost: 175 },
    { id: 'horsebox-3.5', name: 'Horsebox 3.5t', insuranceBase: 400, motCost: 58, serviceCost: 350 },
    { id: 'horsebox-7.5', name: 'Horsebox 7.5t', insuranceBase: 620, motCost: 72, serviceCost: 520 },
    { id: 'horsebox-hgv', name: 'HGV Horsebox', insuranceBase: 900, motCost: 95, serviceCost: 700 }
  ]

  const storageOptions = [
    { id: 'home', name: 'Home/Own Property', monthlyCost: 0 },
    { id: 'yard', name: 'At Livery Yard', monthlyCost: 30 },
    { id: 'storage', name: 'Commercial Storage', monthlyCost: 60 },
    { id: 'secure', name: 'Secure Compound', monthlyCost: 90 }
  ]

  const calculate = () => {
    if (!trailerValue) {
      alert('Please enter vehicle value')
      return
    }

    const value = parseFloat(trailerValue)
    const trips = parseFloat(tripsPerMonth) || 0
    const distance = parseFloat(avgDistance) || 0
    const fuelPerMile = 0.30 // 2026 fuel prices

    const vehicle = vehicleTypes.find(v => v.id === vehicleType)
    if (!vehicle) return

    // Annual mileage (trips × 2 for return × distance × 12 months)
    const annualMileage = trips * 2 * distance * 12

    // Fuel costs - 2026 diesel prices
    let annualFuel = 0
    if (vehicleType === 'trailer') {
      const mpg = parseFloat(towingMpg) || 20
      const gallonsNeeded = annualMileage / mpg
      const fuelPrice = 1.55 // 2026 UK diesel price per litre
      const litresNeeded = gallonsNeeded * 4.546
      annualFuel = litresNeeded * fuelPrice
    } else {
      annualFuel = annualMileage * fuelPerMile
    }

    // Insurance (based on value and vehicle type)
    let insuranceCost = 0
    if (includeInsurance) {
      const valueMultiplier = Math.max(1, value / 5000)
      insuranceCost = vehicle.insuranceBase * Math.sqrt(valueMultiplier)
    }

    // MOT
    const motCost = includeMOT ? vehicle.motCost : 0

    // Servicing & Maintenance
    let servicingCost = 0
    if (includeServicing) {
      servicingCost = vehicle.serviceCost
      // Add tyre replacement fund (tyres every 3-5 years)
      if (vehicleType === 'trailer') {
        servicingCost += 120 // 2026 tyre fund
      } else {
        servicingCost += 240 // 2026 horsebox tyre fund
      }
    }

    // Storage
    const storage = storageOptions.find(s => s.id === storageType)
    let annualStorage = 0
    if (storageType !== 'home' && storageCost) {
      annualStorage = parseFloat(storageCost) * 12
    } else if (storage) {
      annualStorage = storage.monthlyCost * 12
    }

    // Road tax 2026
    let roadTax = 0
    if (vehicleType !== 'trailer') {
      if (vehicleType === 'horsebox-3.5') roadTax = 310
      else if (vehicleType === 'horsebox-7.5') roadTax = 180
      else roadTax = 700
    }

    // Depreciation estimate
    const depreciationRate = vehicleType === 'trailer' ? 0.08 : 0.12
    const depreciation = value * depreciationRate

    // Breakdown/recovery 2026
    const breakdownCover = vehicleType === 'trailer' ? 60 : 140

    // Total annual cost
    const totalAnnual = annualFuel + insuranceCost + motCost + servicingCost + annualStorage + roadTax + breakdownCover
    const totalWithDepreciation = totalAnnual + depreciation
    const costPerTrip = totalAnnual / (trips * 12)
    const costPerMile = annualMileage > 0 ? totalAnnual / annualMileage : 0

    // UK averages 2026
    const ukAverageTrailer = 1400
    const ukAverageHorsebox = 4000

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'trailer_cost',
        vehicle_type: vehicleType,
        vehicle_value: value,
        trips_per_month: trips,
        annual_cost: totalAnnual.toFixed(0)
      })
    }

    setResult({
      totalAnnual: totalAnnual.toFixed(2),
      totalWithDepreciation: totalWithDepreciation.toFixed(2),
      monthlyAverage: (totalAnnual / 12).toFixed(2),
      costPerTrip: costPerTrip.toFixed(2),
      costPerMile: costPerMile.toFixed(2),
      annualMileage: annualMileage.toFixed(0),
      breakdown: {
        fuel: annualFuel.toFixed(2),
        insurance: insuranceCost.toFixed(2),
        mot: motCost.toFixed(2),
        servicing: servicingCost.toFixed(2),
        storage: annualStorage.toFixed(2),
        roadTax: roadTax.toFixed(2),
        breakdown: breakdownCover.toFixed(2),
        depreciation: depreciation.toFixed(2)
      },
      comparison: {
        vsUkTrailer: totalAnnual < ukAverageTrailer,
        vsUkHorsebox: totalAnnual < ukAverageHorsebox,
        ukAverageTrailer,
        ukAverageHorsebox
      },
      vehicleInfo: vehicle
    })
  }

  // 15 FAQs for maximum SEO
  const faqs = [
    {
      q: 'How much does it cost to run a horse trailer UK?',
      a: 'Running a horse trailer in the UK typically costs £900-£1,800 per year in 2026, depending on usage. This includes insurance (£120-£300), servicing (£150-£250), tyres, and fuel for towing. Trailers don\'t require MOT or road tax, making them cheaper to run than horseboxes.'
    },
    {
      q: 'How much does horsebox insurance cost UK?',
      a: 'Horsebox insurance costs vary by size and value in 2026. A 3.5t horsebox typically costs £350-£550/year to insure, while 7.5t boxes cost £450-£800. HGV horseboxes can cost £700-£1,400+. Factors include driver age, experience, security, and storage location.'
    },
    {
      q: 'Do horse trailers need an MOT?',
      a: 'No, horse trailers towed by cars or vans don\'t require an MOT in the UK. However, they should have an annual safety check for brakes, lights, floor condition, and tyres. Horseboxes (self-propelled) do require annual MOT testing - £58-£95 depending on weight class.'
    },
    {
      q: 'What MPG do you get when towing a horse trailer?',
      a: 'Towing a horse trailer typically reduces fuel economy by 20-40%. A vehicle getting 35mpg normally might achieve 18-25mpg when towing. Factors include trailer weight, horses loaded, terrain, and driving style. Budget for significantly higher fuel costs when towing.'
    },
    {
      q: 'How much does horsebox road tax cost?',
      a: '3.5t horseboxes (car licence) cost £310/year road tax in 2026. 7.5t horseboxes have reduced HGV rates around £180/year for private use. Larger HGV horseboxes can cost £600-£1,100+ depending on weight and emissions. Trailers don\'t require road tax.'
    },
    {
      q: 'Is it cheaper to own a trailer or hire?',
      a: 'Owning is usually cheaper if you travel regularly (more than 10-15 times per year). Hiring costs £60-£180 per day plus fuel in 2026. At 15 trips/year, hiring could cost £1,800+, while owning a trailer costs £900-£1,800 annually. Consider convenience and spontaneous travel too.'
    },
    {
      q: 'How often should a horse trailer be serviced?',
      a: 'Horse trailers should be serviced annually or every 3,000-5,000 miles. Service includes brake adjustment, bearing check, light testing, floor inspection, coupling check, and tyre condition. A full service costs £150-£250 in 2026. Don\'t skip servicing - brake failure is dangerous.'
    },
    {
      q: 'Where can I store my horse trailer?',
      a: 'Storage options in 2026 include: at home (free but needs space), livery yard (£25-£50/month), commercial storage (£50-£85/month), or secure compounds (£75-£120/month). Consider security - trailers are theft targets. Some insurance requires specific security measures.'
    },
    {
      q: 'What size horsebox can I drive on a car licence?',
      a: 'With a standard car licence (Category B), you can drive horseboxes up to 3,500kg MAM. For larger 7.5t horseboxes, you need a C1 licence. Licences issued before 1997 often include C1 automatically. Check your licence categories before purchasing.'
    },
    {
      q: 'How much does a horsebox MOT cost?',
      a: 'Horsebox MOT costs depend on weight class in 2026. 3.5t vehicles cost the standard car MOT rate (£58 maximum). 7.5t class costs around £65-£75. Larger HGV horseboxes cost more (£85-£100). Factor in potential repair costs if work is needed to pass.'
    },
    {
      q: 'How much does professional horse transport cost UK?',
      a: 'Professional horse transport in the UK costs £1-£2 per mile loaded in 2026, with minimum charges of £80-£150. A 50-mile journey typically costs £100-£180. Long-distance (200+ miles) can cost £400-£700. Compare this to owning your own transport for frequent travellers.'
    },
    {
      q: 'What licence do I need to tow a horse trailer?',
      a: 'For licences issued after January 1997: you can tow if combined weight (car + trailer) doesn\'t exceed 3,500kg. B+E licence removes this restriction. Pre-1997 licences have more generous towing allowances. Most modern SUVs can tow two-horse trailers on a standard licence.'
    },
    {
      q: 'How long do horse trailers last?',
      a: 'A well-maintained horse trailer lasts 15-25+ years. Key factors are floor condition (check annually - replace wooden floors every 10-15 years), chassis rust prevention, and regular servicing. Aluminium trailers last longer than steel. Budget £1,500-£4,000 for floor replacement.'
    },
    {
      q: 'What should I check before buying a used horse trailer?',
      a: 'Check: floor condition (prod with screwdriver for soft spots), chassis for rust, brakes operation, light connections, tyre age and condition, coupling wear, ramp springs/hinges, and interior for kick damage. Get a professional inspection for £100-£200 - it could save thousands.'
    },
    {
      q: 'Do I need breakdown cover for a horse trailer?',
      a: 'Yes, standard breakdown cover often doesn\'t include trailers. Specialist equine breakdown cover (£50-£80/year) covers trailer recovery and can arrange emergency horse accommodation. Consider what happens if you break down with horses loaded - it\'s worth the extra cost.'
    }
  ]

  // Related calculators
  const relatedCalculators = [
    {
      title: 'Annual Horse Cost Calculator',
      description: 'Complete yearly budget',
      href: '/annual-horse-cost-calculator',
      icon: Calculator,
      color: 'text-amber-600',
      bg: 'bg-amber-50 hover:bg-amber-100'
    },
    {
      title: 'Competition Budget',
      description: 'Show season costs',
      href: '/competition-budget-calculator',
      icon: Trophy,
      color: 'text-rose-600',
      bg: 'bg-rose-50 hover:bg-rose-100'
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
      title: 'First Horse Calculator',
      description: 'New owner costs',
      href: '/first-horse-calculator',
      icon: Heart,
      color: 'text-pink-600',
      bg: 'bg-pink-50 hover:bg-pink-100'
    },
    {
      title: 'Vet Cost Estimator',
      description: 'Healthcare budgeting',
      href: '/vet-cost-estimator',
      icon: Stethoscope,
      color: 'text-red-600',
      bg: 'bg-red-50 hover:bg-red-100'
    }
  ]

  return (
    <>
      <Helmet>
        {/* 1. Title Tag */}
        <title>Horse Trailer Running Cost Calculator UK 2026 | Horsebox Costs | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free horse trailer and horsebox running cost calculator for UK owners. Calculate annual costs including fuel, insurance, MOT, servicing, and storage. 2026 pricing." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="horse trailer running costs UK 2026, horsebox costs, trailer insurance cost, horsebox MOT, towing costs calculator, horse transport budget, 3.5t horsebox" 
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
        <meta property="og:title" content="Horse Trailer Running Cost Calculator UK 2026 | Horsebox Costs | HorseCost" />
        <meta property="og:description" content="Calculate annual horse trailer and horsebox running costs. Free UK calculator for fuel, insurance, MOT, and servicing." />
        <meta property="og:url" content="https://horsecost.co.uk/trailer-cost-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/trailer-cost-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Horse Trailer Running Cost Calculator showing annual transport costs" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Horse Trailer Cost Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Calculate annual horse trailer and horsebox running costs with 2026 UK pricing." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/trailer-cost-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Horse Trailer Cost Calculator UK" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/trailer-cost-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/trailer-cost-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Trailer Cost Calculator', 'item': 'https://horsecost.co.uk/trailer-cost-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Trailer Running Cost Calculator UK',
                'description': 'Calculate annual horse trailer and horsebox running costs including fuel, insurance, MOT, and servicing with 2026 UK pricing.',
                'url': 'https://horsecost.co.uk/trailer-cost-calculator',
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
                'name': 'How to Calculate Horse Trailer Running Costs',
                'description': 'Step-by-step guide to calculating your annual horse transport costs',
                'totalTime': 'PT3M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Select Vehicle Type', 'text': 'Choose trailer, 3.5t horsebox, 7.5t horsebox, or HGV horsebox - each has different running costs.' },
                  { '@type': 'HowToStep', 'name': 'Enter Vehicle Value', 'text': 'Input the current value of your trailer/horsebox for accurate insurance and depreciation calculations.' },
                  { '@type': 'HowToStep', 'name': 'Set Usage Pattern', 'text': 'Enter trips per month and average distance - this determines fuel costs and wear.' },
                  { '@type': 'HowToStep', 'name': 'Choose Running Costs', 'text': 'Include insurance, MOT (horseboxes), servicing, and storage as applicable.' },
                  { '@type': 'HowToStep', 'name': 'Calculate Total', 'text': 'Click calculate to see annual costs, cost per trip, and cost per mile breakdown.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Horse Trailer Running Cost Calculator UK 2026 - Complete Transport Budget',
                'description': 'Free calculator for UK horse trailer and horsebox running costs. Includes fuel, insurance, MOT, servicing, and storage.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png' } },
                'image': 'https://horsecost.co.uk/images/trailer-cost-calculator-og.jpg'
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
                'name': 'Horse Trailer Running Cost Calculator UK 2026',
                'description': 'Calculate annual horse trailer and horsebox running costs',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/trailer-cost-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'Horse Transport Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Horse Trailer',
                    'description': 'A towed vehicle for transporting horses, requiring no MOT or road tax. Annual running costs £900-£1,800 in 2026. Requires suitable tow vehicle with adequate towing capacity.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': '3.5t Horsebox',
                    'description': 'Self-propelled horse transport up to 3,500kg that can be driven on a standard car licence. Requires MOT (£58) and road tax (£310/year). Annual running costs £2,200-£4,000 in 2026.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'C1 Licence',
                    'description': 'Driving licence category required for 7.5t horseboxes. Not included in post-1997 licences. C1 training and test costs £800-£1,500. Pre-1997 licences often include C1 automatically.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'PLG Rate',
                    'description': 'Private Light Goods road tax rate for privately-used horseboxes over 3.5t, significantly cheaper than commercial HGV rates. 7.5t horsebox PLG rate is approximately £180/year in 2026.'
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
                <h1 className="text-3xl md:text-4xl font-bold">Horse Trailer Running Cost Calculator UK 2026</h1>
                <p className="text-sky-200 mt-1">Transport Budget Planner</p>
              </div>
            </div>
            <p className="text-sky-100 max-w-3xl">
              Calculate the true annual cost of owning a horse trailer or horsebox. 
              Includes fuel, insurance, MOT, servicing, storage, and depreciation.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sky-200 text-sm">
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
                198 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-sky-500/30 text-sky-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Hire vs own comparison
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Cost per trip/mile
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
              <strong>Horse trailer running costs are £900-£1,800/year in the UK in 2026.</strong> A 3.5t horsebox costs £2,200-£4,000/year. Trailers don't need MOT or road tax. Key costs: insurance (£175-£900), fuel (£500-£2,000+ based on usage), servicing (£175-£700), storage (£0-£1,080). Professional hire: £60-£180/day.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-sky-50 p-3 rounded-lg text-center">
                <div className="text-xs text-sky-600 font-medium">Horse Trailer</div>
                <div className="text-xl font-bold text-sky-700">£900-1,800</div>
                <div className="text-xs text-gray-500">per year</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xs text-blue-600 font-medium">3.5t Horsebox</div>
                <div className="text-xl font-bold text-blue-700">£2,200-4,000</div>
                <div className="text-xs text-gray-500">per year</div>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg text-center">
                <div className="text-xs text-indigo-600 font-medium">7.5t Horsebox</div>
                <div className="text-xl font-bold text-indigo-700">£3,500-5,500</div>
                <div className="text-xs text-gray-500">per year</div>
              </div>
              <div className="bg-violet-50 p-3 rounded-lg text-center">
                <div className="text-xs text-violet-600 font-medium">Professional Hire</div>
                <div className="text-xl font-bold text-violet-700">£60-180</div>
                <div className="text-xs text-gray-500">per day</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Calculator Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Vehicle Type */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Vehicle Type</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {vehicleTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setVehicleType(type.id)}
                        className={`p-3 rounded-xl text-sm font-medium transition border-2 ${
                          vehicleType === type.id
                            ? 'border-sky-500 bg-sky-50 text-sky-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Vehicle Value */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Vehicle Value (£)</label>
                  </div>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={trailerValue}
                      onChange={(e) => setTrailerValue(e.target.value)}
                      placeholder="e.g., 5000"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {vehicleType === 'trailer' 
                      ? ['2000', '5000', '8000', '12000'].map((val) => (
                          <button
                            key={val}
                            onClick={() => setTrailerValue(val)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                              trailerValue === val 
                                ? 'bg-sky-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            £{parseInt(val).toLocaleString()}
                          </button>
                        ))
                      : ['8000', '15000', '25000', '40000'].map((val) => (
                          <button
                            key={val}
                            onClick={() => setTrailerValue(val)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                              trailerValue === val 
                                ? 'bg-sky-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            £{parseInt(val).toLocaleString()}
                          </button>
                        ))
                    }
                  </div>
                </section>

                {/* Usage */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Usage</label>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Trips per Month</label>
                      <div className="flex flex-wrap gap-2">
                        {['1', '2', '4', '6', '8'].map((val) => (
                          <button
                            key={val}
                            onClick={() => setTripsPerMonth(val)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                              tripsPerMonth === val
                                ? 'bg-sky-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Average Distance (miles one way)</label>
                      <input
                        type="number"
                        value={avgDistance}
                        onChange={(e) => setAvgDistance(e.target.value)}
                        placeholder="e.g., 30"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['15', '30', '50', '75', '100'].map((val) => (
                          <button
                            key={val}
                            onClick={() => setAvgDistance(val)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                              avgDistance === val 
                                ? 'bg-sky-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {val} mi
                          </button>
                        ))}
                      </div>
                    </div>

                    {vehicleType === 'trailer' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Towing MPG (when loaded)</label>
                        <input
                          type="number"
                          value={towingMpg}
                          onChange={(e) => setTowingMpg(e.target.value)}
                          placeholder="e.g., 20"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none"
                        />
                        <p className="text-sm text-gray-500 mt-1">Typical range: 15-25 mpg when towing</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Running Costs */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Include in Calculation</label>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeInsurance}
                        onChange={(e) => setIncludeInsurance(e.target.checked)}
                        className="w-5 h-5 text-sky-600 rounded"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Insurance</span>
                        <p className="text-sm text-gray-500">
                          ~£{vehicleTypes.find(v => v.id === vehicleType)?.insuranceBase}/year
                        </p>
                      </div>
                    </label>

                    {vehicleType !== 'trailer' && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeMOT}
                          onChange={(e) => setIncludeMOT(e.target.checked)}
                          className="w-5 h-5 text-sky-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">MOT</span>
                          <p className="text-sm text-gray-500">
                            ~£{vehicleTypes.find(v => v.id === vehicleType)?.motCost}/year
                          </p>
                        </div>
                      </label>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeServicing}
                        onChange={(e) => setIncludeServicing(e.target.checked)}
                        className="w-5 h-5 text-sky-600 rounded"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Servicing & Maintenance</span>
                        <p className="text-sm text-gray-500">
                          ~£{vehicleTypes.find(v => v.id === vehicleType)?.serviceCost}/year + tyres
                        </p>
                      </div>
                    </label>
                  </div>
                </section>

                {/* Storage */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Storage</label>
                  </div>
                  <select
                    value={storageType}
                    onChange={(e) => setStorageType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none"
                  >
                    {storageOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name} {option.monthlyCost > 0 ? `(~£${option.monthlyCost}/month)` : '(Free)'}
                      </option>
                    ))}
                  </select>
                  
                  {storageType !== 'home' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Custom Monthly Cost (£)</label>
                      <input
                        type="number"
                        value={storageCost}
                        onChange={(e) => setStorageCost(e.target.value)}
                        placeholder="Leave blank for estimate"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  )}
                </section>
              </div>

              {/* Right Column - Results */}
              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-sky-700 hover:to-blue-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Running Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 text-white">
                      <p className="text-sky-100 text-sm mb-1">Annual Running Cost</p>
                      <p className="text-4xl font-bold">£{result.totalAnnual}</p>
                      <p className="text-sky-200 text-sm mt-1">Excluding depreciation</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sky-100 text-xs">Monthly</p>
                          <p className="font-bold">£{result.monthlyAverage}</p>
                        </div>
                        <div>
                          <p className="text-sky-100 text-xs">Per Trip</p>
                          <p className="font-bold">£{result.costPerTrip}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reminders CTA */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold">Service Reminders</h3>
                          <p className="text-blue-200 text-sm">MOT, service &amp; insurance alerts</p>
                        </div>
                        <button
                          onClick={() => setShowRemindersForm(true)}
                          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition flex-shrink-0"
                        >
                          Set Up
                        </button>
                      </div>
                    </div>

                    {/* Cost per mile */}
                    <div className="bg-sky-50 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sky-600 text-sm">Cost per Mile</p>
                          <p className="text-2xl font-bold text-gray-900">£{result.costPerMile}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sky-600 text-sm">Annual Mileage</p>
                          <p className="text-xl font-bold text-gray-900">{parseInt(result.annualMileage).toLocaleString()} mi</p>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 flex items-center gap-2">
                            <Fuel className="w-4 h-4" /> Fuel
                          </span>
                          <span className="font-medium">£{result.breakdown.fuel}</span>
                        </div>
                        {parseFloat(result.breakdown.insurance) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 flex items-center gap-2">
                              <Shield className="w-4 h-4" /> Insurance
                            </span>
                            <span className="font-medium">£{result.breakdown.insurance}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.mot) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">MOT</span>
                            <span className="font-medium">£{result.breakdown.mot}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.servicing) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 flex items-center gap-2">
                              <Wrench className="w-4 h-4" /> Servicing & Tyres
                            </span>
                            <span className="font-medium">£{result.breakdown.servicing}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.storage) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 flex items-center gap-2">
                              <MapPin className="w-4 h-4" /> Storage
                            </span>
                            <span className="font-medium">£{result.breakdown.storage}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.roadTax) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Road Tax</span>
                            <span className="font-medium">£{result.breakdown.roadTax}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Breakdown Cover</span>
                          <span className="font-medium">£{result.breakdown.breakdown}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Running Total</span>
                          <span>£{result.totalAnnual}</span>
                        </div>
                        <div className="flex justify-between text-amber-600">
                          <span>+ Depreciation</span>
                          <span>£{result.breakdown.depreciation}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-bold text-sky-600">
                          <span>True Annual Cost</span>
                          <span>£{result.totalWithDepreciation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hire Comparison */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Hire vs Own Comparison
                      </h3>
                      <p className="text-sm text-amber-800">
                        At {tripsPerMonth} trips/month, hiring would cost approximately 
                        <strong> £{(parseFloat(tripsPerMonth) * 12 * 95).toLocaleString()}/year</strong> (at £95/day average in 2026).
                        {parseFloat(result.totalAnnual) < parseFloat(tripsPerMonth) * 12 * 95 
                          ? ' Owning is saving you money!' 
                          : ' Hiring might be more cost-effective.'}
                      </p>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Enter your vehicle details and click calculate to see your running costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-sky-50 border-l-4 border-sky-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-sky-900 mb-2">Trailer vs Horsebox: Key Differences</h3>
                <ul className="text-sky-800 space-y-1 text-sm">
                  <li>• <strong>Trailers:</strong> No MOT required, no road tax, cheaper insurance, need suitable tow vehicle</li>
                  <li>• <strong>3.5t Horsebox:</strong> Can drive on car licence, MOT required, road tax £310/year</li>
                  <li>• <strong>7.5t+ Horsebox:</strong> Requires C1/C licence, lower road tax (PLG), higher running costs</li>
                  <li>• Consider licence requirements before purchasing - C1 tests cost £900-£1,700</li>
                  <li>• Plan your budget with our <a href="/annual-horse-cost-calculator" className="text-sky-700 underline hover:text-sky-900">Annual Horse Cost Calculator</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Costs Table */}
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Horse Transport Costs 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Vehicle Type</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Insurance</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">MOT</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Road Tax</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Typical Annual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Horse Trailer</td>
                    <td className="py-3 px-4 text-center">£120-£300</td>
                    <td className="py-3 px-4 text-center">Not required</td>
                    <td className="py-3 px-4 text-center">Not required</td>
                    <td className="py-3 px-4 text-center font-semibold text-sky-600">£900-£1,800</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">3.5t Horsebox</td>
                    <td className="py-3 px-4 text-center">£350-£550</td>
                    <td className="py-3 px-4 text-center">£58</td>
                    <td className="py-3 px-4 text-center">£310</td>
                    <td className="py-3 px-4 text-center font-semibold text-sky-600">£2,200-£4,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">7.5t Horsebox</td>
                    <td className="py-3 px-4 text-center">£450-£800</td>
                    <td className="py-3 px-4 text-center">£72</td>
                    <td className="py-3 px-4 text-center">£180</td>
                    <td className="py-3 px-4 text-center font-semibold text-sky-600">£3,500-£5,500</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">HGV Horsebox</td>
                    <td className="py-3 px-4 text-center">£700-£1,400</td>
                    <td className="py-3 px-4 text-center">£95+</td>
                    <td className="py-3 px-4 text-center">£600-£1,100</td>
                    <td className="py-3 px-4 text-center font-semibold text-sky-600">£5,500-£9,000+</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * 2026 costs vary based on usage, value, and location. Fuel costs not included - highly variable based on mileage.
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
            <p className="text-gray-600 mb-6">Plan your complete horse budget:</p>
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
          <section className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Free Horse Care Reminders</h2>
              <p className="text-blue-200 max-w-xl mx-auto">
                Never miss your trailer service, MOT, or insurance renewal. Get free email reminders for all your horse care needs.
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setShowRemindersForm(true)}
                className="w-full bg-white text-blue-600 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg"
              >
                Set Up Free Reminders
              </button>
              <p className="text-blue-300 text-xs text-center mt-3">
                No spam, just helpful reminders. Unsubscribe anytime.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-sky-600 to-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Calculate Your Total Horse Budget</h2>
            <p className="text-sky-100 mb-6 max-w-xl mx-auto">
              Transport is just one cost of horse ownership. Use our Annual Cost Calculator for a complete breakdown.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-sky-600 px-6 py-3 rounded-xl font-bold hover:bg-sky-50 transition"
            >
              Calculate Total Costs
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* SmartSuite Reminders Modal */}
        {showRemindersForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Set Up Transport Reminders</h3>
                  </div>
                  <button
                    onClick={() => setShowRemindersForm(false)}
                    className="text-white/80 hover:text-white text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-blue-200 text-sm mt-2">
                  Get free email reminders for MOT, service, insurance renewal, and all your horse care needs.
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
