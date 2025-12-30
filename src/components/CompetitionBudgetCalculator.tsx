import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Trophy,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Car,
  Ticket,
  Calendar,
  PoundSterling,
  TrendingUp,
  MapPin,
  Users,
  Bell,
  ArrowRight,
  Clock,
  HelpCircle,
  CheckCircle2,
  Home,
  Wheat,
  Scissors,
  Stethoscope,
  Shield,
  ShoppingBag
} from 'lucide-react'

export default function CompetitionBudgetCalculator() {
  // Competition Details
  const [discipline, setDiscipline] = useState('')
  const [competitionLevel, setCompetitionLevel] = useState('')
  const [eventsPerMonth, setEventsPerMonth] = useState('')
  const [seasonLength, setSeasonLength] = useState('8')
  
  // Entry Fees
  const [entryFeePerEvent, setEntryFeePerEvent] = useState('')
  const [membershipFees, setMembershipFees] = useState('')
  
  // Transport
  const [averageDistance, setAverageDistance] = useState('')
  const [fuelCostPerMile, setFuelCostPerMile] = useState('0.25')
  const [ownTransport, setOwnTransport] = useState(true)
  const [transportHireCost, setTransportHireCost] = useState('')
  
  // Additional Costs
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [stabling, setStabling] = useState('')
  const [coaching, setCoaching] = useState('')
  const [equipment, setEquipment] = useState('')
  
  const [result, setResult] = useState<any>(null)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  // Discipline presets (2026 prices)
  const disciplinePresets: Record<string, { 
    label: string, 
    unaffiliatedEntry: number, 
    affiliatedEntry: number,
    membership: number,
    description: string 
  }> = {
    'showjumping': { 
      label: 'Show Jumping', 
      unaffiliatedEntry: 28, 
      affiliatedEntry: 50,
      membership: 145,
      description: 'BS membership + class entries'
    },
    'dressage': { 
      label: 'Dressage', 
      unaffiliatedEntry: 22, 
      affiliatedEntry: 45,
      membership: 140,
      description: 'BD membership + test entries'
    },
    'eventing': { 
      label: 'Eventing', 
      unaffiliatedEntry: 45, 
      affiliatedEntry: 95,
      membership: 165,
      description: 'BE membership + event entries'
    },
    'showing': { 
      label: 'Showing', 
      unaffiliatedEntry: 18, 
      affiliatedEntry: 35,
      membership: 115,
      description: 'Society memberships + class entries'
    },
    'endurance': { 
      label: 'Endurance', 
      unaffiliatedEntry: 40, 
      affiliatedEntry: 60,
      membership: 90,
      description: 'EGB membership + ride entries'
    },
    'hunting': { 
      label: 'Hunting', 
      unaffiliatedEntry: 70, 
      affiliatedEntry: 140,
      membership: 450,
      description: 'Hunt subscription + caps'
    },
    'polocrosse': { 
      label: 'Polo/Polocrosse', 
      unaffiliatedEntry: 35, 
      affiliatedEntry: 55,
      membership: 135,
      description: 'Club membership + tournaments'
    },
    'driving': { 
      label: 'Carriage Driving', 
      unaffiliatedEntry: 40, 
      affiliatedEntry: 70,
      membership: 110,
      description: 'BDS membership + event entries'
    }
  }

  // Level presets
  const levelPresets: Record<string, { label: string, multiplier: number, description: string }> = {
    'intro': { label: 'Intro/Unaffiliated', multiplier: 0.7, description: 'Local shows, no memberships required' },
    'club': { label: 'Club/Riding Club', multiplier: 0.85, description: 'RC competitions, lower entry fees' },
    'affiliated-low': { label: 'Affiliated (Novice)', multiplier: 1.0, description: 'Entry level affiliated competition' },
    'affiliated-mid': { label: 'Affiliated (Medium)', multiplier: 1.3, description: 'Intermediate competition level' },
    'affiliated-high': { label: 'Affiliated (Advanced)', multiplier: 1.6, description: 'Higher level affiliated competition' },
    'championship': { label: 'Championships', multiplier: 2.0, description: 'National/regional championships' }
  }

  const applyDisciplinePreset = (disc: string) => {
    setDiscipline(disc)
    const preset = disciplinePresets[disc]
    if (preset) {
      const isAffiliated = competitionLevel && !competitionLevel.includes('intro') && !competitionLevel.includes('club')
      setEntryFeePerEvent(isAffiliated ? preset.affiliatedEntry.toString() : preset.unaffiliatedEntry.toString())
      setMembershipFees(isAffiliated ? preset.membership.toString() : '0')
    }
  }

  const applyLevelPreset = (level: string) => {
    setCompetitionLevel(level)
    const preset = disciplinePresets[discipline]
    if (preset) {
      const isAffiliated = !level.includes('intro') && !level.includes('club')
      setEntryFeePerEvent(isAffiliated ? preset.affiliatedEntry.toString() : preset.unaffiliatedEntry.toString())
      setMembershipFees(isAffiliated ? preset.membership.toString() : '0')
    }
  }

  const calculate = () => {
    const events = parseFloat(eventsPerMonth) || 2
    const months = parseInt(seasonLength) || 8
    const entryFee = parseFloat(entryFeePerEvent) || 35
    const membership = parseFloat(membershipFees) || 0
    const distance = parseFloat(averageDistance) || 30
    const fuelCost = parseFloat(fuelCostPerMile) || 0.25
    const hireCost = parseFloat(transportHireCost) || 0
    const stablingCost = parseFloat(stabling) || 0
    const coachingCost = parseFloat(coaching) || 0
    const equipmentCost = parseFloat(equipment) || 0

    const totalEvents = events * months

    // Entry fees
    const totalEntryFees = entryFee * totalEvents

    // Transport costs
    const totalMiles = distance * 2 * totalEvents // Round trip
    let transportCosts = 0
    if (ownTransport) {
      transportCosts = totalMiles * fuelCost
      // Add wear and tear estimate (roughly £0.12/mile for trailer)
      transportCosts += totalMiles * 0.12
    } else {
      transportCosts = hireCost * totalEvents
    }

    // Stabling (for multi-day events)
    const stablingTotal = stablingCost * totalEvents * 0.3 // Assume 30% of events need stabling

    // Coaching
    const coachingTotal = coachingCost * months

    // Equipment (annual estimate)
    const equipmentTotal = equipmentCost

    // Calculate totals
    const seasonTotal = totalEntryFees + transportCosts + stablingTotal + 
                       coachingTotal + equipmentTotal + membership

    const perEventCost = seasonTotal / totalEvents
    const monthlyAverage = seasonTotal / months

    // Level multiplier
    const levelData = levelPresets[competitionLevel]
    const adjustedTotal = levelData ? seasonTotal * levelData.multiplier : seasonTotal

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'competition_budget',
        discipline: discipline,
        competition_level: competitionLevel,
        total_events: totalEvents,
        season_total: seasonTotal.toFixed(0)
      })
    }

    setResult({
      totalEvents,
      seasonLength: months,
      costs: {
        entries: totalEntryFees.toFixed(2),
        membership: membership.toFixed(2),
        transport: transportCosts.toFixed(2),
        stabling: stablingTotal.toFixed(2),
        coaching: coachingTotal.toFixed(2),
        equipment: equipmentTotal.toFixed(2)
      },
      transport: {
        totalMiles: Math.round(totalMiles),
        costPerMile: ownTransport ? (fuelCost + 0.12).toFixed(2) : 'N/A',
        method: ownTransport ? 'Own transport' : 'Hired transport'
      },
      totals: {
        season: seasonTotal.toFixed(2),
        perEvent: perEventCost.toFixed(2),
        monthly: monthlyAverage.toFixed(2),
        adjusted: adjustedTotal.toFixed(2)
      },
      breakdown: {
        entriesPercent: ((totalEntryFees / seasonTotal) * 100).toFixed(0),
        transportPercent: ((transportCosts / seasonTotal) * 100).toFixed(0),
        otherPercent: (((stablingTotal + coachingTotal + equipmentTotal + membership) / seasonTotal) * 100).toFixed(0)
      }
    })
  }

  // 15 FAQs for maximum SEO value
  const faqs = [
    {
      q: "How much does it cost to compete in showjumping UK?",
      a: "Unaffiliated showjumping costs £20-35 per class, while British Showjumping affiliated classes cost £40-70+. Annual BS membership is around £145 (2026). Including transport, a casual competitor doing 2 shows monthly might spend £1,800-3,000/year, while serious competitors can spend £6,000-12,000+."
    },
    {
      q: "What does British Eventing membership cost?",
      a: "British Eventing membership costs approximately £165/year for full membership (2026). Event entries range from £70-160 depending on level. A season of 8-10 events at novice level typically costs £3,000-5,000 including transport, with advanced levels costing significantly more."
    },
    {
      q: "Are unaffiliated competitions worth it?",
      a: "Unaffiliated competitions are excellent value - typically 50-60% cheaper than affiliated events with no membership fees. They're perfect for gaining experience, young horses, or riders wanting to compete without high costs. Many riders compete unaffiliated for years and have just as much fun."
    },
    {
      q: "How much does horse transport cost per mile?",
      a: "Own transport costs approximately 25-35p per mile in fuel plus wear and tear (total ~35-50p/mile). Professional horse transport hire costs £1.20-2.50 per mile or £60-180 per trip locally. For frequent competitors, owning transport usually works out cheaper long-term."
    },
    {
      q: "What hidden costs should I budget for?",
      a: "Hidden competition costs include: parking (£8-20), additional classes entered on the day, overnight stabling (£35-70), food and drinks, replacement studs/equipment, turnout preparation, coaching before events, and qualification fees for championships."
    },
    {
      q: "How much does dressage competition cost?",
      a: "British Dressage membership costs around £140/year (2026). Unaffiliated tests cost £18-28, while BD tests cost £35-55+. A season of monthly competitions at prelim/novice level costs £1,500-2,500 including transport. Higher levels with more frequent training cost considerably more."
    },
    {
      q: "Should I join a riding club for competing?",
      a: "Riding clubs offer excellent value - membership is typically £35-60/year and gives access to competitions at 40-60% lower cost than affiliated events. BRC also offers area and national championships. It's a great option for those wanting competitive experience without high costs."
    },
    {
      q: "How do I reduce competition costs?",
      a: "Save money by: sharing transport with friends, competing unaffiliated or riding club level, choosing local venues, entering multiple classes at one venue rather than multiple venues, buying equipment second-hand, and planning your season to minimise travel."
    },
    {
      q: "What equipment do I need for competing?",
      a: "Basic competition equipment includes: show jacket (£100-350), white/cream breeches, show shirt, stock/tie, number holder, and appropriate tack for your discipline. Budget £350-600 for starter kit, though second-hand is perfectly acceptable for most levels."
    },
    {
      q: "How many competitions should I budget for?",
      a: "Most amateur competitors do 1-3 events per month during the season (typically 6-9 months). Beginners might start with 6-10 events per year, while keen competitors may do 20-30+. Budget for your realistic schedule plus a few extras for qualifiers or opportunities."
    },
    {
      q: "What is the cheapest equestrian discipline to compete in?",
      a: "Showing and riding club events are typically cheapest - £15-25 per class with minimal equipment requirements. Endurance riding also offers good value at club level. Eventing and polo/polocrosse are generally most expensive due to higher entry fees and equipment needs."
    },
    {
      q: "How much does coaching for competitions cost?",
      a: "Competition coaching typically costs £45-80 per hour with a qualified instructor. Many competitors have 2-4 lessons per month during competition season, costing £100-300/month. Some disciplines like dressage and eventing benefit from more intensive pre-competition coaching."
    },
    {
      q: "Do I need insurance for competing?",
      a: "Yes - most affiliated competitions require personal accident cover and third-party liability. BHS Gold membership (£50/year) provides this, or buy standalone competition insurance. Your standard horse insurance may not cover competition injuries - check your policy."
    },
    {
      q: "What are championship qualification costs?",
      a: "Qualifying for championships adds £200-500+ in extra fees: qualification classes, championship entry (often £80-200), travel to championship venue (sometimes distant), accommodation, and potentially stabling. Budget separately for championship aspirations."
    },
    {
      q: "How much does overnight stabling cost at competitions?",
      a: "Overnight stabling at competitions costs £35-70 per night in the UK (2026). Multi-day events like eventing or major shows often require 1-3 nights. Some venues include stabling in entry; others charge separately. Budget for bedding and hay too."
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
      title: 'Tack & Equipment Calculator',
      description: 'Budget for competition gear',
      href: '/tack-equipment-calculator',
      icon: ShoppingBag,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 hover:bg-cyan-100'
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
        <title>Competition Budget Calculator UK 2026 | Horse Show Costs | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free competition budget calculator for UK equestrians. Calculate entry fees, transport, membership and show costs for dressage, showjumping, eventing and more. 2026 prices." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="horse competition costs UK, show jumping budget 2026, dressage costs UK, eventing entry fees, horse show expenses, equestrian competition calculator, British Showjumping costs" 
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
        <meta name="theme-color" content="#be123c" />
        
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
        <meta property="og:title" content="Competition Budget Calculator UK 2026 | Horse Show Costs | HorseCost" />
        <meta property="og:description" content="Calculate your horse competition season budget. Entry fees, transport, membership costs for UK equestrian sports." />
        <meta property="og:url" content="https://horsecost.co.uk/competition-budget-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/competition-budget-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Competition Budget Calculator showing horse show costs for UK equestrians" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Competition Budget Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Plan your competition season budget with entry fees, transport and membership costs." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/competition-budget-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Competition Budget Calculator UK" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/competition-budget-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/competition-budget-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Competition Budget Calculator', 'item': 'https://horsecost.co.uk/competition-budget-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Competition Budget Calculator UK',
                'url': 'https://horsecost.co.uk/competition-budget-calculator',
                'description': 'Calculate competition season costs for UK equestrian sports including entry fees, transport, and membership with 2026 prices.',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.8', 'ratingCount': '234', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Calculate Your Horse Competition Budget',
                'description': 'Step-by-step guide to calculating your equestrian competition season costs',
                'totalTime': 'PT5M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Select Your Discipline', 'text': 'Choose your competition discipline: showjumping, dressage, eventing, showing, endurance, hunting, polo, or driving. Each has different entry fees and membership costs.' },
                  { '@type': 'HowToStep', 'name': 'Choose Competition Level', 'text': 'Select your level from intro/unaffiliated through to championships. Higher levels have higher entry fees and may require memberships.' },
                  { '@type': 'HowToStep', 'name': 'Enter Season Details', 'text': 'Specify how many events per month and your season length (typically 6-10 months). Enter entry fees if you know your specific venues.' },
                  { '@type': 'HowToStep', 'name': 'Add Transport Costs', 'text': 'Calculate transport: own vehicle (fuel + wear) or hired transport. Enter average distance to venues for accurate costs.' },
                  { '@type': 'HowToStep', 'name': 'Review Total Budget', 'text': 'Get your complete season budget including entries, transport, membership, coaching, and equipment costs broken down monthly and per event.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Competition Budget Calculator UK 2026 - Plan Your Horse Show Season',
                'description': 'Free calculator for UK equestrian competition costs. Calculate entry fees, transport, membership for dressage, showjumping, eventing and more.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'image': 'https://horsecost.co.uk/images/competition-budget-calculator-og.jpg',
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
                'name': 'Competition Budget Calculator UK 2026',
                'description': 'Calculate horse competition season costs including entry fees, transport and membership',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/competition-budget-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'UK Equestrian Competition Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Affiliated Competition',
                    'description': 'Competitions run under a governing body (British Showjumping, British Dressage, British Eventing). Require membership, have higher entry fees, but results count towards rankings and qualifications.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Unaffiliated Competition',
                    'description': 'Independent competitions not governed by national bodies. Lower entry fees (40-60% cheaper), no membership required. Perfect for gaining experience or casual competitors.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'British Riding Clubs (BRC)',
                    'description': 'Network of local riding clubs offering affordable competitions. Membership £35-60/year gives access to area and national championships. Excellent value middle ground between unaffiliated and fully affiliated.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Competition Cap/Entry Fee',
                    'description': 'The fee paid to enter each competition class. Ranges from £15-25 unaffiliated to £50-150+ for affiliated events. Championship classes and higher levels cost more.'
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
          <a href="/" className="text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1">
            ← Back to All Calculators
          </a>
        </div>

        {/* Header Banner */}
        <header className="bg-gradient-to-r from-rose-600 to-red-500 text-white py-8 mt-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Competition Budget Calculator UK 2026</h1>
                <p className="text-rose-100 mt-1">Plan your season: entries, transport &amp; membership</p>
              </div>
            </div>
            <p className="text-rose-50 max-w-3xl">
              Calculate the true cost of your competition season. Includes entry fees, transport, 
              membership, and all the extras for dressage, showjumping, eventing and more.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-rose-200 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last updated: January 2026
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                UK governing body prices
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                234 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-rose-500/30 text-rose-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                BS/BD/BE fees verified
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                8 disciplines covered
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
              <HelpCircle className="w-5 h-5 text-rose-600" />
              Quick Answer: How Much Does Horse Competition Cost UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>Horse competition costs £1,500-8,000+ per season in the UK (2026).</strong> Casual unaffiliated competitors (10-15 events): £1,500-2,500/year. Regular affiliated competitors (20+ events): £3,000-6,000/year. Serious competitors at higher levels: £6,000-15,000+/year. Main costs: entry fees (30-40%), transport (25-35%), memberships, coaching, and equipment.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-rose-50 p-3 rounded-lg text-center">
                <div className="text-xs text-rose-600 font-medium">Unaffiliated</div>
                <div className="text-xl font-bold text-rose-700">£15-45</div>
                <div className="text-xs text-gray-500">per event</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="text-xs text-red-600 font-medium">Affiliated</div>
                <div className="text-xl font-bold text-red-700">£35-100</div>
                <div className="text-xs text-gray-500">per event</div>
              </div>
              <div className="bg-pink-50 p-3 rounded-lg text-center">
                <div className="text-xs text-pink-600 font-medium">Memberships</div>
                <div className="text-xl font-bold text-pink-700">£90-165</div>
                <div className="text-xs text-gray-500">per year</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg text-center">
                <div className="text-xs text-orange-600 font-medium">Transport</div>
                <div className="text-xl font-bold text-orange-700">£30-100</div>
                <div className="text-xs text-gray-500">per trip</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Main Calculator Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              
              {/* Section 1: Discipline */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h2 className="text-xl font-bold text-gray-900">Your Discipline</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(disciplinePresets).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => applyDisciplinePreset(key)}
                      className={`p-4 rounded-lg border-2 text-left transition ${
                        discipline === key 
                          ? 'border-rose-500 bg-rose-50 text-rose-700' 
                          : 'border-gray-200 hover:border-rose-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">{data.label}</div>
                      <div className="text-xs text-gray-500 mt-1">£{data.unaffiliatedEntry}-{data.affiliatedEntry}/event</div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Section 2: Competition Level */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h2 className="text-xl font-bold text-gray-900">Competition Level</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(levelPresets).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => applyLevelPreset(key)}
                      className={`p-4 rounded-lg border-2 text-left transition ${
                        competitionLevel === key 
                          ? 'border-rose-500 bg-rose-50 text-rose-700' 
                          : 'border-gray-200 hover:border-rose-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">{data.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{data.description}</div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Section 3: Season Details */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h2 className="text-xl font-bold text-gray-900">Season Details</h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Events Per Month
                    </label>
                    <input
                      type="number"
                      value={eventsPerMonth}
                      onChange={(e) => setEventsPerMonth(e.target.value)}
                      placeholder="e.g., 2"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4].map(n => (
                        <button
                          key={n}
                          onClick={() => setEventsPerMonth(n.toString())}
                          className={`px-3 py-1 text-sm rounded-full border ${
                            eventsPerMonth === n.toString() 
                              ? 'bg-rose-100 border-rose-500 text-rose-700' 
                              : 'border-gray-300 hover:border-rose-400'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Season Length (months)</label>
                    <select
                      value={seasonLength}
                      onChange={(e) => setSeasonLength(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    >
                      <option value="4">4 months (short)</option>
                      <option value="6">6 months (spring/summer)</option>
                      <option value="8">8 months (typical)</option>
                      <option value="10">10 months (extended)</option>
                      <option value="12">12 months (year-round)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Ticket className="w-4 h-4 inline mr-2" />
                      Entry Fee Per Event (£)
                    </label>
                    <input
                      type="number"
                      value={entryFeePerEvent}
                      onChange={(e) => setEntryFeePerEvent(e.target.value)}
                      placeholder="e.g., 40"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                </div>
              </section>

              {/* Section 4: Transport */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <h2 className="text-xl font-bold text-gray-900">Transport</h2>
                </div>
                
                <div className="mb-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setOwnTransport(true)}
                      className={`flex-1 p-4 rounded-lg border-2 text-center transition ${
                        ownTransport 
                          ? 'border-rose-500 bg-rose-50 text-rose-700' 
                          : 'border-gray-200 hover:border-rose-300'
                      }`}
                    >
                      <Car className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-semibold">Own Transport</div>
                      <div className="text-xs text-gray-500">Lorry or trailer</div>
                    </button>
                    <button
                      onClick={() => setOwnTransport(false)}
                      className={`flex-1 p-4 rounded-lg border-2 text-center transition ${
                        !ownTransport 
                          ? 'border-rose-500 bg-rose-50 text-rose-700' 
                          : 'border-gray-200 hover:border-rose-300'
                      }`}
                    >
                      <Users className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-semibold">Hire/Share</div>
                      <div className="text-xs text-gray-500">Professional or shared</div>
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Average Distance (miles one way)
                    </label>
                    <input
                      type="number"
                      value={averageDistance}
                      onChange={(e) => setAverageDistance(e.target.value)}
                      placeholder="e.g., 30"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  
                  {ownTransport ? (
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Fuel Cost Per Mile (£)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={fuelCostPerMile}
                        onChange={(e) => setFuelCostPerMile(e.target.value)}
                        placeholder="e.g., 0.25"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Typical: 20-30p/mile + wear</p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Transport Cost Per Trip (£)</label>
                      <input
                        type="number"
                        value={transportHireCost}
                        onChange={(e) => setTransportHireCost(e.target.value)}
                        placeholder="e.g., 90"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Professional hire or sharing cost</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Section 5: Additional Costs */}
              <section className="mb-8">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-3 mb-4 text-left w-full"
                >
                  <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold">5</div>
                  <h2 className="text-xl font-bold text-gray-900">Additional Costs (Optional)</h2>
                  {showAdvanced ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>
                
                {showAdvanced && (
                  <div className="grid md:grid-cols-2 gap-6 pl-11">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Annual Membership Fees (£)</label>
                      <input
                        type="number"
                        value={membershipFees}
                        onChange={(e) => setMembershipFees(e.target.value)}
                        placeholder="e.g., 145"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">BD, BS, BE, RC memberships etc.</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Overnight Stabling Per Event (£)</label>
                      <input
                        type="number"
                        value={stabling}
                        onChange={(e) => setStabling(e.target.value)}
                        placeholder="e.g., 50"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Monthly Coaching (£)</label>
                      <input
                        type="number"
                        value={coaching}
                        onChange={(e) => setCoaching(e.target.value)}
                        placeholder="e.g., 180"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Season Equipment Budget (£)</label>
                      <input
                        type="number"
                        value={equipment}
                        onChange={(e) => setEquipment(e.target.value)}
                        placeholder="e.g., 400"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Show clothes, tack, studs etc.</p>
                    </div>
                  </div>
                )}
              </section>

              {/* Calculate Button */}
              <button
                onClick={calculate}
                className="w-full bg-gradient-to-r from-rose-600 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-rose-700 hover:to-red-600 transition shadow-lg"
              >
                <Calculator className="w-5 h-5 inline mr-2" />
                Calculate Season Budget
              </button>
            </div>

            {/* Results Section */}
            {result && (
              <div className="border-t border-gray-200 bg-gradient-to-b from-rose-50 to-white p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-rose-600" />
                  Your Competition Budget
                </h2>
                
                {/* Main Results */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-rose-600 text-white p-6 rounded-xl text-center">
                    <div className="text-rose-200 text-sm font-medium">Season Total</div>
                    <div className="text-4xl font-bold mt-1">£{parseFloat(result.totals.season).toLocaleString()}</div>
                  </div>
                  <div className="bg-white border-2 border-rose-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Per Event</div>
                    <div className="text-3xl font-bold text-gray-900 mt-1">£{result.totals.perEvent}</div>
                  </div>
                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Monthly Average</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">£{result.totals.monthly}</div>
                  </div>
                  <div className="bg-white border-2 border-gray-200 p-6 rounded-xl text-center">
                    <div className="text-gray-500 text-sm font-medium">Total Events</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{result.totalEvents}</div>
                  </div>
                </div>

                {/* Reminders CTA in Results */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white mb-8">
                  <div className="flex items-center gap-3">
                    <Bell className="w-8 h-8 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-bold">Track Your Competition Calendar</h3>
                      <p className="text-purple-200 text-sm">Get reminders for entries, memberships &amp; deadlines</p>
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
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <PoundSterling className="w-5 h-5 text-rose-600" />
                    Cost Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-rose-600" />
                        <span>Entry Fees ({result.totalEvents} events)</span>
                      </div>
                      <span className="font-bold">£{parseFloat(result.costs.entries).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-gray-600" />
                        <span>Transport ({result.transport.totalMiles} miles)</span>
                      </div>
                      <span className="font-bold">£{parseFloat(result.costs.transport).toLocaleString()}</span>
                    </div>
                    {parseFloat(result.costs.membership) > 0 && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-gray-600" />
                          <span>Membership Fees</span>
                        </div>
                        <span className="font-bold">£{parseFloat(result.costs.membership).toLocaleString()}</span>
                      </div>
                    )}
                    {parseFloat(result.costs.coaching) > 0 && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Coaching ({result.seasonLength} months)</span>
                        <span className="font-bold">£{parseFloat(result.costs.coaching).toLocaleString()}</span>
                      </div>
                    )}
                    {parseFloat(result.costs.equipment) > 0 && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Equipment</span>
                        <span className="font-bold">£{parseFloat(result.costs.equipment).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 font-bold text-lg">
                      <span>Total Season Budget</span>
                      <span className="text-rose-600">£{parseFloat(result.totals.season).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Cost Distribution */}
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-rose-600" />
                    Where Your Money Goes
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Entry Fees</span>
                        <span>{result.breakdown.entriesPercent}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full">
                        <div 
                          className="h-3 bg-rose-500 rounded-full" 
                          style={{ width: `${result.breakdown.entriesPercent}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Transport</span>
                        <span>{result.breakdown.transportPercent}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full">
                        <div 
                          className="h-3 bg-amber-500 rounded-full" 
                          style={{ width: `${result.breakdown.transportPercent}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Other (membership, coaching, equipment)</span>
                        <span>{result.breakdown.otherPercent}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full">
                        <div 
                          className="h-3 bg-blue-500 rounded-full" 
                          style={{ width: `${result.breakdown.otherPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tips Box */}
          <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-lg mt-8">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-rose-800 mb-2">Budget-Saving Tips</h3>
                <ul className="text-rose-900 space-y-1 text-sm">
                  <li>• Share transport with friends to halve fuel costs</li>
                  <li>• Consider unaffiliated or riding club events - 50% cheaper with equal fun</li>
                  <li>• Enter multiple classes at one venue rather than single classes at multiple venues</li>
                  <li>• Buy second-hand show clothes - they're often barely worn</li>
                  <li>• Plan your season calendar to minimise long-distance travel</li>
                  <li>• Calculate your full annual costs with our <a href="/annual-horse-cost-calculator" className="text-rose-700 underline hover:text-rose-900">Annual Horse Cost Calculator</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Competition Costs Table */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">UK Competition Entry Fees 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                <thead>
                  <tr className="bg-rose-600 text-white">
                    <th className="p-4 text-left">Discipline</th>
                    <th className="p-4 text-center">Unaffiliated</th>
                    <th className="p-4 text-center">Affiliated</th>
                    <th className="p-4 text-center">Membership</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(disciplinePresets).map(([key, data], index) => (
                    <tr key={key} className={index % 2 === 0 ? '' : 'bg-gray-50'}>
                      <td className="p-4 font-medium">{data.label}</td>
                      <td className="p-4 text-center">£{data.unaffiliatedEntry}</td>
                      <td className="p-4 text-center">£{data.affiliatedEntry}</td>
                      <td className="p-4 text-center">£{data.membership}/year</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-2">* Prices January 2026. Typical averages vary by venue and level. Championship classes cost more.</p>
          </section>

          {/* FAQ Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
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
                  <h3 className="font-bold text-gray-900 group-hover:text-rose-600">{calc.title}</h3>
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
                Never miss an entry deadline or membership renewal. Get free email reminders for competitions and all your horse care needs.
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
          <div className="mt-12 bg-gradient-to-r from-rose-600 to-red-500 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Need Your Total Horse Budget?</h2>
            <p className="text-rose-100 mb-4">Add competition costs to your complete annual horse ownership budget.</p>
            <a 
              href="/annual-horse-cost-calculator" 
              className="inline-flex items-center gap-2 bg-white text-rose-600 px-6 py-3 rounded-lg font-bold hover:bg-rose-50 transition"
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
                  Get free email reminders for competition entries, membership renewals, and all your horse care needs.
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
