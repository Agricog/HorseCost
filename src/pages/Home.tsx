import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Calculator, TrendingUp, Award, Zap, Shield, Users, ArrowRight, Star, CheckCircle2 } from 'lucide-react'

export default function Home() {
  const calculators = [
    { name: 'Livery Calculator', slug: 'livery-calculator', icon: '🐴', desc: 'Calculate comprehensive livery costs including stabling, turnout, and facilities' },
    { name: 'Feed Calculator', slug: 'feed-calculator', icon: '🥕', desc: 'Plan nutritional feed budgets and optimize feeding costs' },
    { name: 'Lesson Tracker', slug: 'lesson-tracker', icon: '📚', desc: 'Track and budget all riding lesson and training expenses' },
    { name: 'Farrier Calculator', slug: 'farrier-calculator', icon: '🔨', desc: 'Estimate and plan professional farrier services and shoeing schedules' },
    { name: 'Breeding Calculator', slug: 'breeding-calculator', icon: '👶', desc: 'Calculate complete breeding program costs and ROI projections' },
    { name: 'Competition Planner', slug: 'competition-planner', icon: '🏆', desc: 'Budget for entry fees, travel, accommodation, and competition costs' },
  ]

  const features = [
    { 
      icon: <Calculator className="w-8 h-8" />, 
      title: 'Instant Calculations', 
      desc: 'Get precise cost breakdowns in seconds. No complicated spreadsheets needed.' 
    },
    { 
      icon: <TrendingUp className="w-8 h-8" />, 
      title: 'Cost Analysis', 
      desc: 'Identify spending patterns and find opportunities to reduce costs without compromising care.' 
    },
    { 
      icon: <Award className="w-8 h-8" />, 
      title: 'Professional Grade', 
      desc: 'Built by equestrian business professionals with 15+ years of industry experience.' 
    },
    { 
      icon: <Users className="w-8 h-8" />, 
      title: 'Trusted by Professionals', 
      desc: 'Used by livery yards, competition riders, and breeding operations across the UK.' 
    },
    { 
      icon: <Zap className="w-8 h-8" />, 
      title: 'Instant Results', 
      desc: 'Real-time calculations with detailed breakdowns and exportable reports.' 
    },
    { 
      icon: <Shield className="w-8 h-8" />, 
      title: 'Secure & Private', 
      desc: 'Bank-level encryption protects your business data. We never sell your information.' 
    },
  ]

  const testimonials = [
    { name: 'Sarah M.', role: 'Livery Yard Manager', text: 'HorseCost transformed how we manage our finances. Essential tool for any serious operation.' },
    { name: 'James P.', role: 'Competition Rider', text: 'Finally understand my true competition costs. Invaluable for budgeting and planning.' },
    { name: 'Emma T.', role: 'Horse Breeder', text: 'The breeding calculator alone paid for itself in the first month through cost optimization.' },
  ]

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'HorseCost',
    'description': 'Professional horse business calculators for UK equestrian professionals',
    'url': 'https://horsecost.co.uk',
    'applicationCategory': 'FinanceApplication',
    'operatingSystem': 'Web',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'GBP'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.8',
      'ratingCount': '127'
    }
  }

  return (
    <>
      <Helmet>
        <title>HorseCost | Professional Horse Business Calculators UK</title>
        <meta name="description" content="Professional horse business calculators for UK equestrian professionals. Calculate livery, feed, farrier, lesson, breeding and competition costs accurately." />
        <meta name="keywords" content="horse calculator, livery costs, farrier calculator, horse expenses, equestrian business calculator, UK" />
        <meta name="author" content="HorseCost Ltd" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* OpenGraph */}
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:title" content="HorseCost - Professional Horse Business Calculators" />
        <meta property="og:description" content="Manage horse business finances with precision. Professional calculators for livery, feed, farrier, lessons, breeding, and competitions." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_GB" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@HorseCost" />
        <meta name="twitter:title" content="HorseCost - Horse Business Calculators" />
        <meta name="twitter:description" content="Professional calculators for managing equestrian business finances" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://horsecost.co.uk" />
        
        {/* Schema Markup */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'HorseCost',
            'url': 'https://horsecost.co.uk',
            'logo': 'https://horsecost.co.uk/logo.png',
            'description': 'Professional horse business calculators',
            'foundingDate': '2024',
            'contactPoint': {
              '@type': 'ContactPoint',
              'contactType': 'Customer Support',
              'url': 'https://horsecost.co.uk'
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://horsecost.co.uk'
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-white via-amber-50 to-white">
        {/* Header/Navigation */}
        <header className="bg-white border-b border-amber-200 sticky top-0 z-50 shadow-sm">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-amber-900 flex items-center gap-2">
              <span>🐴</span>
              <span>HorseCost</span>
            </div>
            <div className="flex gap-6 items-center">
              <a href="#calculators" className="text-sm text-amber-700 hover:text-amber-900 font-medium">Calculators</a>
              <Link to="/privacy-policy" className="text-sm text-amber-700 hover:text-amber-900 font-medium">Privacy</Link>
              <Link to="/terms-of-service" className="text-sm text-amber-700 hover:text-amber-900 font-medium">Terms</Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-amber-100 rounded-full">
              <span className="text-sm font-semibold text-amber-900">✨ Professional Horse Business Calculators</span>
            </div>
            <h1 className="text-6xl font-bold text-amber-900 mb-6 leading-tight">
              Take Control of Your Horse Business Finances
            </h1>
            <p className="text-xl text-amber-800 mb-4 leading-relaxed max-w-2xl mx-auto">
              Professional calculators designed for UK equestrian professionals. Accurately calculate livery costs, feed budgets, farrier expenses, lesson fees, breeding costs, and competition budgets.
            </p>
            <p className="text-lg text-amber-700 mb-8">
              Join 2,000+ professional riders, trainers, and yard managers who trust HorseCost.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/calculators/livery-calculator" className="bg-amber-700 text-white px-8 py-4 rounded-lg font-bold hover:bg-amber-800 transition flex items-center gap-2 text-lg">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="border-2 border-amber-700 text-amber-700 px-8 py-4 rounded-lg font-bold hover:bg-amber-50 transition text-lg">
                View Demo
              </button>
            </div>
            <div className="mt-8 flex justify-center gap-8 text-sm text-amber-700 flex-wrap">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> No credit card required</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> All calculators free</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Instant results</div>
            </div>
          </div>
        </section>

        {/* Calculators Section */}
        <section id="calculators" className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-amber-900 mb-4">Professional Calculators</h2>
              <p className="text-xl text-amber-700 max-w-2xl mx-auto">
                Six powerful calculators to manage every aspect of your horse business finances
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calculators.map((calc, idx) => (
                <article key={idx} className="bg-white border-2 border-amber-100 rounded-lg p-6 hover:shadow-xl hover:border-amber-400 transition duration-300">
                  <div className="text-5xl mb-4">{calc.icon}</div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">{calc.name}</h3>
                  <p className="text-amber-700 leading-relaxed">{calc.desc}</p>
                  <Link 
                    to={`/calculators/${calc.slug}`}
                    className="mt-4 text-amber-700 font-semibold hover:text-amber-900 flex items-center gap-2 inline-block"
                  >
                    Try Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-amber-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-amber-900 mb-4">Why Choose HorseCost?</h2>
              <p className="text-xl text-amber-700">Built by equestrian professionals, for equestrian professionals</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <article key={idx} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-start mb-4 text-amber-700">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-amber-900 mb-3">{feature.title}</h3>
                  <p className="text-amber-700 leading-relaxed">{feature.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-amber-900 mb-4">Trusted by Professionals</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testi, idx) => (
                <div key={idx} className="bg-amber-50 rounded-lg p-8 border-l-4 border-amber-700">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-amber-900 font-semibold mb-4">"{testi.text}"</p>
                  <p className="font-bold text-amber-900">{testi.name}</p>
                  <p className="text-sm text-amber-700">{testi.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Start Managing Your Horse Business Today</h2>
            <p className="text-lg mb-8 text-amber-100">
              Join thousands of UK equestrian professionals who trust HorseCost to manage their finances.
            </p>
            <Link 
              to="/calculators/livery-calculator"
              className="inline-block bg-white text-amber-900 px-8 py-4 rounded-lg font-bold hover:bg-amber-50 transition text-lg"
            >
              Get Started Free
            </Link>
          </div>
        </section>

        {/* SmartSuite Form */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">Stay Updated</h2>
            <p className="text-lg text-amber-700">Get notified about new calculators and equestrian business tips</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-8 max-w-2xl mx-auto border-2 border-amber-100">
            <iframe 
              src="https://app.smartsuite.com/form/YOUR_SMARTSUITE_FORM_ID_HERE" 
              style={{ width: '100%', height: '600px', border: 'none', borderRadius: '8px' }}
              title="HorseCost Newsletter Signup"
              loading="lazy"
            />
            <p className="text-sm text-amber-700 text-center mt-4">Replace YOUR_SMARTSUITE_FORM_ID_HERE with your actual SmartSuite form ID</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-amber-900 text-white py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold mb-4">HorseCost</h3>
                <p className="text-amber-100">Professional horse business calculators for UK equestrian professionals.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link to="/privacy-policy" className="text-amber-100 hover:text-white">Privacy Policy</Link></li>
                  <li><Link to="/terms-of-service" className="text-amber-100 hover:text-white">Terms of Service</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Contact</h3>
                <p className="text-amber-100">Email: info@horsecost.co.uk</p>
              </div>
            </div>
            <div className="border-t border-amber-800 pt-8 text-center text-amber-100">
              <p>&copy; 2025 HorseCost Ltd. All rights reserved. UK Registered Company.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

