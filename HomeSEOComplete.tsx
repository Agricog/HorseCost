import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { 
  Horse, 
  Calculator, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield,
  ArrowRight,
  Mail,
  MessageCircle,
  Github,
  Linkedin
} from 'lucide-react'

export default function Home() {
  const [email, setEmail] = useState('')

  return (
    <>
      {/* ===================== SEO OPTIMIZATION ===================== */}
      <Helmet>
        {/* ===== PRIMARY META TAGS ===== */}
        <title>HorseCost | Free Horse Business Calculators | UK Equestrian Tools</title>
        <meta 
          name="description" 
          content="Free professional calculators for horse businesses. Calculate livery costs, feed expenses, lesson rates, farrier schedules, breeding costs and competition budgets. Built for equestrian professionals." 
        />
        <meta name="keywords" content="horse calculator, livery calculator, feed cost calculator, farrier cost calculator, lesson rate calculator, horse business calculator, equestrian calculator, yard management, horse expenses, UK" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="language" content="English" />
        <meta name="author" content="HorseCost" />
        <meta name="copyright" content="© 2025 HorseCost. All rights reserved." />
        <meta name="theme-color" content="#b45309" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* ===== CANONICAL URL ===== */}
        <link rel="canonical" href="https://horsecost.co.uk/" />

        {/* ===== OPEN GRAPH / FACEBOOK ===== */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://horsecost.co.uk/" />
        <meta property="og:title" content="HorseCost | Free Horse Business Calculators" />
        <meta property="og:description" content="Professional calculators for equestrian professionals. Free livery, feed, farrier, lesson rate, breeding and competition budget calculators." />
        <meta property="og:image" content="https://horsecost.co.uk/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:locale" content="en_GB" />

        {/* ===== TWITTER / X ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://horsecost.co.uk/" />
        <meta name="twitter:title" content="HorseCost | Free Horse Business Calculators" />
        <meta name="twitter:description" content="Professional calculators for equestrian professionals. Calculate costs, manage finances, grow your horse business." />
        <meta name="twitter:image" content="https://horsecost.co.uk/og-image.jpg" />
        <meta name="twitter:site" content="@horsecost" />
        <meta name="twitter:creator" content="@horsecost" />

        {/* ===== APPLE / iOS ===== */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="HorseCost" />
        <link rel="apple-touch-icon" href="https://horsecost.co.uk/apple-touch-icon.png" />

        {/* ===== GOOGLE SEARCH CONSOLE VERIFICATION ===== */}
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE_HERE" />

        {/* ===== PRECONNECT / DNS PREFETCH ===== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://app.smartsuite.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* ===== SCHEMA MARKUP - ORGANIZATION ===== */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "HorseCost",
            "url": "https://horsecost.co.uk",
            "logo": "https://horsecost.co.uk/logo.png",
            "description": "Free professional calculators for horse business management",
            "foundingDate": "2025",
            "areaServed": "GB",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Service",
              "email": "hello@horsecost.co.uk",
              "availableLanguage": "en"
            },
            "sameAs": [
              "https://twitter.com/horsecost",
              "https://linkedin.com/company/horsecost"
            ]
          })}
        </script>

        {/* ===== SCHEMA MARKUP - WEBSITE ===== */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://horsecost.co.uk",
            "name": "HorseCost",
            "description": "Free professional calculators for horse business management",
            "inLanguage": "en-GB",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://horsecost.co.uk/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>

        {/* ===== SCHEMA MARKUP - BREADCRUMB ===== */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://horsecost.co.uk"
              }
            ]
          })}
        </script>

        {/* ===== SITEMAP & ROBOTS ===== */}
        <link rel="sitemap" href="https://horsecost.co.uk/sitemap.xml" />

        {/* ===== GOOGLE ANALYTICS 4 ===== */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA4_ID_HERE"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'YOUR_GA4_ID_HERE', {
              page_path: window.location.pathname,
            });
          `}
        </script>
      </Helmet>

      {/* ===================== MAIN CONTENT ===================== */}
      <div className="bg-white">
        
        {/* NAVIGATION */}
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-amber-100 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <div className="w-10 h-10 bg-amber-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Horse className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-xl font-bold text-amber-900">HorseCost</h1>
            </a>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#calculators" className="text-gray-600 hover:text-amber-700 font-medium transition">Calculators</a>
              <a href="#about" className="text-gray-600 hover:text-amber-700 font-medium transition">About</a>
              <a href="#contact" className="text-gray-600 hover:text-amber-700 font-medium transition">Contact</a>
            </div>

            <button className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition font-medium">
              Sign In
            </button>
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="pt-32 pb-20 px-4 sm:px-6 bg-gradient-to-b from-amber-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 inline-block">
              <div className="w-16 h-16 bg-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Horse className="w-9 h-9 text-white" aria-hidden="true" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Professional Horse <span className="text-amber-700">Business Calculators</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Free, elegant tools for equestrian professionals. Calculate costs, manage finances, and grow your horse business with precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="#calculators" className="px-8 py-4 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition font-semibold flex items-center justify-center gap-2">
                Explore Calculators <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#contact" className="px-8 py-4 border-2 border-amber-700 text-amber-700 rounded-lg hover:bg-amber-50 transition font-semibold">
                Get Updates
              </a>
            </div>

            {/* TRUST BADGES */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <span>Free & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <span>Instant Calculations</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <span>For All Professionals</span>
              </div>
            </div>
          </div>
        </section>

        {/* CALCULATORS SECTION */}
        <section id="calculators" className="py-20 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Professional Calculators</h2>
              <p className="text-lg text-gray-600">Simple, powerful tools for equestrian business management</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* LIVERY CALCULATOR */}
              <a href="/calculators/livery-calculator" className="group bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 hover:border-amber-200">
                <div className="p-8">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 transition">
                    <Calculator className="w-6 h-6 text-amber-700" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Livery Calculator</h3>
                  <p className="text-gray-600 text-sm mb-4">Calculate monthly livery costs, board rates, and yard profitability instantly.</p>
                  <div className="text-amber-700 font-semibold flex items-center gap-2 group-hover:gap-3 transition">
                    Open Tool <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </a>

              {/* FEED & CARE CALCULATOR */}
              <a href="/calculators/feed-care-calculator" className="group bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 hover:border-amber-200">
                <div className="p-8">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 transition">
                    <TrendingUp className="w-6 h-6 text-amber-700" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Feed & Care Costs</h3>
                  <p className="text-gray-600 text-sm mb-4">Track feed, farrier, vet, and daily care expenses per horse annually.</p>
                  <div className="text-amber-700 font-semibold flex items-center gap-2 group-hover:gap-3 transition">
                    Open Tool <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </a>

              {/* LESSON RATE CALCULATOR */}
              <a href="/calculators/lesson-rate-calculator" className="group bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 hover:border-amber-200">
                <div className="p-8">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 transition">
                    <Users className="w-6 h-6 text-amber-700" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Lesson Rate Pricing</h3>
                  <p className="text-gray-600 text-sm mb-4">Calculate optimal lesson pricing based on costs, competitors, and location.</p>
                  <div className="text-amber-700 font-semibold flex items-center gap-2 group-hover:gap-3 transition">
                    Open Tool <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </a>

              {/* FARRIER CALCULATOR */}
              <a href="/calculators/farrier-calculator" className="group bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 hover:border-amber-200">
                <div className="p-8">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 transition">
                    <Zap className="w-6 h-6 text-amber-700" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Farrier Schedule & Cost</h3>
                  <p className="text-gray-600 text-sm mb-4">Plan shoeing schedules and forecast annual farrier expenses per herd.</p>
                  <div className="text-amber-700 font-semibold flex items-center gap-2 group-hover:gap-3 transition">
                    Open Tool <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </a>

              {/* BREEDING CALCULATOR */}
              <a href="/calculators/breeding-calculator" className="group bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 hover:border-amber-200">
                <div className="p-8">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 transition">
                    <TrendingUp className="w-6 h-6 text-amber-700" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Breeding Cost Analysis</h3>
                  <p className="text-gray-600 text-sm mb-4">Calculate breeding expenses, foal costs, and profitability from foal sales.</p>
                  <div className="text-amber-700 font-semibold flex items-center gap-2 group-hover:gap-3 transition">
                    Open Tool <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </a>

              {/* COMPETITION BUDGET */}
              <a href="/calculators/competition-budget" className="group bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 hover:border-amber-200">
                <div className="p-8">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 transition">
                    <Calculator className="w-6 h-6 text-amber-700" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Competition Budget</h3>
                  <p className="text-gray-600 text-sm mb-4">Plan competition season costs including entries, travel, and accommodation.</p>
                  <div className="text-amber-700 font-semibold flex items-center gap-2 group-hover:gap-3 transition">
                    Open Tool <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </a>
            </div>

            {/* COMING SOON */}
            <div className="text-center mt-12 p-8 bg-white rounded-xl border-2 border-dashed border-amber-200">
              <p className="text-gray-600 mb-3">More calculators launching soon...</p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">Stabling Calculator</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">Hay & Bedding</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">Insurance Calculator</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">Tack Inventory</span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="about" className="py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why HorseCost?</h2>
              <p className="text-lg text-gray-600">Built by equestrian professionals, for equestrian professionals</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mb-4 text-white">
                  <Shield className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">100% Free</h3>
                <p className="text-gray-600">No subscriptions, no hidden fees. All calculators are completely free to use forever.</p>
              </div>

              <div className="p-8 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mb-4 text-white">
                  <Zap className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Results</h3>
                <p className="text-gray-600">Get calculations instantly. No waiting, no complex forms. Simple, fast, and accurate.</p>
              </div>

              <div className="p-8 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mb-4 text-white">
                  <TrendingUp className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Professional Grade</h3>
                <p className="text-gray-600">Built with industry expertise. Trusted by equestrian professionals worldwide.</p>
              </div>

              <div className="p-8 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mb-4 text-white">
                  <Users className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">For Everyone</h3>
                <p className="text-gray-600">From hobbyists to professionals, yard managers to event organizers.</p>
              </div>

              <div className="p-8 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mb-4 text-white">
                  <Zap className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Works Offline</h3>
                <p className="text-gray-600">Use on your phone or tablet at the yard. Works without internet connection.</p>
              </div>

              <div className="p-8 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mb-4 text-white">
                  <Shield className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Your Data is Private</h3>
                <p className="text-gray-600">All calculations stay on your device. We never store or share your data.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 px-4 sm:px-6 bg-amber-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Start Managing Your Horse Business Better</h2>
            <p className="text-xl mb-8 opacity-95">Get instant access to all HorseCost calculators. Free. Forever.</p>
            <a href="#calculators" className="inline-block px-8 py-4 bg-white text-amber-700 rounded-lg hover:bg-gray-100 transition font-semibold">
              Explore All Calculators
            </a>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Updates & Feedback</h2>
              <p className="text-lg text-gray-600">Tell us which calculators you want next or share your feedback</p>
            </div>

            {/* SMARTSUITE FORM */}
            <div className="bg-gray-50 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Send Us Your Feedback</h3>
              <iframe 
                src="https://app.smartsuite.com/form/sba974gi/yLlFp5uhw3?header=false" 
                width="100%" 
                height="600px" 
                frameBorder="0"
                title="HorseCost Feedback Form - SmartSuite"
                className="rounded-lg"
              />
            </div>

            {/* DIRECT CONTACT */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">Questions or calculator requests?</p>
              <a href="mailto:hello@horsecost.co.uk" className="text-amber-700 hover:text-amber-800 font-semibold text-lg">
                hello@horsecost.co.uk
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center">
                    <Horse className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <span className="font-bold text-white">HorseCost</span>
                </div>
                <p className="text-sm">Professional calculators for equestrian professionals.</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Calculators</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#calculators" className="hover:text-white transition">Livery Costs</a></li>
                  <li><a href="#calculators" className="hover:text-white transition">Feed & Care</a></li>
                  <li><a href="#calculators" className="hover:text-white transition">Lesson Rates</a></li>
                  <li><a href="#calculators" className="hover:text-white transition">Farrier Costs</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                  <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
                  <li><a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="/terms-of-service" className="hover:text-white transition">Terms of Service</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Follow Us</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="https://twitter.com/horsecost" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Twitter</a></li>
                  <li><a href="https://linkedin.com/company/horsecost" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">LinkedIn</a></li>
                  <li><a href="https://github.com/horsecost" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-center md:text-left mb-4 md:mb-0">
                © 2025 HorseCost. All rights reserved.
              </p>
              <div className="flex gap-4">
                <a href="https://twitter.com/horsecost" className="hover:text-white transition" title="HorseCost on Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20a11.08 11.08 0 0 0 5.26-1.54v-5.09a3.81 3.81 0 0 1 3.74-3.84h2.84V6.36h-2.84a5.76 5.76 0 0 0-5.74 5.74v2.47A11.07 11.07 0 0 1 8.29 20Z"></path>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/horsecost" className="hover:text-white transition" title="HorseCost on LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="mailto:hello@horsecost.co.uk" className="hover:text-white transition" title="Email HorseCost">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
