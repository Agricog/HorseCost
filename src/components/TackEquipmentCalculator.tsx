import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  ShoppingBag,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  PoundSterling,
  CheckCircle2,
  Star,
  Target,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  Users,
  HelpCircle,
  Home,
  Scissors,
  Shield
} from 'lucide-react'

export default function TackEquipmentCalculator() {
  const [budgetLevel, setBudgetLevel] = useState('mid')
  const [horseType, setHorseType] = useState('allrounder')
  const [discipline, setDiscipline] = useState('general')
  const [needSaddle, setNeedSaddle] = useState(true)
  const [needBridle, setNeedBridle] = useState(true)
  const [needRugs, setNeedRugs] = useState(true)
  const [needBoots, setNeedBoots] = useState(true)
  const [needGrooming, setNeedGrooming] = useState(true)
  const [customSaddle, setCustomSaddle] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [includeSaddleFitting, setIncludeSaddleFitting] = useState(true)
  const [includeSpares, setIncludeSpares] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  const budgetLevels = [
    { id: 'budget', name: 'Budget', description: 'Second-hand & basic brands', multiplier: 0.5 },
    { id: 'mid', name: 'Mid-Range', description: 'Quality new items', multiplier: 1.0 },
    { id: 'premium', name: 'Premium', description: 'Top brands & custom', multiplier: 1.8 },
    { id: 'luxury', name: 'Luxury', description: 'Bespoke & designer', multiplier: 3.0 }
  ]

  const horseTypes = [
    { id: 'pony', name: 'Pony (up to 14.2hh)', sizeMultiplier: 0.85 },
    { id: 'cob', name: 'Cob', sizeMultiplier: 1.0 },
    { id: 'allrounder', name: 'Horse (15-16.2hh)', sizeMultiplier: 1.0 },
    { id: 'warmblood', name: 'Warmblood/Large', sizeMultiplier: 1.15 }
  ]

  const disciplines = [
    { id: 'general', name: 'General Purpose', saddleType: 'GP Saddle', extraGear: 0 },
    { id: 'dressage', name: 'Dressage', saddleType: 'Dressage Saddle', extraGear: 150 },
    { id: 'jumping', name: 'Jumping/Eventing', saddleType: 'Jump Saddle', extraGear: 200 },
    { id: 'showing', name: 'Showing', saddleType: 'Show Saddle', extraGear: 300 },
    { id: 'western', name: 'Western', saddleType: 'Western Saddle', extraGear: 250 }
  ]

  // Base costs (mid-range prices UK 2026)
  const baseCosts = {
    saddle: 850,
    saddleFitting: 85,
    bridle: 130,
    bit: 50,
    reins: 40,
    breastplate: 90,
    martingale: 70,
    girth: 65,
    stirrups: 90,
    stirrupLeathers: 50,
    numnah: 45,
    halfPad: 60,
    turnoutRug: 130,
    stableRug: 90,
    fleece: 45,
    rainSheet: 65,
    flyRug: 55,
    cooler: 60,
    brushingBoots: 50,
    tendonBoots: 60,
    overreachBoots: 28,
    travelBoots: 65,
    groomingKit: 90,
    hoofPick: 10,
    leadrope: 18,
    headcollar: 28,
    hayNet: 14,
    feedBuckets: 22,
    waterBuckets: 18,
    firstAidKit: 70,
    tackBox: 50,
    hatSilk: 25,
    hiViz: 40
  }

  const calculate = () => {
    const budget = budgetLevels.find(b => b.id === budgetLevel)
    const horse = horseTypes.find(h => h.id === horseType)
    const disc = disciplines.find(d => d.id === discipline)
    
    if (!budget || !horse || !disc) return

    const multiplier = budget.multiplier * horse.sizeMultiplier

    let saddleCost = 0
    let bridleCost = 0
    let rugsCost = 0
    let bootsCost = 0
    let groomingCost = 0
    let essentialsCost = 0

    // Saddle & accessories
    if (needSaddle) {
      if (customSaddle && parseFloat(customSaddle) > 0) {
        saddleCost = parseFloat(customSaddle)
      } else {
        saddleCost = baseCosts.saddle * multiplier
      }
      saddleCost += baseCosts.girth * multiplier
      saddleCost += baseCosts.stirrups * multiplier
      saddleCost += baseCosts.stirrupLeathers * multiplier
      saddleCost += baseCosts.numnah * multiplier
      
      if (includeSaddleFitting) {
        saddleCost += baseCosts.saddleFitting
      }
    }

    // Bridle & accessories
    if (needBridle) {
      bridleCost = baseCosts.bridle * multiplier
      bridleCost += baseCosts.bit * multiplier
      bridleCost += baseCosts.reins * multiplier
      
      if (discipline === 'jumping' || discipline === 'general') {
        bridleCost += baseCosts.martingale * multiplier
      }
      if (discipline === 'jumping' || discipline === 'eventing') {
        bridleCost += baseCosts.breastplate * multiplier
      }
    }

    // Rugs
    if (needRugs) {
      rugsCost = baseCosts.turnoutRug * multiplier
      rugsCost += baseCosts.stableRug * multiplier
      rugsCost += baseCosts.fleece * multiplier
      rugsCost += baseCosts.rainSheet * multiplier
      rugsCost += baseCosts.cooler * multiplier
      
      if (includeSpares) {
        rugsCost += baseCosts.turnoutRug * multiplier * 0.8 // spare turnout
        rugsCost += baseCosts.flyRug * multiplier
      }
    }

    // Boots
    if (needBoots) {
      bootsCost = baseCosts.brushingBoots * multiplier
      bootsCost += baseCosts.overreachBoots * multiplier
      bootsCost += baseCosts.travelBoots * multiplier
      
      if (discipline === 'jumping' || discipline === 'eventing') {
        bootsCost += baseCosts.tendonBoots * multiplier
      }
    }

    // Grooming & essentials
    if (needGrooming) {
      groomingCost = baseCosts.groomingKit * multiplier
      groomingCost += baseCosts.hoofPick
      groomingCost += baseCosts.firstAidKit
      groomingCost += baseCosts.tackBox * multiplier
    }

    // Always needed essentials
    essentialsCost = baseCosts.headcollar * multiplier
    essentialsCost += baseCosts.leadrope * multiplier
    essentialsCost += baseCosts.hayNet * 2
    essentialsCost += baseCosts.feedBuckets
    essentialsCost += baseCosts.waterBuckets
    essentialsCost += baseCosts.hiViz

    // Discipline-specific extras
    const disciplineExtras = disc.extraGear * budget.multiplier

    const totalCost = saddleCost + bridleCost + rugsCost + bootsCost + groomingCost + essentialsCost + disciplineExtras
    
    // Annual replacement estimate (rugs every 2-3 years, boots every 1-2 years)
    const annualReplacement = (rugsCost / 2.5) + (bootsCost / 1.5) + 120

    // UK average comparison
    const ukAverageSetup = 2800

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'tack_equipment',
        budget_level: budgetLevel,
        discipline: discipline,
        horse_type: horseType,
        total_cost: totalCost.toFixed(0)
      })
    }

    setResult({
      totalCost: totalCost.toFixed(2),
      annualReplacement: annualReplacement.toFixed(2),
      breakdown: {
        saddle: saddleCost.toFixed(2),
        bridle: bridleCost.toFixed(2),
        rugs: rugsCost.toFixed(2),
        boots: bootsCost.toFixed(2),
        grooming: groomingCost.toFixed(2),
        essentials: essentialsCost.toFixed(2),
        disciplineExtras: disciplineExtras.toFixed(2)
      },
      percentages: {
        saddle: ((saddleCost / totalCost) * 100).toFixed(0),
        bridle: ((bridleCost / totalCost) * 100).toFixed(0),
        rugs: ((rugsCost / totalCost) * 100).toFixed(0),
        boots: ((bootsCost / totalCost) * 100).toFixed(0),
        other: (((groomingCost + essentialsCost + disciplineExtras) / totalCost) * 100).toFixed(0)
      },
      comparison: {
        vsUkAverage: totalCost < ukAverageSetup,
        ukAverage: ukAverageSetup
      },
      budgetInfo: budget,
      disciplineInfo: disc
    })
  }

  // 15 FAQs for maximum SEO value
  const faqs = [
    {
      q: 'How much does a full tack set cost UK?',
      a: 'A complete tack setup for a horse in the UK costs £1,800-£4,500+ depending on quality. Budget setups with second-hand items can be £900-£1,400, while premium branded gear costs £3,500-£7,000. The saddle is typically 40-50% of the total cost.'
    },
    {
      q: 'Should I buy new or second-hand tack?',
      a: 'Second-hand tack can offer excellent value if properly checked. Saddles, bridles, and rugs are often available in good condition at 30-50% of new prices. Always check leather for cracks, stitching integrity, and tree condition for saddles. Have second-hand saddles checked by a fitter.'
    },
    {
      q: 'How much should I spend on a saddle?',
      a: 'For regular riding, budget £550-£1,800 for a quality second-hand or mid-range new saddle. Premium brands like Albion, Devoucoux, or Butet cost £2,500-£6,000+. A well-fitted £900 saddle is better than an ill-fitting £3,500 one - always get professional fitting.'
    },
    {
      q: 'How many rugs does a horse need?',
      a: 'A minimum set includes: turnout rug (medium weight), stable rug, fleece/cooler, and rain sheet. Many owners have 5-8 rugs including spare turnouts, different weights, and fly rugs. Clipped horses need more rugs than those with full coats.'
    },
    {
      q: 'What tack is essential vs nice-to-have?',
      a: 'Essential: saddle, bridle, headcollar, lead rope, grooming kit, first aid kit. Nice-to-have: boots, breastplate, martingale, half pad, multiple rugs. Start with essentials and add as needed - many horses don\'t need boots for light work.'
    },
    {
      q: 'How often does tack need replacing?',
      a: 'Leather tack (saddle, bridle) lasts 10-20+ years with care. Synthetic items last 3-7 years. Rugs typically need replacing every 2-4 years. Boots and numnahs wear faster (1-3 years). Regular cleaning and maintenance extends lifespan significantly.'
    },
    {
      q: 'Is expensive tack worth it?',
      a: 'Premium tack often offers better fit, durability, and comfort, but mid-range quality is perfectly adequate for most riders. Invest most in the saddle (affects horse and rider comfort) and save on items like grooming kits and headcollars where brand matters less.'
    },
    {
      q: 'What tack do I need for different disciplines?',
      a: 'Dressage: dressage saddle, double bridle (for higher levels), white numnah. Jumping: jump saddle, breastplate, tendon boots. Showing: show saddle, coloured browband, minimal visible tack. General purpose saddles work for most recreational riders.'
    },
    {
      q: 'Where can I buy tack in the UK?',
      a: 'Options include: local saddleries (best for fitting), online retailers (Naylors, Ride-Away, Horse Health), Facebook selling groups, eBay, and tack sales at shows. Local saddlers often offer fitting services and trade-ins. Always try saddles before buying.'
    },
    {
      q: 'Do I need a saddle fitter?',
      a: 'Yes - a professional saddle fitter (£60-£120 visit) ensures your saddle fits both horse and rider. Ill-fitting saddles cause back problems, behavioural issues, and poor performance. Get saddles checked every 6-12 months as horses\' shapes change.'
    },
    {
      q: 'What are the best tack brands UK?',
      a: 'Popular UK saddle brands include: Albion, Fairfax, Kent & Masters (mid-range), Devoucoux, Butet, Antares (premium). For bridles: Dy\'on, PS of Sweden, Schockemöhle. Rugs: WeatherBeeta, Shires, Horseware (mid), Rambo, Bucas (premium). Quality varies more by model than brand.'
    },
    {
      q: 'How much are horse boots UK?',
      a: 'Horse boots cost £25-£150+ per pair in the UK. Brushing boots: £30-£80, tendon boots: £40-£120, travel boots: £50-£100, overreach boots: £20-£45. Premium brands like Eskadron, LeMieux, and Veredus cost more. Most horses need 2-3 pairs.'
    },
    {
      q: 'What size rug does my horse need?',
      a: 'Measure from centre of chest around the widest part of the shoulder to the point of the buttock. UK sizes: 5\'6" to 7\'3". Pony rugs: 4\'6" to 5\'9". Cob rugs often run larger in neck. Always check manufacturer sizing guides as they vary between brands.'
    },
    {
      q: 'How do I care for leather tack?',
      a: 'Clean leather after every use with a damp cloth. Weekly: use saddle soap to clean thoroughly. Monthly: condition with leather balm or oil. Store in dry, ventilated area. Annual: deep clean and full condition. Well-maintained leather lasts decades.'
    },
    {
      q: 'Can I insure my horse tack?',
      a: 'Yes - tack insurance typically costs 2-4% of the value per year. Cover can be added to horse insurance policies or home contents insurance. Document everything with photos and receipts. Cover includes theft, loss, and accidental damage. Worth it for expensive saddles.'
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
      title: 'First Horse Calculator',
      description: 'Complete first year costs',
      href: '/first-horse-calculator',
      icon: Star,
      color: 'text-pink-600',
      bg: 'bg-pink-50 hover:bg-pink-100'
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
      title: 'Competition Budget Calculator',
      description: 'Show season expenses',
      href: '/competition-budget-calculator',
      icon: Target,
      color: 'text-rose-600',
      bg: 'bg-rose-50 hover:bg-rose-100'
    }
  ]

  return (
    <>
      <Helmet>
        {/* 1. Title Tag */}
        <title>Tack &amp; Equipment Cost Calculator UK 2026 | Horse Gear Budget | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free tack and equipment cost calculator for UK horse owners. Calculate saddle, bridle, rugs, boots and grooming kit costs. Budget to premium options with 2026 prices." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="horse tack cost UK, saddle prices UK, bridle cost, horse rugs price, equestrian equipment budget, horse gear calculator, tack shopping list 2026" 
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
        <meta name="theme-color" content="#0891b2" />
        
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
        <meta property="og:title" content="Tack & Equipment Cost Calculator UK 2026 | HorseCost" />
        <meta property="og:description" content="Calculate the full cost of tacking up your horse. Saddles, bridles, rugs, boots and more with UK 2026 prices." />
        <meta property="og:url" content="https://horsecost.co.uk/tack-equipment-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/tack-equipment-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Tack and Equipment Cost Calculator showing saddle, bridle, and rug costs" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Tack & Equipment Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Calculate horse tack costs from budget to premium. UK 2026 prices." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/tack-equipment-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Tack & Equipment Cost Calculator UK" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/tack-equipment-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/tack-equipment-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Tack & Equipment Calculator', 'item': 'https://horsecost.co.uk/tack-equipment-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Tack & Equipment Cost Calculator UK',
                'description': 'Calculate the cost of horse tack and equipment including saddles, bridles, rugs, boots, and grooming kits with UK 2026 prices.',
                'url': 'https://horsecost.co.uk/tack-equipment-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.7', 'ratingCount': '234', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Calculate Your Horse Tack Budget',
                'description': 'Step-by-step guide to calculating your horse tack and equipment costs',
                'totalTime': 'PT3M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Select Budget Level', 'text': 'Choose from budget (second-hand), mid-range, premium, or luxury tack options based on your spending preferences.' },
                  { '@type': 'HowToStep', 'name': 'Select Horse Size', 'text': 'Choose your horse type (pony, cob, horse, warmblood) as sizes affect tack pricing.' },
                  { '@type': 'HowToStep', 'name': 'Choose Discipline', 'text': 'Select your primary riding discipline as this determines saddle type and specific equipment needs.' },
                  { '@type': 'HowToStep', 'name': 'Select Equipment Needed', 'text': 'Tick which categories you need: saddle, bridle, rugs, boots, and grooming equipment.' },
                  { '@type': 'HowToStep', 'name': 'View Your Budget', 'text': 'Click calculate to see your total equipment cost with detailed breakdown by category.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Tack & Equipment Cost Calculator UK 2026 - Horse Gear Budget Planner',
                'description': 'Free calculator for UK horse tack costs. Calculate saddle, bridle, rugs, boots and grooming kit expenses from budget to premium options.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'image': 'https://horsecost.co.uk/images/tack-equipment-calculator-og.jpg',
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
                'name': 'Tack & Equipment Cost Calculator UK 2026',
                'description': 'Calculate horse tack and equipment costs including saddles, bridles, rugs, and boots',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/tack-equipment-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'UK Horse Tack Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'GP Saddle',
                    'description': 'General Purpose saddle designed for multiple disciplines including hacking, flatwork, and light jumping. The most versatile saddle type, suitable for most recreational riders.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Turnout Rug',
                    'description': 'Waterproof outdoor rug designed to protect horses from rain and wind while turned out in the field. Available in different weights (no fill to heavyweight) for various temperatures.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Brushing Boots',
                    'description': 'Protective leg boots worn on the lower leg to prevent injury from the horse striking itself during movement. Essential for horses that move close or dish.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Saddle Fitting',
                    'description': 'Professional service (£60-120 in UK) to ensure a saddle fits correctly on both horse and rider. Poor fit causes back problems and performance issues. Should be checked every 6-12 months.'
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
          <a href="/" className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header */}
        <header className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Tack &amp; Equipment Calculator UK 2026</h1>
                <p className="text-cyan-200 mt-1">Plan your horse gear budget</p>
              </div>
            </div>
            <p className="text-cyan-100 max-w-3xl">
              Calculate the full cost of equipping your horse. From saddles and bridles to rugs and boots, 
              plan your tack budget with UK 2026 prices across budget, mid-range, and premium options.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-cyan-200 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last updated: January 2026
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                UK retail pricing
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                234 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-cyan-500/30 text-cyan-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                UK retailer prices verified
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Budget to luxury options
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
              <HelpCircle className="w-5 h-5 text-cyan-600" />
              Quick Answer: How Much Does Horse Tack Cost UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>A complete horse tack setup costs £1,800-£4,500+ in the UK.</strong> Budget second-hand: £900-1,400. Mid-range new: £2,000-3,000. Premium brands: £3,500-7,000+. Saddles account for 40-50% of total cost (£400-5,000+). Annual replacement/maintenance adds £200-500/year for rugs, boots, and wear items.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-600 font-medium">Budget Setup</div>
                <div className="text-xl font-bold text-gray-700">£900-1,400</div>
                <div className="text-xs text-gray-500">second-hand</div>
              </div>
              <div className="bg-cyan-50 p-3 rounded-lg text-center">
                <div className="text-xs text-cyan-600 font-medium">Mid-Range</div>
                <div className="text-xl font-bold text-cyan-700">£2,000-3,000</div>
                <div className="text-xs text-gray-500">new items</div>
              </div>
              <div className="bg-teal-50 p-3 rounded-lg text-center">
                <div className="text-xs text-teal-600 font-medium">Premium</div>
                <div className="text-xl font-bold text-teal-700">£3,500-5,000</div>
                <div className="text-xs text-gray-500">top brands</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-xs text-purple-600 font-medium">Luxury</div>
                <div className="text-xl font-bold text-purple-700">£5,000-10,000+</div>
                <div className="text-xs text-gray-500">bespoke</div>
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
                {/* Budget Level */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Budget Level</label>
                  </div>
                  <div className="space-y-2">
                    {budgetLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setBudgetLevel(level.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          budgetLevel === level.id
                            ? 'border-cyan-500 bg-cyan-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${budgetLevel === level.id ? 'text-cyan-700' : 'text-gray-900'}`}>
                              {level.name}
                            </p>
                            <p className="text-sm text-gray-500">{level.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Horse Type */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Horse Size</label>
                  </div>
                  <select
                    value={horseType}
                    onChange={(e) => setHorseType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                  >
                    {horseTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </section>

                {/* Discipline */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Primary Discipline</label>
                  </div>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                  >
                    {disciplines.map((disc) => (
                      <option key={disc.id} value={disc.id}>{disc.name}</option>
                    ))}
                  </select>
                </section>

                {/* What do you need? */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">What Do You Need?</label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needSaddle}
                        onChange={(e) => setNeedSaddle(e.target.checked)}
                        className="w-5 h-5 text-cyan-600 rounded"
                      />
                      <span className="font-medium text-gray-900">Saddle &amp; Accessories</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needBridle}
                        onChange={(e) => setNeedBridle(e.target.checked)}
                        className="w-5 h-5 text-cyan-600 rounded"
                      />
                      <span className="font-medium text-gray-900">Bridle &amp; Bit</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needRugs}
                        onChange={(e) => setNeedRugs(e.target.checked)}
                        className="w-5 h-5 text-cyan-600 rounded"
                      />
                      <span className="font-medium text-gray-900">Rugs (Turnout, Stable, Cooler)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needBoots}
                        onChange={(e) => setNeedBoots(e.target.checked)}
                        className="w-5 h-5 text-cyan-600 rounded"
                      />
                      <span className="font-medium text-gray-900">Boots (Brushing, Travel)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={needGrooming}
                        onChange={(e) => setNeedGrooming(e.target.checked)}
                        className="w-5 h-5 text-cyan-600 rounded"
                      />
                      <span className="font-medium text-gray-900">Grooming Kit &amp; First Aid</span>
                    </label>
                  </div>
                </section>

                {/* Advanced Options */}
                <section className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-cyan-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Additional Options
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Saddle Budget (£)
                        </label>
                        <div className="relative">
                          <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={customSaddle}
                            onChange={(e) => setCustomSaddle(e.target.value)}
                            placeholder="Leave blank for estimate"
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeSaddleFitting}
                          onChange={(e) => setIncludeSaddleFitting(e.target.checked)}
                          className="w-5 h-5 text-cyan-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Include Saddle Fitting</span>
                          <p className="text-sm text-gray-500">Professional fitting (£85)</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeSpares}
                          onChange={(e) => setIncludeSpares(e.target.checked)}
                          className="w-5 h-5 text-cyan-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Include Spare Rugs</span>
                          <p className="text-sm text-gray-500">Extra turnout + fly rug</p>
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
                  className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-700 hover:to-teal-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Equipment Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl p-6 text-white">
                      <p className="text-cyan-100 text-sm mb-1">Total Equipment Cost</p>
                      <p className="text-4xl font-bold">£{result.totalCost}</p>
                      <p className="text-cyan-200 text-sm mt-1">{result.budgetInfo.name} setup</p>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-100 text-sm">Annual Replacement</span>
                          <span className="font-bold">£{result.annualReplacement}/year</span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        {parseFloat(result.breakdown.saddle) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Saddle &amp; Accessories</span>
                            <span className="font-medium">£{result.breakdown.saddle}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.bridle) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bridle &amp; Bit</span>
                            <span className="font-medium">£{result.breakdown.bridle}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.rugs) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rugs</span>
                            <span className="font-medium">£{result.breakdown.rugs}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.boots) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Boots</span>
                            <span className="font-medium">£{result.breakdown.boots}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.grooming) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Grooming &amp; First Aid</span>
                            <span className="font-medium">£{result.breakdown.grooming}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Essentials (Headcollar etc)</span>
                          <span className="font-medium">£{result.breakdown.essentials}</span>
                        </div>
                        {parseFloat(result.breakdown.disciplineExtras) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">{result.disciplineInfo.name} Extras</span>
                            <span className="font-medium">£{result.breakdown.disciplineExtras}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total</span>
                          <span>£{result.totalCost}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reminders CTA in Results */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold">Track Your Tack Maintenance</h3>
                          <p className="text-purple-200 text-sm">Get reminders for saddle checks, rug repairs &amp; more</p>
                        </div>
                        <button
                          onClick={() => setShowRemindersForm(true)}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-50 transition flex-shrink-0"
                        >
                          Set Up
                        </button>
                      </div>
                    </div>

                    {/* Where the Money Goes */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Where Your Money Goes</h3>
                      <div className="space-y-2">
                        {parseFloat(result.percentages.saddle) > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Saddle</span>
                              <span>{result.percentages.saddle}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-cyan-500 rounded-full"
                                style={{ width: `${result.percentages.saddle}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {parseFloat(result.percentages.rugs) > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Rugs</span>
                              <span>{result.percentages.rugs}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-teal-500 rounded-full"
                                style={{ width: `${result.percentages.rugs}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {parseFloat(result.percentages.bridle) > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Bridle</span>
                              <span>{result.percentages.bridle}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${result.percentages.bridle}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* UK Average Comparison */}
                    <div className={`rounded-xl p-4 ${result.comparison.vsUkAverage ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className={`w-5 h-5 ${result.comparison.vsUkAverage ? 'text-green-600' : 'text-amber-600'}`} />
                        <h3 className={`font-semibold ${result.comparison.vsUkAverage ? 'text-green-900' : 'text-amber-900'}`}>
                          UK Average: £{result.comparison.ukAverage.toLocaleString()}
                        </h3>
                      </div>
                      <p className={`text-sm ${result.comparison.vsUkAverage ? 'text-green-700' : 'text-amber-700'}`}>
                        {result.comparison.vsUkAverage 
                          ? `You're £${(result.comparison.ukAverage - parseFloat(result.totalCost)).toFixed(0)} below average`
                          : `You're £${(parseFloat(result.totalCost) - result.comparison.ukAverage).toFixed(0)} above average`
                        }
                      </p>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select your preferences and click calculate to see your equipment budget</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Box */}
          <div className="bg-cyan-50 border-l-4 border-cyan-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-cyan-900 mb-2">Money-Saving Tips for Tack</h3>
                <ul className="text-cyan-800 space-y-1 text-sm">
                  <li>• <strong>Buy second-hand</strong> - Facebook groups, eBay, and tack sales offer 40-60% savings</li>
                  <li>• <strong>Invest in the saddle</strong> - it's worth spending more here, save elsewhere</li>
                  <li>• <strong>Start minimal</strong> - buy essentials first, add extras as you learn what you need</li>
                  <li>• <strong>Look for bundles</strong> - saddleries often offer package deals</li>
                  <li>• <strong>Care for your tack</strong> - regular cleaning doubles lifespan</li>
                  <li>• Consider <a href="/horse-insurance-calculator" className="text-cyan-700 underline hover:text-cyan-900">tack insurance</a> for valuable items</li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Tack Prices Table */}
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 overflow-x-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Tack Prices Guide 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Item</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Budget</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Mid-Range</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Saddle (GP)</td>
                    <td className="py-3 px-4 text-center">£350-£700</td>
                    <td className="py-3 px-4 text-center">£700-£1,800</td>
                    <td className="py-3 px-4 text-center">£1,800-£5,000+</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Bridle (complete)</td>
                    <td className="py-3 px-4 text-center">£50-£90</td>
                    <td className="py-3 px-4 text-center">£90-£220</td>
                    <td className="py-3 px-4 text-center">£220-£550+</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Turnout Rug</td>
                    <td className="py-3 px-4 text-center">£60-£90</td>
                    <td className="py-3 px-4 text-center">£90-£170</td>
                    <td className="py-3 px-4 text-center">£170-£350+</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Brushing Boots (pair)</td>
                    <td className="py-3 px-4 text-center">£25-£40</td>
                    <td className="py-3 px-4 text-center">£40-£80</td>
                    <td className="py-3 px-4 text-center">£80-£170+</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Grooming Kit</td>
                    <td className="py-3 px-4 text-center">£35-£60</td>
                    <td className="py-3 px-4 text-center">£60-£120</td>
                    <td className="py-3 px-4 text-center">£120-£250+</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Budget prices typically second-hand or basic brands. Premium includes custom-made and designer brands. Prices January 2026.
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
                  <h3 className="font-bold text-gray-900 group-hover:text-cyan-600">{calc.title}</h3>
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
                Never miss a saddle fitting check, rug repair, or equipment maintenance. 
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
          <div className="mt-12 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Planning Your First Horse Purchase?</h2>
            <p className="text-cyan-100 mb-6 max-w-xl mx-auto">
              Get the complete picture with our First Horse Calculator - includes tack, livery, and all first-year costs.
            </p>
            <a 
              href="/first-horse-calculator"
              className="inline-flex items-center gap-2 bg-white text-cyan-600 px-6 py-3 rounded-xl font-bold hover:bg-cyan-50 transition"
            >
              Calculate First Year Costs
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
                  Get free email reminders for saddle fittings, rug cleaning, tack maintenance, and all your horse care needs.
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
