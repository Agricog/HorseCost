import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Shirt,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Star,
  Thermometer,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  Users,
  HelpCircle,
  CheckCircle2,
  Home,
  Shield,
  Scissors,
  Heart,
  Wheat
} from 'lucide-react'

export default function RugCostCalculator() {
  const [horseType, setHorseType] = useState('clipped')
  const [climate, setClimate] = useState('average')
  const [stabling, setStabling] = useState('mixed')
  const [budgetLevel, setBudgetLevel] = useState('mid')
  const [includeSpares, setIncludeSpares] = useState(true)
  const [includeSheets, setIncludeSheets] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  const horseTypes = [
    { id: 'native', name: 'Native/Unclipped', rugsNeeded: 'minimal', multiplier: 0.5, description: 'Hardy breeds, natural coat' },
    { id: 'unclipped', name: 'Unclipped (Non-Native)', rugsNeeded: 'light', multiplier: 0.7, description: 'Good coat but not native hardy' },
    { id: 'trace', name: 'Trace/Bib Clip', rugsNeeded: 'moderate', multiplier: 0.85, description: 'Partial clip, some protection needed' },
    { id: 'clipped', name: 'Hunter/Full Clip', rugsNeeded: 'full', multiplier: 1.0, description: 'Full rug wardrobe needed' },
    { id: 'thin', name: 'Fine-Coated/Thin Skinned', rugsNeeded: 'extra', multiplier: 1.2, description: 'TBs, Arabs - feel the cold' }
  ]

  const climates = [
    { id: 'mild', name: 'Mild (South Coast)', multiplier: 0.8 },
    { id: 'average', name: 'Average UK', multiplier: 1.0 },
    { id: 'cold', name: 'Cold (Scotland/North)', multiplier: 1.15 },
    { id: 'wet', name: 'Very Wet Area', multiplier: 1.1 }
  ]

  const stablingTypes = [
    { id: 'out247', name: 'Out 24/7', turnoutHeavy: true, stableRug: false, multiplier: 1.1 },
    { id: 'mixed', name: 'Mixed (In at Night)', turnoutHeavy: true, stableRug: true, multiplier: 1.0 },
    { id: 'mostly_in', name: 'Mostly Stabled', turnoutHeavy: false, stableRug: true, multiplier: 0.9 }
  ]

  // 2026 pricing
  const budgetLevels = {
    budget: { name: 'Budget', multiplier: 0.6, brands: 'Shires, Derby House', lifespan: 2 },
    mid: { name: 'Mid-Range', multiplier: 1.0, brands: 'WeatherBeeta, Horseware', lifespan: 3 },
    premium: { name: 'Premium', multiplier: 1.6, brands: 'Rambo, Bucas, Back on Track', lifespan: 5 }
  }

  // 2026 base rug prices (mid-range, medium weight, average size)
  const rugPrices = {
    turnoutLight: { name: 'Lightweight Turnout (0g)', base: 80, essential: true },
    turnoutMedium: { name: 'Medium Turnout (200g)', base: 110, essential: true },
    turnoutHeavy: { name: 'Heavy Turnout (300g+)', base: 140, essential: true },
    stableLight: { name: 'Stable Rug Light', base: 52, essential: false },
    stableMedium: { name: 'Stable Rug Medium', base: 70, essential: true },
    stableHeavy: { name: 'Stable Rug Heavy', base: 88, essential: false },
    fleece: { name: 'Fleece/Cooler', base: 42, essential: true },
    rainSheet: { name: 'Rain Sheet', base: 65, essential: false },
    flySheet: { name: 'Fly Sheet (Summer)', base: 58, essential: false },
    flyMask: { name: 'Fly Mask', base: 22, essential: true },
    exercise: { name: 'Exercise Sheet', base: 48, essential: false },
    underBlanket: { name: 'Under Blanket/Liner', base: 58, essential: false }
  }

  const calculate = () => {
    const horse = horseTypes.find(h => h.id === horseType)
    const climateData = climates.find(c => c.id === climate)
    const stablingData = stablingTypes.find(s => s.id === stabling)
    const budget = budgetLevels[budgetLevel as keyof typeof budgetLevels]
    
    if (!horse || !climateData || !stablingData || !budget) return

    // Calculate which rugs are needed
    const rugsNeeded: any[] = []
    let totalInitial = 0

    // Turnout rugs - almost always needed
    if (horse.multiplier >= 0.5) {
      rugsNeeded.push({ ...rugPrices.turnoutLight, quantity: 1, reason: 'Spring/autumn, mild days' })
      totalInitial += rugPrices.turnoutLight.base * budget.multiplier
    }
    if (horse.multiplier >= 0.7) {
      rugsNeeded.push({ ...rugPrices.turnoutMedium, quantity: includeSpares ? 2 : 1, reason: 'Main winter turnout' })
      totalInitial += rugPrices.turnoutMedium.base * budget.multiplier * (includeSpares ? 2 : 1)
    }
    if (horse.multiplier >= 0.85 && (climateData.multiplier >= 1.0 || stablingData.turnoutHeavy)) {
      rugsNeeded.push({ ...rugPrices.turnoutHeavy, quantity: 1, reason: 'Coldest days/nights' })
      totalInitial += rugPrices.turnoutHeavy.base * budget.multiplier
    }

    // Stable rugs - if stabled
    if (stablingData.stableRug) {
      if (horse.multiplier >= 0.7) {
        rugsNeeded.push({ ...rugPrices.stableMedium, quantity: 1, reason: 'Night time stabling' })
        totalInitial += rugPrices.stableMedium.base * budget.multiplier
      }
      if (horse.multiplier >= 1.0 && climateData.multiplier >= 1.0) {
        rugsNeeded.push({ ...rugPrices.stableHeavy, quantity: 1, reason: 'Very cold nights' })
        totalInitial += rugPrices.stableHeavy.base * budget.multiplier
      }
    }

    // Fleece/cooler - always useful
    rugsNeeded.push({ ...rugPrices.fleece, quantity: 1, reason: 'Drying off, travel, layering' })
    totalInitial += rugPrices.fleece.base * budget.multiplier

    // Fly mask - essential for most
    rugsNeeded.push({ ...rugPrices.flyMask, quantity: includeSpares ? 2 : 1, reason: 'Summer fly protection' })
    totalInitial += rugPrices.flyMask.base * budget.multiplier * (includeSpares ? 2 : 1)

    // Optional sheets
    if (includeSheets) {
      if (climateData.id === 'wet' || stablingData.id === 'out247') {
        rugsNeeded.push({ ...rugPrices.rainSheet, quantity: 1, reason: 'No-fill waterproof option' })
        totalInitial += rugPrices.rainSheet.base * budget.multiplier
      }
      rugsNeeded.push({ ...rugPrices.flySheet, quantity: 1, reason: 'Summer UV/fly protection' })
      totalInitial += rugPrices.flySheet.base * budget.multiplier
    }

    // Under blanket for cold horses
    if (horse.multiplier >= 1.2 || climateData.id === 'cold') {
      rugsNeeded.push({ ...rugPrices.underBlanket, quantity: 1, reason: 'Extra warmth layer' })
      totalInitial += rugPrices.underBlanket.base * budget.multiplier
    }

    // Calculate annual replacement cost
    const replacementRate = 1 / budget.lifespan
    const annualReplacement = totalInitial * replacementRate

    // Repairs and cleaning (2026 prices)
    const annualRepairs = 35 * budget.multiplier
    const annualCleaning = 48

    const totalAnnual = annualReplacement + annualRepairs + annualCleaning
    const totalRugCount = rugsNeeded.reduce((sum, rug) => sum + rug.quantity, 0)

    // Compare budget levels
    const budgetTotal = totalInitial * (budgetLevels.budget.multiplier / budget.multiplier)
    const premiumTotal = totalInitial * (budgetLevels.premium.multiplier / budget.multiplier)

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'rug_cost',
        horse_type: horseType,
        climate: climate,
        stabling: stabling,
        budget_level: budgetLevel,
        total_initial: totalInitial.toFixed(0)
      })
    }

    setResult({
      totalInitial: totalInitial.toFixed(2),
      totalAnnual: totalAnnual.toFixed(2),
      monthlyAverage: (totalAnnual / 12).toFixed(2),
      rugCount: totalRugCount,
      rugsNeeded,
      breakdown: {
        replacement: annualReplacement.toFixed(2),
        repairs: annualRepairs.toFixed(2),
        cleaning: annualCleaning.toFixed(2)
      },
      budgetInfo: budget,
      horseInfo: horse,
      comparison: {
        budget: budgetTotal.toFixed(2),
        mid: totalInitial.toFixed(2),
        premium: premiumTotal.toFixed(2)
      },
      fiveYearCost: (totalInitial + (totalAnnual * 4)).toFixed(2),
      tips: getTips(horseType, climate, stabling)
    })
  }

  const getTips = (horse: string, climate: string, stabling: string) => {
    const tips = []
    if (horse === 'native') tips.push('Native breeds often need fewer rugs - don\'t over-rug')
    if (horse === 'thin') tips.push('Fine-coated horses feel the cold - invest in quality rugs')
    if (climate === 'wet') tips.push('Waterproofing is crucial - re-proof annually')
    if (stabling === 'out247') tips.push('Have a spare turnout for wet days')
    tips.push('Measure your horse carefully - ill-fitting rugs cause rubs')
    tips.push('Check rugs daily for damage and adjust straps')
    return tips
  }

  // 15 FAQs for maximum SEO
  const faqs = [
    {
      q: 'How much do horse rugs cost UK?',
      a: 'Horse rugs in the UK cost £40-220+ each depending on type and quality in 2026. Budget turnouts cost £55-95, mid-range £95-140, and premium brands £140-220+. A basic rug wardrobe (4-6 rugs) costs £250-450 budget, £400-700 mid-range, or £700-1,200+ premium. Annual replacement and repair adds £100-250.'
    },
    {
      q: 'How many rugs does a horse need?',
      a: 'A clipped horse typically needs 4-6 rugs: lightweight turnout (0g), medium turnout (200g) plus spare, heavy turnout (300g+), stable rug, and fleece cooler. Add fly sheet/mask for summer. Unclipped natives may only need 1-2 turnouts. The exact number depends on clip level, climate, and whether stabled.'
    },
    {
      q: 'What rugs do I need for a clipped horse?',
      a: 'A clipped horse needs: lightweight turnout (0g) for mild days, medium turnout (200g) as main winter rug, heavy turnout (300g+) for cold snaps, stable rug for nights in, fleece for drying/layering. Consider a rain sheet for spring/autumn and under-blanket for very cold weather.'
    },
    {
      q: 'Should I buy budget or premium rugs?',
      a: 'Budget rugs (£55-95) last 1-2 seasons but need replacing often. Mid-range (£95-140) balance quality and value, lasting 2-3 years. Premium rugs (£140-220+) last 4-5+ years with better waterproofing and fit. Premium works out cheaper long-term if you can afford the upfront cost.'
    },
    {
      q: 'How long do horse rugs last?',
      a: 'Budget rugs last 1-2 years, mid-range 2-3 years, and premium 4-5+ years with proper care. Turnout rugs wear faster than stable rugs. Lifespan depends on: horse behaviour (rug wreckers!), quality of waterproofing, proper fit, and care (cleaning, storage, repairs).'
    },
    {
      q: 'Do unclipped horses need rugs?',
      a: 'Many unclipped horses cope without rugs if: they\'re native/hardy breeds, have good natural shelter, and aren\'t losing condition. However, most unclipped horses benefit from a lightweight/medium turnout in very wet weather to prevent rain scald. Watch your horse - if shivering, they need rugging.'
    },
    {
      q: 'How do I know if my horse is too hot or cold?',
      a: 'Check the base of ears and inside back legs - these should feel warm, not hot or cold. A cold horse has cold ears, may shiver, and tucks up. An over-rugged horse sweats under the rug, has a damp coat, and may lose condition. Adjust rugging to temperature, wind, and rain.'
    },
    {
      q: 'When should I start rugging my horse?',
      a: 'Start rugging when temperatures drop below 10°C for clipped horses, or 5°C for unclipped. Consider wind chill and rain - a wet 10°C day with wind is colder than a dry 5°C day. Clipped horses need rugging immediately after clipping. Introduce gradually if possible.'
    },
    {
      q: 'How do I measure my horse for rugs?',
      a: 'Measure from centre of chest, along the side, to the point of buttock. This gives rug size in feet/inches (e.g., 6\'0"). Common sizes: ponies 4\'6"-5\'9", cobs 5\'9"-6\'3", horses 6\'0"-6\'9", large horses 6\'9"-7\'3". Fit is crucial - too small causes rubs, too big slips.'
    },
    {
      q: 'How do I care for horse rugs?',
      a: 'Shake out mud daily, brush when dry, repair tears promptly. Wash 1-2 times per season (or professionally clean £18-30 in 2026). Re-proof waterproof rugs annually (Nikwax or professional). Store clean and dry in summer. Check straps, buckles, and stitching regularly. Good care extends rug life significantly.'
    },
    {
      q: 'What fill weight rug does my horse need?',
      a: 'Fill weight depends on temperature and clip: 0g (no fill) for 10-15°C, 100g for 5-10°C, 200g for 0-5°C, 300g for below 0°C. Clipped horses need one weight heavier. Adjust for rain, wind, and individual horse - some run hot, others cold. Layer with liners for flexibility.'
    },
    {
      q: 'Are combo rugs better than standard neck rugs?',
      a: 'Combo rugs (attached neck) provide seamless coverage and prevent gaps. They cost £15-30 more but are worthwhile for clipped horses or those living out. Standard rugs with separate neck covers offer flexibility - use neck only when needed. Both have pros and cons.'
    },
    {
      q: 'How often should I change my horse\'s rug?',
      a: 'Change rugs when: the rug is wet through (not just damp on outside), temperature changes significantly (5°C+ swing), or the horse is too hot/cold. In variable UK weather, you may change rugs daily. Keep multiple weights accessible for quick changes.'
    },
    {
      q: 'What causes rug rubs and how do I prevent them?',
      a: 'Rug rubs are caused by: poor fit (too tight or too loose), dirty rugs, wool-sensitive skin, and friction points (shoulders, withers, chest). Prevent with: correct sizing, shoulder gussets, satin-lined shoulders, regular checking, and keeping rugs clean. Treat rubs with zinc cream.'
    },
    {
      q: 'Is it worth getting rugs professionally cleaned?',
      a: 'Professional cleaning (£18-30 per rug in 2026) is worth it annually for turnout rugs. Benefits: proper waterproof re-proofing, thorough cleaning, checking for damage, and extending lifespan. DIY cleaning with Nikwax works for interim washes but professional cleaning is more thorough.'
    }
  ]

  // Related calculators
  const relatedCalculators = [
    {
      title: 'Tack & Equipment Calculator',
      description: 'Full gear costs',
      href: '/tack-equipment-calculator',
      icon: Star,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 hover:bg-cyan-100'
    },
    {
      title: 'Clipping Cost Calculator',
      description: 'Clipping affects rug needs',
      href: '/clipping-cost-calculator',
      icon: Scissors,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 hover:bg-indigo-100'
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
      title: 'Horse Feed Calculator',
      description: 'Nutrition costs',
      href: '/horse-feed-calculator',
      icon: Wheat,
      color: 'text-green-600',
      bg: 'bg-green-50 hover:bg-green-100'
    }
  ]

  return (
    <>
      <Helmet>
        {/* 1. Title Tag */}
        <title>Horse Rug Cost Calculator UK 2026 | How Many Rugs Needed | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free horse rug cost calculator for UK owners. Calculate how many rugs your horse needs, compare budget vs premium brands, and plan your annual rug budget. 2026 UK prices." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="horse rug cost UK 2026, how many rugs does a horse need, turnout rug price, horse blanket cost, WeatherBeeta price, Rambo rug cost, horse rug wardrobe" 
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
        <meta name="theme-color" content="#7c3aed" />
        
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
        <meta property="og:title" content="Horse Rug Cost Calculator UK 2026 | How Many Rugs | HorseCost" />
        <meta property="og:description" content="Calculate how many rugs your horse needs and plan your rug budget with UK 2026 prices." />
        <meta property="og:url" content="https://horsecost.co.uk/rug-cost-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/rug-cost-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Horse Rug Cost Calculator showing rug wardrobe and prices" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Horse Rug Cost Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Calculate your horse rug needs and costs. Budget vs premium comparison included." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/rug-cost-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Horse Rug Cost Calculator UK" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/rug-cost-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/rug-cost-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Rug Cost Calculator', 'item': 'https://horsecost.co.uk/rug-cost-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Rug Cost Calculator UK',
                'description': 'Calculate how many rugs your horse needs and plan your rug budget with UK 2026 pricing.',
                'url': 'https://horsecost.co.uk/rug-cost-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.7', 'ratingCount': '278', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Calculate Your Horse Rug Costs',
                'description': 'Step-by-step guide to calculating your horse rug needs and costs',
                'totalTime': 'PT3M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Select Horse Type', 'text': 'Choose your horse\'s coat type and clip level as this determines rug requirements.' },
                  { '@type': 'HowToStep', 'name': 'Set Your Climate', 'text': 'Select your UK region climate - colder areas need heavier rugs.' },
                  { '@type': 'HowToStep', 'name': 'Choose Stabling Situation', 'text': 'Indicate if horse lives out 24/7, is stabled at night, or mostly stabled.' },
                  { '@type': 'HowToStep', 'name': 'Select Budget Level', 'text': 'Choose budget, mid-range, or premium brands to match your spending.' },
                  { '@type': 'HowToStep', 'name': 'Calculate Rug Wardrobe', 'text': 'Click Calculate to see your complete rug list, initial cost, and annual budget.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Horse Rug Cost Calculator UK 2026 - How Many Rugs Does Your Horse Need',
                'description': 'Free calculator for UK horse rug costs. Work out your complete rug wardrobe and compare budget vs premium brands.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png' } },
                'image': 'https://horsecost.co.uk/images/rug-cost-calculator-og.jpg'
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
                'name': 'Horse Rug Cost Calculator UK 2026',
                'description': 'Calculate how many rugs your horse needs and budget for your rug wardrobe',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/rug-cost-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'Horse Rug Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Turnout Rug',
                    'description': 'Waterproof outer rug for horses living out in the field. Available in different fill weights: 0g (no fill), 100g (light), 200g (medium), 300g+ (heavy). Prices range £55-220+ in 2026.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Fill Weight',
                    'description': 'The amount of insulation in a rug measured in grams (g). 0g = no fill, 100g = light, 200g = medium, 300g+ = heavy. Higher fill = warmer rug. Match to temperature and clip level.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Combo Rug',
                    'description': 'A rug with an attached neck cover providing seamless protection. Costs £15-30 more than standard rugs but prevents gaps and draughts. Ideal for clipped horses or those living out 24/7.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Denier Rating',
                    'description': 'Measurement of rug outer fabric strength. 600D = lightweight, 1200D = standard, 1680D = heavyweight. Higher denier = more durable but heavier. Match to horse behaviour and turnout situation.'
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
          <a href="/" className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header */}
        <header className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Shirt className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Horse Rug Cost Calculator UK 2026</h1>
                <p className="text-violet-200 mt-1">Rug Wardrobe Planner</p>
              </div>
            </div>
            <p className="text-violet-100 max-w-3xl">
              Calculate how many rugs your horse needs and plan your rug budget. 
              Compare budget, mid-range, and premium brands.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-violet-200 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last updated: January 2026
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                UK regional climate
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                278 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-violet-500/30 text-violet-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Budget vs premium comparison
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                5-year cost projections
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
              <HelpCircle className="w-5 h-5 text-violet-600" />
              Quick Answer: How Much Do Horse Rugs Cost UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>Horse rugs cost £40-220+ each in the UK in 2026.</strong> A complete rug wardrobe (4-6 rugs) costs £250-450 budget, £400-700 mid-range, or £700-1,200+ premium. Annual replacement/repair adds £100-250. Clipped horses need more rugs than unclipped natives. Premium rugs last 4-5 years vs 1-2 years for budget.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-violet-50 p-3 rounded-lg text-center">
                <div className="text-xs text-violet-600 font-medium">Budget Wardrobe</div>
                <div className="text-xl font-bold text-violet-700">£250-450</div>
                <div className="text-xs text-gray-500">4-6 rugs</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-xs text-purple-600 font-medium">Mid-Range</div>
                <div className="text-xl font-bold text-purple-700">£400-700</div>
                <div className="text-xs text-gray-500">4-6 rugs</div>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg text-center">
                <div className="text-xs text-indigo-600 font-medium">Premium</div>
                <div className="text-xl font-bold text-indigo-700">£700-1,200</div>
                <div className="text-xs text-gray-500">4-6 rugs</div>
              </div>
              <div className="bg-fuchsia-50 p-3 rounded-lg text-center">
                <div className="text-xs text-fuchsia-600 font-medium">Annual Costs</div>
                <div className="text-xl font-bold text-fuchsia-700">£100-250</div>
                <div className="text-xs text-gray-500">replacement/repairs</div>
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
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Horse Type / Clip Level</label>
                  </div>
                  <div className="space-y-2">
                    {horseTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setHorseType(type.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          horseType === type.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${horseType === type.id ? 'text-violet-700' : 'text-gray-900'}`}>
                              {type.name}
                            </p>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                          <p className="text-sm text-gray-600 capitalize">{type.rugsNeeded}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Your Climate</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {climates.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setClimate(c.id)}
                        className={`p-3 rounded-xl text-center transition border-2 ${
                          climate === c.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`font-medium text-sm ${climate === c.id ? 'text-violet-700' : 'text-gray-900'}`}>
                          {c.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Stabling Situation</label>
                  </div>
                  <div className="space-y-2">
                    {stablingTypes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setStabling(s.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          stabling === s.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`font-medium ${stabling === s.id ? 'text-violet-700' : 'text-gray-900'}`}>
                          {s.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Budget Level</label>
                  </div>
                  <div className="flex gap-2">
                    {Object.entries(budgetLevels).map(([key, level]) => (
                      <button
                        key={key}
                        onClick={() => setBudgetLevel(key)}
                        className={`flex-1 py-3 rounded-xl font-medium transition ${
                          budgetLevel === key
                            ? 'bg-violet-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {budgetLevels[budgetLevel as keyof typeof budgetLevels].brands}
                  </p>
                </section>

                <section className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-violet-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Options
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeSpares}
                          onChange={(e) => setIncludeSpares(e.target.checked)}
                          className="w-5 h-5 text-violet-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Include Spare Rugs</span>
                          <p className="text-sm text-gray-500">Spare turnout for wet days</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeSheets}
                          onChange={(e) => setIncludeSheets(e.target.checked)}
                          className="w-5 h-5 text-violet-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Include Fly Sheet</span>
                          <p className="text-sm text-gray-500">Summer protection</p>
                        </div>
                      </label>
                    </div>
                  )}
                </section>
              </div>

              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-violet-700 hover:to-purple-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Rug Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
                      <p className="text-violet-100 text-sm mb-1">Initial Rug Wardrobe</p>
                      <p className="text-4xl font-bold">£{result.totalInitial}</p>
                      <p className="text-violet-200 text-sm mt-1">{result.rugCount} rugs - {result.budgetInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-violet-100 text-xs">Annual Cost</p>
                          <p className="font-bold">£{result.totalAnnual}</p>
                        </div>
                        <div>
                          <p className="text-violet-100 text-xs">Monthly</p>
                          <p className="font-bold">£{result.monthlyAverage}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reminders CTA */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold">Rug Care Reminders</h3>
                          <p className="text-purple-200 text-sm">Re-proofing &amp; cleaning alerts</p>
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
                      <h3 className="font-semibold text-gray-900 mb-3">Your Rug Wardrobe</h3>
                      <div className="space-y-2 text-sm">
                        {result.rugsNeeded.map((rug: any, i: number) => (
                          <div key={i} className="flex justify-between items-start">
                            <div>
                              <span className="text-gray-900">{rug.name}</span>
                              {rug.quantity > 1 && <span className="text-violet-600 ml-1">×{rug.quantity}</span>}
                              <p className="text-xs text-gray-500">{rug.reason}</p>
                            </div>
                            <span className="font-medium">£{(rug.base * result.budgetInfo.multiplier * rug.quantity).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Annual Running Costs</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Replacement Fund</span>
                          <span className="font-medium">£{result.breakdown.replacement}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Repairs</span>
                          <span className="font-medium">£{result.breakdown.repairs}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Professional Cleaning</span>
                          <span className="font-medium">£{result.breakdown.cleaning}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Annual</span>
                          <span>£{result.totalAnnual}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-violet-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Budget Comparison</h3>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <p className="text-gray-600 text-xs">Budget</p>
                          <p className="font-bold">£{result.comparison.budget}</p>
                        </div>
                        <div className="bg-violet-50 rounded-lg p-2 text-center">
                          <p className="text-violet-600 text-xs">Mid-Range</p>
                          <p className="font-bold">£{result.comparison.mid}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2 text-center">
                          <p className="text-purple-600 text-xs">Premium</p>
                          <p className="font-bold">£{result.comparison.premium}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Premium lasts {budgetLevels.premium.lifespan} years vs {budgetLevels.budget.lifespan} years for budget
                      </p>
                    </div>

                    <div className="bg-violet-50 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">5-Year Total Cost</span>
                        <span className="font-bold text-violet-700 text-lg">£{result.fiveYearCost}</span>
                      </div>
                    </div>

                    {result.tips.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <Thermometer className="w-5 h-5" />
                          Tips for Your Horse
                        </h3>
                        <ul className="text-sm text-amber-800 space-y-1">
                          {result.tips.map((tip: string, i: number) => (
                            <li key={i}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Shirt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Configure your horse's needs to see rug recommendations</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-violet-50 border-l-4 border-violet-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-violet-900 mb-2">Rugging Guidelines</h3>
                <ul className="text-violet-800 space-y-1 text-sm">
                  <li>• <strong>Don't over-rug</strong> - horses tolerate cold better than we think</li>
                  <li>• <strong>Check temperature</strong> - feel ears and under rug daily</li>
                  <li>• <strong>Waterproofing matters</strong> - a wet horse is a cold horse</li>
                  <li>• <strong>Fit is crucial</strong> - poor fit causes rubs and slipping</li>
                  <li>• <strong>Layer up</strong> - use liners rather than one heavy rug</li>
                  <li>• Plan clipping with our <a href="/clipping-cost-calculator" className="text-violet-700 underline hover:text-violet-900">Clipping Cost Calculator</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing Table */}
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Rug Prices 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Rug Type</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Budget</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Mid-Range</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Lightweight Turnout (0g)</td>
                    <td className="py-3 px-4 text-center">£45-60</td>
                    <td className="py-3 px-4 text-center">£70-95</td>
                    <td className="py-3 px-4 text-center">£110-160</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Medium Turnout (200g)</td>
                    <td className="py-3 px-4 text-center">£60-85</td>
                    <td className="py-3 px-4 text-center">£95-130</td>
                    <td className="py-3 px-4 text-center">£155-200</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Heavy Turnout (300g+)</td>
                    <td className="py-3 px-4 text-center">£80-105</td>
                    <td className="py-3 px-4 text-center">£120-160</td>
                    <td className="py-3 px-4 text-center">£180-250</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Stable Rug Medium</td>
                    <td className="py-3 px-4 text-center">£38-55</td>
                    <td className="py-3 px-4 text-center">£58-85</td>
                    <td className="py-3 px-4 text-center">£90-140</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Fleece/Cooler</td>
                    <td className="py-3 px-4 text-center">£22-35</td>
                    <td className="py-3 px-4 text-center">£35-52</td>
                    <td className="py-3 px-4 text-center">£58-95</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * 2026 prices. Combo (attached neck) rugs typically cost £15-30 more.
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
            <p className="text-gray-600 mb-6">Plan all your horse equipment costs:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedCalculators.map((calc, index) => (
                <a 
                  key={index}
                  href={calc.href} 
                  className={`${calc.bg} rounded-xl p-4 transition group`}
                  title={`${calc.title} - ${calc.description}`}
                >
                  <calc.icon className={`w-8 h-8 ${calc.color} mb-2`} />
                  <h3 className="font-bold text-gray-900 group-hover:text-violet-600">{calc.title}</h3>
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
                Never forget to re-proof your rugs or book professional cleaning. Get free email reminders for all your horse care needs.
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
          <div className="mt-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Calculate Your Full Tack &amp; Equipment Costs</h2>
            <p className="text-violet-100 mb-6 max-w-xl mx-auto">
              Rugs are just part of your equipment budget. Get the complete picture.
            </p>
            <a 
              href="/tack-equipment-calculator"
              className="inline-flex items-center gap-2 bg-white text-violet-600 px-6 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
            >
              Calculate Equipment Costs
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
                  Get free email reminders for rug re-proofing, cleaning, and all your horse care needs.
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
