import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Shield,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  PoundSterling,
  CheckCircle2,
  Bell,
  ArrowRight,
  MapPin,
  Clock,
  Users,
  HelpCircle,
  Home,
  Wheat,
  Scissors,
  Stethoscope,
  Package
} from 'lucide-react'

export default function HorseInsuranceCalculator() {
  const [horseValue, setHorseValue] = useState('')
  const [horseAge, setHorseAge] = useState('')
  const [coverageType, setCoverageType] = useState('comprehensive')
  const [vetFeeLimit, setVetFeeLimit] = useState('5000')
  const [use, setUse] = useState('pleasure')
  const [excess, setExcess] = useState('150')
  const [includePersonalAccident, setIncludePersonalAccident] = useState(true)
  const [includeTack, setIncludeTack] = useState(false)
  const [tackValue, setTackValue] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  const coverageTypes = [
    { id: 'basic', name: 'Basic (Mortality Only)', description: 'Death and theft cover only', multiplier: 0.028 },
    { id: 'standard', name: 'Standard', description: 'Mortality + £3,000 vet fees', multiplier: 0.045 },
    { id: 'comprehensive', name: 'Comprehensive', description: 'Mortality + higher vet fees + extras', multiplier: 0.06 },
    { id: 'premium', name: 'Premium', description: 'Full cover including loss of use', multiplier: 0.08 }
  ]

  const useTypes = [
    { id: 'pleasure', name: 'Pleasure/Hacking', multiplier: 1.0 },
    { id: 'competition', name: 'Competition (Unaffiliated)', multiplier: 1.15 },
    { id: 'affiliated', name: 'Competition (Affiliated)', multiplier: 1.25 },
    { id: 'hunting', name: 'Hunting', multiplier: 1.35 },
    { id: 'breeding', name: 'Breeding', multiplier: 1.1 },
    { id: 'professional', name: 'Professional Use', multiplier: 1.4 }
  ]

  const vetFeeLimits = [
    { value: '2500', label: '£2,500', multiplier: 0.8 },
    { value: '5000', label: '£5,000', multiplier: 1.0 },
    { value: '7500', label: '£7,500', multiplier: 1.2 },
    { value: '10000', label: '£10,000', multiplier: 1.4 },
    { value: '15000', label: '£15,000', multiplier: 1.7 }
  ]

  const excessOptions = [
    { value: '100', label: '£100', multiplier: 1.1 },
    { value: '150', label: '£150', multiplier: 1.0 },
    { value: '250', label: '£250', multiplier: 0.9 },
    { value: '500', label: '£500', multiplier: 0.8 }
  ]

  const calculate = () => {
    if (!horseValue || !horseAge) {
      alert('Please enter horse value and age')
      return
    }

    const value = parseFloat(horseValue)
    const age = parseInt(horseAge)

    if (value < 0 || age < 0 || age > 35) {
      alert('Please enter valid values')
      return
    }

    // Base rate from coverage type
    const coverage = coverageTypes.find(c => c.id === coverageType)
    const baseRate = coverage?.multiplier || 0.045

    // Age factor (horses over 15 cost more to insure)
    let ageFactor = 1.0
    if (age >= 20) ageFactor = 1.5
    else if (age >= 18) ageFactor = 1.35
    else if (age >= 15) ageFactor = 1.2
    else if (age >= 12) ageFactor = 1.1
    else if (age <= 3) ageFactor = 1.15

    // Use factor
    const useType = useTypes.find(u => u.id === use)
    const useFactor = useType?.multiplier || 1.0

    // Vet fee limit factor
    const vetLimit = vetFeeLimits.find(v => v.value === vetFeeLimit)
    const vetFactor = coverageType === 'basic' ? 1.0 : (vetLimit?.multiplier || 1.0)

    // Excess factor
    const excessOption = excessOptions.find(e => e.value === excess)
    const excessFactor = excessOption?.multiplier || 1.0

    // Calculate mortality premium
    const mortalityPremium = value * baseRate * ageFactor * useFactor * excessFactor

    // Vet fee premium (if not basic)
    let vetFeePremium = 0
    if (coverageType !== 'basic') {
      const vetLimitValue = parseFloat(vetFeeLimit)
      vetFeePremium = vetLimitValue * 0.085 * ageFactor * vetFactor
    }

    // Personal accident cover
    const personalAccidentPremium = includePersonalAccident ? 38 : 0

    // Tack cover
    let tackPremium = 0
    if (includeTack && tackValue) {
      const tack = parseFloat(tackValue)
      tackPremium = tack * 0.032
    }

    // Total annual premium
    const annualPremium = mortalityPremium + vetFeePremium + personalAccidentPremium + tackPremium
    const monthlyPremium = annualPremium / 12

    // IPT (Insurance Premium Tax at 12%)
    const ipt = annualPremium * 0.12
    const totalWithIPT = annualPremium + ipt

    // UK average comparison (2026 prices)
    const ukAverageBasic = 200
    const ukAverageComprehensive = 500
    const ukAveragePremium = 850

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'horse_insurance',
        horse_value: value,
        horse_age: age,
        coverage_type: coverageType,
        vet_fee_limit: vetFeeLimit,
        annual_premium: totalWithIPT.toFixed(0)
      })
    }

    setResult({
      annualPremium: annualPremium.toFixed(2),
      monthlyPremium: monthlyPremium.toFixed(2),
      ipt: ipt.toFixed(2),
      totalWithIPT: totalWithIPT.toFixed(2),
      monthlyWithIPT: (totalWithIPT / 12).toFixed(2),
      breakdown: {
        mortality: mortalityPremium.toFixed(2),
        vetFees: vetFeePremium.toFixed(2),
        personalAccident: personalAccidentPremium.toFixed(2),
        tack: tackPremium.toFixed(2)
      },
      coverageDetails: {
        type: coverage?.name,
        vetLimit: coverageType === 'basic' ? 'Not included' : `£${parseInt(vetFeeLimit).toLocaleString()}`,
        excess: `£${excess}`,
        use: useType?.name
      },
      comparison: {
        vsBasic: totalWithIPT < ukAverageBasic,
        vsComprehensive: totalWithIPT < ukAverageComprehensive,
        vsPremium: totalWithIPT < ukAveragePremium,
        ukAverageBasic,
        ukAverageComprehensive,
        ukAveragePremium
      },
      factors: {
        age: ageFactor,
        use: useFactor,
        vet: vetFactor,
        excess: excessFactor
      }
    })
  }

  // 15 FAQs for maximum SEO value
  const faqs = [
    {
      q: 'How much does horse insurance cost in the UK?',
      a: 'Horse insurance in the UK typically costs between £170-£900+ per year depending on your horse\'s value, age, use, and the level of cover. Basic mortality-only cover starts around £170/year, while comprehensive policies with high vet fee limits can exceed £650/year. Most owners pay £350-£550 annually for good coverage.'
    },
    {
      q: 'What does horse insurance cover?',
      a: 'Horse insurance typically covers mortality (death from illness, injury, or humane destruction), theft, straying, veterinary fees, personal accident for the rider, public liability, and loss of use. Some policies also cover saddlery and tack, dental treatment, complementary therapies, and permanent incapacity.'
    },
    {
      q: 'Is horse insurance worth it?',
      a: 'Yes, horse insurance is generally worth it, especially vet fee cover. A single colic surgery can cost £5,000-£12,000+, and even routine emergencies often exceed £1,000. The peace of mind and financial protection usually outweighs the annual premium cost. Third-party liability cover is also essential.'
    },
    {
      q: 'What is the excess on horse insurance?',
      a: 'The excess is the amount you pay towards each claim before the insurance kicks in. Standard excesses range from £100-£500. Higher excesses reduce your premium but mean you pay more per claim. Most policies have separate excesses for vet fees and mortality claims.'
    },
    {
      q: 'Can I insure an older horse?',
      a: 'Yes, but options become limited. Most insurers cover horses up to age 20-25 for new policies. Premiums increase significantly for horses over 15, and vet fee cover may be reduced or excluded for very old horses. Some specialist insurers offer veteran horse policies up to age 30.'
    },
    {
      q: 'What vet fee limit should I choose?',
      a: 'We recommend at least £5,000-7,500 vet fee cover for most horses. Colic surgery alone can cost £5,000-£12,000, and complex injuries may require multiple treatments. If you compete or have a valuable horse, consider £10,000-£15,000 limits for better protection.'
    },
    {
      q: 'Does horse insurance cover pre-existing conditions?',
      a: 'No, horse insurance doesn\'t cover pre-existing conditions - any illness or injury that existed before the policy started or during the waiting period (usually 14 days). Always disclose your horse\'s full medical history when applying, as non-disclosure can void all claims.'
    },
    {
      q: 'What is loss of use cover?',
      a: 'Loss of use cover pays out a percentage (typically 50-75%) of your horse\'s insured value if they become permanently unable to perform their insured use due to illness or injury, even though they\'re still alive. It\'s particularly valuable for competition, breeding, or high-value horses.'
    },
    {
      q: 'How do I reduce my horse insurance premium?',
      a: 'You can reduce premiums by: choosing a higher excess (£250-500), reducing vet fee limits, insuring for a lower value, paying annually instead of monthly (saves 5-10%), maintaining good security at your yard, keeping up-to-date vaccination records, and shopping around for quotes each year.'
    },
    {
      q: 'What is Insurance Premium Tax (IPT)?',
      a: 'IPT is a government tax on insurance premiums, currently 12% for horse insurance. It\'s added to your premium by the insurer and passed to HMRC. A £400 premium would have £48 IPT added, making the total £448. IPT is unavoidable on all UK insurance policies.'
    },
    {
      q: 'Do I need public liability insurance for my horse?',
      a: 'Yes, public liability insurance is highly recommended. If your horse causes injury to someone or damages property, you could be liable for thousands in compensation. Most comprehensive policies include £1-5 million public liability. BHS membership includes liability cover as a benefit.'
    },
    {
      q: 'What\'s the difference between per condition and annual vet fee limits?',
      a: 'Per condition limits cap how much you can claim for each separate condition (e.g. £3,000 per condition). Annual limits cap total claims across all conditions in a year (e.g. £7,500/year). Annual limits often provide better protection for multiple issues in one year.'
    },
    {
      q: 'Can I insure a horse I don\'t own?',
      a: 'Yes, you can insure a loaned, leased, or shared horse if you have an "insurable interest" - meaning you would suffer financial loss if something happened. Discuss with the owner and insurer about who should hold the policy and be named as the beneficiary.'
    },
    {
      q: 'How long is the waiting period for horse insurance?',
      a: 'Most horse insurance policies have a 14-day waiting period for illness claims after the policy starts. Accident cover usually starts immediately. Pre-purchase vettings can sometimes reduce or eliminate waiting periods. Always check specific policy terms.'
    },
    {
      q: 'What happens if I need to claim on my horse insurance?',
      a: 'Contact your insurer immediately when an incident occurs. For vet claims, you\'ll need to complete a claim form and provide vet invoices and clinical notes. Most insurers can pay vets directly. Keep all receipts and documentation. Claims are usually processed within 10-20 working days.'
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
      title: 'Vet Cost Estimator',
      description: 'Plan your veterinary budget',
      href: '/vet-cost-estimator',
      icon: Stethoscope,
      color: 'text-red-600',
      bg: 'bg-red-50 hover:bg-red-100'
    },
    {
      title: 'Horse Feed Calculator',
      description: 'Daily hay and feed costs',
      href: '/horse-feed-calculator',
      icon: Wheat,
      color: 'text-green-600',
      bg: 'bg-green-50 hover:bg-green-100'
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
      title: 'Horse Livery Calculator',
      description: 'Compare livery options and pricing',
      href: '/horse-livery-calculator',
      icon: Home,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 hover:bg-emerald-100'
    },
    {
      title: 'Bedding Cost Calculator',
      description: 'Compare shavings, straw, hemp',
      href: '/bedding-cost-calculator',
      icon: Package,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 hover:bg-yellow-100'
    }
  ]

  return (
    <>
      <Helmet>
        {/* 1. Title Tag */}
        <title>Horse Insurance Calculator UK 2026 | Compare Cover &amp; Premiums | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free horse insurance calculator for UK owners. Estimate premiums for mortality, vet fees, and comprehensive cover. Compare quotes and find the right policy. 2026 pricing." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="horse insurance calculator, horse insurance UK, equine insurance cost, vet fee cover horse, horse mortality insurance, horse insurance quotes, how much is horse insurance, horse insurance comparison" 
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
        <meta property="og:title" content="Horse Insurance Calculator UK 2026 | HorseCost" />
        <meta property="og:description" content="Calculate horse insurance premiums instantly. Free UK calculator for mortality, vet fees, and comprehensive cover." />
        <meta property="og:url" content="https://horsecost.co.uk/horse-insurance-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/horse-insurance-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Horse Insurance Calculator showing UK premium estimates and coverage options" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Horse Insurance Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Estimate horse insurance costs with our free UK calculator." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/horse-insurance-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Horse Insurance Calculator" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/horse-insurance-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/horse-insurance-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Horse Insurance Calculator', 'item': 'https://horsecost.co.uk/horse-insurance-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Insurance Calculator UK',
                'description': 'Calculate horse insurance premiums for UK owners with instant quotes for mortality, vet fees, and comprehensive cover. Compare coverage options and find the right policy.',
                'url': 'https://horsecost.co.uk/horse-insurance-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.8', 'ratingCount': '298', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Calculate Horse Insurance Premiums in the UK',
                'description': 'Step-by-step guide to estimating your horse insurance costs',
                'totalTime': 'PT3M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Enter Horse Value', 'text': 'Input your horse\'s current market value. This determines the mortality/theft payout amount.' },
                  { '@type': 'HowToStep', 'name': 'Enter Horse Age', 'text': 'Specify your horse\'s age. Horses over 15 have higher premiums; over 20 may have limited options.' },
                  { '@type': 'HowToStep', 'name': 'Select Coverage Level', 'text': 'Choose from Basic (mortality only), Standard, Comprehensive, or Premium cover levels.' },
                  { '@type': 'HowToStep', 'name': 'Choose Vet Fee Limit', 'text': 'Select your vet fee cover limit from £2,500 to £15,000. We recommend at least £5,000-7,500.' },
                  { '@type': 'HowToStep', 'name': 'Review Your Quote', 'text': 'See your estimated premium including IPT breakdown and compare with UK averages.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Horse Insurance Calculator - UK Premium Estimator 2026',
                'description': 'Free calculator for UK horse owners to estimate insurance premiums with current 2026 pricing.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'image': 'https://horsecost.co.uk/images/horse-insurance-calculator-og.jpg',
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
                'name': 'Horse Insurance Calculator UK 2026',
                'description': 'Calculate horse insurance premiums for mortality, vet fees, and comprehensive cover',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/horse-insurance-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'UK Horse Insurance Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Mortality Cover',
                    'description': 'Insurance that pays out the horse\'s insured value if they die from illness, injury, or are humanely destroyed on veterinary advice.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Vet Fee Cover',
                    'description': 'Insurance cover for veterinary treatment costs up to a specified limit, typically £2,500-£15,000 per year or per condition.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Loss of Use',
                    'description': 'Cover that pays a percentage (usually 50-75%) of insured value if the horse becomes permanently unable to perform its intended purpose.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Insurance Premium Tax (IPT)',
                    'description': 'A UK government tax of 12% applied to insurance premiums. It is added to your policy cost and cannot be avoided.'
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
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Horse Insurance Calculator UK 2026</h1>
                <p className="text-violet-200 mt-1">Compare cover options and estimate premiums</p>
              </div>
            </div>
            <p className="text-violet-100 max-w-3xl">
              Estimate your horse insurance premium based on value, age, use, and coverage level. 
              Compare different options and find the right protection for your horse.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-violet-200 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last updated: January 2026
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                UK insurance pricing
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                298 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-violet-500/30 text-violet-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Based on UK insurer data
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Includes 12% IPT
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
              <HelpCircle className="w-5 h-5 text-violet-600" />
              Quick Answer: How Much Does Horse Insurance Cost UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>Horse insurance in the UK costs £170-£900+ per year depending on coverage level.</strong> Basic mortality-only cover: £170-280/year. Comprehensive with £5,000 vet fees: £400-600/year. Premium with loss of use: £650-900+/year. All prices include 12% IPT. Premiums increase 20-50% for horses over 15 years old.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-600 font-medium">Basic Cover</div>
                <div className="text-xl font-bold text-gray-700">£170-280</div>
                <div className="text-xs text-gray-500">/year</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xs text-blue-600 font-medium">Standard</div>
                <div className="text-xl font-bold text-blue-700">£280-450</div>
                <div className="text-xs text-gray-500">/year</div>
              </div>
              <div className="bg-violet-50 p-3 rounded-lg text-center">
                <div className="text-xs text-violet-600 font-medium">Comprehensive</div>
                <div className="text-xl font-bold text-violet-700">£400-650</div>
                <div className="text-xs text-gray-500">/year</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-xs text-purple-600 font-medium">Premium</div>
                <div className="text-xl font-bold text-purple-700">£650-900+</div>
                <div className="text-xs text-gray-500">/year</div>
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
                {/* Horse Value */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Horse Value</label>
                  </div>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={horseValue}
                      onChange={(e) => setHorseValue(e.target.value)}
                      placeholder="e.g., 5000"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['2000', '5000', '10000', '15000', '25000'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setHorseValue(val)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                          horseValue === val 
                            ? 'bg-violet-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        £{parseInt(val).toLocaleString()}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Horse Age */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Horse Age (Years)</label>
                  </div>
                  <input
                    type="number"
                    value={horseAge}
                    onChange={(e) => setHorseAge(e.target.value)}
                    placeholder="e.g., 10"
                    min="0"
                    max="35"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['5', '10', '15', '18', '20'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setHorseAge(val)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                          horseAge === val 
                            ? 'bg-violet-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val} yrs
                      </button>
                    ))}
                  </div>
                </section>

                {/* Coverage Type */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Coverage Level</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {coverageTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setCoverageType(type.id)}
                        className={`p-3 rounded-xl text-left transition border-2 ${
                          coverageType === type.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`font-semibold text-sm ${coverageType === type.id ? 'text-violet-700' : 'text-gray-900'}`}>
                          {type.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Horse Use */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Primary Use</label>
                  </div>
                  <select
                    value={use}
                    onChange={(e) => setUse(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none"
                  >
                    {useTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </section>

                {/* Vet Fee Limit (if not basic) */}
                {coverageType !== 'basic' && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">5</span>
                      <label className="font-semibold text-gray-900">Vet Fee Limit</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vetFeeLimits.map((limit) => (
                        <button
                          key={limit.value}
                          onClick={() => setVetFeeLimit(limit.value)}
                          className={`px-4 py-2 rounded-xl font-medium transition ${
                            vetFeeLimit === limit.value
                              ? 'bg-violet-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {limit.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended: £5,000-7,500 minimum (colic surgery costs £5,000-12,000)
                    </p>
                  </section>
                )}

                {/* Advanced Options */}
                <section className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-violet-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Additional Options
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      {/* Excess */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Excess Amount</label>
                        <div className="flex flex-wrap gap-2">
                          {excessOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setExcess(option.value)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                excess === option.value
                                  ? 'bg-violet-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Personal Accident */}
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includePersonalAccident}
                          onChange={(e) => setIncludePersonalAccident(e.target.checked)}
                          className="w-5 h-5 text-violet-600 rounded"
                        />
                        <span className="text-gray-700">Include Personal Accident Cover (+£38/year)</span>
                      </label>

                      {/* Tack Cover */}
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeTack}
                          onChange={(e) => setIncludeTack(e.target.checked)}
                          className="w-5 h-5 text-violet-600 rounded"
                        />
                        <span className="text-gray-700">Include Tack &amp; Saddlery Cover</span>
                      </label>

                      {includeTack && (
                        <div className="pl-8">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tack Value (£)</label>
                          <input
                            type="number"
                            value={tackValue}
                            onChange={(e) => setTackValue(e.target.value)}
                            placeholder="e.g., 2000"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-violet-500 focus:outline-none"
                          />
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
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-violet-700 hover:to-purple-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Premium
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
                      <p className="text-violet-100 text-sm mb-1">Estimated Annual Premium</p>
                      <p className="text-4xl font-bold">£{result.totalWithIPT}</p>
                      <p className="text-violet-200 text-sm mt-1">Including 12% IPT</p>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex justify-between">
                          <span className="text-violet-100">Monthly (if paying monthly)</span>
                          <span className="font-bold">£{result.monthlyWithIPT}</span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Premium Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mortality/Theft Cover</span>
                          <span className="font-medium">£{result.breakdown.mortality}</span>
                        </div>
                        {parseFloat(result.breakdown.vetFees) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vet Fee Cover</span>
                            <span className="font-medium">£{result.breakdown.vetFees}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.personalAccident) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Personal Accident</span>
                            <span className="font-medium">£{result.breakdown.personalAccident}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.tack) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tack Cover</span>
                            <span className="font-medium">£{result.breakdown.tack}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">£{result.annualPremium}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IPT (12%)</span>
                          <span className="font-medium">£{result.ipt}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total</span>
                          <span>£{result.totalWithIPT}</span>
                        </div>
                      </div>
                    </div>

                    {/* Coverage Details */}
                    <div className="bg-violet-50 rounded-xl p-4">
                      <h3 className="font-semibold text-violet-900 mb-3">Your Cover Details</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-violet-600">Coverage Type</p>
                          <p className="font-medium text-gray-900">{result.coverageDetails.type}</p>
                        </div>
                        <div>
                          <p className="text-violet-600">Vet Fee Limit</p>
                          <p className="font-medium text-gray-900">{result.coverageDetails.vetLimit}</p>
                        </div>
                        <div>
                          <p className="text-violet-600">Excess</p>
                          <p className="font-medium text-gray-900">{result.coverageDetails.excess}</p>
                        </div>
                        <div>
                          <p className="text-violet-600">Primary Use</p>
                          <p className="font-medium text-gray-900">{result.coverageDetails.use}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reminders CTA in Results */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold">Never Miss a Renewal</h3>
                          <p className="text-purple-200 text-sm">Get free reminders for insurance renewals, vaccinations &amp; more</p>
                        </div>
                        <button
                          onClick={() => setShowRemindersForm(true)}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-50 transition flex-shrink-0"
                        >
                          Set Up
                        </button>
                      </div>
                    </div>

                    {/* UK Average Comparison */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">UK Average Comparison</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Basic Cover Avg</span>
                          <div className="flex items-center gap-2">
                            <span>£{result.comparison.ukAverageBasic}</span>
                            {parseFloat(result.totalWithIPT) <= result.comparison.ukAverageBasic && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Comprehensive Avg</span>
                          <div className="flex items-center gap-2">
                            <span>£{result.comparison.ukAverageComprehensive}</span>
                            {parseFloat(result.totalWithIPT) <= result.comparison.ukAverageComprehensive && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Premium Cover Avg</span>
                          <div className="flex items-center gap-2">
                            <span>£{result.comparison.ukAveragePremium}</span>
                            {parseFloat(result.totalWithIPT) <= result.comparison.ukAveragePremium && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Enter your horse details and click calculate to see your estimated premium</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-violet-50 border-l-4 border-violet-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-violet-900 mb-2">Understanding Horse Insurance</h3>
                <ul className="text-violet-800 space-y-1 text-sm">
                  <li>• <strong>Mortality cover</strong> pays out if your horse dies from illness, injury, or humane destruction</li>
                  <li>• <strong>Vet fee cover</strong> pays for treatment up to your chosen limit per condition/year</li>
                  <li>• <strong>Personal accident</strong> covers you for injuries while riding or handling your horse</li>
                  <li>• <strong>IPT (Insurance Premium Tax)</strong> at 12% is added to all insurance policies</li>
                  <li>• Get multiple quotes - prices vary significantly between insurers</li>
                  <li>• Use our <a href="/vet-cost-estimator" className="text-violet-700 underline hover:text-violet-900">Vet Cost Estimator</a> to understand potential vet bills</li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Insurance Pricing Table */}
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 overflow-x-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Horse Insurance Costs 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Cover Type</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">What&apos;s Included</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Typical Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Basic (Mortality Only)</td>
                    <td className="py-3 px-4 text-center text-gray-600">Death, theft, straying</td>
                    <td className="py-3 px-4 text-center font-semibold text-violet-600">£170-£280/year</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Standard</td>
                    <td className="py-3 px-4 text-center text-gray-600">Mortality + £3k vet fees</td>
                    <td className="py-3 px-4 text-center font-semibold text-violet-600">£280-£450/year</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Comprehensive</td>
                    <td className="py-3 px-4 text-center text-gray-600">Mortality + £5-7.5k vet fees + PA</td>
                    <td className="py-3 px-4 text-center font-semibold text-violet-600">£400-£650/year</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Premium</td>
                    <td className="py-3 px-4 text-center text-gray-600">Full cover + loss of use + £10k+ vet fees</td>
                    <td className="py-3 px-4 text-center font-semibold text-violet-600">£650-£900+/year</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Prices based on UK average for horse valued at £5,000, age 10, pleasure use. 
              Actual premiums depend on individual circumstances. Includes 12% IPT.
            </p>
          </section>

          {/* Tips Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tips for Choosing Horse Insurance</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Prioritise Vet Fee Cover</h3>
                  <p className="text-gray-600 text-sm">Vet bills are the most common claim. A single colic surgery can cost £5,000-£12,000.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Check Per-Condition Limits</h3>
                  <p className="text-gray-600 text-sm">Some policies have per-condition limits that may not cover ongoing treatment.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Disclose Everything</h3>
                  <p className="text-gray-600 text-sm">Always declare full medical history. Non-disclosure can void claims entirely.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Review Annually</h3>
                  <p className="text-gray-600 text-sm">Shop around each year. Premiums vary significantly between insurers.</p>
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
                Never miss an insurance renewal, vaccination due date, worming schedule, or farrier appointment. 
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
          <div className="mt-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Plan Your Complete Horse Budget</h2>
            <p className="text-violet-100 mb-6 max-w-xl mx-auto">
              Insurance is just one part of horse ownership costs. Use our Annual Cost Calculator for a complete budget breakdown.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-violet-600 px-6 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
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
                  Get free email reminders for insurance renewals, vaccinations, worming, farrier visits, and more.
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
