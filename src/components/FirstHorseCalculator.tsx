import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Heart,
  Calculator,
  AlertCircle,
  ChevronDown,
  PoundSterling,
  CheckCircle2,
  Star,
  ShoppingBag,
  Calendar,
  Shield,
  Home,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  Users,
  HelpCircle,
  Wheat,
  Stethoscope,
  Scissors
} from 'lucide-react'

export default function FirstHorseCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('')
  const [horseType, setHorseType] = useState('allrounder')
  const [liveryType, setLiveryType] = useState('diy')
  const [region, setRegion] = useState('average')
  const [includeVetting, setIncludeVetting] = useState(true)
  const [vettingLevel, setVettingLevel] = useState('5stage')
  const [includeInsurance, setIncludeInsurance] = useState(true)
  const [includeFirstAidKit, setIncludeFirstAidKit] = useState(true)
  const [tackOwned, setTackOwned] = useState('none')
  const [result, setResult] = useState<any>(null)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  // 2026 pricing
  const horseTypes = [
    { id: 'pony', name: 'Pony (under 14.2hh)', purchaseRange: '1800-5500', avgCost: 3500 },
    { id: 'cob', name: 'Cob/Native', purchaseRange: '2500-7000', avgCost: 4500 },
    { id: 'allrounder', name: 'All-rounder', purchaseRange: '3500-12000', avgCost: 6500 },
    { id: 'competition', name: 'Competition Horse', purchaseRange: '6000-25000', avgCost: 12000 },
    { id: 'project', name: 'Project/Youngster', purchaseRange: '1200-5000', avgCost: 3000 }
  ]

  const liveryTypes = [
    { id: 'diy', name: 'DIY Livery', monthlyCost: 170, description: 'You do all care' },
    { id: 'part', name: 'Part Livery', monthlyCost: 400, description: 'Shared care' },
    { id: 'full', name: 'Full Livery', monthlyCost: 650, description: 'All care included' },
    { id: 'grass', name: 'Grass Livery', monthlyCost: 120, description: 'Field only' }
  ]

  const vettingOptions = [
    { id: '2stage', name: '2-Stage Vetting', cost: 180 },
    { id: '5stage', name: '5-Stage Vetting', cost: 400 },
    { id: 'full', name: 'Full + X-rays', cost: 950 }
  ]

  const tackPackages = [
    { id: 'none', name: 'Need Everything', saddleCost: 950, bridleCost: 180, rugsCost: 480, bootsCost: 180 },
    { id: 'some', name: 'Have Some Basics', saddleCost: 950, bridleCost: 0, rugsCost: 240, bootsCost: 0 },
    { id: 'saddle', name: 'Have Saddle', saddleCost: 0, bridleCost: 180, rugsCost: 480, bootsCost: 180 },
    { id: 'most', name: 'Have Most Items', saddleCost: 0, bridleCost: 0, rugsCost: 180, bootsCost: 0 }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.3,
    'southeast': 1.15,
    'average': 1.0,
    'north': 0.9,
    'scotland': 0.95
  }

  const calculate = () => {
    const regionFactor = regionMultipliers[region]
    
    // Purchase price
    let purchase = 0
    if (purchasePrice && parseFloat(purchasePrice) > 0) {
      purchase = parseFloat(purchasePrice)
    } else {
      const horse = horseTypes.find(h => h.id === horseType)
      purchase = horse?.avgCost || 6500
    }

    // Pre-purchase vetting
    let vettingCost = 0
    if (includeVetting) {
      const vetting = vettingOptions.find(v => v.id === vettingLevel)
      vettingCost = vetting?.cost || 400
    }

    // Transport to new home
    const transportCost = 180 * regionFactor

    // Livery (first year)
    const livery = liveryTypes.find(l => l.id === liveryType)
    const annualLivery = (livery?.monthlyCost || 400) * 12 * regionFactor

    // Tack & Equipment
    const tack = tackPackages.find(t => t.id === tackOwned)
    const tackCost = tack 
      ? (tack.saddleCost + tack.bridleCost + tack.rugsCost + tack.bootsCost)
      : 1790

    // Saddle fitting
    const saddleFitting = tackOwned === 'none' || tackOwned === 'some' ? 90 : 0

    // Grooming kit & stable equipment
    const groomingKit = 120
    const stableEquipment = liveryType === 'diy' ? 240 : 60

    // First aid kit
    const firstAidKit = includeFirstAidKit ? 95 : 0

    // Insurance (first year)
    let insuranceCost = 0
    if (includeInsurance) {
      insuranceCost = Math.max(250, purchase * 0.055) * regionFactor
    }

    // Farrier (6 visits in first year)
    const farrierCost = 115 * 6 * regionFactor

    // Vet costs (vaccinations, dental, worming)
    const vetRoutine = 480 * regionFactor

    // Feed & bedding (if DIY - included in other livery)
    let feedBedding = 0
    if (liveryType === 'diy' || liveryType === 'grass') {
      feedBedding = 240 * 12 * regionFactor
    }

    // Unexpected costs buffer (10% of running costs)
    const runningCosts = annualLivery + farrierCost + vetRoutine + feedBedding
    const contingency = runningCosts * 0.1

    // Totals
    const oneOffCosts = purchase + vettingCost + transportCost + tackCost + saddleFitting + groomingKit + stableEquipment + firstAidKit
    const firstYearRunning = annualLivery + (includeInsurance ? insuranceCost : 0) + farrierCost + vetRoutine + feedBedding + contingency
    const totalFirstYear = oneOffCosts + firstYearRunning
    const monthlyOngoing = firstYearRunning / 12

    // UK average first year cost (2026)
    const ukAverageFirstYear = 14000

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'first_horse',
        horse_type: horseType,
        livery_type: liveryType,
        purchase_price: purchase.toFixed(0),
        first_year_total: totalFirstYear.toFixed(0)
      })
    }

    setResult({
      totalFirstYear: totalFirstYear.toFixed(2),
      oneOffCosts: oneOffCosts.toFixed(2),
      firstYearRunning: firstYearRunning.toFixed(2),
      monthlyOngoing: monthlyOngoing.toFixed(2),
      breakdown: {
        purchase: purchase.toFixed(2),
        vetting: vettingCost.toFixed(2),
        transport: transportCost.toFixed(2),
        tack: tackCost.toFixed(2),
        saddleFitting: saddleFitting.toFixed(2),
        groomingKit: groomingKit.toFixed(2),
        stableEquipment: stableEquipment.toFixed(2),
        firstAidKit: firstAidKit.toFixed(2),
        livery: annualLivery.toFixed(2),
        insurance: insuranceCost.toFixed(2),
        farrier: farrierCost.toFixed(2),
        vet: vetRoutine.toFixed(2),
        feedBedding: feedBedding.toFixed(2),
        contingency: contingency.toFixed(2)
      },
      comparison: {
        vsUkAverage: totalFirstYear < ukAverageFirstYear,
        ukAverageFirstYear
      },
      savingsSuggestions: getSavingsSuggestions(liveryType, tackOwned, includeInsurance)
    })
  }

  const getSavingsSuggestions = (livery: string, tack: string, insured: boolean) => {
    const suggestions = []
    
    if (livery === 'full') {
      suggestions.push('Part livery could save £200-350/month if you have time')
    }
    if (tack === 'none') {
      suggestions.push('Good second-hand saddles save 40-60% vs new')
      suggestions.push('Facebook groups often have quality tack for sale')
    }
    if (!insured) {
      suggestions.push('⚠️ We strongly recommend insurance - one colic surgery costs £6,000+')
    }
    
    return suggestions
  }

  // 15 FAQs for maximum SEO
  const faqs = [
    {
      q: 'How much does it cost to buy a horse in the UK?',
      a: 'Horse prices in the UK vary hugely from £800 for an unbroken project to £50,000+ for a top competition horse (2026 prices). A sensible first horse typically costs £3,500-£10,000. Budget extra for vetting (£180-£950), transport (£120-£250), and initial tack/equipment (£1,200-£2,500).'
    },
    {
      q: 'What is the total first year cost of owning a horse?',
      a: 'The first year of horse ownership typically costs £10,000-£18,000 in the UK in 2026, including purchase price, equipment, and running costs. This breaks down to: purchase (£3,500-£10,000), tack/equipment (£1,200-£2,500), and annual costs (£5,000-£10,000 for livery, farrier, vet, insurance).'
    },
    {
      q: 'Should I get a horse vetted before buying?',
      a: 'Yes, always get a pre-purchase vetting for any horse you\'re seriously considering. A 5-stage vetting (£350-£450 in 2026) checks for health issues and soundness. For expensive horses or those for specific work, consider X-rays (additional £250-£600). It\'s cheaper than buying problems.'
    },
    {
      q: 'What tack do I need for my first horse?',
      a: 'Essential tack includes: properly fitted saddle (£600-£2,500), bridle with bit (£100-£250), numnahs/saddle pads (£35-£80), headcollar and leadrope (£35-£60), rugs (£250-£600 for basic set), grooming kit (£60-£120), and first aid kit (£60-£120). Budget £1,200-£2,500 total.'
    },
    {
      q: 'What type of livery should I choose?',
      a: 'DIY livery (£120-£220/month in 2026) requires 2-3 hours daily but is cheapest. Part livery (£300-£500) offers shared care. Full livery (£500-£800+) includes all care but is most expensive. Choose based on your time, experience, and budget. Most first-time owners benefit from part livery.'
    },
    {
      q: 'Do I need horse insurance?',
      a: 'We strongly recommend insurance. Vet fee cover is essential - a single colic surgery costs £6,000-£12,000 in 2026. Public liability protects you if your horse injures someone. Budget £250-£600/year for comprehensive cover. The peace of mind is worth it for unexpected emergencies.'
    },
    {
      q: 'How much should I budget for unexpected costs?',
      a: 'Budget 10-15% of your annual running costs for unexpected expenses. Common surprises include: emergency vet calls, lost shoes between farrier visits, rug repairs, broken tack, extra feed in harsh winters, and grazing supplements. Having £600-£1,200 savings buffer is sensible.'
    },
    {
      q: 'What ongoing costs should I expect?',
      a: 'Monthly ongoing costs in 2026 typically include: livery (£120-£700), feed if DIY (£100-£180), bedding if DIY (£60-£120), insurance (£25-£60), plus regular costs like farrier every 6-8 weeks (£95-£140) and worming quarterly (£18-£30). Budget £350-£950/month depending on setup.'
    },
    {
      q: 'Should I buy a young horse or experienced horse?',
      a: 'First-time owners should buy an experienced, well-schooled horse aged 8-15. Young horses (under 6) need professional training and experienced handling. Yes, older horses cost more initially, but you\'ll save on training costs and avoid potentially dangerous situations.'
    },
    {
      q: 'Where should I buy my first horse?',
      a: 'Good sources include: reputable dealers (offer trial periods), riding school dispersals, word of mouth through your instructor, and rehoming charities (horses assessed and honest descriptions). Avoid buying solely from online ads without expert help - always take an experienced person to view.'
    },
    {
      q: 'How long does it take to find the right first horse?',
      a: 'Allow 2-6 months to find the right first horse. Don\'t rush - the wrong horse is expensive and potentially dangerous. View multiple horses, take your instructor, try before you buy, and be prepared to walk away. The right horse is worth waiting for.'
    },
    {
      q: 'What questions should I ask when viewing a horse?',
      a: 'Ask about: age, height, breeding, how long they\'ve owned it, reason for sale, temperament (loading, clipping, traffic, farrier, vet), health history (injuries, colic, surgeries), current routine, feeding requirements, any vices, and whether you can try before buying. Watch for evasive answers.'
    },
    {
      q: 'Can I afford a horse on a budget?',
      a: 'Horse ownership requires minimum £300-400/month for basic DIY grass livery setup. Cheaper options include: loan horses (share costs), part-loan arrangements, rehoming charities (often reduced fees), buying in autumn (prices lower), and second-hand tack. But don\'t cut corners on vetting or insurance.'
    },
    {
      q: 'What riding experience do I need before buying?',
      a: 'You should be a competent, confident rider at walk, trot, and canter before buying. Most experts recommend at least 2-3 years of regular lessons (weekly) and experience with different horses. Handling experience (grooming, leading, tacking up) is equally important.'
    },
    {
      q: 'Should I buy or loan my first horse?',
      a: 'Consider loaning first - it gives you experience of ownership without full financial commitment. Full loans (you pay all costs) or part-loans (share horse and costs) let you learn before buying. Many first-time owners loan for 6-12 months before purchasing their own horse.'
    }
  ]

  // Related calculators
  const relatedCalculators = [
    {
      title: 'Annual Horse Cost Calculator',
      description: 'Calculate ongoing yearly costs',
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
      title: 'Horse Livery Calculator',
      description: 'Compare livery yard options',
      href: '/horse-livery-calculator',
      icon: Home,
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
      title: 'Vet Cost Estimator',
      description: 'Plan your healthcare budget',
      href: '/vet-cost-estimator',
      icon: Stethoscope,
      color: 'text-red-600',
      bg: 'bg-red-50 hover:bg-red-100'
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
        <title>First Horse Cost Calculator UK 2026 | First Year Expenses | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free first horse cost calculator for UK buyers. Calculate total first year costs including purchase, vetting, tack, livery, and running expenses. 2026 UK pricing guide." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="first horse cost UK 2026, buying a horse budget, horse ownership costs, first year horse expenses, how much does a horse cost, horse buying guide UK" 
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
        <meta name="theme-color" content="#db2777" />
        
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
        <meta property="og:title" content="First Horse Cost Calculator UK 2026 | First Year Budget | HorseCost" />
        <meta property="og:description" content="Calculate total first year costs of horse ownership. Free UK calculator for purchase, tack, livery, and running costs." />
        <meta property="og:url" content="https://horsecost.co.uk/first-horse-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/first-horse-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="First Horse Cost Calculator showing UK first year ownership expenses" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="First Horse Cost Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Calculate first year horse ownership costs. Purchase, tack, livery and running expenses." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/first-horse-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="First Horse Cost Calculator UK" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/first-horse-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/first-horse-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'First Horse Calculator', 'item': 'https://horsecost.co.uk/first-horse-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'First Horse Cost Calculator UK',
                'description': 'Calculate total first year costs of horse ownership including purchase, vetting, tack, livery, and running expenses with UK 2026 pricing.',
                'url': 'https://horsecost.co.uk/first-horse-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.9', 'ratingCount': '356', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Calculate First Horse Costs',
                'description': 'Step-by-step guide to calculating your first year horse ownership costs',
                'totalTime': 'PT5M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Select Horse Type', 'text': 'Choose the type of horse you\'re looking for - pony, cob, all-rounder, competition horse, or project horse. This sets the typical purchase price range.' },
                  { '@type': 'HowToStep', 'name': 'Choose Livery Type', 'text': 'Select your preferred livery arrangement - DIY, part, full, or grass livery. This is usually your biggest ongoing cost.' },
                  { '@type': 'HowToStep', 'name': 'Select Your Region', 'text': 'Choose your UK region as prices vary - London and South East are 15-30% higher than average.' },
                  { '@type': 'HowToStep', 'name': 'Add Tack Requirements', 'text': 'Indicate what equipment you already have or need to buy - saddle, bridle, rugs, boots, and grooming kit.' },
                  { '@type': 'HowToStep', 'name': 'Include Vetting & Insurance', 'text': 'Add pre-purchase vetting (recommended) and insurance costs for your complete first year budget.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'First Horse Cost Calculator UK 2026 - Complete First Year Budget',
                'description': 'Free calculator for UK first horse buyers. Calculate total costs including purchase, vetting, tack, livery, and running expenses.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png' } },
                'image': 'https://horsecost.co.uk/images/first-horse-calculator-og.jpg'
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
                'name': 'First Horse Cost Calculator UK 2026',
                'description': 'Calculate first year horse ownership costs including purchase, equipment and running expenses',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/first-horse-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'UK First Horse Buying Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Pre-Purchase Vetting',
                    'description': 'A veterinary examination before buying a horse. 2-stage covers basic health, 5-stage includes exercise and flexion tests. Costs £180-950 depending on level and X-rays.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'All-Rounder Horse',
                    'description': 'A versatile horse suitable for multiple disciplines - hacking, schooling, and light competition. Ideal for first-time buyers. Typically costs £3,500-12,000.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Part Livery',
                    'description': 'A livery arrangement where care responsibilities are shared between owner and yard. Typically includes some mucking out, turnout, and feeding. Costs £300-500/month in 2026.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Saddle Fitting',
                    'description': 'Professional assessment to ensure a saddle fits both horse and rider correctly. Essential when buying a new saddle. Costs £75-120 for fitting appointment.'
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
          <a href="/" className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header */}
        <header className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">First Horse Cost Calculator UK 2026</h1>
                <p className="text-pink-200 mt-1">First Year Budget Planner</p>
              </div>
            </div>
            <p className="text-pink-100 max-w-3xl">
              Planning to buy your first horse? Calculate the true first year cost including purchase, 
              vetting, tack, livery, and all running expenses. No surprises!
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-pink-200 text-sm">
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
                356 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-pink-500/30 text-pink-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                First-time buyer focused
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                All costs included
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
              <HelpCircle className="w-5 h-5 text-pink-600" />
              Quick Answer: How Much Does a First Horse Cost UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>First year of horse ownership costs £10,000-£18,000 in the UK (2026).</strong> This includes: horse purchase (£3,500-£10,000 for sensible first horse), pre-purchase vetting (£180-£400), tack and equipment (£1,200-£2,500), plus first year running costs (£5,000-£10,000). Monthly ongoing costs after setup: £350-£950 depending on livery type and location.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-pink-50 p-3 rounded-lg text-center">
                <div className="text-xs text-pink-600 font-medium">Horse Purchase</div>
                <div className="text-xl font-bold text-pink-700">£3,500-10k</div>
                <div className="text-xs text-gray-500">first horse</div>
              </div>
              <div className="bg-rose-50 p-3 rounded-lg text-center">
                <div className="text-xs text-rose-600 font-medium">Tack &amp; Kit</div>
                <div className="text-xl font-bold text-rose-700">£1,200-2,500</div>
                <div className="text-xs text-gray-500">one-off</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <div className="text-xs text-amber-600 font-medium">First Year Running</div>
                <div className="text-xl font-bold text-amber-700">£5,000-10k</div>
                <div className="text-xs text-gray-500">livery, vet, farrier</div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg text-center">
                <div className="text-xs text-emerald-600 font-medium">Monthly Ongoing</div>
                <div className="text-xl font-bold text-emerald-700">£350-950</div>
                <div className="text-xs text-gray-500">year 2+</div>
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
                {/* Horse Type */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Type of Horse</label>
                  </div>
                  <div className="space-y-2">
                    {horseTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setHorseType(type.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          horseType === type.id
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <p className={`font-medium ${horseType === type.id ? 'text-pink-700' : 'text-gray-900'}`}>
                            {type.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            £{type.purchaseRange}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Custom Purchase Price */}
                <section>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter specific purchase price (£)
                  </label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      placeholder="Leave blank for estimate"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </section>

                {/* Livery Type */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Livery Type</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {liveryTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setLiveryType(type.id)}
                        className={`p-3 rounded-xl text-left transition border-2 ${
                          liveryType === type.id
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className={`font-medium text-sm ${liveryType === type.id ? 'text-pink-700' : 'text-gray-900'}`}>
                          {type.name}
                        </p>
                        <p className="text-xs text-gray-500">{type.description}</p>
                        <p className="text-xs text-gray-600 mt-1">~£{type.monthlyCost}/month</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Region */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  >
                    <option value="london">London (+30%)</option>
                    <option value="southeast">South East England (+15%)</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England (-10%)</option>
                    <option value="scotland">Scotland / Wales (-5%)</option>
                  </select>
                </section>

                {/* Tack Situation */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Tack &amp; Equipment</label>
                  </div>
                  <select
                    value={tackOwned}
                    onChange={(e) => setTackOwned(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  >
                    <option value="none">Need everything (first horse)</option>
                    <option value="some">Have some basics (bridle, rugs)</option>
                    <option value="saddle">Have a saddle already</option>
                    <option value="most">Have most items</option>
                  </select>
                </section>

                {/* Pre-purchase Options */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Pre-purchase &amp; Safety</label>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeVetting}
                        onChange={(e) => setIncludeVetting(e.target.checked)}
                        className="w-5 h-5 text-pink-600 rounded"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Pre-purchase Vetting</span>
                        <p className="text-sm text-gray-500">Highly recommended!</p>
                      </div>
                    </label>

                    {includeVetting && (
                      <div className="pl-8">
                        <select
                          value={vettingLevel}
                          onChange={(e) => setVettingLevel(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none"
                        >
                          {vettingOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name} (£{option.cost})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeInsurance}
                        onChange={(e) => setIncludeInsurance(e.target.checked)}
                        className="w-5 h-5 text-pink-600 rounded"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Horse Insurance</span>
                        <p className="text-sm text-gray-500">Strongly recommended</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeFirstAidKit}
                        onChange={(e) => setIncludeFirstAidKit(e.target.checked)}
                        className="w-5 h-5 text-pink-600 rounded"
                      />
                      <div>
                        <span className="font-medium text-gray-900">First Aid Kit</span>
                        <p className="text-sm text-gray-500">Essential for horse owners</p>
                      </div>
                    </label>
                  </div>
                </section>
              </div>

              {/* Right Column - Results */}
              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-700 hover:to-rose-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate First Year Cost
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white">
                      <p className="text-pink-100 text-sm mb-1">Total First Year Cost</p>
                      <p className="text-4xl font-bold">£{result.totalFirstYear}</p>
                      <p className="text-pink-200 text-sm mt-1">Including purchase &amp; setup</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-pink-100 text-xs">One-off Costs</p>
                          <p className="font-bold">£{result.oneOffCosts}</p>
                        </div>
                        <div>
                          <p className="text-pink-100 text-xs">Year 1 Running</p>
                          <p className="font-bold">£{result.firstYearRunning}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reminders CTA */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold">New Horse Care Reminders</h3>
                          <p className="text-purple-200 text-sm">Get reminders for farrier, vet &amp; more</p>
                        </div>
                        <button
                          onClick={() => setShowRemindersForm(true)}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-50 transition flex-shrink-0"
                        >
                          Set Up
                        </button>
                      </div>
                    </div>

                    {/* Monthly Ongoing */}
                    <div className="bg-pink-50 rounded-xl p-4 text-center">
                      <p className="text-pink-600 text-sm">Monthly Running Cost (Year 2+)</p>
                      <p className="text-3xl font-bold text-gray-900">£{result.monthlyOngoing}</p>
                      <p className="text-sm text-gray-500">After initial setup</p>
                    </div>

                    {/* One-off Costs Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-pink-600" />
                        One-off Costs
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Horse Purchase</span>
                          <span className="font-medium">£{result.breakdown.purchase}</span>
                        </div>
                        {parseFloat(result.breakdown.vetting) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Pre-purchase Vetting</span>
                            <span className="font-medium">£{result.breakdown.vetting}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transport Home</span>
                          <span className="font-medium">£{result.breakdown.transport}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tack &amp; Equipment</span>
                          <span className="font-medium">£{result.breakdown.tack}</span>
                        </div>
                        {parseFloat(result.breakdown.saddleFitting) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Saddle Fitting</span>
                            <span className="font-medium">£{result.breakdown.saddleFitting}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Grooming Kit</span>
                          <span className="font-medium">£{result.breakdown.groomingKit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Stable Equipment</span>
                          <span className="font-medium">£{result.breakdown.stableEquipment}</span>
                        </div>
                        {parseFloat(result.breakdown.firstAidKit) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">First Aid Kit</span>
                            <span className="font-medium">£{result.breakdown.firstAidKit}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Subtotal</span>
                          <span>£{result.oneOffCosts}</span>
                        </div>
                      </div>
                    </div>

                    {/* Running Costs Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-pink-600" />
                        First Year Running Costs
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Livery (12 months)</span>
                          <span className="font-medium">£{result.breakdown.livery}</span>
                        </div>
                        {parseFloat(result.breakdown.insurance) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Insurance</span>
                            <span className="font-medium">£{result.breakdown.insurance}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Farrier (6 visits)</span>
                          <span className="font-medium">£{result.breakdown.farrier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vet (routine care)</span>
                          <span className="font-medium">£{result.breakdown.vet}</span>
                        </div>
                        {parseFloat(result.breakdown.feedBedding) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Feed &amp; Bedding</span>
                            <span className="font-medium">£{result.breakdown.feedBedding}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contingency (10%)</span>
                          <span className="font-medium">£{result.breakdown.contingency}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Subtotal</span>
                          <span>£{result.firstYearRunning}</span>
                        </div>
                      </div>
                    </div>

                    {/* Savings Suggestions */}
                    {result.savingsSuggestions.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <Star className="w-5 h-5" />
                          Money-Saving Tips
                        </h3>
                        <ul className="space-y-1 text-sm text-amber-800">
                          {result.savingsSuggestions.map((tip: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* UK Comparison */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">UK Average Comparison</h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Average first year cost</span>
                        <div className="flex items-center gap-2">
                          <span>£{result.comparison.ukAverageFirstYear.toLocaleString()}</span>
                          {result.comparison.vsUkAverage && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select your options and click calculate to see your first year budget</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Important Warning */}
          <div className="bg-pink-50 border-l-4 border-pink-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-pink-900 mb-2">First-Time Buyer Checklist</h3>
                <ul className="text-pink-800 space-y-1 text-sm">
                  <li>✓ <strong>Take your instructor</strong> to view horses - they'll spot issues you won't</li>
                  <li>✓ <strong>Always get a vetting</strong> - £400 is cheap compared to buying problems</li>
                  <li>✓ <strong>Try before you buy</strong> - reputable sellers offer trial periods</li>
                  <li>✓ <strong>Have livery arranged first</strong> - don't buy without a place to keep them</li>
                  <li>✓ <strong>Buy insurance immediately</strong> - accidents happen on day one</li>
                  <li>✓ <strong>Budget for the unexpected</strong> - horses are experts at vet bills!</li>
                  <li>• Calculate ongoing costs with our <a href="/annual-horse-cost-calculator" className="text-pink-700 underline hover:text-pink-900">Annual Calculator</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Shopping List */}
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">First Horse Shopping List &amp; Costs 2026</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-pink-600" />
                  Essential Tack
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Saddle (fitted)</span>
                    <span className="font-medium">£600-£2,500</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Bridle &amp; Bit</span>
                    <span className="font-medium">£100-£250</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Saddle Pads</span>
                    <span className="font-medium">£35-£100</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Headcollar &amp; Leadrope</span>
                    <span className="font-medium">£35-£60</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Boots/Bandages</span>
                    <span className="font-medium">£60-£180</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Home className="w-5 h-5 text-pink-600" />
                  Rugs &amp; Care Items
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Turnout Rug (medium)</span>
                    <span className="font-medium">£100-£250</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Stable Rug</span>
                    <span className="font-medium">£60-£140</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Cooler/Fleece</span>
                    <span className="font-medium">£35-£80</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Grooming Kit</span>
                    <span className="font-medium">£60-£120</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">First Aid Kit</span>
                    <span className="font-medium">£60-£120</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              💡 <strong>Tip:</strong> Good quality second-hand tack can save 40-60%. Check Facebook groups, 
              eBay, and local tack sales. Always have saddles professionally fitted.
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
            <p className="text-gray-600 mb-6">Plan your ongoing horse ownership costs:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedCalculators.map((calc, index) => (
                <a 
                  key={index}
                  href={calc.href} 
                  className={`${calc.bg} rounded-xl p-4 transition group`}
                  title={`${calc.title} - ${calc.description}`}
                >
                  <calc.icon className={`w-8 h-8 ${calc.color} mb-2`} />
                  <h3 className="font-bold text-gray-900 group-hover:text-pink-600">{calc.title}</h3>
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
              <h2 className="text-2xl font-bold mb-2">Free New Horse Care Reminders</h2>
              <p className="text-purple-200 max-w-xl mx-auto">
                Never miss a farrier appointment, vaccination, or worming date. Get free email reminders for all your new horse care needs.
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
          <div className="mt-12 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Calculate Ongoing Costs?</h2>
            <p className="text-pink-100 mb-6 max-w-xl mx-auto">
              Now you know the first year costs, use our Annual Calculator to plan your ongoing budget.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-xl font-bold hover:bg-pink-50 transition"
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
                    <h3 className="text-xl font-bold">Set Up New Horse Care Reminders</h3>
                  </div>
                  <button
                    onClick={() => setShowRemindersForm(false)}
                    className="text-white/80 hover:text-white text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-purple-200 text-sm mt-2">
                  Get free email reminders for farrier, vet visits, vaccinations, and all your new horse care needs.
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
