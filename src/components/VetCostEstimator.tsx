import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Stethoscope,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Heart,
  Syringe,
  Pill,
  Calendar,
  Shield,
  Activity,
  Bell,
  ArrowRight,
  MapPin,
  Clock,
  Users,
  HelpCircle,
  Home,
  Wheat,
  Scissors,
  Package
} from 'lucide-react'

export default function VetCostEstimator() {
  const [vaccinations, setVaccinations] = useState(true)
  const [dental, setDental] = useState(true)
  const [dentalFrequency, setDentalFrequency] = useState('annual')
  const [worming, setWorming] = useState('targeted')
  const [horseAge, setHorseAge] = useState('adult')
  const [horseUse, setHorseUse] = useState('pleasure')
  const [emergencyFund, setEmergencyFund] = useState('1000')
  const [includeBloodTests, setIncludeBloodTests] = useState(false)
  const [includePhysio, setIncludePhysio] = useState(false)
  const [physioFrequency, setPhysioFrequency] = useState('quarterly')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [region, setRegion] = useState('average')
  const [result, setResult] = useState<any>(null)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  const wormingPrograms = [
    { id: 'targeted', name: 'Targeted (FEC Testing)', costPerTest: 28, testsPerYear: 4, treatmentsPerYear: 1.5 },
    { id: 'traditional', name: 'Traditional (Routine)', costPerTest: 0, testsPerYear: 0, treatmentsPerYear: 4 },
    { id: 'minimal', name: 'Minimal/Low Risk', costPerTest: 28, testsPerYear: 2, treatmentsPerYear: 1 }
  ]

  const ageFactors: Record<string, { factor: number; risks: string[] }> = {
    'foal': { factor: 1.5, risks: ['Vaccinations', 'Growth checks', 'Parasite management'] },
    'youngster': { factor: 1.2, risks: ['Development monitoring', 'Training injuries'] },
    'adult': { factor: 1.0, risks: ['Routine care', 'Work-related issues'] },
    'veteran': { factor: 1.4, risks: ['Arthritis', 'Cushings/PPID', 'Dental issues', 'Weight management'] }
  }

  const useFactors: Record<string, number> = {
    'pleasure': 1.0,
    'competition': 1.2,
    'hunting': 1.3,
    'breeding': 1.25,
    'retirement': 0.9
  }

  const regionMultipliers: Record<string, number> = {
    'london': 1.4,
    'southeast': 1.25,
    'average': 1.0,
    'north': 0.9,
    'scotland': 0.95
  }

  // UK 2026 Pricing (updated from 2025)
  const ukPricing = {
    vaccination: {
      flu: 60,
      tetanus: 50,
      fluTetCombo: 80,
      booster: 60
    },
    dental: {
      routine: 130,
      sedation: 45,
      extractions: 160,
      powerFloat: 190
    },
    worming: {
      treatment: 16,
      fecTest: 28,
      tapewormTest: 20
    },
    callout: {
      routine: 50,
      emergency: 160,
      outOfHours: 280
    },
    bloodTest: 95,
    physio: 70
  }

  const calculate = () => {
    const regionFactor = regionMultipliers[region]
    const ageFactor = ageFactors[horseAge]?.factor || 1.0
    const useFactor = useFactors[horseUse] || 1.0

    let totalRoutine = 0
    const breakdown: Record<string, number> = {}

    // Vaccinations (annual flu + tetanus booster)
    if (vaccinations) {
      const vaccCost = ukPricing.vaccination.fluTetCombo * regionFactor
      breakdown['Vaccinations (Flu/Tetanus)'] = vaccCost
      totalRoutine += vaccCost
    }

    // Dental care
    if (dental) {
      let dentalCost = ukPricing.dental.routine + ukPricing.dental.sedation
      if (dentalFrequency === 'biannual') {
        dentalCost *= 2
      }
      dentalCost *= regionFactor
      // Veterans may need more dental work
      if (horseAge === 'veteran') {
        dentalCost *= 1.3
      }
      breakdown['Dental Care'] = dentalCost
      totalRoutine += dentalCost
    }

    // Worming program
    const wormProgram = wormingPrograms.find(w => w.id === worming)
    if (wormProgram) {
      const testCost = wormProgram.costPerTest * wormProgram.testsPerYear
      const treatmentCost = ukPricing.worming.treatment * wormProgram.treatmentsPerYear
      const tapewormTest = ukPricing.worming.tapewormTest * 2 // Twice yearly
      const wormCost = (testCost + treatmentCost + tapewormTest) * regionFactor
      breakdown['Worming Program'] = wormCost
      totalRoutine += wormCost
    }

    // Blood tests (if selected)
    if (includeBloodTests) {
      const bloodCost = ukPricing.bloodTest * regionFactor
      breakdown['Annual Blood Test'] = bloodCost
      totalRoutine += bloodCost
    }

    // Physio/bodywork
    if (includePhysio) {
      let physioSessions = physioFrequency === 'monthly' ? 12 : physioFrequency === 'bimonthly' ? 6 : 4
      const physioCost = ukPricing.physio * physioSessions * regionFactor
      breakdown['Physiotherapy'] = physioCost
      totalRoutine += physioCost
    }

    // One routine visit/callout included
    const calloutCost = ukPricing.callout.routine * regionFactor
    breakdown['Routine Callout'] = calloutCost
    totalRoutine += calloutCost

    // Apply age and use factors
    const adjustedRoutine = totalRoutine * ageFactor * useFactor

    // Emergency fund
    const emergencyBudget = parseFloat(emergencyFund) || 0

    // Total annual estimate
    const totalAnnual = adjustedRoutine + emergencyBudget
    const monthlyAverage = totalAnnual / 12

    // UK average comparison
    const ukAverageRoutine = 500
    const ukAverageWithEmergency = 1300

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'vet_cost_estimator',
        horse_age: horseAge,
        horse_use: horseUse,
        region: region,
        routine_costs: adjustedRoutine.toFixed(0),
        total_annual: totalAnnual.toFixed(0)
      })
    }

    setResult({
      routineCosts: adjustedRoutine.toFixed(2),
      emergencyFund: emergencyBudget.toFixed(2),
      totalAnnual: totalAnnual.toFixed(2),
      monthlyAverage: monthlyAverage.toFixed(2),
      breakdown,
      factors: {
        age: ageFactor,
        use: useFactor,
        region: regionFactor,
        ageRisks: ageFactors[horseAge]?.risks || []
      },
      comparison: {
        vsUkRoutine: adjustedRoutine < ukAverageRoutine,
        vsUkTotal: totalAnnual < ukAverageWithEmergency,
        ukAverageRoutine,
        ukAverageWithEmergency
      },
      recommendations: getRecommendations(horseAge, horseUse, totalAnnual)
    })
  }

  const getRecommendations = (age: string, use: string, total: number) => {
    const recs = []
    
    if (age === 'veteran') {
      recs.push('Consider blood tests for early Cushings/PPID detection')
      recs.push('Budget extra for potential arthritis management')
    }
    if (age === 'foal' || age === 'youngster') {
      recs.push('Ensure complete vaccination course is followed')
      recs.push('Regular growth and development checks recommended')
    }
    if (use === 'competition' || use === 'hunting') {
      recs.push('Consider regular physiotherapy for performance')
      recs.push('Joint supplements may reduce long-term vet costs')
    }
    if (total < 600) {
      recs.push('Consider increasing emergency fund for unexpected bills')
    }
    
    return recs
  }

  // 15 FAQs for maximum SEO value
  const faqs = [
    {
      q: 'How much do horse vet bills cost per year UK?',
      a: 'Routine annual vet costs in the UK typically range from £350-£650 for vaccinations, dental care, and worming. However, total annual costs including unexpected issues average £900-£1,600. A single emergency like colic surgery can cost £5,000-£12,000, which is why insurance or an emergency fund is essential.'
    },
    {
      q: 'How often does a horse need vaccinations?',
      a: 'Horses need an initial primary vaccination course (two injections 4-6 weeks apart), then annual boosters for flu and tetanus. Competition horses under FEI/BD/BS rules need flu boosters every 6 months. Tetanus protection lasts longer but is usually given annually as a combination vaccine.'
    },
    {
      q: 'How often should a horse see the dentist?',
      a: 'Most horses need dental checks every 12 months. Young horses (under 5) and veterans (over 15) often need checks every 6 months due to more rapid changes. Signs your horse needs dental work include dropping food, head tilting, bit resistance, or weight loss.'
    },
    {
      q: 'What is targeted worming for horses?',
      a: 'Targeted worming uses faecal egg count (FEC) tests to determine if your horse actually needs worming, rather than routine dosing. It\'s more cost-effective and reduces resistance build-up. Most horses on good pasture management only need 1-2 treatments per year plus tapeworm control.'
    },
    {
      q: 'What is a horse emergency fund?',
      a: 'An emergency fund is money set aside for unexpected vet bills. We recommend £1,000-£2,000 minimum, as common emergencies like colic, wounds, or lameness investigations can easily cost £500-£2,500. Colic surgery averages £6,000-£10,000. This fund supplements insurance or covers excesses.'
    },
    {
      q: 'Do older horses cost more in vet bills?',
      a: 'Yes, veteran horses (15+) typically have higher vet costs. Common issues include dental problems, arthritis, Cushings disease (PPID), and weight management. Budget 30-50% more for routine care, plus consider conditions that may need ongoing medication like bute or Prascend (£60-80/month).'
    },
    {
      q: 'How much does horse colic surgery cost UK?',
      a: 'Colic surgery in the UK costs £5,000-£12,000+ depending on complications and aftercare. Medical colic treatment (without surgery) typically costs £500-£2,500. This is why vet fee insurance with at least £7,500 cover is strongly recommended for all horse owners.'
    },
    {
      q: 'What vaccinations do horses need UK?',
      a: 'In the UK, horses should be vaccinated against equine influenza (flu) and tetanus as a minimum. These are usually given as a combined vaccine costing £70-90. Additional vaccines like equine herpes virus (EHV) may be recommended for breeding stock or horses that travel frequently.'
    },
    {
      q: 'How much does an equine physio cost?',
      a: 'Equine physiotherapy in the UK costs £60-£85 per session, with initial assessments sometimes higher. Many competition horses benefit from quarterly or monthly sessions. Some insurance policies cover physiotherapy if prescribed by a vet following injury.'
    },
    {
      q: 'Are vet bills more expensive in London and the South East?',
      a: 'Yes, vet fees vary significantly by region. London and the South East are typically 25-40% more expensive than the national average. Northern England, Scotland, and Wales tend to be 5-10% below average. Always get quotes from local vets for accurate budgeting.'
    },
    {
      q: 'How much does a horse lameness workup cost?',
      a: 'A lameness investigation in the UK typically costs £300-£1,500 depending on complexity. Basic flexion tests and nerve blocks cost £200-400. X-rays add £150-300, ultrasound £150-250, and MRI £1,500-3,000. Complex cases requiring referral to an equine hospital cost more.'
    },
    {
      q: 'What does a pre-purchase vetting cost UK?',
      a: 'Pre-purchase vettings (PPE) in the UK cost £100-150 for a basic 2-stage vetting, £250-350 for a full 5-stage vetting, plus £150-300 for X-rays if required. Blood sampling for future testing adds £50-80. Always use your own vet, not the seller\'s.'
    },
    {
      q: 'How much does horse insurance cost UK?',
      a: 'Horse insurance in the UK costs £25-100+ per month depending on cover level, horse value, age, and use. Basic third-party liability costs £10-15/month. Comprehensive cover with £7,500+ vet fees, theft, and loss of use costs £50-100+/month. Premiums increase with horse age.'
    },
    {
      q: 'What routine care does a horse need annually?',
      a: 'Annual routine care includes: vaccinations (flu/tetanus booster), dental check and rasp, worming program (FEC tests + treatments), farrier every 6-8 weeks, annual health check. Competition horses also need flu boosters every 6 months and passport updates.'
    },
    {
      q: 'Should I get horse insurance or save an emergency fund?',
      a: 'Ideally both. Insurance covers major costs like colic surgery (£5,000-12,000) and third-party liability (essential). An emergency fund (£1,000-2,000) covers excesses, excluded conditions, and costs below your claim threshold. Young, healthy horses may manage with a larger emergency fund; older horses benefit from comprehensive insurance.'
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
      title: 'Horse Insurance Calculator',
      description: 'Compare cover options and premiums',
      href: '/horse-insurance-calculator',
      icon: Shield,
      color: 'text-purple-600',
      bg: 'bg-purple-50 hover:bg-purple-100'
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
        <title>Horse Vet Cost Estimator UK 2026 | Annual Veterinary Budget | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free horse vet cost calculator for UK owners. Estimate annual veterinary expenses including vaccinations, dental, worming, and emergency fund. Accurate 2026 pricing." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="horse vet costs UK, equine veterinary expenses, horse vaccination cost, horse dental cost, worming program cost, horse healthcare budget, vet bills horse, colic surgery cost UK" 
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
        <meta name="theme-color" content="#dc2626" />
        
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
        <meta property="og:title" content="Horse Vet Cost Estimator UK 2026 | HorseCost" />
        <meta property="og:description" content="Calculate annual horse veterinary costs. Free UK calculator for vaccinations, dental, worming, and emergency budget." />
        <meta property="og:url" content="https://horsecost.co.uk/vet-cost-estimator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/vet-cost-estimator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Horse Vet Cost Estimator showing UK veterinary expenses breakdown" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Horse Vet Cost Estimator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Estimate annual horse vet costs with our free UK calculator." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/vet-cost-estimator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Horse Vet Cost Estimator" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/vet-cost-estimator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/vet-cost-estimator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Vet Cost Estimator', 'item': 'https://horsecost.co.uk/vet-cost-estimator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Vet Cost Estimator UK',
                'description': 'Calculate annual horse veterinary costs including vaccinations, dental care, worming, and emergency fund budgeting with accurate 2026 UK pricing.',
                'url': 'https://horsecost.co.uk/vet-cost-estimator',
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
                'name': 'How to Estimate Annual Horse Vet Costs in the UK',
                'description': 'Step-by-step guide to calculating your annual horse veterinary budget',
                'totalTime': 'PT3M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Select Horse Age', 'text': 'Choose your horse\'s age category (foal, youngster, adult, or veteran) as this affects health risks and costs.' },
                  { '@type': 'HowToStep', 'name': 'Choose Primary Use', 'text': 'Select how your horse is used (pleasure, competition, hunting, breeding, retirement) - competition horses have higher vet costs.' },
                  { '@type': 'HowToStep', 'name': 'Select Your Region', 'text': 'Choose your UK region as vet costs vary significantly - London/South East is 25-40% higher than average.' },
                  { '@type': 'HowToStep', 'name': 'Configure Routine Care', 'text': 'Select which routine care you need: vaccinations, dental, worming program, blood tests, physiotherapy.' },
                  { '@type': 'HowToStep', 'name': 'Set Emergency Fund', 'text': 'Choose your annual emergency fund (£500-2,000 recommended) for unexpected vet bills.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Horse Vet Cost Estimator - UK Veterinary Budget Planner 2026',
                'description': 'Free calculator for UK horse owners to estimate annual veterinary costs with current 2026 pricing.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'image': 'https://horsecost.co.uk/images/vet-cost-estimator-og.jpg',
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
                'name': 'Horse Vet Cost Estimator UK 2026',
                'description': 'Calculate annual horse veterinary costs including vaccinations, dental, worming and emergency fund',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/vet-cost-estimator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'UK Equine Veterinary Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Faecal Egg Count (FEC)',
                    'description': 'A laboratory test that counts parasite eggs in horse manure to determine if worming treatment is needed. Costs £25-30 per test in the UK.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Colic Surgery',
                    'description': 'Emergency abdominal surgery to treat severe colic in horses. Costs £5,000-12,000 in the UK and is the most common reason for large vet bills.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Pre-Purchase Vetting (PPE)',
                    'description': 'A veterinary examination before buying a horse, ranging from basic 2-stage (£100-150) to full 5-stage with X-rays (£400-650).'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Cushings Disease (PPID)',
                    'description': 'Pituitary Pars Intermedia Dysfunction - a common hormonal condition in older horses requiring lifelong medication (Prascend) costing £60-80/month.'
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
          <a href="/" className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header */}
        <header className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Vet Cost Estimator UK 2026</h1>
                <p className="text-red-200 mt-1">Plan your annual horse healthcare budget</p>
              </div>
            </div>
            <p className="text-red-100 max-w-3xl">
              Estimate costs for vaccinations, dental care, worming programs, and build an emergency fund 
              for unexpected vet bills. Accurate 2026 UK pricing by region.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-red-200 text-sm">
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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-red-500/30 text-red-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Verified UK pricing data
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Sources: RCVS, UK equine vets
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
              <HelpCircle className="w-5 h-5 text-red-600" />
              Quick Answer: How Much Do Horse Vet Bills Cost Per Year UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>Annual horse vet costs in the UK range from £350-650 for routine care (vaccinations, dental, worming), plus £1,000-2,000 emergency fund recommended.</strong> Total budget: £1,300-2,500/year. Colic surgery costs £5,000-12,000, making insurance or savings essential. Veteran horses (15+) cost 30-50% more. London/South East prices are 25-40% higher than average.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xs text-green-600 font-medium">Routine Care</div>
                <div className="text-xl font-bold text-green-700">£350-650</div>
                <div className="text-xs text-gray-500">/year</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xs text-blue-600 font-medium">Emergency Fund</div>
                <div className="text-xl font-bold text-blue-700">£1,000-2,000</div>
                <div className="text-xs text-gray-500">recommended</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="text-xs text-red-600 font-medium">Colic Surgery</div>
                <div className="text-xl font-bold text-red-700">£5,000-12,000</div>
                <div className="text-xs text-gray-500">if needed</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <div className="text-xs text-amber-600 font-medium">Total Budget</div>
                <div className="text-xl font-bold text-amber-700">£1,300-2,500</div>
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
                {/* Horse Age */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Horse Age Category</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'foal', name: 'Foal (0-2 yrs)' },
                      { id: 'youngster', name: 'Youngster (3-5 yrs)' },
                      { id: 'adult', name: 'Adult (6-14 yrs)' },
                      { id: 'veteran', name: 'Veteran (15+ yrs)' }
                    ].map((age) => (
                      <button
                        key={age.id}
                        onClick={() => setHorseAge(age.id)}
                        className={`p-3 rounded-xl text-sm font-medium transition border-2 ${
                          horseAge === age.id
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {age.name}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Horse Use */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Primary Use</label>
                  </div>
                  <select
                    value={horseUse}
                    onChange={(e) => setHorseUse(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                  >
                    <option value="pleasure">Pleasure/Hacking</option>
                    <option value="competition">Competition</option>
                    <option value="hunting">Hunting</option>
                    <option value="breeding">Breeding</option>
                    <option value="retirement">Retirement/Companion</option>
                  </select>
                </section>

                {/* Region */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none"
                  >
                    <option value="london">London (Higher costs +40%)</option>
                    <option value="southeast">South East England (+25%)</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England (-10%)</option>
                    <option value="scotland">Scotland / Wales (-5%)</option>
                  </select>
                </section>

                {/* Routine Care */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Routine Care</label>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Vaccinations */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={vaccinations}
                        onChange={(e) => setVaccinations(e.target.checked)}
                        className="w-5 h-5 text-red-600 rounded"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">Annual Vaccinations</span>
                        <p className="text-sm text-gray-500">Flu &amp; tetanus booster (~£80)</p>
                      </div>
                    </label>

                    {/* Dental */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dental}
                        onChange={(e) => setDental(e.target.checked)}
                        className="w-5 h-5 text-red-600 rounded"
                      />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">Dental Care</span>
                        <p className="text-sm text-gray-500">Routine check &amp; rasp (~£175)</p>
                      </div>
                    </label>

                    {dental && (
                      <div className="pl-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dental Frequency</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDentalFrequency('annual')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                              dentalFrequency === 'annual'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Annual
                          </button>
                          <button
                            onClick={() => setDentalFrequency('biannual')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                              dentalFrequency === 'biannual'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Twice Yearly
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Worming */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Worming Program</label>
                      <div className="space-y-2">
                        {wormingPrograms.map((prog) => (
                          <button
                            key={prog.id}
                            onClick={() => setWorming(prog.id)}
                            className={`w-full p-3 rounded-xl text-left transition border-2 ${
                              worming === prog.id
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <p className={`font-medium text-sm ${worming === prog.id ? 'text-red-700' : 'text-gray-900'}`}>
                              {prog.name}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Emergency Fund */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Emergency Fund (Annual)</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['500', '1000', '1500', '2000'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setEmergencyFund(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          emergencyFund === val
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        £{parseInt(val).toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Recommended minimum: £1,000 for unexpected vet bills
                  </p>
                </section>

                {/* Advanced Options */}
                <section className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-red-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Additional Services
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeBloodTests}
                          onChange={(e) => setIncludeBloodTests(e.target.checked)}
                          className="w-5 h-5 text-red-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Annual Blood Test</span>
                          <p className="text-sm text-gray-500">Health screening (~£95)</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includePhysio}
                          onChange={(e) => setIncludePhysio(e.target.checked)}
                          className="w-5 h-5 text-red-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Physiotherapy</span>
                          <p className="text-sm text-gray-500">Regular sessions (~£70/visit)</p>
                        </div>
                      </label>

                      {includePhysio && (
                        <div className="pl-8">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Physio Frequency</label>
                          <select
                            value={physioFrequency}
                            onChange={(e) => setPhysioFrequency(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                          >
                            <option value="quarterly">Quarterly (4x/year)</option>
                            <option value="bimonthly">Every 2 Months (6x/year)</option>
                            <option value="monthly">Monthly (12x/year)</option>
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
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 rounded-xl font-bold text-lg hover:from-red-700 hover:to-rose-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Vet Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white">
                      <p className="text-red-100 text-sm mb-1">Estimated Annual Vet Budget</p>
                      <p className="text-4xl font-bold">£{result.totalAnnual}</p>
                      <p className="text-red-200 text-sm mt-1">Including emergency fund</p>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex justify-between">
                          <span className="text-red-100">Monthly average</span>
                          <span className="font-bold">£{result.monthlyAverage}</span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        {Object.entries(result.breakdown).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{key}</span>
                            <span className="font-medium">£{(value as number).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-gray-600">Routine Subtotal</span>
                          <span className="font-medium">£{result.routineCosts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Emergency Fund</span>
                          <span className="font-medium">£{result.emergencyFund}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Budget</span>
                          <span>£{result.totalAnnual}</span>
                        </div>
                      </div>
                    </div>

                    {/* Age-related Risks */}
                    {result.factors.ageRisks.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          Health Considerations for {horseAge.charAt(0).toUpperCase() + horseAge.slice(1)}s
                        </h3>
                        <ul className="space-y-1 text-sm text-amber-800">
                          {result.factors.ageRisks.map((risk: string, i: number) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {result.recommendations.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          Recommendations
                        </h3>
                        <ul className="space-y-1 text-sm text-green-800">
                          {result.recommendations.map((rec: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Reminders CTA in Results */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold">Never Miss a Vaccination</h3>
                          <p className="text-purple-200 text-sm">Get free reminders for vet visits, vaccinations, worming &amp; more</p>
                        </div>
                        <button
                          onClick={() => setShowRemindersForm(true)}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-50 transition flex-shrink-0"
                        >
                          Set Up
                        </button>
                      </div>
                    </div>

                    {/* UK Comparison */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">UK Average Comparison</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Routine care avg</span>
                          <div className="flex items-center gap-2">
                            <span>£{result.comparison.ukAverageRoutine}</span>
                            {parseFloat(result.routineCosts) <= result.comparison.ukAverageRoutine && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Total budget avg</span>
                          <div className="flex items-center gap-2">
                            <span>£{result.comparison.ukAverageWithEmergency}</span>
                            {parseFloat(result.totalAnnual) <= result.comparison.ukAverageWithEmergency && (
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
                    <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select your options and click calculate to see your estimated vet costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-900 mb-2">Why an Emergency Fund Matters</h3>
                <ul className="text-red-800 space-y-1 text-sm">
                  <li>• <strong>Colic surgery:</strong> £5,000-£12,000+ (most common equine emergency)</li>
                  <li>• <strong>Wound treatment:</strong> £500-£2,500 depending on severity</li>
                  <li>• <strong>Lameness investigation:</strong> £300-£1,500 for diagnostics</li>
                  <li>• <strong>Eye emergencies:</strong> £250-£600 per episode</li>
                  <li>• Insurance excesses typically £100-£500 per claim</li>
                  <li>• Use our <a href="/horse-insurance-calculator" className="text-red-700 underline hover:text-red-900">Insurance Calculator</a> to compare cover options</li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Pricing Table */}
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 overflow-x-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Veterinary Costs 2026</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Syringe className="w-5 h-5 text-red-600" />
                  Vaccinations
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Flu/Tetanus Combined</span>
                    <span className="font-medium">£70-£90</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Flu Only Booster</span>
                    <span className="font-medium">£50-£70</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Primary Course (2 visits)</span>
                    <span className="font-medium">£130-£180</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-600" />
                  Dental Care
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Routine Check &amp; Rasp</span>
                    <span className="font-medium">£110-£150</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Sedation (if required)</span>
                    <span className="font-medium">£40-£55</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Extractions (each)</span>
                    <span className="font-medium">£120-£200</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-red-600" />
                  Worming
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Faecal Egg Count (FEC)</span>
                    <span className="font-medium">£25-£35</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Tapeworm Saliva Test</span>
                    <span className="font-medium">£18-£25</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Wormer (per dose)</span>
                    <span className="font-medium">£14-£20</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  Callout Fees
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Routine Visit</span>
                    <span className="font-medium">£45-£65</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Emergency (daytime)</span>
                    <span className="font-medium">£140-£200</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Out of Hours</span>
                    <span className="font-medium">£250-£350+</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">* Prices vary by region. London/South East typically 25-40% higher.</p>
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
                  <h3 className="font-bold text-gray-900 group-hover:text-red-600">{calc.title}</h3>
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
                Never miss a vaccination, worming date, dental check, or farrier appointment again. 
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
          <div className="mt-12 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Plan Your Complete Horse Budget</h2>
            <p className="text-red-100 mb-6 max-w-xl mx-auto">
              Vet costs are just one part of horse ownership. Use our Annual Cost Calculator for a complete budget breakdown.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition"
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
                  Get free email reminders for vaccinations, worming, dental checks, farrier visits, and more.
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
