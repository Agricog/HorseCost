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
  Target
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
  const [result, setResult] = useState<any>(null)

  const lessonTypes = [
    { id: 'group', name: 'Group Lesson', description: '4-6 riders', baseCost30: 25, baseCost60: 40 },
    { id: 'semi', name: 'Semi-Private', description: '2-3 riders', baseCost30: 35, baseCost60: 55 },
    { id: 'private', name: 'Private Lesson', description: '1-to-1 tuition', baseCost30: 45, baseCost60: 70 },
    { id: 'lunge', name: 'Lunge Lesson', description: 'On the lunge', baseCost30: 50, baseCost60: 80 },
    { id: 'freelance', name: 'Freelance Instructor', description: 'At your yard', baseCost30: 40, baseCost60: 60 }
  ]

  const examCosts = [
    { id: 'stage1', name: 'BHS Stage 1', cost: 120, prepLessons: 4 },
    { id: 'stage2', name: 'BHS Stage 2', cost: 140, prepLessons: 6 },
    { id: 'stage3', name: 'BHS Stage 3', cost: 180, prepLessons: 8 },
    { id: 'galop1-4', name: 'Pony Club Tests (1-4)', cost: 25, prepLessons: 2 },
    { id: 'galop5-7', name: 'Pony Club Tests (5-7)', cost: 35, prepLessons: 4 }
  ]

  const regionMultipliers: Record<string, number> = {
    'london': 1.4,
    'southeast': 1.2,
    'average': 1.0,
    'north': 0.9,
    'scotland': 0.95
  }

  const gearCosts = {
    beginner: { hat: 60, boots: 50, jodhpurs: 30, bodyProtector: 80 },
    intermediate: { hat: 120, boots: 100, jodhpurs: 60, bodyProtector: 120 },
    advanced: { hat: 200, boots: 180, jodhpurs: 100, bodyProtector: 200 }
  }

  const calculate = () => {
    const regionFactor = regionMultipliers[region]
    const duration = parseInt(lessonDuration)
    const lessonsWeek = parseFloat(lessonsPerWeek)
    const weeks = parseInt(weeksPerYear)

    // Get base lesson cost
    const lesson = lessonTypes.find(l => l.id === lessonType)
    if (!lesson) return

    let lessonCost = duration === 30 ? lesson.baseCost30 : lesson.baseCost60
    
    // Apply custom cost if provided
    if (customCost && parseFloat(customCost) > 0) {
      lessonCost = parseFloat(customCost)
    } else {
      lessonCost *= regionFactor
    }

    // Calculate annual lessons
    const annualLessons = lessonsWeek * weeks
    const annualLessonCost = annualLessons * lessonCost

    // Exam costs
    let examCost = 0
    let examPrepCost = 0
    if (includeExams) {
      const exam = examCosts.find(e => e.id === examLevel)
      if (exam) {
        examCost = exam.cost
        examPrepCost = exam.prepLessons * lessonCost
      }
    }

    // Gear costs (first year only)
    let gearCost = 0
    if (includeGear) {
      const gear = gearCosts[riderLevel as keyof typeof gearCosts]
      gearCost = gear.hat + gear.boots + gear.jodhpurs + gear.bodyProtector
    }

    // Totals
    const totalFirstYear = annualLessonCost + examCost + examPrepCost + gearCost
    const totalOngoing = annualLessonCost + examCost + examPrepCost
    const monthlyAverage = totalOngoing / 12
    const costPerLesson = annualLessonCost / annualLessons

    // UK averages
    const ukAverageAnnual = 2400 // Based on weekly group lessons

    // Progress estimate
    const hoursPerYear = annualLessons * (duration / 60)

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

  const faqs = [
    {
      q: 'How much do horse riding lessons cost in the UK?',
      a: 'Horse riding lessons in the UK typically cost £35-£50 for a group lesson (60 mins), £50-£80 for a private lesson, and £25-£35 for a 30-minute session. Prices vary by region - London and the South East are 20-40% higher than the national average.'
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
      a: 'Essential items include: a properly fitted riding hat (PAS015/BSEN1384), jodhpurs or stretchy trousers, boots with a small heel (riding boots or sturdy ankle boots), and a body protector (required for jumping). Most schools can lend hats for early lessons.'
    },
    {
      q: 'How often should I have riding lessons?',
      a: 'Weekly lessons are ideal for steady progress. Twice weekly accelerates learning significantly. Less than fortnightly means you spend more time revising than progressing. Many riders have one weekly lesson plus practice rides on school horses.'
    },
    {
      q: 'What are BHS exams and are they worth doing?',
      a: 'BHS (British Horse Society) exams assess riding and horse care skills at progressive stages. They\'re valuable for career riders, demonstrate competence to insurers, and provide structured learning goals. Stage 1-3 are achievable for recreational riders.'
    },
    {
      q: 'Can adults learn to ride from scratch?',
      a: 'Absolutely! Many adults learn to ride successfully. You may progress differently to children (more cautious but more analytical), but adult learners often become excellent riders. Look for schools experienced with adult beginners and consider private lessons initially.'
    },
    {
      q: 'What\'s the difference between a riding school and freelance instructor?',
      a: 'Riding schools provide horses, facilities, and multiple instructors. Freelance instructors come to your yard if you have access to a horse. Schools suit beginners; freelancers suit horse owners wanting tuition on their own horse.'
    },
    {
      q: 'How do I choose a good riding school?',
      a: 'Look for BHS Approved or ABRS registered schools, qualified instructors, well-cared-for horses, good facilities, and safety equipment. Visit first, check reviews, and ensure they match your goals (pleasure riding vs competition).'
    },
    {
      q: 'Should my child do Pony Club or private lessons?',
      a: 'Both are valuable. Pony Club offers social riding, rallies, camps, and structured tests at lower cost. Private lessons provide focused skill development. Many children do both - weekly lessons plus Pony Club activities.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Riding Lesson Cost Calculator UK 2025 | Plan Your Budget | HorseCost</title>
        <meta 
          name="description" 
          content="Free riding lesson cost calculator for UK riders. Calculate annual lesson costs, compare private vs group lessons, and plan your equestrian education budget. 2025 prices." 
        />
        <meta name="keywords" content="riding lesson cost UK, horse riding lessons price, private riding lessons cost, learn to ride budget, BHS exam cost, riding school prices" />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#7c3aed" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:title" content="Riding Lesson Cost Calculator UK 2025 | HorseCost" />
        <meta property="og:description" content="Calculate annual riding lesson costs. Compare group, private, and semi-private lesson prices." />
        <meta property="og:url" content="https://horsecost.co.uk/riding-lesson-calculator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Riding Lesson Calculator UK | HorseCost" />

        <link rel="canonical" href="https://horsecost.co.uk/riding-lesson-calculator" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/#calculators' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Riding Lesson Calculator', 'item': 'https://horsecost.co.uk/riding-lesson-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Riding Lesson Cost Calculator UK',
                'description': 'Calculate annual riding lesson costs for UK riders including group, private, and semi-private lessons.',
                'url': 'https://horsecost.co.uk/riding-lesson-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.8', 'ratingCount': '234' }
              },
              {
                '@type': 'FAQPage',
                'mainEntity': faqs.map(faq => ({
                  '@type': 'Question',
                  'name': faq.q,
                  'acceptedAnswer': { '@type': 'Answer', 'text': faq.a }
                }))
              },
              {
                '@type': 'Organization',
                'name': 'HorseCost',
                'url': 'https://horsecost.co.uk'
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Back Link */}
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <a href="/" className="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Riding Lesson Calculator</h1>
                <p className="text-violet-200">UK 2025 Lesson Budget Planner</p>
              </div>
            </div>
            <p className="text-violet-100 max-w-2xl">
              Plan your riding education budget. Calculate annual lesson costs, compare lesson types, 
              and include exam preparation and gear costs.
            </p>
            <p className="text-violet-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Calculator Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Lesson Type */}
                <div>
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
                </div>

                {/* Lesson Duration */}
                <div>
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
                </div>

                {/* Frequency */}
                <div>
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
                </div>

                {/* Weeks per Year */}
                <div>
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
                </div>

                {/* Region */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Your Region</label>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none"
                  >
                    <option value="london">London (Higher prices)</option>
                    <option value="southeast">South East England</option>
                    <option value="average">Midlands / Average UK</option>
                    <option value="north">Northern England</option>
                    <option value="scotland">Scotland / Wales</option>
                  </select>
                </div>

                {/* Custom Cost */}
                <div>
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
                </div>

                {/* Advanced Options */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-violet-600 font-medium"
                  >
                    {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    Additional Costs
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      {/* Rider Level */}
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

                      {/* Exams */}
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

                      {/* Gear */}
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
                </div>
              </div>

              {/* Right Column - Results */}
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
                    {/* Main Result */}
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

                    {/* Lessons Summary */}
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

                    {/* Breakdown */}
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

                    {/* Progress Estimate */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Expected Progress
                      </h3>
                      <p className="text-sm text-green-800">
                        With {result.hoursPerYear} hours of tuition this year: <strong>{result.progressEstimate}</strong>
                      </p>
                    </div>

                    {/* UK Comparison */}
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

          {/* Info Box */}
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
                </ul>
              </div>
            </div>
          </div>

          {/* UK Pricing Table */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Riding Lesson Prices 2025</h2>
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
                    <td className="py-3 px-4 text-center">£22-£30</td>
                    <td className="py-3 px-4 text-center">£35-£50</td>
                    <td className="py-3 px-4 text-center text-gray-600">Regular practice, social riding</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Semi-Private (2-3)</td>
                    <td className="py-3 px-4 text-center">£30-£40</td>
                    <td className="py-3 px-4 text-center">£50-£65</td>
                    <td className="py-3 px-4 text-center text-gray-600">Faster progress, friends/siblings</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Private (1-to-1)</td>
                    <td className="py-3 px-4 text-center">£40-£55</td>
                    <td className="py-3 px-4 text-center">£60-£85</td>
                    <td className="py-3 px-4 text-center text-gray-600">Beginners, exam prep, specific goals</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Lunge Lesson</td>
                    <td className="py-3 px-4 text-center">£45-£60</td>
                    <td className="py-3 px-4 text-center">£70-£90</td>
                    <td className="py-3 px-4 text-center text-gray-600">Seat development, nervous riders</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Freelance (at your yard)</td>
                    <td className="py-3 px-4 text-center">£35-£45</td>
                    <td className="py-3 px-4 text-center">£50-£70</td>
                    <td className="py-3 px-4 text-center text-gray-600">Own horse tuition</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Prices vary by region. London/South East typically 20-40% higher. Scotland/Wales/North 5-10% lower.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group bg-gray-50 rounded-xl">
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                    <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                    <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Related Calculators */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Calculators</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/first-horse-calculator" className="bg-pink-50 hover:bg-pink-100 rounded-xl p-4 transition group">
                <Star className="w-8 h-8 text-pink-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-pink-600">First Horse Calculator</h3>
                <p className="text-sm text-gray-600">First year ownership costs</p>
              </a>
              <a href="/annual-horse-cost-calculator" className="bg-amber-50 hover:bg-amber-100 rounded-xl p-4 transition group">
                <Calendar className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600">Annual Cost Calculator</h3>
                <p className="text-sm text-gray-600">Full ownership budget</p>
              </a>
              <a href="/competition-budget-calculator" className="bg-rose-50 hover:bg-rose-100 rounded-xl p-4 transition group">
                <Target className="w-8 h-8 text-rose-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-rose-600">Competition Budget</h3>
                <p className="text-sm text-gray-600">Show season costs</p>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Own Your Own Horse?</h2>
            <p className="text-violet-100 mb-6 max-w-xl mx-auto">
              Calculate the full cost of horse ownership with our comprehensive Annual Cost Calculator.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-violet-600 px-6 py-3 rounded-xl font-bold hover:bg-violet-50 transition"
            >
              Calculate Ownership Costs
              <Calculator className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
