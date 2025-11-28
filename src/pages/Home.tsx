import { useEffect } from 'react'
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
  useEffect(() => {
    document.title = 'HorseCost | Professional Horse Business Calculators UK'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Free professional horse calculators for UK equestrians. Calculate livery costs, farrier expenses, feed budgets, competition costs & more. Plan your equestrian finances with confidence.'
      )
    }
  }, [])

  const calculators = [
    {
      title: 'Livery Cost Calculator',
      description: 'Compare DIY, part, and full livery costs. Find the right option for your budget and lifestyle.',
      icon: PoundSterling,
      href: '/calculators/livery-cost',
      tag: 'Most Popular',
      color: 'bg-horse-700'
    },
    {
      title: 'Annual Cost Calculator',
      description: 'Get a complete breakdown of yearly horse ownership costs including insurance, vets, and equipment.',
      icon: Calendar,
      href: '/calculators/annual-cost',
      tag: 'Essential',
      color: 'bg-forest-700'
    },
    {
      title: 'Feed Budget Planner',
      description: 'Calculate hay, hard feed, and supplement costs based on your horse\'s weight and workload.',
      icon: Wheat,
      href: '/calculators/feed-budget',
      tag: 'Nutrition',
      color: 'bg-amber-700'
    },
    {
      title: 'Farrier Cost Calculator',
      description: 'Plan your annual farrier budget for shoes, trims, and remedial work with UK pricing.',
      icon: Scissors,
      href: '/calculators/farrier-cost',
      tag: 'Hoof Care',
      color: 'bg-stone-700'
    },
    {
      title: 'Competition Budget',
      description: 'Calculate entry fees, travel costs, and show expenses for your competition season.',
      icon: Trophy,
      href: '/calculators/competition-budget',
      tag: 'Competing',
      color: 'bg-rose-700'
    },
    {
      title: 'Weight Calculator',
      description: 'Estimate your horse\'s weight using the weigh tape method for accurate feeding and medication.',
      icon: Scale,
      href: '/calculators/weight-calculator',
      tag: 'Health',
      color: 'bg-sky-700'
    }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get accurate calculations in seconds with our optimised tools'
    },
    {
      icon: Shield,
      title: 'UK-Specific Data',
      description: 'All costs based on current UK market rates and regional averages'
    },
    {
      icon: Users,
      title: 'Built for Equestrians',
      description: 'Designed by horse owners who understand your needs'
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

  return (
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
              Plan Your Horse Costs
              <br />
              <span className="text-gradient">With Confidence</span>
            </h1>
            
            <p className="animate-fade-up-delay-2 text-lg sm:text-xl text-horse-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Professional calculators for livery, farrier, feed, and competition costs. 
              Make informed decisions about your equestrian budget with UK-specific pricing.
            </p>
            
            <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#calculators" className="btn-primary text-base px-8 py-4">
                Explore Calculators
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a href="#features" className="btn-secondary text-base px-8 py-4">
                Learn More
              </a>
            </div>

            <div className="mt-16 pt-8 border-t border-horse-200">
              <p className="text-sm text-horse-500 mb-4">Trusted by equestrians across the UK</p>
              <div className="flex items-center justify-center gap-8 text-horse-400">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">2,500+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  <span className="font-medium">6 Calculators</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-medium">4.9 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="calculators" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="section-heading mb-4">Professional Horse Calculators</h2>
              <p className="section-subheading mx-auto">
                Everything you need to plan and manage your equestrian finances, 
                all in one place and completely free.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {calculators.map((calc) => (
                <a 
                  key={calc.title}
                  href={calc.href}
                  className="calculator-card p-6 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${calc.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <calc.icon className="w-6 h-6" />
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
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
                Built specifically for UK horse owners who want clarity on costs without the complexity.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div 
                  key={feature.title}
                  className="bg-white rounded-xl p-8 shadow-sm border border-horse-100"
                >
                  <div className="w-14 h-14 bg-horse-100 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-horse-700" />
                  </div>
                  <h3 className="text-xl font-bold text-horse-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-horse-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="section-heading mb-4">What Equestrians Say</h2>
              <p className="section-subheading mx-auto">
                Join thousands of horse owners who trust HorseCost for their financial planning.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <article 
                  key={index}
                  className="bg-horse-50 rounded-xl p-8 border border-horse-100"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-500 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-horse-700 leading-relaxed mb-6">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <footer className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-horse-300 rounded-full flex items-center justify-center text-horse-700 font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <cite className="font-semibold text-horse-900 not-italic">
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
              Ready to Take Control of Your Horse Costs?
            </h2>
            <p className="text-lg text-horse-300 mb-10 max-w-2xl mx-auto">
              Start planning your equestrian budget today with our free, professional calculators. 
              No sign-up required.
            </p>
            <a 
              href="#calculators" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-horse-900 font-semibold rounded-lg hover:bg-horse-100 transition-all duration-200"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
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
                  <Calculator className="w-5 h-5 text-horse-300" />
                </div>
                <span className="text-xl font-serif font-bold text-white">HorseCost</span>
              </a>
              <p className="text-sm leading-relaxed max-w-md">
                Free professional horse calculators for UK equestrians. 
                Plan your livery, farrier, feed, and competition costs with confidence.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Calculators</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/calculators/livery-cost" className="hover:text-white transition">Livery Cost</a></li>
                <li><a href="/calculators/annual-cost" className="hover:text-white transition">Annual Cost</a></li>
                <li><a href="/calculators/feed-budget" className="hover:text-white transition">Feed Budget</a></li>
                <li><a href="/calculators/farrier-cost" className="hover:text-white transition">Farrier Cost</a></li>
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
          
          <div className="pt-8 border-t border-horse-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} HorseCost. All rights reserved.
            </p>
            <p className="text-sm">
              Made with care for UK equestrians
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
