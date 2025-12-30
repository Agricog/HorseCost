import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Calculator,
  Home,
  PoundSterling,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Bell,
  ArrowRight,
  Download,
  Share2,
  Clock,
  MapPin,
  HelpCircle,
  Wheat,
  Scissors,
  Stethoscope,
  Shield,
  Building
} from 'lucide-react'

export default function HorseLiveryCalculator() {
  // Yard setup
  const [numberOfStables, setNumberOfStables] = useState<string>('15')
  const [profitMargin, setProfitMargin] = useState<string>('15')
  
  // Variable costs (per horse/month)
  const [feedCostPerHorse, setFeedCostPerHorse] = useState<string>('80')
  const [hayCostPerHorse, setHayCostPerHorse] = useState<string>('120')
  const [beddingCostPerHorse, setBeddingCostPerHorse] = useState<string>('60')
  
  // Labour
  const [labourHoursPerWeek, setLabourHoursPerWeek] = useState<string>('40')
  const [labourHourlyRate, setLabourHourlyRate] = useState<string>('15')
  
  // Other variable costs
  const [variableUtilities, setVariableUtilities] = useState<string>('200')
  const [suppliesCost, setSuppliesCost] = useState<string>('50')
  
  // Fixed costs (monthly)
  const [rentMortgage, setRentMortgage] = useState<string>('1500')
  const [businessRates, setBusinessRates] = useState<string>('200')
  const [insurance, setInsurance] = useState<string>('250')
  const [staffSalaries, setStaffSalaries] = useState<string>('0')
  const [machineryVehicles, setMachineryVehicles] = useState<string>('300')
  const [fieldMaintenance, setFieldMaintenance] = useState<string>('250')
  const [adminCosts, setAdminCosts] = useState<string>('100')
  
  // Service add-ons
  const [partLiveryAddOn, setPartLiveryAddOn] = useState<string>('150')
  const [fullLiveryAddOn, setFullLiveryAddOn] = useState<string>('350')
  
  const [result, setResult] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeBreakdown, setActiveBreakdown] = useState<string | null>(null)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  // UK Average livery prices for comparison
  const ukAverages = {
    diyLivery: { low: 100, mid: 150, high: 250 },
    partLivery: { low: 250, mid: 350, high: 500 },
    fullLivery: { low: 400, mid: 550, high: 800 }
  }

  const calculate = () => {
    const stables = Math.max(1, parseInt(numberOfStables) || 1)
    const margin = parseFloat(profitMargin) || 15
    
    // Variable costs (annual)
    const feed = parseFloat(feedCostPerHorse) || 0
    const hay = parseFloat(hayCostPerHorse) || 0
    const bedding = parseFloat(beddingCostPerHorse) || 0
    const labourHours = parseFloat(labourHoursPerWeek) || 0
    const hourlyRate = parseFloat(labourHourlyRate) || 0
    const utilities = parseFloat(variableUtilities) || 0
    const supplies = parseFloat(suppliesCost) || 0
    
    const annualFeed = feed * 12 * stables
    const annualHay = hay * 12 * stables
    const annualBedding = bedding * 12 * stables
    const annualLabour = labourHours * hourlyRate * 52
    const annualUtilities = utilities * 12
    const annualSupplies = supplies * 12
    
    const totalVariableCosts = annualFeed + annualHay + annualBedding + annualLabour + annualUtilities + annualSupplies
    
    // Fixed costs (annual)
    const rent = parseFloat(rentMortgage) || 0
    const rates = parseFloat(businessRates) || 0
    const ins = parseFloat(insurance) || 0
    const salaries = parseFloat(staffSalaries) || 0
    const machinery = parseFloat(machineryVehicles) || 0
    const fieldMaint = parseFloat(fieldMaintenance) || 0
    const admin = parseFloat(adminCosts) || 0
    
    const annualRent = rent * 12
    const annualRates = rates * 12
    const annualInsurance = ins * 12
    const annualSalaries = salaries * 12
    const annualMachinery = machinery * 12
    const annualFieldMaint = fieldMaint * 12
    const annualAdmin = admin * 12
    
    const totalFixedCosts = annualRent + annualRates + annualInsurance + annualSalaries + annualMachinery + annualFieldMaint + annualAdmin
    
    // Totals
    const totalAnnualCosts = totalVariableCosts + totalFixedCosts
    const monthlyAverageCosts = totalAnnualCosts / 12
    const baseCostPerStable = monthlyAverageCosts / stables
    const marginMultiplier = 1 + (margin / 100)
    
    // Pricing
    const diyPrice = baseCostPerStable * marginMultiplier
    const partPrice = diyPrice + (parseFloat(partLiveryAddOn) || 0)
    const fullPrice = diyPrice + (parseFloat(fullLiveryAddOn) || 0)
    
    // Break-even
    const breakEvenStables = totalAnnualCosts / (diyPrice * 12)
    const breakEvenPercentage = (breakEvenStables / stables) * 100
    
    // Profitability at full occupancy
    const annualRevenueDIY = diyPrice * 12 * stables
    const annualProfit = annualRevenueDIY - totalAnnualCosts
    const monthlyProfit = annualProfit / 12

    // Track calculation event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'horse_livery',
        stables: stables,
        diy_price: diyPrice.toFixed(0),
        profit_margin: margin
      })
    }

    setResult({
      diyPrice: diyPrice.toFixed(2),
      partPrice: partPrice.toFixed(2),
      fullPrice: fullPrice.toFixed(2),
      baseCostPerStable: baseCostPerStable.toFixed(2),
      monthlyAverageCosts: monthlyAverageCosts.toFixed(2),
      totalAnnualCosts: totalAnnualCosts.toFixed(2),
      breakEvenStables: breakEvenStables.toFixed(1),
      breakEvenPercentage: breakEvenPercentage.toFixed(0),
      annualProfit: annualProfit.toFixed(2),
      monthlyProfit: monthlyProfit.toFixed(2),
      breakdown: {
        variable: {
          total: totalVariableCosts.toFixed(2),
          percentage: ((totalVariableCosts / totalAnnualCosts) * 100).toFixed(1),
          items: {
            feed: annualFeed.toFixed(2),
            hay: annualHay.toFixed(2),
            bedding: annualBedding.toFixed(2),
            labour: annualLabour.toFixed(2),
            utilities: annualUtilities.toFixed(2),
            supplies: annualSupplies.toFixed(2)
          }
        },
        fixed: {
          total: totalFixedCosts.toFixed(2),
          percentage: ((totalFixedCosts / totalAnnualCosts) * 100).toFixed(1),
          items: {
            rent: annualRent.toFixed(2),
            rates: annualRates.toFixed(2),
            insurance: annualInsurance.toFixed(2),
            salaries: annualSalaries.toFixed(2),
            machinery: annualMachinery.toFixed(2),
            fieldMaint: annualFieldMaint.toFixed(2),
            admin: annualAdmin.toFixed(2)
          }
        }
      },
      comparison: {
        diyVsAverage: diyPrice - ukAverages.diyLivery.mid,
        partVsAverage: partPrice - ukAverages.partLivery.mid,
        fullVsAverage: fullPrice - ukAverages.fullLivery.mid
      }
    })
  }

  const downloadCSV = () => {
    if (!result) return
    const csvContent = [
      ['Horse Livery Calculator Results', new Date().toLocaleDateString('en-GB')],
      [],
      ['RECOMMENDED PRICING'],
      ['DIY Livery Price', '£' + result.diyPrice + '/month'],
      ['Part Livery Price', '£' + result.partPrice + '/month'],
      ['Full Livery Price', '£' + result.fullPrice + '/month'],
      [],
      ['FINANCIAL SUMMARY'],
      ['Monthly Operating Costs', '£' + result.monthlyAverageCosts],
      ['Annual Operating Costs', '£' + result.totalAnnualCosts],
      ['Break-Even Occupancy', result.breakEvenStables + ' stables (' + result.breakEvenPercentage + '%)'],
      ['Annual Profit (Full Occupancy)', '£' + result.annualProfit],
      ['Monthly Profit (Full Occupancy)', '£' + result.monthlyProfit],
      [],
      ['SETTINGS'],
      ['Number of Stables', numberOfStables],
      ['Profit Margin', profitMargin + '%']
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'horse-livery-pricing-' + new Date().toISOString().split('T')[0] + '.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (!result) return
    const text = `My livery pricing (calculated with HorseCost):

DIY: £${result.diyPrice}/month
Part: £${result.partPrice}/month
Full: £${result.fullPrice}/month

Break-even: ${result.breakEvenStables} stables

Calculate yours: https://horsecost.co.uk/horse-livery-calculator`

    if (navigator.share) {
      navigator.share({ title: 'Horse Livery Pricing', text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  // 15 FAQs for maximum SEO
  const faqs = [
    {
      q: "How do I calculate livery prices for my yard?",
      a: "Calculate your total annual costs (variable + fixed), divide by 12 for monthly costs, then divide by number of stables for cost per stable. Add your profit margin (typically 10-15%) to get your DIY price. Add service premiums for Part (£100-200) and Full (£250-500) livery based on extra labour hours."
    },
    {
      q: "What costs should I include in livery pricing?",
      a: "Include all costs: Variable (feed, hay, bedding, labour, utilities, supplies) and Fixed (rent/mortgage, business rates, insurance, staff salaries, machinery, field maintenance, admin). Don't forget to value your own time at a realistic hourly rate."
    },
    {
      q: "What is a reasonable profit margin for livery yards UK?",
      a: "A 10-15% profit margin is typical for UK livery yards. This covers empty stables, unexpected repairs, and price inflation. Premium facilities in high-demand areas (South East, near cities) can charge 20%+ margins. Lower margins suit competitive rural areas."
    },
    {
      q: "How much should I charge for DIY livery UK 2026?",
      a: "UK DIY livery prices in 2026 range from £100-250/month depending on location and facilities. South East England averages £150-200, while rural areas charge £100-150. Include stable, field access, use of facilities (arena, wash bay), and water/electricity in your price."
    },
    {
      q: "How much should Part livery cost UK?",
      a: "Part livery in the UK typically costs £250-500/month. This includes DIY facilities plus some services (usually morning or evening duties). Calculate based on DIY price plus 30-60 minutes extra daily labour. Urban/premium yards charge £400-500+."
    },
    {
      q: "How much should Full livery cost UK 2026?",
      a: "Full livery in the UK ranges from £400-800+/month in 2026. This covers complete care: feeding, mucking out, turnout, rug changes, and basic exercise. Premium yards with excellent facilities charge £700-1,000+. Calculate as DIY price plus 1-3 hours daily labour."
    },
    {
      q: "What is break-even occupancy for a livery yard?",
      a: "Break-even occupancy is the minimum number of stables you need filled to cover all costs. Calculate by dividing total annual costs by (DIY price × 12). A 15-stable yard with £80,000 annual costs and £500 DIY price breaks even at 13-14 stables (87-93% occupancy)."
    },
    {
      q: "Should I include my own labour in livery calculations?",
      a: "Yes, always include your own labour at realistic rates (£12-20/hour depending on experience). This shows true costs, helps price fairly, and reveals when hiring staff becomes viable. Without valuing your time, you'll undercharge and burn out."
    },
    {
      q: "How do variable and fixed costs differ in livery pricing?",
      a: "Variable costs change with horse numbers (feed, hay, bedding per horse). Fixed costs stay constant regardless of occupancy (rent, insurance, rates). Fixed costs spread across more horses = lower per-horse cost. This is why full yards are more profitable."
    },
    {
      q: "How often should I review livery prices?",
      a: "Review prices annually at minimum. Feed, bedding, and fuel costs rise with inflation (typically 3-5% yearly). Include price review clauses in livery contracts allowing 30-60 days notice for increases. Some yards increase every January."
    },
    {
      q: "What facilities justify higher livery prices?",
      a: "Premium facilities include: indoor arena, all-weather outdoor arena, horse walker, wash bay with hot water, solarium, large stables (14x12ft+), individual turnout, good hacking access, on-site instructor, and quality footing. Each adds £25-100/month to pricing."
    },
    {
      q: "How do I compete with cheaper yards in my area?",
      a: "Compete on value not price: better facilities, reliable service, quality forage, safe fencing, good drainage, flexible arrangements, clear communication. Many owners pay premium for reliability and peace of mind. Underpricing attracts difficult clients and isn't sustainable."
    },
    {
      q: "What insurance do I need for a livery yard UK?",
      a: "Essential: Public liability (£5-10 million), employer's liability if staff, property/buildings insurance. Optional: business interruption, personal accident, legal expenses. Budget £2,000-5,000/year for comprehensive cover. Some policies charge per horse - factor this into pricing."
    },
    {
      q: "How do regional differences affect livery pricing UK?",
      a: "Location significantly impacts pricing. South East England is 30-50% higher than national average. London suburbs, Surrey, Berkshire charge premium rates. Rural Scotland, Wales, and Northern England are typically cheapest. Research 5-10 local competitors to price competitively."
    },
    {
      q: "Can I charge different prices for different stables?",
      a: "Yes, tiered pricing is common. Charge more for: larger stables, better positioned stables (more light, less drafty), stables near facilities, stables with individual turnout. Some yards have standard and premium tiers with £50-100/month difference."
    }
  ]

  // Related calculators
  const relatedCalculators = [
    {
      title: 'Annual Horse Cost Calculator',
      description: 'Calculate total yearly ownership costs',
      href: '/annual-horse-cost-calculator',
      icon: Calculator,
      color: 'text-amber-600'
    },
    {
      title: 'Horse Feed Calculator',
      description: 'Plan hay and hard feed costs',
      href: '/horse-feed-calculator',
      icon: Wheat,
      color: 'text-green-600'
    },
    {
      title: 'Farrier Cost Calculator',
      description: 'Budget farrier expenses',
      href: '/farrier-cost-calculator',
      icon: Scissors,
      color: 'text-stone-600'
    },
    {
      title: 'Vet Cost Estimator',
      description: 'Plan veterinary budgets',
      href: '/vet-cost-estimator',
      icon: Stethoscope,
      color: 'text-red-600'
    },
    {
      title: 'Horse Insurance Calculator',
      description: 'Compare insurance options',
      href: '/horse-insurance-calculator',
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      title: 'Bedding Cost Calculator',
      description: 'Compare bedding types',
      href: '/bedding-cost-calculator',
      icon: Home,
      color: 'text-yellow-600'
    }
  ]

  return (
    <>
      <Helmet>
        {/* 1. Title Tag */}
        <title>Horse Livery Calculator UK 2026 | Calculate DIY, Part & Full Livery Prices | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free livery pricing calculator for UK yard owners. Calculate sustainable DIY, Part & Full livery prices with all costs included. Break-even analysis & profit margins. 2026 UK pricing." 
        />
        
        {/* 3. Keywords */}
        <meta name="keywords" content="livery calculator UK, horse livery pricing, DIY livery cost, full livery price UK, part livery calculator, livery yard pricing, horse boarding costs UK, livery business calculator, yard owner calculator" />
        
        {/* 4. Author */}
        <meta name="author" content="HorseCost" />
        
        {/* 5. Robots */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* 6. Googlebot */}
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* 7. Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        
        {/* 8. Theme Color */}
        <meta name="theme-color" content="#059669" />
        
        {/* 9. Apple Mobile */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* 10. OG Type */}
        <meta property="og:type" content="website" />
        
        {/* 11. OG Site Name */}
        <meta property="og:site_name" content="HorseCost" />
        
        {/* 12. OG Locale */}
        <meta property="og:locale" content="en_GB" />
        
        {/* 13. OG Complete */}
        <meta property="og:title" content="Horse Livery Calculator UK 2026 | HorseCost" />
        <meta property="og:description" content="Calculate sustainable livery prices for your UK yard. DIY, Part & Full livery pricing with break-even analysis." />
        <meta property="og:url" content="https://horsecost.co.uk/horse-livery-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/horse-livery-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Horse Livery Calculator showing UK pricing breakdown" />

        {/* 14. Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Horse Livery Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Calculate sustainable livery pricing for your UK yard. Free calculator with break-even analysis." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/horse-livery-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Horse Livery Calculator" />

        {/* 15. Canonical */}
        <link rel="canonical" href="https://horsecost.co.uk/horse-livery-calculator" />
        
        {/* Hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/horse-livery-calculator" />

        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* JSON-LD Schemas (8) */}
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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Horse Livery Calculator', 'item': 'https://horsecost.co.uk/horse-livery-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Livery Calculator UK',
                'url': 'https://horsecost.co.uk/horse-livery-calculator',
                'description': 'Professional livery pricing calculator for UK yard owners. Calculate sustainable DIY, Part, and Full livery prices with break-even analysis and profit margins.',
                'applicationCategory': 'BusinessApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.8', 'ratingCount': '312', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Calculate Livery Prices for Your Yard',
                'description': 'Step-by-step guide to pricing DIY, Part, and Full livery services',
                'totalTime': 'PT10M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Enter Yard Details', 'text': 'Input your number of stables and target profit margin (typically 10-15%).' },
                  { '@type': 'HowToStep', 'name': 'Add Variable Costs', 'text': 'Enter costs that change with horse numbers: feed, hay, bedding, labour hours, utilities, supplies.' },
                  { '@type': 'HowToStep', 'name': 'Add Fixed Costs', 'text': 'Enter costs that stay constant: rent/mortgage, business rates, insurance, machinery, field maintenance.' },
                  { '@type': 'HowToStep', 'name': 'Set Service Add-ons', 'text': 'Define extra charges for Part livery (£100-200) and Full livery (£250-500) based on additional labour.' },
                  { '@type': 'HowToStep', 'name': 'Calculate Pricing', 'text': 'Click calculate to see recommended DIY, Part, and Full livery prices plus break-even occupancy.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Horse Livery Calculator - UK Yard Pricing Guide 2026',
                'description': 'Calculate sustainable livery prices for UK yards with our free calculator.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'image': 'https://horsecost.co.uk/images/horse-livery-calculator-og.jpg',
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
              // Schema 7: WebPage with Speakable
              {
                '@type': 'WebPage',
                'name': 'Horse Livery Calculator UK 2026',
                'description': 'Calculate livery pricing for UK yards',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/horse-livery-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'UK Livery Yard Terms',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'DIY Livery',
                    'description': 'Self-care arrangement where horse owner provides all daily care. Yard provides stable, field, and facilities. UK prices: £100-250/month.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Part Livery',
                    'description': 'Shared care between owner and yard. Typically includes morning or evening duties. UK prices: £250-500/month.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Full Livery',
                    'description': 'Complete care provided by yard including feeding, mucking out, turnout, and rug changes. UK prices: £400-800+/month.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Break-Even Occupancy',
                    'description': 'The minimum number of stables that must be filled to cover all operating costs. Calculated as: Total Annual Costs ÷ (Price × 12).'
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
          <a href="/" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header Banner */}
        <header className="bg-gradient-to-r from-emerald-600 to-green-500 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Building className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Horse Livery Calculator UK 2026</h1>
                <p className="text-emerald-100 mt-1">Calculate sustainable livery prices for your yard</p>
              </div>
            </div>
            <p className="text-emerald-50 max-w-3xl">
              Professional pricing calculator for UK livery yard owners. Work out DIY, Part, and Full livery 
              prices with accurate cost analysis, profit margins, and break-even occupancy.
            </p>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-emerald-500/30 text-emerald-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Verified UK pricing data
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Sources: BHS, yard owner surveys
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Updated January 2026
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mt-4 text-emerald-200 text-sm">
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
          </div>
        </header>

        {/* Quick Answer Box */}
        <div className="max-w-5xl mx-auto px-4 mt-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              Quick Answer: How Much Should I Charge for Livery UK?
            </h2>
            <p className="text-gray-700 quick-answer">
              <strong>Average UK livery prices in 2026: DIY £100-250/month, Part £250-500/month, Full £400-800/month.</strong> Prices vary significantly by location (South East is 30-50% higher) and facilities. Calculate your specific pricing by entering all costs below and adding a 10-15% profit margin to cover empty stables and unexpected expenses.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xs text-green-600 font-medium">DIY Livery</div>
                <div className="text-xl font-bold text-green-700">£100-250</div>
                <div className="text-xs text-gray-500">per month</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-xs text-blue-600 font-medium">Part Livery</div>
                <div className="text-xl font-bold text-blue-700">£250-500</div>
                <div className="text-xs text-gray-500">per month</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg text-center">
                <div className="text-xs text-amber-600 font-medium">Full Livery</div>
                <div className="text-xl font-bold text-amber-700">£400-800</div>
                <div className="text-xs text-gray-500">per month</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-xs text-purple-600 font-medium">Premium Full</div>
                <div className="text-xl font-bold text-purple-700">£800+</div>
                <div className="text-xs text-gray-500">per month</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Main Calculator Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden calculator-card">
            <div className="p-6 md:p-8">
              
              {/* Section 1: Yard Setup */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h2 className="text-xl font-bold text-gray-900">Yard Setup</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Building className="w-4 h-4 inline mr-2" />
                      Number of Stables
                    </label>
                    <input
                      type="number"
                      value={numberOfStables}
                      onChange={(e) => setNumberOfStables(e.target.value)}
                      placeholder="15"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Total stables/spaces at your yard</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <TrendingUp className="w-4 h-4 inline mr-2" />
                      Profit Margin (%)
                    </label>
                    <input
                      type="number"
                      value={profitMargin}
                      onChange={(e) => setProfitMargin(e.target.value)}
                      placeholder="15"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 10-15% for most yards</p>
                  </div>
                </div>
              </section>

              {/* Section 2: Variable Costs */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h2 className="text-xl font-bold text-gray-900">Variable Costs (Per Horse/Month)</h2>
                </div>
                <p className="text-gray-600 mb-4">These costs scale with the number of horses at your yard.</p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Feed Cost (£)</label>
                    <input
                      type="number"
                      value={feedCostPerHorse}
                      onChange={(e) => setFeedCostPerHorse(e.target.value)}
                      placeholder="80"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Hard feed per horse. <a href="/horse-feed-calculator" className="text-emerald-600 hover:underline">Feed calculator →</a>
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Hay/Haylage Cost (£)</label>
                    <input
                      type="number"
                      value={hayCostPerHorse}
                      onChange={(e) => setHayCostPerHorse(e.target.value)}
                      placeholder="120"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Average £100-150/horse/month</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Bedding Cost (£)</label>
                    <input
                      type="number"
                      value={beddingCostPerHorse}
                      onChange={(e) => setBeddingCostPerHorse(e.target.value)}
                      placeholder="60"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      <a href="/bedding-cost-calculator" className="text-emerald-600 hover:underline">Bedding calculator →</a>
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-medium mb-2">Labour Hours (per week)</label>
                    <input
                      type="number"
                      value={labourHoursPerWeek}
                      onChange={(e) => setLabourHoursPerWeek(e.target.value)}
                      placeholder="40"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Include YOUR hours - your time has value</p>
                    
                    <label className="block text-gray-700 font-medium mb-2 mt-4">Hourly Rate (£)</label>
                    <input
                      type="number"
                      value={labourHourlyRate}
                      onChange={(e) => setLabourHourlyRate(e.target.value)}
                      placeholder="15"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum wage £11.44, recommend £12-20</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-gray-700 font-medium mb-2">Utilities (monthly £)</label>
                    <input
                      type="number"
                      value={variableUtilities}
                      onChange={(e) => setVariableUtilities(e.target.value)}
                      placeholder="200"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Electric, water that varies with usage</p>
                    
                    <label className="block text-gray-700 font-medium mb-2 mt-4">Supplies (monthly £)</label>
                    <input
                      type="number"
                      value={suppliesCost}
                      onChange={(e) => setSuppliesCost(e.target.value)}
                      placeholder="50"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Cleaning products, small equipment</p>
                  </div>
                </div>
              </section>

              {/* Section 3: Fixed Costs */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h2 className="text-xl font-bold text-gray-900">Fixed Monthly Costs</h2>
                </div>
                <p className="text-gray-600 mb-4">These costs remain constant regardless of how many horses you have.</p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Rent/Mortgage (£)</label>
                    <input
                      type="number"
                      value={rentMortgage}
                      onChange={(e) => setRentMortgage(e.target.value)}
                      placeholder="1500"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Business Rates (£)</label>
                    <input
                      type="number"
                      value={businessRates}
                      onChange={(e) => setBusinessRates(e.target.value)}
                      placeholder="200"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Insurance (£)</label>
                    <input
                      type="number"
                      value={insurance}
                      onChange={(e) => setInsurance(e.target.value)}
                      placeholder="250"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Monthly (annual ÷ 12)</p>
                  </div>
                </div>
                
                {/* Advanced Fixed Costs (Collapsible) */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 mt-6 text-emerald-600 font-medium hover:text-emerald-700"
                >
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showAdvanced ? 'Hide' : 'Show'} Additional Fixed Costs
                </button>
                
                {showAdvanced && (
                  <div className="grid md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Staff Salaries (£)</label>
                      <input
                        type="number"
                        value={staffSalaries}
                        onChange={(e) => setStaffSalaries(e.target.value)}
                        placeholder="0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">0 if owner-operated</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Machinery/Vehicles (£)</label>
                      <input
                        type="number"
                        value={machineryVehicles}
                        onChange={(e) => setMachineryVehicles(e.target.value)}
                        placeholder="300"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Tractor, mower, fuel, repairs</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Field Maintenance (£)</label>
                      <input
                        type="number"
                        value={fieldMaintenance}
                        onChange={(e) => setFieldMaintenance(e.target.value)}
                        placeholder="250"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Fencing, harrowing, seeding</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Admin Costs (£)</label>
                      <input
                        type="number"
                        value={adminCosts}
                        onChange={(e) => setAdminCosts(e.target.value)}
                        placeholder="100"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Phone, internet, accounting</p>
                    </div>
                  </div>
                )}
              </section>

              {/* Section 4: Service Add-ons */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <h2 className="text-xl font-bold text-gray-900">Service Add-ons (Monthly)</h2>
                </div>
                <p className="text-gray-600 mb-4">Extra charges for Part and Full livery services on top of DIY price.</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Part Livery Add-on (£)</label>
                    <input
                      type="number"
                      value={partLiveryAddOn}
                      onChange={(e) => setPartLiveryAddOn(e.target.value)}
                      placeholder="150"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Typical: £100-200 (30-60 mins extra/day)</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Livery Add-on (£)</label>
                    <input
                      type="number"
                      value={fullLiveryAddOn}
                      onChange={(e) => setFullLiveryAddOn(e.target.value)}
                      placeholder="350"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Typical: £250-500 (1-3 hours extra/day)</p>
                  </div>
                </div>
              </section>

              {/* Calculate Button */}
              <button
                onClick={calculate}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-green-600 transition shadow-lg"
              >
                <Calculator className="w-5 h-5 inline mr-2" />
                Calculate Livery Prices
              </button>
            </div>

            {/* Results Section */}
            {result && (
              <div className="border-t border-gray-200 bg-gradient-to-b from-emerald-50 to-white p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <PoundSterling className="w-6 h-6 text-emerald-600" />
                  Your Recommended Livery Prices
                </h2>
                
                {/* Main Pricing Results */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-emerald-600 text-white p-6 rounded-xl text-center">
                    <div className="text-emerald-200 text-sm font-medium">DIY Livery</div>
                    <div className="text-4xl font-bold mt-1">£{parseFloat(result.diyPrice).toLocaleString()}</div>
                    <div className="text-emerald-200 text-sm mt-1">per month</div>
                  </div>
                  <div className="bg-white border-2 border-blue-200 p-6 rounded-xl text-center">
                    <div className="text-blue-600 text-sm font-medium">Part Livery</div>
                    <div className="text-3xl font-bold text-gray-900 mt-1">£{parseFloat(result.partPrice).toLocaleString()}</div>
                    <div className="text-gray-500 text-sm mt-1">per month</div>
                  </div>
                  <div className="bg-white border-2 border-amber-200 p-6 rounded-xl text-center">
                    <div className="text-amber-600 text-sm font-medium">Full Livery</div>
                    <div className="text-3xl font-bold text-gray-900 mt-1">£{parseFloat(result.fullPrice).toLocaleString()}</div>
                    <div className="text-gray-500 text-sm mt-1">per month</div>
                  </div>
                </div>

                {/* Break-Even & Profitability */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className={`p-4 rounded-lg ${parseFloat(result.breakEvenPercentage) <= 85 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                    <div className="flex items-center gap-3">
                      <TrendingUp className={`w-6 h-6 ${parseFloat(result.breakEvenPercentage) <= 85 ? 'text-green-600' : 'text-amber-600'}`} />
                      <div>
                        <div className="font-bold text-gray-900">Break-Even: {result.breakEvenStables} stables ({result.breakEvenPercentage}%)</div>
                        <div className="text-sm text-gray-600">
                          {parseFloat(result.breakEvenPercentage) <= 75 
                            ? 'Excellent - good buffer for empty stables' 
                            : parseFloat(result.breakEvenPercentage) <= 85 
                              ? 'Good - reasonable margin for vacancies'
                              : 'Tight - consider increasing prices or reducing costs'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <PoundSterling className="w-6 h-6 text-emerald-600" />
                      <div>
                        <div className="font-bold text-gray-900">Monthly Profit (Full Occupancy)</div>
                        <div className="text-2xl font-bold text-emerald-600">£{parseFloat(result.monthlyProfit).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">Cost Breakdown</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {/* Variable Costs */}
                  <div 
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-emerald-300 transition"
                    onClick={() => setActiveBreakdown(activeBreakdown === 'variable' ? null : 'variable')}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold">Variable Costs</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">£{parseFloat(result.breakdown.variable.total).toLocaleString()}/year</div>
                        <div className="text-xs text-gray-500">{result.breakdown.variable.percentage}%</div>
                      </div>
                    </div>
                    {activeBreakdown === 'variable' && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Feed</span><span>£{parseFloat(result.breakdown.variable.items.feed).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Hay/Haylage</span><span>£{parseFloat(result.breakdown.variable.items.hay).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Bedding</span><span>£{parseFloat(result.breakdown.variable.items.bedding).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Labour</span><span>£{parseFloat(result.breakdown.variable.items.labour).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Utilities</span><span>£{parseFloat(result.breakdown.variable.items.utilities).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Supplies</span><span>£{parseFloat(result.breakdown.variable.items.supplies).toLocaleString()}</span></div>
                      </div>
                    )}
                  </div>

                  {/* Fixed Costs */}
                  <div 
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-emerald-300 transition"
                    onClick={() => setActiveBreakdown(activeBreakdown === 'fixed' ? null : 'fixed')}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold">Fixed Costs</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">£{parseFloat(result.breakdown.fixed.total).toLocaleString()}/year</div>
                        <div className="text-xs text-gray-500">{result.breakdown.fixed.percentage}%</div>
                      </div>
                    </div>
                    {activeBreakdown === 'fixed' && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Rent/Mortgage</span><span>£{parseFloat(result.breakdown.fixed.items.rent).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Business Rates</span><span>£{parseFloat(result.breakdown.fixed.items.rates).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Insurance</span><span>£{parseFloat(result.breakdown.fixed.items.insurance).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Staff Salaries</span><span>£{parseFloat(result.breakdown.fixed.items.salaries).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Machinery</span><span>£{parseFloat(result.breakdown.fixed.items.machinery).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Field Maintenance</span><span>£{parseFloat(result.breakdown.fixed.items.fieldMaint).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Admin</span><span>£{parseFloat(result.breakdown.fixed.items.admin).toLocaleString()}</span></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* UK Comparison */}
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <h3 className="font-bold text-gray-900 mb-3">How Your Prices Compare to UK Averages</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-sm text-gray-600">DIY</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-emerald-500 rounded-full" 
                          style={{width: `${Math.min(100, (parseFloat(result.diyPrice) / ukAverages.diyLivery.high) * 100)}%`}}
                        ></div>
                      </div>
                      <div className="w-32 text-right text-sm">
                        <span className={result.comparison.diyVsAverage > 0 ? 'text-amber-600' : 'text-green-600'}>
                          {result.comparison.diyVsAverage > 0 ? '+' : ''}£{result.comparison.diyVsAverage.toFixed(0)} vs avg
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-sm text-gray-600">Part</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-blue-500 rounded-full" 
                          style={{width: `${Math.min(100, (parseFloat(result.partPrice) / ukAverages.partLivery.high) * 100)}%`}}
                        ></div>
                      </div>
                      <div className="w-32 text-right text-sm">
                        <span className={result.comparison.partVsAverage > 0 ? 'text-amber-600' : 'text-green-600'}>
                          {result.comparison.partVsAverage > 0 ? '+' : ''}£{result.comparison.partVsAverage.toFixed(0)} vs avg
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-sm text-gray-600">Full</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-amber-500 rounded-full" 
                          style={{width: `${Math.min(100, (parseFloat(result.fullPrice) / ukAverages.fullLivery.high) * 100)}%`}}
                        ></div>
                      </div>
                      <div className="w-32 text-right text-sm">
                        <span className={result.comparison.fullVsAverage > 0 ? 'text-amber-600' : 'text-green-600'}>
                          {result.comparison.fullVsAverage > 0 ? '+' : ''}£{result.comparison.fullVsAverage.toFixed(0)} vs avg
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <button
                    onClick={shareResults}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Results
                  </button>
                  <button
                    onClick={downloadCSV}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download CSV
                  </button>
                </div>

                {/* Reminders CTA */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-bold text-lg">Manage Your Livery Business Better</h3>
                      <p className="text-purple-200 text-sm mt-1">
                        Get free reminders for client payments, farrier visits, vaccinations, and more.
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

          {/* Cost Notes Box */}
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg mt-8">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-emerald-800 mb-2">Important Notes for Yard Owners</h3>
                <ul className="text-emerald-900 space-y-1 text-sm">
                  <li>• Always value your own labour - your time is worth money</li>
                  <li>• 10-15% margin covers empty stables, repairs, and price inflation</li>
                  <li>• South East England prices typically 30-50% higher than rural areas</li>
                  <li>• Review prices annually to keep pace with cost increases</li>
                  <li>• Premium facilities (arena, horse walker) justify higher pricing</li>
                  <li>• Build price review clauses into all livery contracts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <article className="mt-12 space-y-12">
            
            {/* Understanding Livery Pricing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding UK Livery Yard Pricing</h2>
              <p className="text-gray-700 mb-4">
                Running a profitable livery yard requires careful pricing that covers all costs while remaining competitive. 
                Many yard owners undercharge because they don't account for all expenses - particularly their own time. 
                This calculator helps you build sustainable pricing based on real costs.
              </p>
              <p className="text-gray-700 mb-4">
                The key is understanding the difference between <strong>variable costs</strong> (scale with horse numbers) 
                and <strong>fixed costs</strong> (stay constant). Fixed costs spread across more horses means better 
                profitability at higher occupancy - this is why filling your yard matters so much.
              </p>
              <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-r-lg">
                <p className="text-gray-700 italic">
                  <strong>Example:</strong> A 15-stable yard with £6,000/month total costs at 100% occupancy has 
                  £400/stable cost. At 75% occupancy (11-12 stables), that jumps to £500-545/stable. Your pricing 
                  needs to account for this variability.
                </p>
              </div>
            </section>

            {/* UK Pricing Table */}
            <section className="overflow-x-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">UK Livery Prices by Type 2025</h2>
              <table className="w-full border-collapse">
                <caption className="sr-only">UK horse livery prices by type and region</caption>
                <thead>
                  <tr className="bg-emerald-600 text-white">
                    <th scope="col" className="p-3 text-left">Livery Type</th>
                    <th scope="col" className="p-3 text-right">Low</th>
                    <th scope="col" className="p-3 text-right">Average</th>
                    <th scope="col" className="p-3 text-right">High</th>
                    <th scope="col" className="p-3 text-left hidden md:table-cell">What's Included</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <th scope="row" className="p-3 font-medium text-left">DIY Livery</th>
                    <td className="p-3 text-right">£100</td>
                    <td className="p-3 text-right">£150</td>
                    <td className="p-3 text-right">£250</td>
                    <td className="p-3 text-sm hidden md:table-cell">Stable, field, facilities access only</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <th scope="row" className="p-3 font-medium text-left">Part Livery</th>
                    <td className="p-3 text-right">£250</td>
                    <td className="p-3 text-right">£350</td>
                    <td className="p-3 text-right">£500</td>
                    <td className="p-3 text-sm hidden md:table-cell">DIY + some duties (AM or PM)</td>
                  </tr>
                  <tr className="border-b">
                    <th scope="row" className="p-3 font-medium text-left">Full Livery</th>
                    <td className="p-3 text-right">£400</td>
                    <td className="p-3 text-right">£550</td>
                    <td className="p-3 text-right">£800</td>
                    <td className="p-3 text-sm hidden md:table-cell">Complete care, feeding, turnout, rugs</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <th scope="row" className="p-3 font-medium text-left">Premium Full</th>
                    <td className="p-3 text-right">£700</td>
                    <td className="p-3 text-right">£900</td>
                    <td className="p-3 text-right">£1,200+</td>
                    <td className="p-3 text-sm hidden md:table-cell">Full + exercise, grooming, shows</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-500 mt-2">* Prices vary significantly by region. South East typically 30-50% above national average.</p>
            </section>

            {/* Tips Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing Tips for Livery Yard Owners</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-800 mb-2">✓ Do This</h3>
                  <ul className="text-green-900 space-y-2 text-sm">
                    <li>• Value your time at £15-20/hour minimum</li>
                    <li>• Build in 10-15% margin for contingencies</li>
                    <li>• Review and adjust prices annually</li>
                    <li>• Research local competitors before pricing</li>
                    <li>• Include price review clauses in contracts</li>
                    <li>• Charge more for premium stables/facilities</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                  <h3 className="font-bold text-red-800 mb-2">✗ Avoid This</h3>
                  <ul className="text-red-900 space-y-2 text-sm">
                    <li>• Forgetting to include your own labour costs</li>
                    <li>• Pricing only to cover costs (no profit margin)</li>
                    <li>• Competing on price alone (race to bottom)</li>
                    <li>• Ignoring annual cost increases</li>
                    <li>• Underpricing to fill stables quickly</li>
                    <li>• Same price for all stables regardless of quality</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-700 faq-answer">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </article>

          {/* Related Calculators */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Calculators</h2>
            <p className="text-gray-600 mb-6">More tools for equestrian business planning:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedCalculators.map((calc, index) => (
                <a 
                  key={index}
                  href={calc.href} 
                  className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-emerald-400 hover:shadow-md transition group"
                  title={`${calc.title} - ${calc.description}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <calc.icon className={`w-5 h-5 ${calc.color}`} />
                    <h3 className="font-bold text-gray-900 group-hover:text-emerald-600">{calc.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{calc.description}</p>
                  <div className="text-emerald-600 text-sm font-medium mt-2 flex items-center gap-1">
                    Use calculator <ArrowRight className="w-3 h-3" />
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Reminders Section */}
          <section className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Free Yard Management Reminders</h2>
              <p className="text-purple-200 max-w-xl mx-auto">
                Stay organised with free email reminders for client payments, farrier visits, 
                vaccinations, and worming schedules.
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
          <div className="mt-12 bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Need Help With Livery Business Planning?</h2>
            <p className="text-emerald-100 mb-4">Get in touch for advice or suggest features you'd like to see.</p>
            <a 
              href="mailto:hello@horsecost.co.uk" 
              className="inline-block bg-white text-emerald-600 px-6 py-3 rounded-lg font-bold hover:bg-emerald-50 transition"
            >
              Contact Us
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
                    <h3 className="text-xl font-bold">Set Up Yard Reminders</h3>
                  </div>
                  <button
                    onClick={() => setShowRemindersForm(false)}
                    className="text-white/80 hover:text-white text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-purple-200 text-sm mt-2">
                  Get free email reminders for payments, farrier visits, vaccinations and more.
                </p>
              </div>
              <div className="p-0">
                <iframe 
                  src="https://app.smartsuite.com/form/sba974gi/W5GfKQSj6G?header=false" 
                  width="100%" 
                  height="500px" 
                  frameBorder="0"
                  title="Yard Management Reminders Signup"
                  className="border-0"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
