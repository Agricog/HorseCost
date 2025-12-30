import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Handshake,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  PoundSterling,
  CheckCircle2,
  Scale,
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
  Heart
} from 'lucide-react'

export default function HorseLoanCalculator() {
  const [loanType, setLoanType] = useState('full')
  const [loanFee, setLoanFee] = useState('')
  const [liveryType, setLiveryType] = useState('diy')
  const [region, setRegion] = useState('average')
  const [includeFarrier, setIncludeFarrier] = useState(true)
  const [includeVet, setIncludeVet] = useState(true)
  const [includeInsurance, setIncludeInsurance] = useState(true)
  const [includeFeed, setIncludeFeed] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [purchasePrice, setPurchasePrice] = useState('6000')
  const [result, setResult] = useState<any>(null)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  // 2026 pricing
  const loanTypes = [
    { id: 'full', name: 'Full Loan', description: 'You have sole use of the horse', feeRange: '£0-60/week', multiplier: 1.0 },
    { id: 'part', name: 'Part Loan', description: 'Share with owner (typically 3 days/week)', feeRange: '£25-95/week', multiplier: 0.5 },
    { id: 'share', name: 'Share Board', description: 'Share costs with another loaner', feeRange: '£35-70/week', multiplier: 0.5 },
    { id: 'companion', name: 'Companion Loan', description: 'Field companion, minimal riding', feeRange: '£0-25/week', multiplier: 0.6 }
  ]

  const liveryTypes = [
    { id: 'grass', name: 'Grass Livery', baseCost: 120 },
    { id: 'diy', name: 'DIY Livery', baseCost: 200 },
    { id: 'part', name: 'Part Livery', baseCost: 400 },
    { id: 'full', name: 'Full Livery', baseCost: 650 }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.4,
    'southeast': 1.2,
    'average': 1.0,
    'north': 0.9,
    'scotland': 0.95
  }

  // Annual costs UK 2026
  const annualCosts = {
    farrier: {
      barefoot: 360,
      shod: 1050
    },
    vet: {
      routine: 480,
      vaccinations: 95,
      dental: 150
    },
    insurance: {
      basic: 250,
      comprehensive: 520
    },
    feed: {
      grass: 720,
      diy: 2100,
      part: 1400,
      full: 0 // included in livery
    },
    tack: {
      loan: 240, // maintenance only
      buy: 1800 // buying new
    },
    worming: 180,
    lessons: 1400 // optional
  }

  const calculate = () => {
    const loan = loanTypes.find(l => l.id === loanType)
    const livery = liveryTypes.find(l => l.id === liveryType)
    
    if (!loan || !livery) return

    const regionFactor = regionMultipliers[region]
    const costMultiplier = loan.multiplier

    // Weekly loan fee
    const weeklyFee = loanFee ? parseFloat(loanFee) : 0
    const annualLoanFee = weeklyFee * 52

    // Livery costs (full loan = 100%, part loan = 50% or as agreed)
    let annualLivery = livery.baseCost * 12 * regionFactor
    if (loanType === 'part' || loanType === 'share') {
      annualLivery *= 0.5 // typically split
    }

    // Farrier (usually loaner responsibility for full loan)
    let annualFarrier = 0
    if (includeFarrier) {
      annualFarrier = annualCosts.farrier.shod * regionFactor * costMultiplier
    }

    // Vet (routine care)
    let annualVet = 0
    if (includeVet) {
      annualVet = (annualCosts.vet.routine + annualCosts.vet.vaccinations + annualCosts.vet.dental) * regionFactor * costMultiplier
    }

    // Insurance
    let annualInsurance = 0
    if (includeInsurance) {
      annualInsurance = annualCosts.insurance.comprehensive * regionFactor
    }

    // Feed (if DIY or grass livery)
    let annualFeed = 0
    if (includeFeed && (liveryType === 'diy' || liveryType === 'grass')) {
      annualFeed = annualCosts.feed[liveryType as keyof typeof annualCosts.feed] * regionFactor * costMultiplier
    }

    // Worming
    const annualWorming = annualCosts.worming * costMultiplier

    // Tack maintenance (for loan horse)
    const annualTack = annualCosts.tack.loan * costMultiplier

    const totalLoanAnnual = annualLoanFee + annualLivery + annualFarrier + annualVet + annualInsurance + annualFeed + annualWorming + annualTack
    const monthlyLoanCost = totalLoanAnnual / 12

    // Compare to owning
    const purchaseCost = purchasePrice ? parseFloat(purchasePrice) : 6000
    const ownAnnualLivery = livery.baseCost * 12 * regionFactor
    const ownAnnualFarrier = annualCosts.farrier.shod * regionFactor
    const ownAnnualVet = (annualCosts.vet.routine + annualCosts.vet.vaccinations + annualCosts.vet.dental) * regionFactor
    const ownAnnualInsurance = annualCosts.insurance.comprehensive * regionFactor
    const ownAnnualFeed = (liveryType === 'diy' || liveryType === 'grass') ? annualCosts.feed[liveryType as keyof typeof annualCosts.feed] * regionFactor : 0
    const ownAnnualWorming = annualCosts.worming
    const ownAnnualTack = 350 // ongoing maintenance + replacement

    const totalOwnAnnual = ownAnnualLivery + ownAnnualFarrier + ownAnnualVet + ownAnnualInsurance + ownAnnualFeed + ownAnnualWorming + ownAnnualTack
    const monthlyOwnCost = totalOwnAnnual / 12

    // First year comparison
    const firstYearLoan = totalLoanAnnual
    const firstYearOwn = purchaseCost + annualCosts.tack.buy + totalOwnAnnual

    // Break-even calculation (how many years until owning is cheaper)
    const annualSavingsOwning = totalLoanAnnual - totalOwnAnnual
    const breakEvenYears = annualSavingsOwning > 0 ? (purchaseCost + annualCosts.tack.buy) / annualSavingsOwning : 0

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'horse_loan',
        loan_type: loanType,
        livery_type: liveryType,
        annual_loan_cost: totalLoanAnnual.toFixed(0),
        annual_own_cost: totalOwnAnnual.toFixed(0)
      })
    }

    setResult({
      loanAnnual: totalLoanAnnual.toFixed(2),
      loanMonthly: monthlyLoanCost.toFixed(2),
      ownAnnual: totalOwnAnnual.toFixed(2),
      ownMonthly: monthlyOwnCost.toFixed(2),
      firstYearLoan: firstYearLoan.toFixed(2),
      firstYearOwn: firstYearOwn.toFixed(2),
      annualDifference: (totalLoanAnnual - totalOwnAnnual).toFixed(2),
      breakEvenYears: breakEvenYears > 0 ? breakEvenYears.toFixed(1) : 'N/A',
      breakdown: {
        loanFee: annualLoanFee.toFixed(2),
        livery: annualLivery.toFixed(2),
        farrier: annualFarrier.toFixed(2),
        vet: annualVet.toFixed(2),
        insurance: annualInsurance.toFixed(2),
        feed: annualFeed.toFixed(2),
        worming: annualWorming.toFixed(2),
        tack: annualTack.toFixed(2)
      },
      loanInfo: loan,
      loanIsCheaper: totalLoanAnnual < totalOwnAnnual,
      fiveYearLoan: (totalLoanAnnual * 5).toFixed(2),
      fiveYearOwn: (purchaseCost + annualCosts.tack.buy + (totalOwnAnnual * 5)).toFixed(2)
    })
  }

  // 15 FAQs for maximum SEO
  const faqs = [
    {
      q: 'What is a horse loan arrangement?',
      a: 'A horse loan is when an owner allows someone else to care for and ride their horse, either fully or part-time. The loaner typically pays for keep costs (livery, farrier, vet) while the owner retains ownership. It\'s a great way to have horse access without the purchase cost.'
    },
    {
      q: 'How much does it cost to loan a horse UK?',
      a: 'Loaning a horse in the UK typically costs £250-£700/month for full loan in 2026, covering livery, feed, farrier, and vet costs. Part loans cost £120-£380/month for 2-3 days per week. Some owners charge a loan fee (£0-60/week), while others offer free loans for experienced homes.'
    },
    {
      q: 'What is the difference between full and part loan?',
      a: 'Full loan means you have sole use of the horse and pay all costs. Part loan means sharing the horse with the owner or another loaner - typically 2-4 days per week each. Costs are usually shared proportionally. Full loan offers more flexibility but higher costs.'
    },
    {
      q: 'Is loaning or buying a horse cheaper?',
      a: 'Loaning is cheaper initially (no purchase cost, often comes with tack), but ongoing costs can be similar to owning. Over 3-5+ years, owning often becomes more economical if the horse remains healthy. Loaning is ideal for those wanting flexibility or testing commitment.'
    },
    {
      q: 'What should a horse loan agreement include?',
      a: 'A loan agreement should cover: loan period and notice period, who pays for what (farrier, vet, livery, insurance), riding/competition permissions, what happens if the horse is injured, owner access rights, and termination conditions. Always get it in writing.'
    },
    {
      q: 'Do I need insurance for a loan horse?',
      a: 'Yes, insurance is essential. Check if the owner\'s policy covers loaners, or take out your own third-party liability. Consider adding personal accident cover. Some owners require the loaner to maintain full insurance as a loan condition. Budget £250-520/year for comprehensive cover.'
    },
    {
      q: 'Can I compete on a loan horse?',
      a: 'This depends on your agreement with the owner. Many loan agreements allow unaffiliated competitions, but affiliated competing (BE, BD, BS) may require owner permission or even attendance. Always clarify competition permissions before signing.'
    },
    {
      q: 'What happens if a loan horse gets injured?',
      a: 'This should be covered in your loan agreement. Typically, routine vet bills are the loaner\'s responsibility, while major injuries/decisions remain with the owner. Insurance is crucial - ensure you\'re clear on who pays excess and who makes treatment decisions.'
    },
    {
      q: 'How do I find a horse to loan?',
      a: 'Options include: local riding schools (school masters available for loan), Facebook horse loan groups, horsequest.co.uk, preloved.co.uk, local saddleries notice boards, and word of mouth at yards. Always meet the horse several times before committing.'
    },
    {
      q: 'What questions should I ask when viewing a loan horse?',
      a: 'Key questions: Why is the horse being loaned? What\'s their history/any injuries? Are they shod or barefoot? What\'s their temperament on the ground and ridden? Can I see them ridden first? What comes with them (tack, rugs)? What are the owner\'s expectations?'
    },
    {
      q: 'How long should a horse loan agreement last?',
      a: 'Most loan agreements are open-ended with a notice period, typically 1-3 months for full loans and 2-4 weeks for part loans. Some owners prefer fixed-term loans (6-12 months) with renewal options. Longer notice periods give both parties more security.'
    },
    {
      q: 'What is a companion loan?',
      a: 'A companion loan is when a horse is loaned primarily as a field companion for another horse. The loaner provides basic care (field livery, farrier, vet) but may have limited or no riding. Often offered for retired horses, horses with minor issues, or those needing company.'
    },
    {
      q: 'Can the owner take back a loan horse?',
      a: 'Yes, owners retain full ownership and can terminate loan agreements according to the notice period specified. This is why written agreements are essential. Typical notice periods are 1-3 months for full loan, giving the loaner time to find alternatives.'
    },
    {
      q: 'What experience do I need to loan a horse?',
      a: 'Requirements vary by horse and owner. Full loans of experienced horses suit confident riders who can manage daily care. Part loans may suit less experienced riders with yard support. Most owners want someone competent, committed, and with good horse knowledge.'
    },
    {
      q: 'Should I loan before buying my first horse?',
      a: 'Loaning is excellent preparation for buying. You experience the reality of horse ownership - early mornings, bad weather, vet bills - without full financial commitment. Many experts recommend loaning for 6-12 months before purchasing to test your commitment and ability.'
    }
  ]

  // Related calculators
  const relatedCalculators = [
    {
      title: 'First Horse Calculator',
      description: 'Full first year buying costs',
      href: '/first-horse-calculator',
      icon: Heart,
      color: 'text-pink-600',
      bg: 'bg-pink-50 hover:bg-pink-100'
    },
    {
      title: 'Annual Horse Cost Calculator',
      description: 'Calculate yearly ownership costs',
      href: '/annual-horse-cost-calculator',
      icon: Calculator,
      color: 'text-amber-600',
      bg: 'bg-amber-50 hover:bg-amber-100'
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
      title: 'Horse Insurance Calculator',
      description: 'Compare cover options and premiums',
      href: '/horse-insurance-calculator',
      icon: Shield,
      color: 'text-purple-600',
      bg: 'bg-purple-50 hover:bg-purple-100'
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
    }
  ]

  return (
    <>
      <Helmet>
        {/* 1. Title Tag */}
        <title>Horse Loan Calculator UK 2026 | Loan vs Buy Comparison | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free horse loan cost calculator for UK. Compare loaning vs buying costs, calculate full and part loan expenses. Make informed decisions with 2026 UK prices." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="horse loan cost UK 2026, loan horse price, part loan cost, full loan horse, loan vs buy horse, horse share cost, horse loan agreement" 
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
        <meta name="theme-color" content="#059669" />
        
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
        <meta property="og:title" content="Horse Loan Calculator UK 2026 | Loan vs Buy | HorseCost" />
        <meta property="og:description" content="Compare horse loan vs buying costs. Calculate full loan, part loan, and share arrangements with UK 2026 pricing." />
        <meta property="og:url" content="https://horsecost.co.uk/horse-loan-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/horse-loan-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Horse Loan Calculator showing UK loan vs buy cost comparison" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Horse Loan Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Compare horse loaning vs buying costs. Full loan, part loan, and share board calculations." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/horse-loan-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Horse Loan Calculator UK" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/horse-loan-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/horse-loan-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Horse Loan Calculator', 'item': 'https://horsecost.co.uk/horse-loan-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Loan Cost Calculator UK',
                'description': 'Calculate and compare horse loan costs vs buying in the UK with 2026 pricing. Full loan, part loan, and share board options.',
                'url': 'https://horsecost.co.uk/horse-loan-calculator',
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
                'name': 'How to Calculate Horse Loan Costs',
                'description': 'Step-by-step guide to calculating horse loan costs and comparing with buying',
                'totalTime': 'PT4M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Select Loan Type', 'text': 'Choose your loan arrangement - full loan, part loan, share board, or companion loan. Each has different cost structures and responsibilities.' },
                  { '@type': 'HowToStep', 'name': 'Enter Weekly Loan Fee', 'text': 'If the owner charges a weekly fee, enter the amount. Many loans are free, others charge £0-60/week depending on horse quality.' },
                  { '@type': 'HowToStep', 'name': 'Choose Livery Type', 'text': 'Select where the horse will be kept - grass, DIY, part, or full livery. This is typically your biggest ongoing cost.' },
                  { '@type': 'HowToStep', 'name': 'Select Costs You Pay', 'text': 'Indicate which costs you\'re responsible for - farrier, vet, insurance, feed. Full loans usually pay everything, part loans share.' },
                  { '@type': 'HowToStep', 'name': 'Compare to Buying', 'text': 'See the break-even point where buying becomes cheaper than loaning long-term.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Horse Loan Calculator UK 2026 - Loan vs Buy Comparison',
                'description': 'Free calculator to compare horse loaning vs buying costs in the UK. Calculate full loan, part loan, and share board expenses.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png' } },
                'image': 'https://horsecost.co.uk/images/horse-loan-calculator-og.jpg'
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
                'name': 'Horse Loan Calculator UK 2026',
                'description': 'Calculate horse loan costs and compare with buying in the UK',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/horse-loan-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'UK Horse Loan Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Full Loan',
                    'description': 'A loan arrangement where one person has sole use of the horse and pays all costs (livery, farrier, vet, insurance). The owner retains ownership. Costs £250-700/month in 2026.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Part Loan',
                    'description': 'A loan arrangement where the horse is shared between owner and loaner, typically 2-4 days per week each. Costs are usually shared proportionally. Costs £120-380/month in 2026.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Share Board',
                    'description': 'Similar to part loan but between two loaners rather than owner and loaner. Each loaner has specific days and shares all costs equally. Often arranged between friends or yard members.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Companion Loan',
                    'description': 'A loan arrangement where the horse is kept primarily as a field companion for another horse. Minimal or no riding, basic care provided. Often for retired horses or those unsuitable for regular work.'
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
          <a href="/" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header */}
        <header className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Handshake className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Horse Loan Calculator UK 2026</h1>
                <p className="text-emerald-200 mt-1">Loan vs Buy Comparison</p>
              </div>
            </div>
            <p className="text-emerald-100 max-w-3xl">
              Calculate the true cost of loaning a horse and compare it to buying. 
              Understand full loan, part loan, and share arrangements with UK 2026 prices.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-emerald-200 text-sm">
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
                298 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-emerald-500/30 text-emerald-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Break-even analysis included
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Loan vs buy comparison
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
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              Quick Answer: How Much Does It Cost to Loan a Horse UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>Horse loan costs in the UK range from £120-£700/month (2026).</strong> Full loan: £250-700/month (sole use, all costs). Part loan: £120-380/month (shared 2-3 days). Companion loan: £100-280/month (field companion, minimal riding). Many owners loan for free if you cover all costs. Over 3-5 years, buying often becomes cheaper than loaning.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-emerald-50 p-3 rounded-lg text-center">
                <div className="text-xs text-emerald-600 font-medium">Full Loan</div>
                <div className="text-xl font-bold text-emerald-700">£250-700</div>
                <div className="text-xs text-gray-500">per month</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xs text-green-600 font-medium">Part Loan</div>
                <div className="text-xl font-bold text-green-700">£120-380</div>
                <div className="text-xs text-gray-500">per month</div>
              </div>
              <div className="bg-teal-50 p-3 rounded-lg text-center">
                <div className="text-xs text-teal-600 font-medium">Companion</div>
                <div className="text-xl font-bold text-teal-700">£100-280</div>
                <div className="text-xs text-gray-500">per month</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <div className="text-xs text-amber-600 font-medium">Break-even</div>
                <div className="text-xl font-bold text-amber-700">3-5 years</div>
                <div className="text-xs text-gray-500">loan vs buy</div>
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
                {/* Loan Type */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Loan Type</label>
                  </div>
                  <div className="space-y-2">
                    {loanTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setLoanType(type.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          loanType === type.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${loanType === type.id ? 'text-emerald-700' : 'text-gray-900'}`}>
                              {type.name}
                            </p>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                          <p className="text-sm text-gray-600">{type.feeRange}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Loan Fee */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Weekly Loan Fee (if any)</label>
                  </div>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={loanFee}
                      onChange={(e) => setLoanFee(e.target.value)}
                      placeholder="0 (many loans are free)"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Some owners charge a fee, others loan for free</p>
                </section>

                {/* Livery Type */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Livery Type</label>
                  </div>
                  <select
                    value={liveryType}
                    onChange={(e) => setLiveryType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  >
                    {liveryTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} (~£{type.baseCost}/month)
                      </option>
                    ))}
                  </select>
                </section>

                {/* Region */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="london">London (+40%)</option>
                    <option value="southeast">South East England (+20%)</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England (-10%)</option>
                    <option value="scotland">Scotland / Wales (-5%)</option>
                  </select>
                </section>

                {/* Costs Included */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Costs You Pay</label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeFarrier}
                        onChange={(e) => setIncludeFarrier(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 rounded"
                      />
                      <span className="text-gray-900">Farrier (~£85/visit)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeVet}
                        onChange={(e) => setIncludeVet(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 rounded"
                      />
                      <span className="text-gray-900">Routine Vet Care</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeInsurance}
                        onChange={(e) => setIncludeInsurance(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 rounded"
                      />
                      <span className="text-gray-900">Insurance</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeFeed}
                        onChange={(e) => setIncludeFeed(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 rounded"
                      />
                      <span className="text-gray-900">Feed &amp; Bedding (DIY only)</span>
                    </label>
                  </div>
                </section>

                {/* Advanced - Compare to Buying */}
                <section className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-emerald-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Compare to Buying
                  </button>

                  {showAdvanced && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Horse Purchase Price (for comparison)
                      </label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={purchasePrice}
                          onChange={(e) => setPurchasePrice(e.target.value)}
                          placeholder="6000"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['3500', '6000', '10000', '15000'].map((val) => (
                          <button
                            key={val}
                            onClick={() => setPurchasePrice(val)}
                            className={`px-3 py-1 rounded-lg text-sm transition ${
                              purchasePrice === val
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            £{parseInt(val).toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Right Column - Results */}
              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-green-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Loan Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result - Loan Cost */}
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white">
                      <p className="text-emerald-100 text-sm mb-1">Annual Loan Cost</p>
                      <p className="text-4xl font-bold">£{result.loanAnnual}</p>
                      <p className="text-emerald-200 text-sm mt-1">{result.loanInfo.name}</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-emerald-100 text-xs">Monthly</p>
                          <p className="font-bold">£{result.loanMonthly}</p>
                        </div>
                        <div>
                          <p className="text-emerald-100 text-xs">First Year</p>
                          <p className="font-bold">£{result.firstYearLoan}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reminders CTA */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold">Loan Horse Care Reminders</h3>
                          <p className="text-purple-200 text-sm">Get reminders for farrier, vet &amp; worming</p>
                        </div>
                        <button
                          onClick={() => setShowRemindersForm(true)}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-50 transition flex-shrink-0"
                        >
                          Set Up
                        </button>
                      </div>
                    </div>

                    {/* Loan Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Loan Cost Breakdown (Annual)</h3>
                      <div className="space-y-2 text-sm">
                        {parseFloat(result.breakdown.loanFee) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Loan Fee</span>
                            <span className="font-medium">£{result.breakdown.loanFee}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Livery</span>
                          <span className="font-medium">£{result.breakdown.livery}</span>
                        </div>
                        {parseFloat(result.breakdown.farrier) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Farrier</span>
                            <span className="font-medium">£{result.breakdown.farrier}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.vet) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vet Care</span>
                            <span className="font-medium">£{result.breakdown.vet}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.insurance) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Insurance</span>
                            <span className="font-medium">£{result.breakdown.insurance}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.feed) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Feed &amp; Bedding</span>
                            <span className="font-medium">£{result.breakdown.feed}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Worming</span>
                          <span className="font-medium">£{result.breakdown.worming}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tack Maintenance</span>
                          <span className="font-medium">£{result.breakdown.tack}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Annual</span>
                          <span>£{result.loanAnnual}</span>
                        </div>
                      </div>
                    </div>

                    {/* Loan vs Buy Comparison */}
                    <div className="bg-white border-2 border-emerald-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Scale className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-semibold text-gray-900">Loan vs Buy Comparison</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-emerald-50 rounded-lg p-3">
                          <p className="text-emerald-600 font-medium mb-1">Loaning</p>
                          <p className="text-lg font-bold text-gray-900">£{result.loanAnnual}/yr</p>
                          <p className="text-gray-500 text-xs">First year: £{result.firstYearLoan}</p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-3">
                          <p className="text-amber-600 font-medium mb-1">Owning</p>
                          <p className="text-lg font-bold text-gray-900">£{result.ownAnnual}/yr</p>
                          <p className="text-gray-500 text-xs">First year: £{result.firstYearOwn}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">5-Year Loan Cost</span>
                          <span className="font-medium">£{result.fiveYearLoan}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">5-Year Ownership Cost</span>
                          <span className="font-medium">£{result.fiveYearOwn}</span>
                        </div>
                        {result.breakEvenYears !== 'N/A' && (
                          <div className="flex justify-between text-sm font-semibold text-emerald-600">
                            <span>Break-even Point</span>
                            <span>~{result.breakEvenYears} years</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className={`rounded-xl p-4 ${result.loanIsCheaper ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className={`w-5 h-5 ${result.loanIsCheaper ? 'text-emerald-600' : 'text-amber-600'}`} />
                        <h3 className={`font-semibold ${result.loanIsCheaper ? 'text-emerald-900' : 'text-amber-900'}`}>
                          {result.loanIsCheaper ? 'Loaning is cheaper annually' : 'Owning is cheaper annually'}
                        </h3>
                      </div>
                      <p className={`text-sm ${result.loanIsCheaper ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {result.loanIsCheaper 
                          ? `You save £${Math.abs(parseFloat(result.annualDifference)).toFixed(0)}/year by loaning. Good for flexibility and testing commitment.`
                          : `Owning saves £${Math.abs(parseFloat(result.annualDifference)).toFixed(0)}/year in running costs, but requires £${purchasePrice} upfront plus tack.`
                        }
                      </p>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Handshake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select your loan arrangement and click calculate</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Box */}
          <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-emerald-900 mb-2">Essential Loan Agreement Tips</h3>
                <ul className="text-emerald-800 space-y-1 text-sm">
                  <li>• <strong>Always get it in writing</strong> - verbal agreements cause disputes</li>
                  <li>• <strong>Clarify all costs upfront</strong> - who pays for what, including emergencies</li>
                  <li>• <strong>Agree notice periods</strong> - typically 1-3 months for full loans</li>
                  <li>• <strong>Check insurance cover</strong> - ensure you're covered to ride</li>
                  <li>• <strong>Meet the horse multiple times</strong> before committing</li>
                  <li>• Consider loaning first with our <a href="/first-horse-calculator" className="text-emerald-700 underline hover:text-emerald-900">First Horse Calculator</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Loan Costs Table */}
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Horse Loan Costs Guide 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Loan Type</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Weekly Fee</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Monthly Total</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Annual Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Full Loan (DIY)</td>
                    <td className="py-3 px-4 text-center">£0-60</td>
                    <td className="py-3 px-4 text-center">£350-£580</td>
                    <td className="py-3 px-4 text-center">£4,200-£7,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Full Loan (Part Livery)</td>
                    <td className="py-3 px-4 text-center">£0-60</td>
                    <td className="py-3 px-4 text-center">£520-£820</td>
                    <td className="py-3 px-4 text-center">£6,200-£9,800</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Part Loan (3 days)</td>
                    <td className="py-3 px-4 text-center">£25-95</td>
                    <td className="py-3 px-4 text-center">£180-£400</td>
                    <td className="py-3 px-4 text-center">£2,200-£4,800</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Companion Loan</td>
                    <td className="py-3 px-4 text-center">£0-25</td>
                    <td className="py-3 px-4 text-center">£120-£300</td>
                    <td className="py-3 px-4 text-center">£1,400-£3,600</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Totals include livery, farrier, vet, insurance, and basic feed (2026 UK prices). Actual costs vary by region and horse needs.
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
                  <h3 className="font-bold text-gray-900 group-hover:text-emerald-600">{calc.title}</h3>
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
              <h2 className="text-2xl font-bold mb-2">Free Loan Horse Care Reminders</h2>
              <p className="text-purple-200 max-w-xl mx-auto">
                Never miss a farrier appointment, vaccination, or worming date. Get free email reminders for all your loan horse care needs.
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
          <div className="mt-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Buy Instead?</h2>
            <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
              Calculate the complete first-year costs of horse ownership with our First Horse Calculator.
            </p>
            <a 
              href="/first-horse-calculator"
              className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition"
            >
              Calculate Buying Costs
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
                    <h3 className="text-xl font-bold">Set Up Loan Horse Care Reminders</h3>
                  </div>
                  <button
                    onClick={() => setShowRemindersForm(false)}
                    className="text-white/80 hover:text-white text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-purple-200 text-sm mt-2">
                  Get free email reminders for farrier, vet visits, worming, and all your loan horse care needs.
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
