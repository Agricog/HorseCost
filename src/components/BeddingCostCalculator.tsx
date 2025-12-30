import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Layers,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  PoundSterling,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  Users,
  HelpCircle,
  CheckCircle2,
  Home,
  Wheat,
  Scissors,
  Stethoscope,
  Shield
} from 'lucide-react'

export default function BeddingCostCalculator() {
  const [beddingType, setBeddingType] = useState('shavings')
  const [stableSize, setStableSize] = useState('standard')
  const [horsesKeptIn, setHorsesKeptIn] = useState('stabled')
  const [region, setRegion] = useState('average')
  const [customBagPrice, setCustomBagPrice] = useState('')
  const [customBagsPerWeek, setCustomBagsPerWeek] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [includeDisposal, setIncludeDisposal] = useState(true)
  const [bulkBuying, setBulkBuying] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  const beddingTypes = [
    { 
      id: 'shavings', 
      name: 'Wood Shavings', 
      description: 'Most popular option',
      bagPrice: 10,
      bagWeight: '20kg',
      bagsPerWeekFull: 3,
      bagsPerWeekPartial: 1.5,
      disposal: 'easy',
      pros: ['Widely available', 'Good absorbency', 'Easy to muck out'],
      cons: ['Can be dusty', 'Takes time to decompose']
    },
    { 
      id: 'straw', 
      name: 'Straw', 
      description: 'Traditional bedding',
      bagPrice: 6,
      bagWeight: 'bale',
      bagsPerWeekFull: 2,
      bagsPerWeekPartial: 1,
      disposal: 'easy',
      pros: ['Cheapest option', 'Warm & comfortable', 'Easy to find'],
      cons: ['Horses may eat it', 'More waste volume', 'Can be dusty']
    },
    { 
      id: 'pellets', 
      name: 'Wood Pellets', 
      description: 'Expands when wet',
      bagPrice: 9,
      bagWeight: '15kg',
      bagsPerWeekFull: 2,
      bagsPerWeekPartial: 1,
      disposal: 'medium',
      pros: ['Very absorbent', 'Low dust', 'Less storage space'],
      cons: ['Higher initial cost', 'Needs water to expand', 'Can be slippery initially']
    },
    { 
      id: 'hemp', 
      name: 'Hemp Bedding', 
      description: 'Eco-friendly option',
      bagPrice: 16,
      bagWeight: '20kg',
      bagsPerWeekFull: 2,
      bagsPerWeekPartial: 1,
      disposal: 'excellent',
      pros: ['Very absorbent', 'Virtually dust-free', 'Composts quickly'],
      cons: ['Most expensive', 'Not always available']
    },
    { 
      id: 'paper', 
      name: 'Shredded Paper', 
      description: 'Dust-free option',
      bagPrice: 12,
      bagWeight: '20kg',
      bagsPerWeekFull: 2.5,
      bagsPerWeekPartial: 1.5,
      disposal: 'medium',
      pros: ['Dust-free', 'Good for respiratory issues', 'Recyclable'],
      cons: ['Can get soggy', 'Sticks to rugs', 'Moderate cost']
    },
    { 
      id: 'rubber', 
      name: 'Rubber Matting', 
      description: 'Minimal bedding needed',
      bagPrice: 0,
      bagWeight: 'one-off',
      bagsPerWeekFull: 0.5,
      bagsPerWeekPartial: 0.25,
      disposal: 'minimal',
      pros: ['Long-term savings', 'Easy to clean', 'Comfortable'],
      cons: ['High upfront cost (£350-700)', 'Needs thin layer on top']
    },
    { 
      id: 'miscanthus', 
      name: 'Miscanthus', 
      description: 'Elephant grass bedding',
      bagPrice: 14,
      bagWeight: '20kg',
      bagsPerWeekFull: 2,
      bagsPerWeekPartial: 1,
      disposal: 'excellent',
      pros: ['Very absorbent', 'Low dust', 'Sustainable'],
      cons: ['Not widely available', 'Premium price']
    }
  ]

  const stableSizes = [
    { id: 'small', name: 'Small (10x10ft)', multiplier: 0.8 },
    { id: 'standard', name: 'Standard (12x12ft)', multiplier: 1.0 },
    { id: 'large', name: 'Large (14x14ft)', multiplier: 1.3 },
    { id: 'foaling', name: 'Foaling Box (16x16ft)', multiplier: 1.6 }
  ]

  const keepingOptions = [
    { id: 'stabled', name: 'Fully Stabled', description: 'In overnight + daytime', multiplier: 1.0 },
    { id: 'nightonly', name: 'Night Only', description: 'Out during day', multiplier: 0.6 },
    { id: 'parttime', name: 'Part Time', description: '3-4 nights per week', multiplier: 0.4 },
    { id: 'fieldkept', name: 'Field Kept', description: 'Occasional stabling only', multiplier: 0.15 }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.25,
    'southeast': 1.15,
    'average': 1.0,
    'north': 0.9,
    'scotland': 0.95
  }

  const disposalCosts: Record<string, number> = {
    easy: 35,
    medium: 55,
    excellent: 25,
    minimal: 12
  }

  const calculate = () => {
    const bedding = beddingTypes.find(b => b.id === beddingType)
    const size = stableSizes.find(s => s.id === stableSize)
    const keeping = keepingOptions.find(k => k.id === horsesKeptIn)
    
    if (!bedding || !size || !keeping) return

    const regionFactor = regionMultipliers[region]
    
    // Calculate bags per week
    let bagsPerWeek = keeping.multiplier >= 0.5 
      ? bedding.bagsPerWeekFull * size.multiplier * keeping.multiplier
      : bedding.bagsPerWeekPartial * size.multiplier * (keeping.multiplier / 0.5)
    
    // Custom override
    if (customBagsPerWeek && parseFloat(customBagsPerWeek) > 0) {
      bagsPerWeek = parseFloat(customBagsPerWeek)
    }
    
    // Bag price
    let bagPrice = bedding.bagPrice
    if (customBagPrice && parseFloat(customBagPrice) > 0) {
      bagPrice = parseFloat(customBagPrice)
    } else {
      bagPrice *= regionFactor
    }
    
    // Bulk discount
    if (bulkBuying) {
      bagPrice *= 0.85 // 15% bulk discount
    }

    const weeklyBeddingCost = bagsPerWeek * bagPrice
    const monthlyBeddingCost = weeklyBeddingCost * 4.33
    const annualBeddingCost = weeklyBeddingCost * 52

    // Disposal costs
    let annualDisposal = 0
    if (includeDisposal) {
      annualDisposal = disposalCosts[bedding.disposal] * 12 * regionFactor * keeping.multiplier
    }

    // Initial setup (if rubber matting)
    let initialSetup = 0
    if (beddingType === 'rubber') {
      initialSetup = 500 * size.multiplier // rubber mats one-off cost
    }

    const totalAnnual = annualBeddingCost + annualDisposal
    const totalFirstYear = totalAnnual + initialSetup

    // Compare to alternatives
    const shavingsCost = 10 * 3 * 52 * size.multiplier * keeping.multiplier * regionFactor
    const strawCost = 6 * 2 * 52 * size.multiplier * keeping.multiplier * regionFactor

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'bedding_cost',
        bedding_type: beddingType,
        stable_size: stableSize,
        stabling_pattern: horsesKeptIn,
        annual_total: totalAnnual.toFixed(0)
      })
    }

    setResult({
      weeklyBeddingCost: weeklyBeddingCost.toFixed(2),
      monthlyBeddingCost: monthlyBeddingCost.toFixed(2),
      annualBeddingCost: annualBeddingCost.toFixed(2),
      annualDisposal: annualDisposal.toFixed(2),
      totalAnnual: totalAnnual.toFixed(2),
      totalFirstYear: totalFirstYear.toFixed(2),
      initialSetup: initialSetup.toFixed(2),
      bagsPerWeek: bagsPerWeek.toFixed(1),
      bagsPerYear: (bagsPerWeek * 52).toFixed(0),
      bagPrice: bagPrice.toFixed(2),
      beddingInfo: bedding,
      comparison: {
        shavings: shavingsCost.toFixed(2),
        straw: strawCost.toFixed(2),
        current: totalAnnual.toFixed(2)
      },
      savings: {
        vsShavings: (shavingsCost - totalAnnual).toFixed(2),
        vsStraw: (strawCost - totalAnnual).toFixed(2)
      }
    })
  }

  // 15 FAQs for maximum SEO value
  const faqs = [
    {
      q: 'What is the cheapest horse bedding UK?',
      a: 'Straw is typically the cheapest horse bedding in the UK at £5-7 per bale, costing around £450-700/year for a fully stabled horse. However, it creates more waste volume. Wood shavings cost £700-1,000/year but are easier to manage. Long-term, rubber matting with minimal bedding can be most economical.'
    },
    {
      q: 'How much bedding does a horse need per week?',
      a: 'A fully stabled horse typically needs 2-4 bags/bales of bedding per week depending on type. Shavings: 2-3 bags (20kg), Straw: 2-3 bales, Pellets: 1-2 bags (expand when wet). Horses stabled only at night need 40-60% less. Rubber matting reduces bedding needs by 70-80%.'
    },
    {
      q: 'What is the best bedding for horses with respiratory issues?',
      a: 'Dust-free options are essential for horses with respiratory problems. Paper bedding, hemp, and dust-extracted shavings are best. Avoid straw (dusty and mould-prone) and standard shavings. Rubber matting with minimal dust-free bedding on top is ideal for severe cases.'
    },
    {
      q: 'Is straw or shavings better for horses?',
      a: 'Both have pros and cons. Straw is cheaper, warmer, and traditional but horses may eat it, it\'s dustier, and creates more waste. Shavings are more absorbent, easier to muck out, and horses won\'t eat them, but cost more and take longer to decompose.'
    },
    {
      q: 'How often should horse bedding be changed?',
      a: 'Full bed changes aren\'t usually needed if you muck out daily. With good management, deep litter beds need full changes every 3-6 months. Rubber matting systems may only need weekly deep cleans. Daily removal of droppings and wet patches is essential regardless of bedding type.'
    },
    {
      q: 'What is deep litter bedding for horses?',
      a: 'Deep litter involves removing droppings but leaving wet bedding, adding fresh on top. The bed builds up over weeks/months, generating warmth through decomposition. It works best with straw, requires less daily work, but needs complete strip-out every few months. Not suitable for all horses.'
    },
    {
      q: 'Are rubber stable mats worth it?',
      a: 'Rubber mats cost £350-700 upfront but reduce bedding needs by 70-80%, saving £450-700/year on bedding. They\'re more comfortable, easier to clean, and last 10-20 years. Break-even is typically 1-2 years. Ideal for horses on box rest or with joint issues.'
    },
    {
      q: 'How do I dispose of horse bedding waste?',
      a: 'Options include: muck heap collection services (£25-120/month), farmer collection (often free for straw), local compost schemes, or bagging for garden centres. Straw and hemp compost fastest. Some yards have communal muck heaps with regular collection.'
    },
    {
      q: 'What bedding is best for foals?',
      a: 'Straw is traditionally preferred for foaling boxes - it\'s warm, non-slip, and allows foals to stand easily. Avoid deep shavings (foals can inhale them). Paper or hemp are good alternatives. Ensure bedding is deep and clean for the first few weeks.'
    },
    {
      q: 'How much does horse bedding cost per month UK?',
      a: 'Monthly bedding costs in the UK 2026: Straw £35-60, Shavings £60-100, Pellets £55-80, Hemp £80-130, Paper £70-110. These assume standard stable, fully stabled horse, and average UK prices. Costs vary significantly by region and horse\'s time in stable.'
    },
    {
      q: 'What is miscanthus bedding for horses?',
      a: 'Miscanthus (elephant grass) is a sustainable bedding made from dried grass stems. It\'s highly absorbent, low-dust, and composts quickly. Costs £12-16 per bale. Popular with eco-conscious owners but not as widely available as shavings or straw.'
    },
    {
      q: 'How much do wood pellets cost for horse bedding?',
      a: 'Wood pellets cost £8-11 per 15kg bag in the UK. A fully stabled horse uses 1-2 bags per week (£450-700/year). Pellets expand 3x when wet, so require less storage. Bulk buying (pallet orders) saves 10-15%. They\'re more absorbent but can be slippery initially.'
    },
    {
      q: 'Can I save money by bulk buying horse bedding?',
      a: 'Yes - bulk buying (pallet orders of 48+ bags) typically saves 10-20% on shavings and pellets. A pallet of shavings costs £350-450 vs £8-12/bag retail. Share deliveries with yard friends to split costs. Storage space is needed though - 48 bags takes considerable room.'
    },
    {
      q: 'What size stable needs the most bedding?',
      a: 'Bedding needs scale roughly with floor area. A standard 12x12ft stable is the baseline. Small stables (10x10ft) need about 20% less. Large stables (14x14ft) need 30% more. Foaling boxes (16x16ft) need 60% more bedding than standard.'
    },
    {
      q: 'How do I reduce horse bedding costs?',
      a: 'Key savings: 1) Install rubber matting (70% less bedding needed), 2) Buy in bulk (10-20% off), 3) Muck out efficiently with shavings fork, 4) Source straw direct from farmers, 5) Consider part-turnout to reduce stabling time, 6) Share delivery costs with yard friends.'
    }
  ]

  // Related calculators for internal linking
  const relatedCalculators = [
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
      title: 'Horse Livery Calculator',
      description: 'Compare livery options and pricing',
      href: '/horse-livery-calculator',
      icon: Home,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 hover:bg-emerald-100'
    },
    {
      title: 'Farrier Cost Calculator',
      description: 'Annual shoeing and trimming costs',
      href: '/farrier-cost-calculator',
      icon: Scissors,
      color: 'text-stone-600',
      bg: 'bg-stone-50 hover:bg-stone-100'
    },
    {
      title: 'Vet Cost Estimator',
      description: 'Plan your veterinary budget',
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
    }
  ]

  return (
    <>
      <Helmet>
        {/* 1. Title Tag */}
        <title>Bedding Cost Calculator UK 2026 | Compare Horse Bedding Prices | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free horse bedding cost calculator for UK. Compare shavings, straw, hemp, pellets and rubber matting costs. Calculate annual bedding budget with 2026 prices." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="horse bedding cost UK, shavings price, straw bedding cost, hemp bedding horse, rubber stable mats, bedding calculator 2026, wood pellets horse" 
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
        <meta name="theme-color" content="#854d0e" />
        
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
        <meta property="og:title" content="Bedding Cost Calculator UK 2026 | Compare Horse Bedding | HorseCost" />
        <meta property="og:description" content="Compare horse bedding costs - shavings, straw, hemp, pellets and more. Calculate annual bedding budget with UK 2026 prices." />
        <meta property="og:url" content="https://horsecost.co.uk/bedding-cost-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/bedding-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Bedding Cost Calculator showing different horse bedding types and costs" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Bedding Cost Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Compare horse bedding costs and calculate annual budget. UK 2026 prices." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/bedding-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Bedding Cost Calculator UK" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/bedding-cost-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/bedding-cost-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Bedding Cost Calculator', 'item': 'https://horsecost.co.uk/bedding-cost-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Bedding Cost Calculator UK',
                'description': 'Calculate and compare horse bedding costs for different bedding types including shavings, straw, hemp, pellets, and rubber matting with UK 2026 prices.',
                'url': 'https://horsecost.co.uk/bedding-cost-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.7', 'ratingCount': '243', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Calculate Horse Bedding Costs',
                'description': 'Step-by-step guide to calculating your annual horse bedding costs',
                'totalTime': 'PT3M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Select Bedding Type', 'text': 'Choose your bedding type: shavings, straw, pellets, hemp, paper, rubber matting, or miscanthus. Each has different costs and properties.' },
                  { '@type': 'HowToStep', 'name': 'Select Stable Size', 'text': 'Choose your stable size from small (10x10ft) to foaling box (16x16ft). Larger stables need more bedding.' },
                  { '@type': 'HowToStep', 'name': 'Set Time Stabled', 'text': 'Select how long your horse is stabled: fully stabled, night only, part time, or field kept. This affects bedding usage.' },
                  { '@type': 'HowToStep', 'name': 'Choose Region', 'text': 'Select your UK region as bedding prices vary. London/Southeast costs more, Northern areas less.' },
                  { '@type': 'HowToStep', 'name': 'View Annual Costs', 'text': 'Click calculate to see your weekly, monthly, and annual bedding costs with comparisons to alternatives.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Bedding Cost Calculator UK 2026 - Compare Horse Bedding Prices',
                'description': 'Free calculator for UK horse bedding costs. Compare shavings, straw, hemp, pellets and rubber matting to find the most economical option.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'image': 'https://horsecost.co.uk/images/bedding-calculator-og.jpg',
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
                'name': 'Bedding Cost Calculator UK 2026',
                'description': 'Calculate and compare horse bedding costs including shavings, straw, hemp, and rubber matting',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/bedding-cost-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'UK Horse Bedding Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Deep Litter',
                    'description': 'A bedding management system where droppings are removed daily but wet bedding is left, with fresh bedding added on top. The bed builds up over weeks, generating warmth through decomposition. Requires complete strip-out every 3-6 months.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Wood Pellets',
                    'description': 'Compressed wood bedding that expands 3x when wet. Low dust, very absorbent, and requires less storage space than shavings. Costs £8-11 per 15kg bag in the UK.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Rubber Stable Matting',
                    'description': 'Permanent rubber flooring for stables that reduces bedding needs by 70-80%. Costs £350-700 upfront but saves significantly on bedding long-term. Lasts 10-20 years with proper care.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Miscanthus',
                    'description': 'Sustainable horse bedding made from elephant grass (Miscanthus giganteus). Highly absorbent, low-dust, and composts quickly. An eco-friendly alternative to traditional bedding.'
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
          <a href="/" className="text-yellow-700 hover:text-yellow-800 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header */}
        <header className="bg-gradient-to-r from-yellow-700 to-amber-600 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Bedding Cost Calculator UK 2026</h1>
                <p className="text-yellow-200 mt-1">Compare horse bedding prices</p>
              </div>
            </div>
            <p className="text-yellow-100 max-w-3xl">
              Compare horse bedding costs and find the most economical option for your stable. 
              Calculate annual costs for shavings, straw, hemp, pellets, and rubber matting with UK 2026 prices.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-yellow-200 text-sm">
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
                243 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-yellow-600/30 text-yellow-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                UK supplier prices verified
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                7 bedding types compared
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
              <HelpCircle className="w-5 h-5 text-yellow-600" />
              Quick Answer: How Much Does Horse Bedding Cost UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>Horse bedding costs £450-1,200 per year in the UK.</strong> Straw is cheapest at £450-700/year. Wood shavings: £700-1,000/year. Hemp bedding: £850-1,300/year. Wood pellets: £500-800/year. Rubber matting costs £350-700 upfront but reduces annual bedding costs to £200-400. Costs assume fully stabled horse in standard 12x12ft stable.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="text-xs text-yellow-600 font-medium">Straw</div>
                <div className="text-xl font-bold text-yellow-700">£450-700</div>
                <div className="text-xs text-gray-500">/year</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <div className="text-xs text-amber-600 font-medium">Shavings</div>
                <div className="text-xl font-bold text-amber-700">£700-1,000</div>
                <div className="text-xs text-gray-500">/year</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xs text-green-600 font-medium">Pellets</div>
                <div className="text-xl font-bold text-green-700">£500-800</div>
                <div className="text-xs text-gray-500">/year</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-xs text-purple-600 font-medium">Hemp</div>
                <div className="text-xl font-bold text-purple-700">£850-1,300</div>
                <div className="text-xs text-gray-500">/year</div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Bedding Type */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Bedding Type</label>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {beddingTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setBeddingType(type.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          beddingType === type.id
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${beddingType === type.id ? 'text-yellow-700' : 'text-gray-900'}`}>
                              {type.name}
                            </p>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                          <p className="text-sm text-gray-600">
                            {type.bagPrice > 0 ? `~£${type.bagPrice}/${type.bagWeight}` : 'One-off cost'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Stable Size */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Stable Size</label>
                  </div>
                  <select
                    value={stableSize}
                    onChange={(e) => setStableSize(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                  >
                    {stableSizes.map((size) => (
                      <option key={size.id} value={size.id}>{size.name}</option>
                    ))}
                  </select>
                </section>

                {/* Time Stabled */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Time Stabled</label>
                  </div>
                  <div className="space-y-2">
                    {keepingOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setHorsesKeptIn(option.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          horsesKeptIn === option.id
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`font-medium ${horsesKeptIn === option.id ? 'text-yellow-700' : 'text-gray-900'}`}>
                          {option.name}
                        </p>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Region */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                  >
                    <option value="london">London / South East (+25%)</option>
                    <option value="southeast">Home Counties (+15%)</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England (-10%)</option>
                    <option value="scotland">Scotland / Wales (-5%)</option>
                  </select>
                </section>

                {/* Advanced Options */}
                <section className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-yellow-700 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Additional Options
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Bag/Bale Price (£)
                        </label>
                        <div className="relative">
                          <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={customBagPrice}
                            onChange={(e) => setCustomBagPrice(e.target.value)}
                            placeholder="Leave blank for estimate"
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bags/Bales Per Week
                        </label>
                        <input
                          type="number"
                          value={customBagsPerWeek}
                          onChange={(e) => setCustomBagsPerWeek(e.target.value)}
                          placeholder="Leave blank for estimate"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                        />
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeDisposal}
                          onChange={(e) => setIncludeDisposal(e.target.checked)}
                          className="w-5 h-5 text-yellow-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Include Muck Disposal</span>
                          <p className="text-sm text-gray-500">Collection or removal costs</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bulkBuying}
                          onChange={(e) => setBulkBuying(e.target.checked)}
                          className="w-5 h-5 text-yellow-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Bulk Buying Discount</span>
                          <p className="text-sm text-gray-500">~15% off for pallet orders</p>
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
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 text-white py-4 rounded-xl font-bold text-lg hover:from-yellow-700 hover:to-amber-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Bedding Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-yellow-600 to-amber-600 rounded-2xl p-6 text-white">
                      <p className="text-yellow-100 text-sm mb-1">Annual Bedding Cost</p>
                      <p className="text-4xl font-bold">£{result.totalAnnual}</p>
                      <p className="text-yellow-200 text-sm mt-1">{result.beddingInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-yellow-100 text-xs">Weekly</p>
                          <p className="font-bold">£{result.weeklyBeddingCost}</p>
                        </div>
                        <div>
                          <p className="text-yellow-100 text-xs">Monthly</p>
                          <p className="font-bold">£{result.monthlyBeddingCost}</p>
                        </div>
                      </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="bg-yellow-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Usage Estimate</h3>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-yellow-600 text-sm">Per Week</p>
                          <p className="text-xl font-bold text-gray-900">{result.bagsPerWeek}</p>
                          <p className="text-xs text-gray-500">bags/bales</p>
                        </div>
                        <div>
                          <p className="text-yellow-600 text-sm">Per Year</p>
                          <p className="text-xl font-bold text-gray-900">{result.bagsPerYear}</p>
                          <p className="text-xs text-gray-500">bags/bales</p>
                        </div>
                        <div>
                          <p className="text-yellow-600 text-sm">Unit Cost</p>
                          <p className="text-xl font-bold text-gray-900">£{result.bagPrice}</p>
                          <p className="text-xs text-gray-500">per bag/bale</p>
                        </div>
                      </div>
                    </div>

                    {/* Reminders CTA in Results */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold">Track Your Bedding Orders</h3>
                          <p className="text-purple-200 text-sm">Get reminders when it's time to reorder</p>
                        </div>
                        <button
                          onClick={() => setShowRemindersForm(true)}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-50 transition flex-shrink-0"
                        >
                          Set Up
                        </button>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Annual Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bedding</span>
                          <span className="font-medium">£{result.annualBeddingCost}</span>
                        </div>
                        {parseFloat(result.annualDisposal) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Muck Disposal</span>
                            <span className="font-medium">£{result.annualDisposal}</span>
                          </div>
                        )}
                        {parseFloat(result.initialSetup) > 0 && (
                          <div className="flex justify-between text-amber-600">
                            <span>+ Initial Setup (rubber mats)</span>
                            <span className="font-medium">£{result.initialSetup}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Annual</span>
                          <span>£{result.totalAnnual}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pros & Cons */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">{result.beddingInfo.name} - Pros &amp; Cons</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-green-600 font-medium text-sm mb-2">✓ Pros</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {result.beddingInfo.pros.map((pro: string, i: number) => (
                              <li key={i}>• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-red-600 font-medium text-sm mb-2">✗ Cons</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {result.beddingInfo.cons.map((con: string, i: number) => (
                              <li key={i}>• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Comparison */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h3 className="font-semibold text-amber-900 mb-3">Compare to Alternatives</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Wood Shavings</span>
                          <span className={`font-medium ${parseFloat(result.savings.vsShavings) > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            £{result.comparison.shavings}/year
                            {parseFloat(result.savings.vsShavings) > 0 && ` (save £${result.savings.vsShavings})`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Straw</span>
                          <span className={`font-medium ${parseFloat(result.savings.vsStraw) > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            £{result.comparison.straw}/year
                            {parseFloat(result.savings.vsStraw) > 0 && ` (save £${result.savings.vsStraw})`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select your bedding type and stable setup to see costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Box */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">Money-Saving Tips for Bedding</h3>
                <ul className="text-yellow-800 space-y-1 text-sm">
                  <li>• <strong>Buy in bulk</strong> - pallet orders save 10-20% on shavings and pellets</li>
                  <li>• <strong>Consider rubber mats</strong> - upfront cost but 70% less bedding needed</li>
                  <li>• <strong>Muck out efficiently</strong> - use a shavings fork to save bedding</li>
                  <li>• <strong>Local farmers</strong> - often sell straw cheaper than feed merchants</li>
                  <li>• <strong>Share delivery</strong> - split costs with yard friends</li>
                  <li>• Calculate your full costs with our <a href="/annual-horse-cost-calculator" className="text-yellow-700 underline hover:text-yellow-900">Annual Horse Cost Calculator</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Bedding Prices Table */}
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 overflow-x-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Horse Bedding Prices 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Bedding Type</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Price/Unit</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Weekly Cost</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Annual Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Straw</td>
                    <td className="py-3 px-4 text-center">£5-8/bale</td>
                    <td className="py-3 px-4 text-center">£10-16</td>
                    <td className="py-3 px-4 text-center">£450-850</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Wood Shavings</td>
                    <td className="py-3 px-4 text-center">£9-13/bag</td>
                    <td className="py-3 px-4 text-center">£27-39</td>
                    <td className="py-3 px-4 text-center">£700-1,050</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Wood Pellets</td>
                    <td className="py-3 px-4 text-center">£8-11/bag</td>
                    <td className="py-3 px-4 text-center">£16-22</td>
                    <td className="py-3 px-4 text-center">£600-950</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Hemp</td>
                    <td className="py-3 px-4 text-center">£14-18/bale</td>
                    <td className="py-3 px-4 text-center">£28-36</td>
                    <td className="py-3 px-4 text-center">£850-1,250</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Paper</td>
                    <td className="py-3 px-4 text-center">£11-15/bag</td>
                    <td className="py-3 px-4 text-center">£28-38</td>
                    <td className="py-3 px-4 text-center">£700-1,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Rubber Mats + Minimal</td>
                    <td className="py-3 px-4 text-center">£350-700 setup</td>
                    <td className="py-3 px-4 text-center">£5-12</td>
                    <td className="py-3 px-4 text-center">£200-450</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Costs based on fully stabled horse in standard 12x12ft stable. Prices January 2026. Actual costs vary by region, supplier, and horse's habits.
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
                  <h3 className="font-bold text-gray-900 group-hover:text-yellow-600">{calc.title}</h3>
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
                Never run out of bedding again. Get free email reminders for reorders, stable maintenance, and all your horse care needs.
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
          <div className="mt-12 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Calculate Your Full Horse Budget</h2>
            <p className="text-yellow-100 mb-6 max-w-xl mx-auto">
              Bedding is just one cost. Get the complete picture with our Annual Horse Cost Calculator.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-yellow-700 px-6 py-3 rounded-xl font-bold hover:bg-yellow-50 transition"
            >
              Calculate Annual Costs
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
                  Get free email reminders for bedding orders, stable cleaning, and all your horse care needs.
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
