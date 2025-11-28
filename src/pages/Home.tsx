import { Helmet } from 'react-helmet-async'
import { 
  Calculator, 
  PoundSterling, 
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
  Users
} from 'lucide-react'

export default function Home() {
  const calculators = [
    {
      title: 'Livery Cost Calculator',
      description: 'Compare DIY, part, and full livery costs. Find the right option for your budget and lifestyle.',
      icon: PoundSterling,
      href: '/calculators/livery-cost',
      tag: 'Most Popular',
      color: 'bg-horse-700',
      keywords: 'livery calculator, livery costs UK, horse livery prices'
    },
    {
      title: 'Annual Cost Calculator',
      description: 'Get a complete breakdown of yearly horse ownership costs including insurance, vets, and equipment.',
      icon: Calendar,
      href: '/calculators/annual-cost',
      tag: 'Essential',
      color: 'bg-forest-700',
      keywords: 'horse cost calculator, annual horse expenses, horse ownership costs UK'
    },
    {
      title: 'Feed Budget Planner',
      description: 'Calculate hay, hard feed, and supplement costs based on your horse\'s weight and workload.',
      icon: Wheat,
      href: '/calculators/feed-budget',
      tag: 'Nutrition',
      color: 'bg-amber-700',
      keywords: 'horse feed calculator, feed budget planner, horse nutrition costs'
    },
    {
      title: 'Farrier Cost Calculator',
      description: 'Plan your annual farrier budget for shoes, trims, and remedial work with UK pricing.',
      icon: Scissors,
      href: '/calculators/farrier-cost',
      tag: 'Hoof Care',
      color: 'bg-stone-700',
      keywords: 'farrier calculator, farrier costs UK, horse shoeing prices'
    },
    {
      title: 'Competition Budget',
      description: 'Calculate entry fees, travel costs, and show expenses for your competition season.',
      icon: Trophy,
      href: '/calculators/competition-budget',
      tag: 'Competing',
      color: 'bg-rose-700',
      keywords: 'competition budget calculator, horse show costs, equestrian competition planner'
    },
    {
      title: 'Weight Calculator',
      description: 'Estimate your horse\'s weight using the weigh tape method for accurate feeding and medication.',
      icon: Scale,
      href: '/calculators/weight-calculator',
      tag: 'Health',
      color: 'bg-sky-700',
      keywords: 'horse weight calculator, weigh tape method, horse weight estimation'
    }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Instant Accurate Results',
      description: 'Get precise calculations in seconds with our optimised tools. No guesswork, just reliable data.'
    },
    {
      icon: Shield,
      title: 'UK-Specific Pricing Data',
      description: 'All costs based on current UK market rates, regional averages, and 2025 pricing updates.'
    },
    {
      icon: Users,
      title: 'Built by Horse Owners',
      description: 'Designed by experienced UK equestrians who understand real-world horse ownership costs.'
    }
  ]

  const testimonials = [
    {
      quote: "Finally, a calculator that understands UK livery costs! Helped me budget properly for my first horse.",
      author: "Sarah M.",
      location: "Yorkshire",
      rating: 5
    },
    {
      quote: "The annual cost breakdown was eye-opening. Now I know exactly what to budget each month.",
      author: "James T.",
      location: "Surrey",
      rating: 5
    },
    {
      quote: "Simple, accurate, and actually useful. Bookmarked for when I'm planning my competition season.",
      author: "Emma R.",
      location: "Cheshire",
      rating: 5
    }
  ]

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HorseCost',
    url: 'https://horsecost.co.uk',
    logo: 'https://horsecost.co.uk/logo.png',
    description: 'Professional horse business calculators for UK equestrians',
    sameAs: ['https://twitter.com/horsecost'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      url: 'https://horsecost.co.uk'
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB'
    }
  }

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HorseCost - Horse Cost Calculators',
    description: 'Professional calculators for managing UK horse business finances including livery, farrier, feed, and competition costs',
    url: 'https://horsecost.co.uk',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '127',
      bestRating: '5',
      worstRating: '1'
    }
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much does it cost to own a horse in the UK?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Horse ownership costs in the UK average £4,000-£8,000+ annually depending on livery type, location, and services. Use our Annual Cost Calculator for personalized estimates.'
        }
      },
      {
        '@type': 'Question',
        name: 'How much does UK livery cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'UK livery costs range from £150-£500+ per month depending on type (DIY £150-£200, part £250-£350, full £350-£500+) and location. Our Livery Calculator provides detailed regional breakdowns.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are typical farrier costs in the UK?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'UK farrier costs typically range £40-£80 per visit, with routine shoeing at £100-£150 per hoof. Calculate your annual budget with our Farrier Cost Calculator.'
        }
      }
    ]
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://horsecost.co.uk'
      }
    ]
  }

  return (
    <>
      <Helmet>
        <title>HorseCost | Free Professional Horse Cost Calculators UK 2025</title>
        <meta name="description" content="Free professional horse calculators for UK equestrians. Calculate livery, farrier, feed, competition & annual costs instantly. Plan your horse business finances with confidence. 6+ calculators, UK pricing, no sign-up required." />
        <meta name="keywords" content="horse calculator, livery calculator, farrier calculator, horse costs UK, equestrian budget, horse expenses, feed budget calculator, competition budget planner" />
        <meta name="author" content="HorseCost Ltd" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:title" content="HorseCost - Professional Horse Cost Calculators UK" />
        <meta property="og:description" content="Free calculators for livery costs, farrier expenses, feed budgets & more. Plan your equestrian finances with UK-specific pricing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://horsecost.co.uk" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:image" content="https://horsecost.co.uk/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@horsecost" />
        <meta name="twitter:title" content="HorseCost - Horse Cost Calculators UK" />
        <meta name="twitter:description" content="Free professional calculators for UK horse owners. Calculate livery, farrier, feed & competition costs instantly." />
        <meta name="twitter:image" content="https://horsecost.co.uk/og-image.jpg" />
        
        <link rel="canonical" href="https://horsecost.co.uk" />
        <link rel="alternate" hrefLang="en-GB" href="https://horsecost.co.uk" />
        
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(softwareAppSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#78350f" />
      </Helmet>

      <div className="min-h-screen bg-horse-50">
        <header className="bg-white/80 backdrop-blur-md border-b border-horse-200 sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-horse-800 rounded-full flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-horse-100" />
                </div>
                <span className="text-xl font-serif font-bold text-horse-900">HorseCost</span>
              </a>
              <div className="hidden md:flex items-center gap-8">
                <a href="#calculators" className="text-horse-600 hover:text-horse-900 transition font-medium">
                  Calculators
                </a>
                <a href="#features" className="text-horse-600 hover:text-horse-900 transition font-medium">
                  Features
                </a>
                <a href="#testimonials" className="text-horse-600 hover:text-horse-900 transition font-medium">
                  Reviews
                </a>
              </div>
              <a href="#calculators" className="btn-primary text-sm">
                Get Started
              </a>
            </div>
          </nav>
        </header>

        <main>
          <section className="bg-gradient-hero pt-16 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="animate-fade-up">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-horse-200/60 text-horse-800 rounded-full text-sm font-medium mb-6">
                  <CheckCircle2 className="w-4 h-4" />
                  Free Professional Calculators for UK Equestrians
                </span>
              </div>
              
              <h1 className="animate-fade-up-delay-1 text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-horse-950 leading-tight mb-6">
                Plan Your Horse Business Costs
                <br />
                <span className="text-gradient">With Professional Precision</span>
              </h1>
              
              <p className="animate-fade-up-delay-2 text-lg sm:text-xl text-horse-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                Professional horse cost calculators for UK equestrians. Calculate livery costs, farrier expenses, feed budgets, competition costs, annual ownership expenses, and weight estimation. Make informed financial decisions with UK-specific pricing and expert guidance.
              </p>
              
              <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#calculators" className="btn-primary text-base px-8 py-4">
                  Explore Calculators
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
                <a href="#features" className="btn-secondary text-base px-8 py-4">
                  Why Choose Us
                </a>
              </div>

              <div className="mt-16 pt-8 border-t border-horse-200">
                <p className="text-sm text-horse-500 mb-4">Trusted by equestrians across the UK</p>
                <div className="flex flex-wrap items-center justify-center gap-8 text-horse-400">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">2,500+ Active Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    <span className="font-medium">6 Professional Calculators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-medium">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="calculators" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="section-heading mb-4">Professional Horse Cost Calculators</h2>
                <p className="section-subheading mx-auto">
                  Six powerful, free calculators designed specifically for UK horse owners. 
                  Calculate livery, farrier, feed, competition costs and more with precision.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {calculators.map((calc) => (
                  <a 
                    key={calc.title}
                    href={calc.href}
                    className="calculator-card p-6 flex flex-col group"
                    title={`${calc.title} - ${calc.keywords}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${calc.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        alc.icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-semibold text-horse-500 bg-horse-100 px-3 py-1 rounded-full">
                        {calc.tag}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-horse-900 mb-2 group-hover:text-horse-700 transition">
                      {calc.title}
                    </h3>
                    
                    <p className="text-horse-600 text-sm leading-relaxed mb-4 flex-grow">
                      {calc.description}
                    </p>
                    
                    <div className="flex items-center text-horse-700 font-semibold text-sm group-hover:text-horse-900 transition">
                      Try Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-warm">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="section-heading mb-4">Why Choose HorseCost?</h2>
                <p className="section-subheading mx-auto">
                  Built by UK horse owners for UK horse owners. Professional, accurate, free.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature) => (
                  <article 
                    key={feature.title}
                    className="bg-white rounded-xl p-8 shadow-sm border border-horse-100"
                  >
                    <div className="w-14 h-14 bg-horse-100 rounded-xl flex items-center justify-center mb-6">
                      <feature.icon className="w-7 h-7 text-horse-700" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-horse-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-horse-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="section-heading mb-4">What UK Equestrians Say</h2>
                <p className="section-subheading mx-auto">
                  Join 2,500+ horse owners who trust HorseCost for accurate financial planning.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <article 
                    key={index}
                    className="bg-horse-50 rounded-xl p-8 border border-horse-100"
                  >
                    <div className="flex gap-1 mb-4" aria-label={`${testimonial.rating} out of 5 stars`}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-amber-500 fill-current" aria-hidden="true" />
                      ))}
                    </div>
                    <blockquote className="text-horse-700 leading-relaxed mb-6 italic">
                      {`"${testimonial.quote}"`}
                    </blockquote>
                    <footer className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-horse-300 rounded-full flex items-center justify-center text-horse-700 font-bold">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        ite className="font-semibold text-horse-900 not-italic">
                          {testimonial.author}
                        </cite>
                        <p className="text-sm text-horse-500">{testimonial.location}</p>
                      </div>
                    </footer>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-horse-900">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                Ready to Take Control of Your Horse Business Finances?
              </h2>
              <p className="text-lg text-horse-300 mb-10 max-w-2xl mx-auto">
                Start planning your equestrian budget today with our free, professional calculators. 
                No credit card, no sign-up required. Just instant, accurate results.
              </p>
              <a 
                href="#calculators" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-horse-900 font-semibold rounded-lg hover:bg-horse-100 transition-all duration-200"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </a>
            </div>
          </section>
        </main>

        <footer className="bg-horse-950 text-horse-400 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <a href="/" className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-horse-800 rounded-full flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-horse-300" aria-hidden="true" />
                  </div>
                  <span className="text-xl font-serif font-bold text-white">HorseCost</span>
                </a>
                <p className="text-sm leading-relaxed max-w-md">
                  Free professional horse cost calculators for UK equestrians. 
                  Plan livery, farrier, feed, and competition costs with confidence.
                </p>
              </div>
              
              <nav>
                <h4 className="font-semibold text-white mb-4">Calculators</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/calculators/livery-cost" className="hover:text-white transition">Livery Cost Calculator</a></li>
                  <li><a href="/calculators/annual-cost" className="hover:text-white transition">Annual Cost Calculator</a></li>
                  <li><a href="/calculators/feed-budget" className="hover:text-white transition">Feed Budget Planner</a></li>
                  <li><a href="/calculators/farrier-cost" className="hover:text-white transition">Farrier Cost Calculator</a></li>
                </ul>
              </nav>
              
              <nav>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="/terms-of-service" className="hover:text-white transition">Terms of Service</a></li>
                  <li><a href="/sitemap.xml" className="hover:text-white transition">Sitemap</a></li>
                </ul>
              </nav>
            </div>
            
            <div className="pt-8 border-t border-horse-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm">
                {`© ${new Date().getFullYear()} HorseCost. All rights reserved. UK Registered.`}
              </p>
              <p className="text-sm">
                Professional horse calculators for UK equestrians
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

