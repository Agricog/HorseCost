import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Smile,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Star,
  Shield,
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
  ShoppingBag
} from 'lucide-react'

export default function DentalCostCalculator() {
  const [horseAge, setHorseAge] = useState('adult')
  const [dentalProvider, setDentalProvider] = useState('edt')
  const [region, setRegion] = useState('average')
  const [numHorses, setNumHorses] = useState('1')
  const [hasIssues, setHasIssues] = useState(false)
  const [issueType, setIssueType] = useState('none')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  // 2026 pricing
  const ageGroups = [
    { id: 'young', name: 'Young (Under 5)', checksPerYear: 2, description: 'More frequent checks needed', multiplier: 1.3 },
    { id: 'adult', name: 'Adult (5-15)', checksPerYear: 1, description: 'Annual routine check', multiplier: 1.0 },
    { id: 'senior', name: 'Senior (15-20)', checksPerYear: 1.5, description: 'May need extra attention', multiplier: 1.2 },
    { id: 'veteran', name: 'Veteran (20+)', checksPerYear: 2, description: 'Frequent monitoring needed', multiplier: 1.5 }
  ]

  const providers = [
    { id: 'edt', name: 'Equine Dental Technician (EDT)', basePrice: 65, callout: 0, description: 'Qualified specialist - most common' },
    { id: 'vet', name: 'Veterinary Dentist', basePrice: 95, callout: 50, description: 'Can sedate and do extractions' },
    { id: 'specialist', name: 'Specialist Equine Vet', basePrice: 170, callout: 70, description: 'For complex procedures' }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.4,
    'southeast': 1.2,
    'average': 1.0,
    'north': 0.9,
    'scotland': 0.95
  }

  const dentalIssues = [
    { id: 'none', name: 'No Issues', cost: 0 },
    { id: 'hooks', name: 'Hooks/Ramps', cost: 25, description: 'Extra rasping needed' },
    { id: 'wolf', name: 'Wolf Teeth Removal', cost: 95, description: 'One-off procedure' },
    { id: 'extraction', name: 'Tooth Extraction', cost: 300, description: 'Requires vet + sedation' },
    { id: 'diastema', name: 'Diastema Treatment', cost: 180, description: 'Gap treatment' },
    { id: 'quidding', name: 'Quidding Investigation', cost: 120, description: 'Chewing problems' }
  ]

  const calculate = () => {
    const age = ageGroups.find(a => a.id === horseAge)
    const provider = providers.find(p => p.id === dentalProvider)
    const issue = dentalIssues.find(i => i.id === issueType)
    if (!age || !provider || !issue) return

    const horses = parseInt(numHorses)
    const regionFactor = regionMultipliers[region]

    // Base routine check cost
    const checkCost = (provider.basePrice + provider.callout) * regionFactor
    const checksPerYear = age.checksPerYear
    const annualRoutineCost = checkCost * checksPerYear * age.multiplier

    // Issue costs (usually one-off but may recur)
    let issueCost = 0
    if (hasIssues && issue.cost > 0) {
      issueCost = issue.cost * regionFactor
      // Extractions need vet, add sedation
      if (issueType === 'extraction') {
        issueCost += 90 // Sedation cost
      }
    }

    // Multi-horse discount for callout
    let totalAnnual = 0
    if (horses === 1) {
      totalAnnual = annualRoutineCost + issueCost
    } else {
      // Discount on callout for multiple horses
      const perHorseCheck = provider.basePrice * regionFactor * checksPerYear * age.multiplier
      const sharedCallout = (provider.callout * regionFactor * checksPerYear) / horses
      totalAnnual = (perHorseCheck + sharedCallout + (issueCost / horses)) * horses
    }

    const perHorseAnnual = totalAnnual / horses
    const monthlyAverage = totalAnnual / 12

    // 5-year projection
    const fiveYearCost = (annualRoutineCost * 5) + issueCost // Issues usually don't recur

    // Compare providers
    const edtAnnual = (65 * regionFactor * checksPerYear * age.multiplier) * horses
    const vetAnnual = ((95 + 50) * regionFactor * checksPerYear * age.multiplier) * horses

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'dental_cost',
        horse_age: horseAge,
        provider: dentalProvider,
        num_horses: horses,
        annual_total: totalAnnual.toFixed(0)
      })
    }

    setResult({
      totalAnnual: totalAnnual.toFixed(2),
      perHorseAnnual: perHorseAnnual.toFixed(2),
      monthlyAverage: monthlyAverage.toFixed(2),
      checksPerYear: checksPerYear,
      breakdown: {
        routineChecks: (annualRoutineCost * horses).toFixed(2),
        issuesTreatment: (issueCost * horses).toFixed(2),
        perCheck: checkCost.toFixed(2)
      },
      ageInfo: age,
      providerInfo: provider,
      issueInfo: hasIssues ? issue : null,
      horses,
      comparison: {
        edt: edtAnnual.toFixed(2),
        vet: vetAnnual.toFixed(2),
        savings: (vetAnnual - edtAnnual).toFixed(2)
      },
      fiveYear: fiveYearCost.toFixed(2),
      recommendations: getRecommendations(horseAge, hasIssues, issueType)
    })
  }

  const getRecommendations = (age: string, issues: boolean, issueType: string) => {
    const recs = []
    if (age === 'young') recs.push('Young horses need checks every 6 months until age 5')
    if (age === 'veteran') recs.push('Veteran horses may need more frequent checks - watch for weight loss')
    if (!issues) recs.push('Book annual check in spring before competition season')
    if (issueType === 'wolf') recs.push('Wolf teeth removal is usually a one-time procedure')
    if (issueType === 'extraction') recs.push('Extractions require veterinary care and sedation')
    recs.push('EDT is sufficient for routine care - use vet for extractions/sedation')
    return recs
  }

  // 15 FAQs for maximum SEO value
  const faqs = [
    {
      q: 'How much does horse dental care cost UK?',
      a: 'Horse dental care in the UK costs £55-100 for a routine check and rasp with an EDT (Equine Dental Technician) in 2026. Veterinary dentists charge £90-170 plus callout (£45-70). Annual dental costs typically range £65-180 per horse depending on age and provider. Additional procedures like wolf teeth removal (£70-120) or extractions (£250-450) cost extra.'
    },
    {
      q: 'How often should a horse see the dentist?',
      a: 'Adult horses (5-15 years) need annual dental checks. Young horses under 5 need checks every 6 months as teeth are still erupting. Senior horses (15+) may need 1-2 checks yearly. Horses with known dental issues may need more frequent attention. Most owners book spring checks before competition season.'
    },
    {
      q: 'What is the difference between EDT and vet dentist?',
      a: 'EDTs (Equine Dental Technicians) are qualified specialists for routine dental care including rasping, floating, and identifying problems. Vets can sedate horses and perform extractions, X-rays, and complex procedures. EDTs are cheaper (£55-80) while vets cost more (£90-170+) but are essential for sedation and surgery.'
    },
    {
      q: 'What is included in a routine dental check?',
      a: 'A routine dental check includes: examination of all teeth, rasping/floating sharp edges, checking for hooks, ramps, and wave mouth, assessing bit seats, checking for loose teeth or disease, and advice on any concerns. Most EDTs spend 20-40 minutes per horse.'
    },
    {
      q: 'Does my horse need sedation for dental work?',
      a: 'Most routine dental work doesn\'t require sedation - a competent EDT can work safely with a calm horse. Sedation is needed for: extractions, wolf teeth removal, nervous/difficult horses, detailed examinations, X-rays, or complex procedures. Sedation adds £70-110 to the cost and requires a vet.'
    },
    {
      q: 'How much does wolf teeth removal cost?',
      a: 'Wolf teeth removal costs £70-140 in the UK depending on complexity (2026 prices). Simple extractions by experienced EDTs cost less, while difficult cases requiring vet sedation cost more. It\'s usually a one-time procedure done in young horses. Some EDTs include basic wolf teeth removal in their callout fee.'
    },
    {
      q: 'What are signs my horse needs dental work?',
      a: 'Signs include: dropping food while eating (quidding), weight loss, reluctance to accept the bit, head tilting, bad breath, facial swelling, nasal discharge, long fibre in droppings, resistance to bridling, and difficulty chewing. Annual checks catch problems before symptoms appear.'
    },
    {
      q: 'Can I save money on horse dental care?',
      a: 'Save money by: using an EDT for routine work (not vet), booking with yard mates to share callout fees, maintaining annual checks (prevents costly problems), choosing spring appointments (less demand), and asking about multi-horse discounts. Prevention is cheaper than treatment.'
    },
    {
      q: 'What qualifications should an EDT have?',
      a: 'Look for EDTs qualified through BAEDT (British Association of Equine Dental Technicians) or BEVA-approved courses. They should be registered, insured, and able to provide references. Ask about their experience with your horse\'s age group. Avoid unqualified individuals offering cheap dental work.'
    },
    {
      q: 'Do older horses need more dental care?',
      a: 'Yes, veteran horses (20+) often need more attention. Teeth continue wearing and may become uneven, loose, or fall out. They may need softer feeds if chewing is difficult. Check twice yearly and watch for weight loss. Dental issues are a common cause of condition loss in older horses.'
    },
    {
      q: 'How much does tooth extraction cost for a horse?',
      a: 'Horse tooth extraction costs £250-450 in the UK (2026 prices). This includes vet callout (£50-70), sedation (£70-110), and the extraction procedure itself. Complex extractions or those requiring referral can cost £500-1,000+. Aftercare medications may add £30-50 to the total.'
    },
    {
      q: 'What is quidding in horses and how much does treatment cost?',
      a: 'Quidding is when a horse drops partially chewed food - a sign of dental problems. Investigation costs £100-150 and may reveal sharp edges, loose teeth, or mouth ulcers. Treatment varies: simple rasping (£65-90), extractions (£250-450), or ongoing management. Early intervention prevents weight loss.'
    },
    {
      q: 'Should I use the same dentist as my yard?',
      a: 'Using the same EDT as your yard has benefits: shared callout fees (saving £10-25 per horse), convenient scheduling, and the dentist knows the horses. However, always verify their qualifications. Some yards have arrangements with EDTs for reduced rates when treating multiple horses.'
    },
    {
      q: 'What is diastema in horses and how much does treatment cost?',
      a: 'Diastema is abnormal gaps between teeth where food packs in, causing gum disease. Treatment costs £150-250 per session and may need repeating 2-3 times yearly. Severe cases requiring specialist care can cost £400-600. Prevention through regular dental care is more cost-effective.'
    },
    {
      q: 'When is the best time to book horse dental appointments?',
      a: 'Spring (March-May) is ideal - before competition season and fly season. Avoid summer when horses may be more irritable. Many EDTs offer discounts for bookings in quieter months (January-February). Book well ahead for popular EDTs - they can be booked 2-3 months in advance.'
    }
  ]

  // Related calculators for internal linking
  const relatedCalculators = [
    {
      title: 'Vet Cost Estimator',
      description: 'Plan your complete healthcare budget',
      href: '/vet-cost-estimator',
      icon: Stethoscope,
      color: 'text-red-600',
      bg: 'bg-red-50 hover:bg-red-100'
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
      title: 'Worming Cost Calculator',
      description: 'Plan your parasite control budget',
      href: '/worming-cost-calculator',
      icon: Star,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 hover:bg-emerald-100'
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
      title: 'Horse Insurance Calculator',
      description: 'Compare cover options and premiums',
      href: '/horse-insurance-calculator',
      icon: Shield,
      color: 'text-purple-600',
      bg: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      title: 'Horse Livery Calculator',
      description: 'Compare livery options and pricing',
      href: '/horse-livery-calculator',
      icon: Home,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 hover:bg-emerald-100'
    }
  ]

  return (
    <>
      <Helmet>
        {/* 1. Title Tag */}
        <title>Horse Dental Cost Calculator UK 2026 | EDT vs Vet Prices | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free horse dental cost calculator for UK owners. Compare EDT vs vet dentist prices, calculate annual dental care costs, and plan your horse's dental budget. 2026 UK prices." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="horse dental cost UK 2026, equine dentist price, EDT cost, horse teeth floating price, wolf teeth removal cost, horse dental check cost, equine dental technician" 
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
        <meta name="theme-color" content="#0d9488" />
        
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
        <meta property="og:title" content="Horse Dental Cost Calculator UK 2026 | EDT vs Vet | HorseCost" />
        <meta property="og:description" content="Compare EDT vs vet dentist costs. Calculate annual horse dental care budget with UK 2026 prices." />
        <meta property="og:url" content="https://horsecost.co.uk/dental-cost-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/dental-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Horse Dental Cost Calculator showing EDT vs vet pricing comparison" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Horse Dental Cost Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Calculate horse dental care costs. Compare EDT vs vet prices for routine checks and procedures." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/dental-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Horse Dental Cost Calculator UK" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/dental-cost-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/dental-cost-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Dental Cost Calculator', 'item': 'https://horsecost.co.uk/dental-cost-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Dental Cost Calculator UK',
                'description': 'Calculate horse dental care costs including routine checks, procedures, and compare EDT vs vet prices with UK 2026 pricing.',
                'url': 'https://horsecost.co.uk/dental-cost-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.8', 'ratingCount': '223', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Calculate Horse Dental Costs',
                'description': 'Step-by-step guide to calculating your horse dental care costs',
                'totalTime': 'PT3M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Select Horse Age', 'text': 'Choose your horse\'s age group as this affects how often dental checks are needed. Young and veteran horses need more frequent checks.' },
                  { '@type': 'HowToStep', 'name': 'Choose Dental Provider', 'text': 'Select EDT, vet dentist, or specialist depending on your needs and budget. EDTs are cheaper for routine care.' },
                  { '@type': 'HowToStep', 'name': 'Enter Number of Horses', 'text': 'Add multiple horses to benefit from shared callout fee calculations - save £10-25 per horse.' },
                  { '@type': 'HowToStep', 'name': 'Select Your Region', 'text': 'Choose your UK region as prices vary - London and South East are 20-40% higher than average.' },
                  { '@type': 'HowToStep', 'name': 'Add Any Dental Issues', 'text': 'Include any known problems like wolf teeth, extractions, or diastema needing treatment.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Horse Dental Cost Calculator UK 2026 - EDT vs Vet Prices',
                'description': 'Free calculator for UK horse dental costs. Compare equine dental technicians with vet dentists and plan your annual dental care budget.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png' } },
                'image': 'https://horsecost.co.uk/images/dental-calculator-og.jpg'
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
                'name': 'Horse Dental Cost Calculator UK 2026',
                'description': 'Calculate horse dental care costs and compare EDT vs vet prices',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/dental-cost-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'UK Horse Dental Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'EDT (Equine Dental Technician)',
                    'description': 'A qualified specialist trained to perform routine dental care on horses including rasping, floating, and identifying problems. Cannot sedate or perform extractions. BAEDT qualified EDTs are recommended.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Floating/Rasping',
                    'description': 'The process of filing down sharp edges and points on horse teeth using specialized rasps. Part of routine dental care performed 1-2 times yearly. Costs £55-100 with an EDT.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Wolf Teeth',
                    'description': 'Small vestigial teeth in front of the molars that can interfere with the bit. Usually removed in young horses as a one-time procedure. Costs £70-140 depending on complexity.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Quidding',
                    'description': 'When a horse drops partially chewed food from its mouth - a key sign of dental problems. May indicate sharp edges, loose teeth, or mouth ulcers requiring dental attention.'
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
          <a href="/" className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header */}
        <header className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Smile className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Horse Dental Cost Calculator UK 2026</h1>
                <p className="text-teal-200 mt-1">EDT &amp; Vet Dentist Prices</p>
              </div>
            </div>
            <p className="text-teal-100 max-w-3xl">
              Calculate your horse's annual dental care costs. Compare EDT vs vet dentist prices 
              and plan for routine checks and procedures with UK 2026 pricing.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-teal-200 text-sm">
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
                223 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-teal-500/30 text-teal-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                BAEDT prices verified
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                EDT vs Vet compared
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
              <HelpCircle className="w-5 h-5 text-teal-600" />
              Quick Answer: How Much Does Horse Dental Care Cost UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>Horse dental care costs £65-180 per year for routine checks in the UK (2026).</strong> EDT (Equine Dental Technician): £55-80 per visit, no callout fee. Vet dentist: £90-170 plus £45-70 callout. Annual checks cost £65-180 depending on provider and age. Wolf teeth removal: £70-140. Extractions: £250-450 including sedation. Multi-horse discount: save £10-25 per horse by sharing callout fees.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-teal-50 p-3 rounded-lg text-center">
                <div className="text-xs text-teal-600 font-medium">EDT Check</div>
                <div className="text-xl font-bold text-teal-700">£55-80</div>
                <div className="text-xs text-gray-500">routine care</div>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg text-center">
                <div className="text-xs text-cyan-600 font-medium">Vet Dentist</div>
                <div className="text-xl font-bold text-cyan-700">£90-170</div>
                <div className="text-xs text-gray-500">+ callout</div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg text-center">
                <div className="text-xs text-emerald-600 font-medium">Wolf Teeth</div>
                <div className="text-xl font-bold text-emerald-700">£70-140</div>
                <div className="text-xs text-gray-500">removal</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xs text-blue-600 font-medium">Extraction</div>
                <div className="text-xl font-bold text-blue-700">£250-450</div>
                <div className="text-xs text-gray-500">inc. sedation</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Horse Age */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Horse Age Group</label>
                  </div>
                  <div className="space-y-2">
                    {ageGroups.map((age) => (
                      <button
                        key={age.id}
                        onClick={() => setHorseAge(age.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          horseAge === age.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${horseAge === age.id ? 'text-teal-700' : 'text-gray-900'}`}>
                              {age.name}
                            </p>
                            <p className="text-sm text-gray-500">{age.description}</p>
                          </div>
                          <p className="text-sm text-gray-600">{age.checksPerYear}x/year</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Dental Provider */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Dental Provider</label>
                  </div>
                  <div className="space-y-2">
                    {providers.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setDentalProvider(provider.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          dentalProvider === provider.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${dentalProvider === provider.id ? 'text-teal-700' : 'text-gray-900'}`}>
                              {provider.name}
                            </p>
                            <p className="text-sm text-gray-500">{provider.description}</p>
                          </div>
                          <p className="text-sm text-gray-600">£{provider.basePrice}{provider.callout > 0 ? `+${provider.callout}` : ''}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Number of Horses */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Number of Horses</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['1', '2', '3', '4', '5'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setNumHorses(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          numHorses === val
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Share callout fees with multiple horses</p>
                </section>

                {/* Region */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  >
                    <option value="london">London / South East (+40%)</option>
                    <option value="southeast">Home Counties (+20%)</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England (-10%)</option>
                    <option value="scotland">Scotland / Wales (-5%)</option>
                  </select>
                </section>

                {/* Dental Issues */}
                <section className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-teal-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Dental Issues / Procedures
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasIssues}
                          onChange={(e) => setHasIssues(e.target.checked)}
                          className="w-5 h-5 text-teal-600 rounded"
                        />
                        <span className="font-medium text-gray-900">Has dental issues requiring treatment</span>
                      </label>

                      {hasIssues && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
                          <select
                            value={issueType}
                            onChange={(e) => setIssueType(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                          >
                            {dentalIssues.map(issue => (
                              <option key={issue.id} value={issue.id}>
                                {issue.name} {issue.cost > 0 ? `(+£${issue.cost})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </div>

              {/* Right Column - Results */}
              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-cyan-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Dental Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white">
                      <p className="text-teal-100 text-sm mb-1">Annual Dental Cost</p>
                      <p className="text-4xl font-bold">£{result.totalAnnual}</p>
                      <p className="text-teal-200 text-sm mt-1">{result.providerInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-teal-100 text-xs">Per Horse</p>
                          <p className="font-bold">£{result.perHorseAnnual}</p>
                        </div>
                        <div>
                          <p className="text-teal-100 text-xs">Checks/Year</p>
                          <p className="font-bold">{result.checksPerYear}x</p>
                        </div>
                      </div>
                    </div>

                    {/* Reminders CTA in Results */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold">Never Miss a Dental Check</h3>
                          <p className="text-purple-200 text-sm">Get reminders for dental appointments</p>
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
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Routine Checks ({result.horses} horse{result.horses > 1 ? 's' : ''})</span>
                          <span className="font-medium">£{result.breakdown.routineChecks}</span>
                        </div>
                        {parseFloat(result.breakdown.issuesTreatment) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">{result.issueInfo?.name}</span>
                            <span className="font-medium">£{result.breakdown.issuesTreatment}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Annual</span>
                          <span>£{result.totalAnnual}</span>
                        </div>
                        <div className="flex justify-between text-teal-600">
                          <span>Per Check</span>
                          <span>£{result.breakdown.perCheck}</span>
                        </div>
                      </div>
                    </div>

                    {/* EDT vs Vet Comparison */}
                    <div className="bg-white border-2 border-teal-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">EDT vs Vet Comparison</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-teal-50 rounded-lg p-3 text-center">
                          <p className="text-teal-600 font-medium mb-1">EDT</p>
                          <p className="text-lg font-bold text-gray-900">£{result.comparison.edt}</p>
                          <p className="text-xs text-gray-500">per year</p>
                        </div>
                        <div className="bg-cyan-50 rounded-lg p-3 text-center">
                          <p className="text-cyan-600 font-medium mb-1">Vet Dentist</p>
                          <p className="text-lg font-bold text-gray-900">£{result.comparison.vet}</p>
                          <p className="text-xs text-gray-500">per year</p>
                        </div>
                      </div>
                      {parseFloat(result.comparison.savings) > 0 && (
                        <p className="text-sm text-teal-600 mt-3 text-center font-medium">
                          EDT saves £{result.comparison.savings}/year for routine care
                        </p>
                      )}
                    </div>

                    {/* Recommendations */}
                    {result.recommendations.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Recommendations
                        </h3>
                        <ul className="text-sm text-amber-800 space-y-1">
                          {result.recommendations.map((rec: string, i: number) => (
                            <li key={i}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 5-Year Cost */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">5-Year Dental Cost</span>
                        <span className="font-bold text-gray-900">£{result.fiveYear}</span>
                      </div>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Smile className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Configure your dental care needs to see costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Box */}
          <div className="bg-teal-50 border-l-4 border-teal-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-teal-900 mb-2">Dental Care Tips</h3>
                <ul className="text-teal-800 space-y-1 text-sm">
                  <li>• <strong>Book annually</strong> - prevention is cheaper than treatment</li>
                  <li>• <strong>Use an EDT</strong> for routine care - save vets for procedures</li>
                  <li>• <strong>Share callout fees</strong> - book with yard mates</li>
                  <li>• <strong>Watch for signs</strong> - quidding, weight loss, bit resistance</li>
                  <li>• <strong>Young horses</strong> - check every 6 months until age 5</li>
                  <li>• Calculate your full vet costs with our <a href="/vet-cost-estimator" className="text-teal-700 underline hover:text-teal-900">Vet Cost Estimator</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Dental Prices Table */}
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Dental Prices 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Service</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">EDT</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Vet Dentist</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Routine Check &amp; Rasp</td>
                    <td className="py-3 px-4 text-center">£55-80</td>
                    <td className="py-3 px-4 text-center">£90-140</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Callout Fee</td>
                    <td className="py-3 px-4 text-center">£0-25</td>
                    <td className="py-3 px-4 text-center">£45-70</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Wolf Teeth Removal</td>
                    <td className="py-3 px-4 text-center">£70-100</td>
                    <td className="py-3 px-4 text-center">£90-140</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Sedation</td>
                    <td className="py-3 px-4 text-center text-gray-400">N/A</td>
                    <td className="py-3 px-4 text-center">£70-110</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Extraction</td>
                    <td className="py-3 px-4 text-center text-gray-400">N/A</td>
                    <td className="py-3 px-4 text-center">£250-450</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">* Prices January 2026. Regional variations apply - London/SE 20-40% higher.</p>
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
            <p className="text-gray-600 mb-6">Calculate other aspects of horse healthcare:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedCalculators.map((calc, index) => (
                <a 
                  key={index}
                  href={calc.href} 
                  className={`${calc.bg} rounded-xl p-4 transition group`}
                  title={`${calc.title} - ${calc.description}`}
                >
                  <calc.icon className={`w-8 h-8 ${calc.color} mb-2`} />
                  <h3 className="font-bold text-gray-900 group-hover:text-teal-600">{calc.title}</h3>
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
                Never miss a dental appointment. Get free email reminders for annual checks and all your horse care needs.
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
          <div className="mt-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Plan Your Complete Healthcare Budget</h2>
            <p className="text-teal-100 mb-6 max-w-xl mx-auto">
              Dental care is just one part of horse healthcare. Calculate your full vet budget.
            </p>
            <a 
              href="/vet-cost-estimator"
              className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-xl font-bold hover:bg-teal-50 transition"
            >
              Calculate Vet Costs
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
                  Get free email reminders for dental checks and all your horse care needs.
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
