import { Helmet } from 'react-helmet-async'
import { 
  Calculator, 
  Calendar,
  Wheat,
  Scissors,
  Trophy,
  Scale,
  ArrowRight,
  CheckCircle2,
  Star,
  Shield,
  Zap,
  Users,
  Home,
  Gamepad2,
  Sparkles,
  Stethoscope,
  Truck,
  GraduationCap,
  Heart,
  ShoppingBag,
  Layers,
  Bug,
  TreePine,
  Smile,
  Shirt
} from 'lucide-react'

export default function HomePage() {
  const calculators = [
    {
      title: 'Dental Calculator',
      description: 'EDT vs vet dentist costs',
      href: '/dental-cost-calculator',
      icon: Smile,
      color: 'from-teal-500 to-cyan-600',
      tag: 'Healthcare',
      available: true
    },
    {
      title: 'Rug Calculator',
      description: 'How many rugs does your horse need?',
      href: '/rug-cost-calculator',
      icon: Shirt,
      color: 'from-violet-500 to-purple-600',
      tag: 'Equipment',
      available: true
    },
    {
      title: 'Retirement Calculator',
      description: 'Veteran & retired horse costs',
      href: '/retirement-cost-calculator',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      tag: 'Senior Care',
      available: true
    },
    {
      title: 'Annual Horse Cost Calculator',
      description: 'The complete UK horse ownership budget calculator. Calculate livery, feed, farrier, vet bills, insurance, tack & equipment costs.',
      icon: Calendar,
      href: '/annual-horse-cost-calculator',
      tag: 'Most Popular',
      color: 'from-amber-500 to-orange-600',
      available: true
    },
    {
      title: 'Horse Feed Calculator',
      description: 'Calculate daily hay requirements and monthly feed costs based on your horse\'s weight and workload.',
      icon: Wheat,
      href: '/horse-feed-calculator',
      tag: 'Nutrition',
      color: 'from-green-500 to-emerald-600',
      available: true
    },
    {
      title: 'Farrier Cost Calculator',
      description: 'Plan your annual farrier budget. Compare barefoot vs shod costs with UK 2025 pricing.',
      icon: Scissors,
      href: '/farrier-cost-calculator',
      tag: 'Hoof Care',
      color: 'from-stone-500 to-stone-600',
      available: true
    },
    {
      title: 'Horse Weight Calculator',
      description: 'Estimate your horse\'s weight from measurements for accurate feeding and wormer dosing.',
      icon: Scale,
      href: '/horse-weight-calculator',
      tag: 'Health',
      color: 'from-sky-500 to-blue-600',
      available: true
    },
    {
      title: 'Competition Budget',
      description: 'Calculate entry fees, transport, membership and show expenses for your season.',
      icon: Trophy,
      href: '/competition-budget-calculator',
      tag: 'Competing',
      color: 'from-rose-500 to-red-600',
      available: true
    },
    {
      title: 'Horse Livery Calculator',
      description: 'Calculate sustainable DIY, Part, and Full livery pricing for yard owners.',
      icon: Home,
      href: '/calculators/horse-livery',
      tag: 'For Yards',
      color: 'from-emerald-500 to-green-600',
      available: true
    },
    {
      title: 'Horse Insurance Calculator',
      description: 'Estimate insurance premiums for mortality, vet fees, and comprehensive cover with UK 2025 pricing.',
      icon: Shield,
      href: '/horse-insurance-calculator',
      tag: 'Protection',
      color: 'from-violet-500 to-purple-600',
      available: true
    },
    {
      title: 'Vet Cost Estimator',
      description: 'Plan your annual veterinary budget including vaccinations, dental, worming, and emergency fund.',
      icon: Stethoscope,
      href: '/vet-cost-estimator',
      tag: 'Healthcare',
      color: 'from-red-500 to-rose-600',
      available: true
    },
    {
      title: 'Trailer Running Costs',
      description: 'Calculate annual trailer or horsebox running costs including fuel, insurance, MOT, and servicing.',
      icon: Truck,
      href: '/trailer-cost-calculator',
      tag: 'Transport',
      color: 'from-sky-500 to-blue-600',
      available: true
    },
    {
      title: 'Riding Lesson Calculator',
      description: 'Plan your riding education budget. Compare group, private, and semi-private lesson costs.',
      icon: GraduationCap,
      href: '/riding-lesson-calculator',
      tag: 'Learning',
      color: 'from-violet-500 to-purple-600',
      available: true
    },
    {
      title: 'First Horse Calculator',
      description: 'Calculate your complete first year costs including purchase, tack, livery, and all running expenses.',
      icon: Heart,
      href: '/first-horse-calculator',
      tag: 'New Owners',
      color: 'from-pink-500 to-rose-600',
      available: true
    },
    {
      title: 'Tack & Equipment',
      description: 'Calculate saddle, bridle, rugs, and boots costs',
      href: '/tack-equipment-calculator',
      icon: ShoppingBag,
      color: 'from-cyan-500 to-teal-600',
      tag: 'Gear',
      available: true
    },
    {
      title: 'Horse Loan Calculator',
      description: 'Compare loaning vs buying costs',
      href: '/horse-loan-calculator',
      icon: Users,
      color: 'from-emerald-500 to-green-600',
      tag: 'Options',
      available: true
    },
    {
      title: 'Bedding Calculator',
      description: 'Compare shavings, straw, hemp & more',
      href: '/bedding-cost-calculator',
      icon: Layers,
      color: 'from-yellow-500 to-amber-600',
      tag: 'Stabling',
      available: true
    },
    {
      title: 'Clipping Calculator',
      description: 'DIY vs professional clipping costs',
      href: '/clipping-cost-calculator',
      icon: Sparkles,
      color: 'from-indigo-500 to-violet-600',
      tag: 'Grooming',
      available: true
    },
    {
      title: 'Worming Calculator',
      description: 'Compare worming programs & FEC testing',
      href: '/worming-cost-calculator',
      icon: Bug,
      color: 'from-emerald-500 to-teal-600',
      tag: 'Healthcare',
      available: true
    },
    {
      title: 'Transport Calculator',
      description: 'Moving and travel costs',
      href: '/horse-transport-calculator',
      icon: Truck,
      color: 'from-sky-500 to-blue-600',
      tag: 'Travel',
      available: true
    },
    {
      title: 'Field Rent Calculator',
      description: 'Grazing land & paddock costs',
      href: '/field-rent-calculator',
      icon: TreePine,
      color: 'from-green-600 to-emerald-600',
      tag: 'Land',
      available: true
    }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get accurate calculations in seconds with our optimised tools.'
    },
    {
      icon: Shield,
      title: 'UK Pricing',
      description: 'All costs based on current 2025 UK market rates and averages.'
    },
    {
      icon: Users,
      title: 'Horse Owner Built',
      description: 'Designed by experienced UK equestrians who understand real costs.'
    }
  ]

  const testimonials = [
    {
      quote: 'Finally, a calculator that understands UK livery costs! Helped me budget properly for my first horse.',
      author: 'Sarah M.',
      location: 'Yorkshire',
      rating: 5
    },
    {
      quote: 'The annual cost breakdown was eye-opening. Now I know exactly what to budget each month.',
      author: 'James T.',
      location: 'Surrey',
      rating: 5
    },
    {
      quote: 'Simple, accurate, and actually useful. My kids love the Horse Care Challenge game too!',
      author: 'Emma R.',
      location: 'Cheshire',
      rating: 5
    }
  ]

  const faqs = [
    {
      q: 'What is included in the horse cost calculator?',
      a: 'Our calculator includes livery costs, feed and bedding, farrier services, veterinary care, insurance, worming, dental care, tack and equipment, and optional extras like lessons and competition costs.'
    },
    {
      q: 'Are the UK prices accurate for 2025?',
      a: 'Yes, all pricing is based on current 2025 UK market rates and averages collected from yards, farriers, and vets across the UK.'
    },
    {
      q: 'Can I save my calculations?',
      a: 'Our calculators work in your browser and provide instant results. You can take screenshots or note your figures for future reference.'
    },
    {
      q: 'What livery types are covered?',
      a: 'We cover Full Livery, Part Livery, DIY Livery, Grass Livery, and Home Kept. Each has different typical costs which you can customise.'
    },
    {
      q: 'Is the Horse Care Challenge game free?',
      a: 'Yes! The Horse Care Challenge is completely free to play. It\'s designed for horse lovers of all ages to test their knowledge.'
    },
    {
      q: 'How often is the calculator updated?',
      a: 'We update pricing information regularly to reflect changes in the UK equestrian market. Last major update was January 2025.'
    }
  ]

  return (
    <>
      <Helmet>
  {/* 1. Title Tag */}
  <title>HorseCost | Free Horse Cost Calculators UK 2025 | Annual Costs, Livery & More</title>
  
  {/* 2. Meta Description */}
  <meta 
    name="description" 
    content="Free professional horse cost calculators for UK owners. Calculate annual ownership costs, livery, feed, farrier & vet expenses. 21 calculators with accurate 2025 UK pricing." 
  />
  
  {/* 3. Keywords */}
  <meta name="keywords" content="horse cost calculator UK, annual horse costs, livery calculator, horse ownership costs, equestrian budget, farrier costs UK, horse feed calculator, vet costs horses UK" />
  
  {/* 4. Author */}
  <meta name="author" content="HorseCost" />
  
  {/* 5. Robots */}
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  
  {/* 6. Googlebot */}
  <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  
  {/* 7. Viewport */}
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
  
  {/* 8. Theme Color */}
  <meta name="theme-color" content="#b45309" />
  
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
  <meta property="og:title" content="HorseCost | Free Horse Cost Calculators UK 2025" />
  <meta property="og:description" content="Free professional horse cost calculators for UK owners. Calculate annual costs, livery, feed & more. 21 calculators with 2025 pricing." />
  <meta property="og:url" content="https://horsecost.co.uk" />
  <meta property="og:image" content="https://horsecost.co.uk/images/horsecost-og.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="HorseCost - Free UK Horse Cost Calculators" />

  {/* 14. Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@HorseCost" />
  <meta name="twitter:title" content="HorseCost | Free Horse Cost Calculators UK 2025" />
  <meta name="twitter:description" content="Calculate your horse ownership costs with 21 free UK calculators. Accurate 2025 pricing." />
  <meta name="twitter:image" content="https://horsecost.co.uk/images/horsecost-og.jpg" />
  <meta name="twitter:image:alt" content="HorseCost UK Horse Calculators" />

  {/* 15. Canonical */}
  <link rel="canonical" href="https://horsecost.co.uk" />
  
  {/* Hreflang */}
  <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk" />

  {/* Preconnect */}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="dns-prefetch" href="https://www.google-analytics.com" />

  {/* JSON-LD Schemas */}
  <script type="application/ld+json">
    {JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        // Schema 1: WebSite (without fake SearchAction)
        {
          '@type': 'WebSite',
          'name': 'HorseCost',
          'url': 'https://horsecost.co.uk',
          'description': 'Free professional horse cost calculators for UK equestrians. 21 calculators with accurate 2025 UK pricing.'
        },
        // Schema 2: Organization
        {
          '@type': 'Organization',
          'name': 'HorseCost',
          'url': 'https://horsecost.co.uk',
          'logo': 'https://horsecost.co.uk/logo.png',
          'description': 'Free professional horse cost calculators for UK equestrians',
          'foundingDate': '2024',
          'areaServed': 'GB',
          'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'Customer Support',
            'email': 'hello@horsecost.co.uk'
          },
          'sameAs': [
            'https://twitter.com/HorseCost',
            'https://www.facebook.com/HorseCost'
          ]
        },
        // Schema 3: BreadcrumbList
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://horsecost.co.uk'
            }
          ]
        },
        // Schema 4: FAQPage
        {
          '@type': 'FAQPage',
          'mainEntity': faqs.map(faq => ({
            '@type': 'Question',
            'name': faq.q,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.a
            }
          }))
        },
        // Schema 5: ItemList (Calculator Collection)
        {
          '@type': 'ItemList',
          'name': 'Horse Cost Calculators',
          'description': 'Free UK horse cost calculators',
          'numberOfItems': 21,
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Annual Horse Cost Calculator', 'url': 'https://horsecost.co.uk/annual-horse-cost-calculator' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Horse Feed Calculator', 'url': 'https://horsecost.co.uk/horse-feed-calculator' },
            { '@type': 'ListItem', 'position': 3, 'name': 'Farrier Cost Calculator', 'url': 'https://horsecost.co.uk/farrier-cost-calculator' },
            { '@type': 'ListItem', 'position': 4, 'name': 'Horse Livery Calculator', 'url': 'https://horsecost.co.uk/horse-livery-calculator' },
            { '@type': 'ListItem', 'position': 5, 'name': 'Vet Cost Estimator', 'url': 'https://horsecost.co.uk/vet-cost-estimator' }
          ]
        },
        // Schema 6: WebPage with Speakable
        {
          '@type': 'WebPage',
          'name': 'HorseCost - Free UK Horse Cost Calculators',
          'description': 'Calculate horse ownership costs with 21 free UK calculators',
          'speakable': {
            '@type': 'SpeakableSpecification',
            'cssSelector': ['h1', '.quick-answer']
          },
          'url': 'https://horsecost.co.uk'
        }
      ]
    })}
  </script>
</Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">HorseCost</span>
              </a>
              <div className="hidden md:flex items-center gap-6">
                <a href="#calculators" className="text-gray-600 hover:text-amber-600 transition font-medium">Calculators</a>
                <a href="/horse-care-challenge" className="text-gray-600 hover:text-purple-600 transition font-medium">Quiz Game</a>
                <a href="#reviews" className="text-gray-600 hover:text-amber-600 transition font-medium">Reviews</a>
              </div>
              <a 
                href="/annual-horse-cost-calculator" 
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-amber-600 hover:to-orange-600 transition shadow-md"
              >
                Calculate Costs
              </a>
            </div>
          </nav>
        </header>

        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pt-12 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold mb-6">
                  <CheckCircle2 className="w-4 h-4" />
                  100% Free UK Horse Calculators
                </span>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Know Your
                  <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent"> Horse Costs</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                  Professional calculators for UK horse owners. Work out annual costs, livery fees, 
                  feed budgets and more. Plus a fun quiz game for young equestrians!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a 
                    href="/annual-horse-cost-calculator" 
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-5 h-5" />
                    Calculate Annual Costs
                  </a>
                  <a 
                    href="/horse-care-challenge" 
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-indigo-600 transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    Play Quiz Game
                  </a>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-amber-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold">2,500+ Users</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calculator className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold">21 Calculators</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-semibold">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </section>

          {/* Horse Calculators Grid */}
          <section id="calculators" className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Horse Cost Calculators</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Professional calculators for every aspect of UK horse ownership. Free, fast, and accurate.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {calculators.map((calc) => (
                  <a 
                    key={calc.title}
                    href={calc.available ? calc.href : '#'}
                    className={`bg-white border-2 rounded-2xl p-6 transition group ${
                      calc.available 
                        ? 'border-gray-200 hover:border-amber-400 hover:shadow-lg cursor-pointer' 
                        : 'border-gray-100 opacity-60 cursor-not-allowed'
                    }`}
                    onClick={(e) => !calc.available && e.preventDefault()}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${calc.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        <calc.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        calc.available 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {calc.tag}
                      </span>
                    </div>
                    
                    <h3 className={`text-lg font-bold mb-2 ${calc.available ? 'text-gray-900 group-hover:text-amber-600' : 'text-gray-500'}`}>
                      {calc.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {calc.description}
                    </p>
                    
                    {calc.available && (
                      <div className="flex items-center text-amber-600 font-semibold text-sm">
                        Try Now
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Horse Care Challenge Game */}
          <section className="py-12 px-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                {/* Decorative sparkles */}
                <Sparkles className="absolute top-8 right-8 w-8 h-8 text-yellow-300 animate-pulse" />
                <Sparkles className="absolute bottom-12 left-12 w-6 h-6 text-pink-300 animate-pulse" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                  <div className="w-48 h-48 md:w-64 md:h-64 bg-white/20 rounded-3xl flex items-center justify-center order-2 lg:order-1">
                    <div className="text-center text-white">
                      <Gamepad2 className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-2" />
                      <p className="font-bold text-lg">Quiz</p>
                      <p className="text-purple-200">Game</p>
                    </div>
                  </div>

                  <div className="flex-1 text-white order-1 lg:order-2">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                        🎮 FUN GAME
                      </span>
                      <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                        KIDS & ADULTS
                      </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Horse Care Challenge</h2>
                    
                    <p className="text-purple-100 text-lg mb-6 max-w-xl">
                      Test your horse knowledge with our fun quiz game! Perfect for young equestrians 
                      learning about horse care. Compete with friends, earn badges, and build your virtual stable.
                    </p>

                    <ul className="space-y-2 mb-8">
                      <li className="flex items-center gap-2 text-purple-100">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        50+ horse care questions
                      </li>
                      <li className="flex items-center gap-2 text-purple-100">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        Earn points & badges
                      </li>
                      <li className="flex items-center gap-2 text-purple-100">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        Share scores with friends
                      </li>
                    </ul>

                    <a 
                      href="/horse-care-challenge"
                      className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition shadow-lg"
                    >
                      Play Now - It's Free!
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Horse Owners Trust Us</h2>
                <p className="text-gray-600">Built by UK equestrians, for UK equestrians.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature) => (
                  <div key={feature.title} className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="reviews" className="py-16 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">What Horse Owners Say</h2>
                <p className="text-gray-600">Join thousands of UK equestrians using HorseCost.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 mb-6 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 font-bold">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-600">Find answers to common questions about our calculators.</p>
              </div>

              <div className="grid gap-6">
                {faqs.map((faq, index) => (
                  <details key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200 cursor-pointer group">
                    <summary className="font-bold text-gray-900 flex items-center justify-between list-none">
                      {faq.q}
                      <span className="ml-4 text-amber-600 group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="text-gray-600 mt-4 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 bg-gradient-to-r from-amber-600 to-orange-500">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Know Your Horse Costs?
              </h2>
              <p className="text-amber-100 text-lg mb-10 max-w-2xl mx-auto">
                Start planning your equestrian budget today. Free, instant, accurate results for UK horse owners.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="/annual-horse-cost-calculator" 
                  className="w-full sm:w-auto bg-white text-amber-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-50 transition shadow-lg"
                >
                  Calculate Annual Costs
                </a>
                <a 
                  href="/horse-care-challenge" 
                  className="w-full sm:w-auto bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-lg"
                >
                  Play Horse Quiz
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <a href="/" className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">HorseCost</span>
                </a>
                <p className="text-sm max-w-md">
                  Free professional horse cost calculators for UK equestrians. 
                  Plan your horse ownership budget with confidence.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">Calculators</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/annual-horse-cost-calculator" className="hover:text-white transition">Annual Cost Calculator</a></li>
                  <li><a href="/horse-feed-calculator" className="hover:text-white transition">Feed Calculator</a></li>
                  <li><a href="/farrier-cost-calculator" className="hover:text-white transition">Farrier Calculator</a></li>
                  <li><a href="/horse-weight-calculator" className="hover:text-white transition">Weight Calculator</a></li>
                  <li><a href="/competition-budget-calculator" className="hover:text-white transition">Competition Budget</a></li>
                  <li><a href="/horse-care-challenge" className="hover:text-white transition">Horse Quiz Game</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="/terms-of-service" className="hover:text-white transition">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm">© {new Date().getFullYear()} HorseCost. All rights reserved.</p>
              <p className="text-sm">Made with ❤️ for UK horse owners</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}







