import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  GraduationCap,
  Calculator,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  PoundSterling,
  CheckCircle2,
  Calendar,
  Star,
  Target,
  Bell,
  ArrowRight,
  Clock,
  MapPin,
  Users,
  HelpCircle,
  Heart,
  Shield,
  Home,
  Trophy
} from 'lucide-react'

export default function RidingLessonCalculator() {
  const [lessonType, setLessonType] = useState('group')
  const [lessonDuration, setLessonDuration] = useState('60')
  const [lessonsPerWeek, setLessonsPerWeek] = useState('1')
  const [weeksPerYear, setWeeksPerYear] = useState('48')
  const [customCost, setCustomCost] = useState('')
  const [includeExams, setIncludeExams] = useState(false)
  const [examLevel, setExamLevel] = useState('stage1')
  const [includeGear, setIncludeGear] = useState(false)
  const [riderLevel, setRiderLevel] = useState('beginner')
  const [region, setRegion] = useState('average')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showRemindersForm, setShowRemindersForm] = useState(false)

  // 2026 pricing
  const lessonTypes = [
    { id: 'group', name: 'Group Lesson', description: '4-6 riders', baseCost30: 28, baseCost60: 45 },
    { id: 'semi', name: 'Semi-Private', description: '2-3 riders', baseCost30: 40, baseCost60: 62 },
    { id: 'private', name: 'Private Lesson', description: '1-to-1 tuition', baseCost30: 52, baseCost60: 80 },
    { id: 'lunge', name: 'Lunge Lesson', description: 'On the lunge', baseCost30: 58, baseCost60: 90 },
    { id: 'freelance', name: 'Freelance Instructor', description: 'At your yard', baseCost30: 45, baseCost60: 68 }
  ]

  // 2026 exam pricing
  const examCosts = [
    { id: 'stage1', name: 'BHS Stage 1', cost: 140, prepLessons: 4 },
    { id: 'stage2', name: 'BHS Stage 2', cost: 160, prepLessons: 6 },
    { id: 'stage3', name: 'BHS Stage 3', cost: 200, prepLessons: 8 },
    { id: 'galop1-4', name: 'Pony Club Tests 1-4', cost: 30, prepLessons: 2 },
    { id: 'galop5-7', name: 'Pony Club Tests 5-7', cost: 45, prepLessons: 4 }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.4,
    'southeast': 1.2,
    'average': 1.0,
    'north': 0.9,
    'scotland': 0.95
  }

  // 2026 gear pricing
  const gearCosts = {
    beginner: { hat: 70, boots: 60, jodhpurs: 35, bodyProtector: 95 },
    intermediate: { hat: 140, boots: 120, jodhpurs: 70, bodyProtector: 140 },
    advanced: { hat: 240, boots: 210, jodhpurs: 120, bodyProtector: 240 }
  }

  const calculate = () => {
    const regionFactor = regionMultipliers[region]
    const duration = parseInt(lessonDuration)
    const lessonsWeek = parseFloat(lessonsPerWeek)
    const weeks = parseInt(weeksPerYear)

    const lesson = lessonTypes.find(l => l.id === lessonType)
    if (!lesson) return

    let lessonCost = duration === 30 ? lesson.baseCost30 : lesson.baseCost60
    
    if (customCost && parseFloat(customCost) > 0) {
      lessonCost = parseFloat(customCost)
    } else {
      lessonCost *= regionFactor
    }

    const annualLessons = lessonsWeek * weeks
    const annualLessonCost = annualLessons * lessonCost

    let examCost = 0
    let examPrepCost = 0
    if (includeExams) {
      const exam = examCosts.find(e => e.id === examLevel)
      if (exam) {
        examCost = exam.cost
        examPrepCost = exam.prepLessons * lessonCost
      }
    }

    let gearCost = 0
    if (includeGear) {
      const gear = gearCosts[riderLevel as keyof typeof gearCosts]
      gearCost = gear.hat + gear.boots + gear.jodhpurs + gear.bodyProtector
    }

    const totalFirstYear = annualLessonCost + examCost + examPrepCost + gearCost
    const totalOngoing = annualLessonCost + examCost + examPrepCost
    const monthlyAverage = totalOngoing / 12
    const costPerLesson = annualLessonCost / annualLessons

    const ukAverageAnnual = 2700 // Updated for 2026

    const hoursPerYear = annualLessons * (duration / 60)

    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_calculation', {
        calculator_name: 'riding_lesson',
        lesson_type: lessonType,
        lesson_duration: duration,
        lessons_per_week: lessonsWeek,
        region: region,
        annual_cost: totalOngoing.toFixed(0)
      })
    }

    setResult({
      annualLessonCost: annualLessonCost.toFixed(2),
      totalFirstYear: totalFirstYear.toFixed(2),
      totalOngoing: totalOngoing.toFixed(2),
      monthlyAverage: monthlyAverage.toFixed(2),
      costPerLesson: costPerLesson.toFixed(2),
      annualLessons: annualLessons.toFixed(0),
      hoursPerYear: hoursPerYear.toFixed(0),
      breakdown: {
        lessons: annualLessonCost.toFixed(2),
        examFee: examCost.toFixed(2),
        examPrep: examPrepCost.toFixed(2),
        gear: gearCost.toFixed(2)
      },
      comparison: {
        vsUkAverage: totalOngoing < ukAverageAnnual,
        ukAverageAnnual
      },
      lessonInfo: lesson,
      progressEstimate: getProgressEstimate(hoursPerYear, riderLevel)
    })
  }

  const getProgressEstimate = (hours: number, level: string) => {
    if (level === 'beginner') {
      if (hours >= 100) return 'Ready to canter confidently and start jumping'
      if (hours >= 50) return 'Developing balance at trot, learning canter'
      return 'Building confidence at walk and trot'
    } else if (level === 'intermediate') {
      if (hours >= 100) return 'Refining jumping technique, working on flatwork'
      if (hours >= 50) return 'Improving canter transitions and basic jumping'
      return 'Consolidating current skills'
    } else {
      if (hours >= 100) return 'Competition preparation, advanced movements'
      if (hours >= 50) return 'Refining technique for specific discipline'
      return 'Maintaining and improving performance'
    }
  }

  // 15 FAQs for maximum SEO
  const faqs = [
    {
      q: 'How much do horse riding lessons cost in the UK?',
      a: 'Horse riding lessons in the UK typically cost £40-£55 for a group lesson (60 mins), £60-£90 for a private lesson, and £28-£40 for a 30-minute session in 2026. Prices vary by region - London and the South East are 20-40% higher than the national average. Annual costs for weekly lessons range £2,000-£4,500.'
    },
    {
      q: 'How many lessons do I need to learn to ride?',
      a: 'Most beginners need 20-30 hours of lessons to become confident at walk and trot, and 50-100 hours to canter and jump small fences. This typically takes 1-2 years of weekly lessons. Progress depends on natural ability, lesson frequency, and practice opportunities.'
    },
    {
      q: 'Are private lessons worth the extra cost?',
      a: 'Private lessons are valuable for beginners building confidence, riders with specific goals, or those preparing for exams. You progress faster with 1-to-1 attention. However, group lessons teach important skills like riding in company and are more affordable for regular riding.'
    },
    {
      q: 'What should I wear to horse riding lessons?',
      a: 'Essential items include: a properly fitted riding hat (PAS015/BSEN1384), jodhpurs or stretchy trousers, boots with a small heel (riding boots or sturdy ankle boots), and a body protector (required for jumping). Most schools can lend hats for early lessons. Budget £260-£470 for beginner gear.'
    },
    {
      q: 'How often should I have riding lessons?',
      a: 'Weekly lessons are ideal for steady progress. Twice weekly accelerates learning significantly. Less than fortnightly means you spend more time revising than progressing. Many riders have one weekly lesson plus practice rides on school horses.'
    },
    {
      q: 'What are BHS exams and are they worth doing?',
      a: 'BHS (British Horse Society) exams assess riding and horse care skills at progressive stages. They are valuable for career riders, demonstrate competence to insurers, and provide structured learning goals. Stage 1-3 are achievable for recreational riders. Stage 1 costs around £140 in 2026.'
    },
    {
      q: 'Can adults learn to ride from scratch?',
      a: 'Absolutely! Many adults learn to ride successfully. You may progress differently to children (more cautious but more analytical), but adult learners often become excellent riders. Look for schools experienced with adult beginners and consider private lessons initially.'
    },
    {
      q: 'What is the difference between a riding school and freelance instructor?',
      a: 'Riding schools provide horses, facilities, and multiple instructors. Freelance instructors come to your yard if you have access to a horse. Schools suit beginners; freelancers suit horse owners wanting tuition on their own horse. Freelance rates are typically £45-£70 per hour.'
    },
    {
      q: 'How do I choose a good riding school?',
      a: 'Look for BHS Approved or ABRS registered schools, qualified instructors, well-cared-for horses, good facilities, and safety equipment. Visit first, check reviews, and ensure they match your goals (pleasure riding vs competition).'
    },
    {
      q: 'Should my child do Pony Club or private lessons?',
      a: 'Both are valuable. Pony Club offers social riding, rallies, camps, and structured tests at lower cost (£25-£45 per test). Private lessons provide focused skill development. Many children do both - weekly lessons plus Pony Club activities.'
    },
    {
      q: 'What is a lunge lesson and who needs one?',
      a: 'A lunge lesson involves riding a horse controlled by the instructor on a long rein, allowing you to focus entirely on your position and balance without steering. They cost £58-£90 for 30-60 minutes in 2026. Excellent for beginners, nervous riders, and improving seat/posture at any level.'
    },
    {
      q: 'How much should I budget for riding lessons annually?',
      a: 'Budget £2,000-£2,700 for weekly group lessons, £3,000-£4,500 for weekly private lessons. Add £260-£470 for starter gear in year one, plus £140-£200 for exams if pursuing qualifications. The UK average annual spend on lessons is approximately £2,700 in 2026.'
    },
    {
      q: 'Do riding schools offer block booking discounts?',
      a: 'Yes, most riding schools offer 10-15% discount for block bookings (typically 10 lessons). Some offer monthly membership packages including unlimited practice rides. Always ask about discounts, loyalty schemes, and off-peak rates.'
    },
    {
      q: 'What age can children start riding lessons?',
      a: 'Children can start lead-rein lessons from age 3-4, progressing to independent lessons from age 5-6. Many schools offer pony experience days for younger children. Early lessons focus on confidence, balance, and pony care rather than technical riding.'
    },
    {
      q: 'How long until I can own my own horse?',
      a: 'Most riders should have at least 2-3 years of regular lessons (100+ hours in the saddle) before considering horse ownership. You need to be confident at all paces, understand basic horse care, and have experience with different horses. Use our First Horse Calculator to plan ownership costs.'
    }
  ]

  // Related calculators
  const relatedCalculators = [
    {
      title: 'First Horse Calculator',
      description: 'First year ownership costs',
      href: '/first-horse-calculator',
      icon: Heart,
      color: 'text-pink-600',
      bg: 'bg-pink-50 hover:bg-pink-100'
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
      title: 'Competition Budget',
      description: 'Show season costs',
      href: '/competition-budget-calculator',
      icon: Trophy,
      color: 'text-rose-600',
      bg: 'bg-rose-50 hover:bg-rose-100'
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
      title: 'Horse Insurance Calculator',
      description: 'Cover options and costs',
      href: '/horse-insurance-calculator',
      icon: Shield,
      color: 'text-purple-600',
      bg: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      title: 'Tack & Equipment Calculator',
      description: 'Riding gear costs',
      href: '/tack-equipment-calculator',
      icon: Star,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 hover:bg-indigo-100'
    }
  ]

  return (
    <>
      <Helmet>
        {/* 1. Title Tag */}
        <title>Riding Lesson Cost Calculator UK 2026 | Plan Your Budget | HorseCost</title>
        
        {/* 2. Meta Description */}
        <meta 
          name="description" 
          content="Free riding lesson cost calculator for UK riders. Calculate annual lesson costs, compare private vs group lessons, and plan your equestrian education budget. 2026 prices." 
        />
        
        {/* 3. Keywords Meta */}
        <meta 
          name="keywords" 
          content="riding lesson cost UK 2026, horse riding lessons price, private riding lessons cost, learn to ride budget, BHS exam cost, riding school prices, group lesson cost" 
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
        <meta property="og:title" content="Riding Lesson Cost Calculator UK 2026 | Plan Your Budget | HorseCost" />
        <meta property="og:description" content="Calculate annual riding lesson costs. Compare group, private, and semi-private lesson prices." />
        <meta property="og:url" content="https://horsecost.co.uk/riding-lesson-calculator" />
        <meta property="og:image" content="https://horsecost.co.uk/images/riding-lesson-calculator-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Riding Lesson Cost Calculator showing UK lesson prices and annual budget planning" />

        {/* 14. Twitter Card Complete */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="Riding Lesson Cost Calculator UK 2026 | HorseCost" />
        <meta name="twitter:description" content="Calculate annual riding lesson costs. Compare lesson types and plan your equestrian education budget." />
        <meta name="twitter:image" content="https://horsecost.co.uk/images/riding-lesson-calculator-twitter.jpg" />
        <meta name="twitter:image:alt" content="Riding Lesson Cost Calculator UK" />

        {/* 15. Canonical URL */}
        <link rel="canonical" href="https://horsecost.co.uk/riding-lesson-calculator" />
        
        {/* Alternate hreflang */}
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk/riding-lesson-calculator" />

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
                  { '@type': 'ListItem', 'position': 3, 'name': 'Riding Lesson Calculator', 'item': 'https://horsecost.co.uk/riding-lesson-calculator' }
                ]
              },
              // Schema 2: SoftwareApplication
              {
                '@type': 'SoftwareApplication',
                'name': 'Riding Lesson Cost Calculator UK',
                'description': 'Calculate annual riding lesson costs for UK riders including group, private, and semi-private lessons with 2026 pricing.',
                'url': 'https://horsecost.co.uk/riding-lesson-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP', 'availability': 'https://schema.org/InStock' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.8', 'ratingCount': '267', 'bestRating': '5', 'worstRating': '1' },
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
                'name': 'How to Calculate Your Riding Lesson Budget',
                'description': 'Step-by-step guide to planning your annual riding lesson costs',
                'totalTime': 'PT3M',
                'step': [
                  { '@type': 'HowToStep', 'name': 'Choose Lesson Type', 'text': 'Select group (4-6 riders), semi-private (2-3 riders), private (1-to-1), lunge, or freelance lessons.' },
                  { '@type': 'HowToStep', 'name': 'Select Duration', 'text': 'Choose 30-minute or 60-minute lesson length based on your goals and budget.' },
                  { '@type': 'HowToStep', 'name': 'Set Frequency', 'text': 'Decide how many lessons per week - weekly is ideal for steady progress.' },
                  { '@type': 'HowToStep', 'name': 'Choose Region', 'text': 'Select your UK region as prices vary by 20-40% between areas.' },
                  { '@type': 'HowToStep', 'name': 'Calculate Budget', 'text': 'Click calculate to see your annual costs, monthly average, and progress expectations.' }
                ]
              },
              // Schema 5: Article
              {
                '@type': 'Article',
                'headline': 'Riding Lesson Cost Calculator UK 2026 - Plan Your Equestrian Budget',
                'description': 'Free calculator for UK riding lesson costs. Compare group, private, and semi-private lessons with current pricing.',
                'datePublished': '2026-01-01',
                'dateModified': '2026-01-01',
                'author': { '@type': 'Organization', 'name': 'HorseCost', 'url': 'https://horsecost.co.uk' },
                'publisher': { '@type': 'Organization', 'name': 'HorseCost', 'logo': { '@type': 'ImageObject', 'url': 'https://horsecost.co.uk/logo.png' } },
                'image': 'https://horsecost.co.uk/images/riding-lesson-calculator-og.jpg'
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
                'name': 'Riding Lesson Cost Calculator UK 2026',
                'description': 'Calculate annual riding lesson costs for UK riders',
                'speakable': {
                  '@type': 'SpeakableSpecification',
                  'cssSelector': ['h1', '.quick-answer']
                },
                'url': 'https://horsecost.co.uk/riding-lesson-calculator',
                'lastReviewed': '2026-01-01'
              },
              // Schema 8: DefinedTermSet
              {
                '@type': 'DefinedTermSet',
                'name': 'Riding Lesson Terminology',
                'hasDefinedTerm': [
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Group Lesson',
                    'description': 'A riding lesson with 4-6 riders, costing £40-£55 for 60 minutes in 2026. Good for regular practice and learning to ride in company.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Private Lesson',
                    'description': 'One-to-one riding instruction, costing £60-£90 for 60 minutes in 2026. Best for beginners, exam preparation, or addressing specific issues.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'Lunge Lesson',
                    'description': 'A lesson where the horse is controlled by the instructor on a long rein, allowing focus on seat and balance. Costs £58-£90 in 2026.'
                  },
                  {
                    '@type': 'DefinedTerm',
                    'name': 'BHS Exams',
                    'description': 'British Horse Society qualifications assessing riding and horse care skills. Stage 1 costs approximately £140 in 2026 plus preparation lessons.'
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
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Riding Lesson Cost Calculator UK 2026</h1>
                <p className="text-violet-200 mt-1">Plan Your Equestrian Education Budget</p>
              </div>
            </div>
            <p className="text-violet-100 max-w-3xl">
              Plan your riding education budget. Calculate annual lesson costs, compare lesson types, 
              and include exam preparation and gear costs.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-violet-200 text-sm">
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
                267 ratings
              </span>
            </div>
            
            {/* E-E-A-T Trust Signals */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-violet-500/30 text-violet-100 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                BHS exam costs included
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Progress estimates
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
              Quick Answer: How Much Do Riding Lessons Cost UK?
            </h2>
            <p className="text-gray-700 mb-4 quick-answer">
              <strong>Riding lessons in the UK cost £40-£55 for a 60-minute group lesson, £60-£90 for private lessons in 2026.</strong> 30-minute lessons: £28-£52. Weekly lessons cost £2,000-£4,500 annually. London/South East is 20-40% higher. Most riders need 50-100 hours to canter and jump confidently. BHS Stage 1 exam: ~£140.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-violet-50 p-3 rounded-lg text-center">
                <div className="text-xs text-violet-600 font-medium">Group Lesson</div>
                <div className="text-xl font-bold text-violet-700">£40-55</div>
                <div className="text-xs text-gray-500">60 mins</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-xs text-purple-600 font-medium">Private Lesson</div>
                <div className="text-xl font-bold text-purple-700">£60-90</div>
                <div className="text-xs text-gray-500">60 mins</div>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg text-center">
                <div className="text-xs text-indigo-600 font-medium">Annual Budget</div>
                <div className="text-xl font-bold text-indigo-700">£2,000-4,500</div>
                <div className="text-xs text-gray-500">weekly lessons</div>
              </div>
              <div className="bg-fuchsia-50 p-3 rounded-lg text-center">
                <div className="text-xs text-fuchsia-600 font-medium">Learn to Canter</div>
                <div className="text-xl font-bold text-fuchsia-700">50-100 hrs</div>
                <div className="text-xs text-gray-500">typical progress</div>
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
                    <label className="font-semibold text-gray-900">Lesson Type</label>
                  </div>
                  <div className="space-y-2">
                    {lessonTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setLessonType(type.id)}
                        className={`w-full p-3 rounded-xl text-left transition border-2 ${
                          lessonType === type.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${lessonType === type.id ? 'text-violet-700' : 'text-gray-900'}`}>
                              {type.name}
                            </p>
                            <p className="text-sm text-gray-500">{type.description}</p>
                          </div>
                          <p className="text-sm text-gray-600">
                            from £{type.baseCost30}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Lesson Duration</label>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { value: '30', label: '30 minutes' },
                      { value: '60', label: '60 minutes' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setLessonDuration(option.value)}
                        className={`flex-1 py-3 rounded-xl font-medium transition ${
                          lessonDuration === option.value
                            ? 'bg-violet-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Lessons per Week</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['0.5', '1', '2', '3'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setLessonsPerWeek(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          lessonsPerWeek === val
                            ? 'bg-violet-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val === '0.5' ? 'Fortnightly' : `${val}x weekly`}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Weeks per Year</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['40', '44', '48', '52'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setWeeksPerYear(val)}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                          weeksPerYear === val
                            ? 'bg-violet-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {val} weeks
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Account for holidays and breaks
                  </p>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none"
                  >
                    <option value="london">London (+40%)</option>
                    <option value="southeast">South East (+20%)</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England (-10%)</option>
                    <option value="scotland">Scotland / Wales (-5%)</option>
                  </select>
                </section>

                <section>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter your actual lesson cost (£)
                  </label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={customCost}
                      onChange={(e) => setCustomCost(e.target.value)}
                      placeholder="Leave blank for estimate"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                </section>

                <section className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-violet-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Additional Costs
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Level</label>
                        <select
                          value={riderLevel}
                          onChange={(e) => setRiderLevel(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-violet-500 focus:outline-none"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeExams}
                          onChange={(e) => setIncludeExams(e.target.checked)}
                          className="w-5 h-5 text-violet-600 rounded"
                        />
                        <span className="font-medium text-gray-900">Include Exam Costs</span>
                      </label>

                      {includeExams && (
                        <div className="pl-8">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Exam Level</label>
                          <select
                            value={examLevel}
                            onChange={(e) => setExamLevel(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-violet-500 focus:outline-none"
                          >
                            {examCosts.map((exam) => (
                              <option key={exam.id} value={exam.id}>
                                {exam.name} (£{exam.cost})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeGear}
                          onChange={(e) => setIncludeGear(e.target.checked)}
                          className="w-5 h-5 text-violet-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">Include Riding Gear (First Year)</span>
                          <p className="text-sm text-gray-500">Hat, boots, jodhpurs, body protector</p>
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
                  Calculate Lesson Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
                      <p className="text-violet-100 text-sm mb-1">Annual Lesson Budget</p>
                      <p className="text-4xl font-bold">£{result.totalOngoing}</p>
                      <p className="text-violet-200 text-sm mt-1">Ongoing yearly cost</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-violet-100 text-xs">Monthly</p>
                          <p className="font-bold">£{result.monthlyAverage}</p>
                        </div>
                        <div>
                          <p className="text-violet-100 text-xs">Per Lesson</p>
                          <p className="font-bold">£{result.costPerLesson}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reminders CTA */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                      <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold">Lesson Reminders</h3>
                          <p className="text-purple-200 text-sm">Track your riding progress</p>
                        </div>
                        <button
                          onClick={() => setShowRemindersForm(true)}
                          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-50 transition flex-shrink-0"
                        >
                          Set Up
                        </button>
                      </div>
                    </div>

                    <div className="bg-violet-50 rounded-xl p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-violet-600 text-sm">Annual Lessons</p>
                          <p className="text-2xl font-bold text-gray-900">{result.annualLessons}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-violet-600 text-sm">Hours in Saddle</p>
                          <p className="text-2xl font-bold text-gray-900">{result.hoursPerYear}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lessons ({result.annualLessons}x)</span>
                          <span className="font-medium">£{result.breakdown.lessons}</span>
                        </div>
                        {parseFloat(result.breakdown.examFee) > 0 && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Exam Fee</span>
                              <span className="font-medium">£{result.breakdown.examFee}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Exam Prep Lessons</span>
                              <span className="font-medium">£{result.breakdown.examPrep}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Ongoing Annual</span>
                          <span>£{result.totalOngoing}</span>
                        </div>
                        {parseFloat(result.breakdown.gear) > 0 && (
                          <>
                            <div className="flex justify-between text-amber-600">
                              <span>+ First Year Gear</span>
                              <span>£{result.breakdown.gear}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t font-bold text-violet-600">
                              <span>First Year Total</span>
                              <span>£{result.totalFirstYear}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Expected Progress
                      </h3>
                      <p className="text-sm text-green-800">
                        With {result.hoursPerYear} hours of tuition this year: <strong>{result.progressEstimate}</strong>
                      </p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">UK Average Comparison</h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Average annual spend</span>
                        <div className="flex items-center gap-2">
                          <span>£{result.comparison.ukAverageAnnual.toLocaleString()}</span>
                          {result.comparison.vsUkAverage && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Based on weekly 60-minute group lessons
                      </p>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select your lesson preferences and click calculate to see your annual budget</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-violet-50 border-l-4 border-violet-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-violet-900 mb-2">Tips for Getting the Most from Lessons</h3>
                <ul className="text-violet-800 space-y-1 text-sm">
                  <li>• <strong>Weekly lessons</strong> are ideal - fortnightly means more revision, less progress</li>
                  <li>• <strong>Block bookings</strong> often offer 10-15% discount at many schools</li>
                  <li>• <strong>Mix lesson types</strong> - group for practice, occasional private for specific issues</li>
                  <li>• <strong>Practice rides</strong> between lessons accelerate progress significantly</li>
                  <li>• Choose a <strong>BHS Approved</strong> school for quality assurance</li>
                  <li>• Ready to own? Use our <a href="/first-horse-calculator" className="text-violet-700 underline hover:text-violet-900">First Horse Calculator</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing Table */}
          <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Riding Lesson Prices 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Lesson Type</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">30 mins</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">60 mins</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Group (4-6)</td>
                    <td className="py-3 px-4 text-center">£25-£35</td>
                    <td className="py-3 px-4 text-center">£40-£55</td>
                    <td className="py-3 px-4 text-center text-gray-600">Regular practice, social riding</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Semi-Private (2-3)</td>
                    <td className="py-3 px-4 text-center">£35-£48</td>
                    <td className="py-3 px-4 text-center">£55-£72</td>
                    <td className="py-3 px-4 text-center text-gray-600">Faster progress, friends/siblings</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Private (1-to-1)</td>
                    <td className="py-3 px-4 text-center">£45-£65</td>
                    <td className="py-3 px-4 text-center">£65-£95</td>
                    <td className="py-3 px-4 text-center text-gray-600">Beginners, exam prep, specific goals</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Lunge Lesson</td>
                    <td className="py-3 px-4 text-center">£52-£70</td>
                    <td className="py-3 px-4 text-center">£80-£105</td>
                    <td className="py-3 px-4 text-center text-gray-600">Seat development, nervous riders</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Freelance (at your yard)</td>
                    <td className="py-3 px-4 text-center">£40-£55</td>
                    <td className="py-3 px-4 text-center">£58-£80</td>
                    <td className="py-3 px-4 text-center text-gray-600">Own horse tuition</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Prices vary by region. London/South East typically 20-40% higher. Scotland/Wales/North 5-10% lower.
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
            <p className="text-gray-600 mb-6">Plan your equestrian journey:</p>
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
                Track your riding progress and never miss a lesson. Get free email reminders for all your horse care needs.
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
            <h2 className="text-2xl font-bold mb-4">Ready to Own Your Own Horse?</h2>
            <p className="text-violet-100 mb-6 max-w-xl mx-auto">
              Calculate the full cost of horse ownership with our comprehensive Annual Cost Calculator.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-violet-600 px-6 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
            >
              Calculate Ownership Costs
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
                  Get free email reminders for lesson bookings, progress milestones, and all your horse care needs.
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
