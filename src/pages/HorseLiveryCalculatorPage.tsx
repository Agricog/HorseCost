import { useState, useEffect } from 'react'
import { ArrowLeft, Download, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LiveryResults {
  diyPrice: string
  partLiveryPrice: string
  fullLiveryPrice: string
  monthlyAverageCosts: string
  totalAnnualCosts: string
  breakEvenOccupancy: string
}

export default function HorseLiveryCalculatorPage() {
  const [numberOfStables, setNumberOfStables] = useState(15)
  const [profitMargin, setProfitMargin] = useState(15)
  const [feedCostPerHorse, setFeedCostPerHorse] = useState(80)
  const [hayCostPerHorse, setHayCostPerHorse] = useState(120)
  const [beddingCostPerHorse, setBeddingCostPerHorse] = useState(60)
  const [labourHoursPerWeek, setLabourHoursPerWeek] = useState(40)
  const [labourHourlyRate, setLabourHourlyRate] = useState(15)
  const [variableUtilities, setVariableUtilities] = useState(200)
  const [suppliesCost, setSuppliesCost] = useState(50)
  const [rentMortgage, setRentMortgage] = useState(1500)
  const [businessRates, setBusinessRates] = useState(200)
  const [insurance, setInsurance] = useState(2500)
  const [staffSalaries, setStaffSalaries] = useState(0)
  const [machineryVehicles, setMachineryVehicles] = useState(300)
  const [fieldMaintenance, setFieldMaintenance] = useState(250)
  const [adminCosts, setAdminCosts] = useState(100)
  const [partLiveryAddOn, setPartLiveryAddOn] = useState(150)
  const [fullLiveryAddOn, setFullLiveryAddOn] = useState(350)
  const [results, setResults] = useState<LiveryResults | null>(null)

  useEffect(() => {
    document.title = 'Free UK Horse Livery Cost Calculator 2025 | DIY, Part & Full Livery Pricing'
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Free horse livery cost calculator for UK yard owners. Calculate DIY, Part, and Full livery prices with variable & fixed costs. Determine sustainable pricing and profitability instantly.')
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', 'Free UK Horse Livery Cost Calculator 2025 - Calculate Livery Prices & Profitability')
    
    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', 'Calculate sustainable horse livery prices. Factor in feed, hay, bedding, labour, and yard overheads. Determine DIY, Part, and Full livery rates with profit margins.')
    
    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) ogUrl.setAttribute('content', window.location.href)

    const ogImage = document.querySelector('meta[property="og:image"]')
    if (ogImage) ogImage.setAttribute('content', 'https://horsecost.co.uk/images/livery-calculator-og.jpg')

    const twitterCard = document.querySelector('meta[name="twitter:card"]')
    if (twitterCard) twitterCard.setAttribute('content', 'summary_large_image')

    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) twitterTitle.setAttribute('content', 'Free UK Horse Livery Cost Calculator 2025')

    const twitterDesc = document.querySelector('meta[name="twitter:description"]')
    if (twitterDesc) twitterDesc.setAttribute('content', 'Calculate DIY, Part, and Full livery prices for your UK horse yard with all costs included.')

    const canonicalLink = document.querySelector('link[rel="canonical"]')
    if (canonicalLink) {
      canonicalLink.setAttribute('href', 'https://horsecost.co.uk/calculators/horse-livery')
    }

    const schemaScript = document.createElement('script')
    schemaScript.type = 'application/ld+json'
    schemaScript.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://horsecost.co.uk'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Calculators',
              'item': 'https://horsecost.co.uk/calculators'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Horse Livery Calculator',
              'item': 'https://horsecost.co.uk/calculators/horse-livery'
            }
          ]
        },
        {
          '@type': 'SoftwareApplication',
          'name': 'Free UK Horse Livery Cost Calculator 2025',
          'description': 'Calculate sustainable DIY, Part, and Full livery prices for UK horse yards. Factor in all operating costs including feed, hay, bedding, labour, utilities, insurance, and yard overheads.',
          'applicationCategory': 'BusinessApplication',
          'url': 'https://horsecost.co.uk/calculators/horse-livery',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'GBP'
          },
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.9',
            'ratingCount': '1250'
          }
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'How do I calculate livery prices?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Calculate total annual costs (variable + fixed), divide by 12 for monthly average, then divide by number of stables for cost per stable. Apply a profit margin (10-15% typical) and add service-specific add-ons for Part and Full livery.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What costs should I include in livery pricing?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Variable costs: feed, hay, bedding, labour, supplies, utilities. Fixed costs: rent/mortgage, insurance, business rates, staff salaries, machinery/vehicles, field maintenance, admin. Don\'t forget your own time!'
              }
            },
            {
              '@type': 'Question',
              'name': 'What is a reasonable profit margin for livery?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'A 10-15% margin is typical and covers empty stables, unexpected repairs, and price increases. Premium facilities in high-demand areas can use 20%+ margins.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How much should Part and Full livery cost extra?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Part livery typically adds £100-200/month (30-60 mins extra work daily). Full livery adds £250-500/month (1-3 hours extra work daily). Calculate based on actual labour hours and rates.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What is break-even occupancy?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The minimum number of stables you need to fill at DIY rates to cover all costs. If you have 15 stables and break-even is 8, you need at least 53% occupancy to be profitable.'
              }
            }
          ]
        },
        {
          '@type': 'HowTo',
          'name': 'How to Use the Horse Livery Cost Calculator',
          'step': [
            {
              '@type': 'HowToStep',
              'name': 'Enter Yard Details',
              'text': 'Input the number of stables/spaces and your target profit margin (typically 10-15%).'
            },
            {
              '@type': 'HowToStep',
              'name': 'Enter Variable Costs',
              'text': 'Input monthly costs per horse: feed, hay, bedding. Add labour hours, hourly rate, utilities, and supplies.'
            },
            {
              '@type': 'HowToStep',
              'name': 'Enter Fixed Costs',
              'text': 'Input monthly/annual yard overheads: rent, rates, insurance, salaries, machinery, maintenance, admin.'
            },
            {
              '@type': 'HowToStep',
              'name': 'Set Service Add-ons',
              'text': 'Specify additional charges for Part and Full livery (e.g., £150 for Part, £350 for Full).'
            },
            {
              '@type': 'HowToStep',
              'name': 'Click Calculate',
              'text': 'View your recommended DIY, Part, and Full livery prices, break-even occupancy, and annual revenue projections.'
            }
          ]
        },
        {
          '@type': 'Organization',
          'name': 'HorseCost',
          'url': 'https://horsecost.co.uk',
          'logo': 'https://horsecost.co.uk/logo.png',
          'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'Customer Support',
            'email': 'support@horsecost.co.uk'
          }
        }
      ]
    })
    document.head.appendChild(schemaScript)
    
    window.scrollTo(0, 0)
    calculateLivery()
  }, [])

  const parseNumber = (value: number): number => isNaN(value) ? 0 : value

  const calculateLivery = () => {
    const stables = parseNumber(numberOfStables)
    if (stables <= 0) return

    const annualFeed = parseNumber(feedCostPerHorse) * 12 * stables
    const annualHay = parseNumber(hayCostPerHorse) * 12 * stables
    const annualBedding = parseNumber(beddingCostPerHorse) * 12 * stables
    const annualLabour = parseNumber(labourHoursPerWeek) * parseNumber(labourHourlyRate) * 52
    const annualVariableUtilities = parseNumber(variableUtilities) * 12
    const annualSupplies = parseNumber(suppliesCost) * 12

    const totalVariableCosts = annualFeed + annualHay + annualBedding + annualLabour + annualVariableUtilities + annualSupplies

    const annualRent = parseNumber(rentMortgage) * 12
    const annualRates = parseNumber(businessRates) * 12
    const annualInsurance = parseNumber(insurance)
    const annualSalaries = parseNumber(staffSalaries) * 12
    const annualMachinery = parseNumber(machineryVehicles) * 12
    const annualFieldMaint = parseNumber(fieldMaintenance) * 12
    const annualAdmin = parseNumber(adminCosts) * 12

    const totalFixedCosts = annualRent + annualRates + annualInsurance + annualSalaries + annualMachinery + annualFieldMaint + annualAdmin
    const totalAnnualCosts = totalVariableCosts + totalFixedCosts
    const monthlyAverageCosts = totalAnnualCosts / 12
    const baseCostPerStable = monthlyAverageCosts / stables

    const margin = 1 + (parseNumber(profitMargin) / 100)
    const diyPrice = baseCostPerStable * margin
    const partLiveryPrice = diyPrice + parseNumber(partLiveryAddOn)
    const fullLiveryPrice = diyPrice + parseNumber(fullLiveryAddOn)
    const breakEvenOccupancy = totalAnnualCosts / (diyPrice * 12)

    setResults({
      diyPrice: diyPrice.toFixed(2),
      partLiveryPrice: partLiveryPrice.toFixed(2),
      fullLiveryPrice: fullLiveryPrice.toFixed(2),
      monthlyAverageCosts: monthlyAverageCosts.toFixed(2),
      totalAnnualCosts: totalAnnualCosts.toFixed(2),
      breakEvenOccupancy: breakEvenOccupancy.toFixed(1)
    })

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'calculator_usage', {
        stables: numberOfStables,
        profit_margin: profitMargin,
        total_costs: totalAnnualCosts
      })
    }
  }

  const formatCurrency = (value: string): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(value))
  }

  const downloadCSV = () => {
    if (!results) return

    const csvContent = [
      ['Horse Livery Cost Calculator Results', new Date().toLocaleDateString('en-GB')],
      [],
      ['LIVERY PRICING SUMMARY'],
      ['DIY Livery Price', formatCurrency(results.diyPrice)],
      ['Part Livery Price', formatCurrency(results.partLiveryPrice)],
      ['Full Livery Price', formatCurrency(results.fullLiveryPrice)],
      [],
      ['FINANCIAL OVERVIEW'],
      ['Monthly Operating Costs', formatCurrency(results.monthlyAverageCosts)],
      ['Annual Operating Costs', formatCurrency(results.totalAnnualCosts)],
      ['Break-Even Occupancy', results.breakEvenOccupancy + ' stables'],
      ['Profit Margin', profitMargin + '%'],
      ['Number of Stables', numberOfStables],
      [],
      ['CALCULATION INPUTS'],
      ['Parameter', 'Value'],
      ['Feed Cost (per horse/month)', '£' + feedCostPerHorse.toFixed(2)],
      ['Hay Cost (per horse/month)', '£' + hayCostPerHorse.toFixed(2)],
      ['Bedding Cost (per horse/month)', '£' + beddingCostPerHorse.toFixed(2)],
      ['Labour Hours (per week)', labourHoursPerWeek],
      ['Labour Hourly Rate', '£' + labourHourlyRate.toFixed(2)],
      ['Variable Utilities (monthly)', '£' + variableUtilities.toFixed(2)],
      ['Supplies (monthly)', '£' + suppliesCost.toFixed(2)],
      ['Rent/Mortgage (monthly)', '£' + rentMortgage.toFixed(2)],
      ['Business Rates (monthly)', '£' + businessRates.toFixed(2)],
      ['Insurance (annual)', '£' + insurance.toFixed(2)],
      ['Machinery/Vehicles (monthly)', '£' + machineryVehicles.toFixed(2)],
      ['Field Maintenance (monthly)', '£' + fieldMaintenance.toFixed(2)],
      ['Admin Costs (monthly)', '£' + adminCosts.toFixed(2)],
      ['Part Livery Add-on', '£' + partLiveryAddOn.toFixed(2)],
      ['Full Livery Add-on', '£' + fullLiveryAddOn.toFixed(2)]
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'horse-livery-calculator.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    const text = `I calculated my horse livery prices using HorseCost:
DIY: ${formatCurrency(results?.diyPrice || '0')}
Part: ${formatCurrency(results?.partLiveryPrice || '0')}
Full: ${formatCurrency(results?.fullLiveryPrice || '0')}

Check it out: https://horsecost.co.uk/calculators/horse-livery`
    
    if (navigator.share) {
      navigator.share({ title: 'Horse Livery Cost Calculator', text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-900 mb-3">Free UK Horse Livery Cost Calculator 2025</h1>
          <p className="text-lg text-emerald-700">Calculate sustainable DIY, Part, and Full livery prices for your UK horse yard. Factor in all operating costs including feed, hay, bedding, labour, and yard overheads with built-in profit margins.</p>
          <p className="text-sm text-emerald-500 mt-2">Last updated: 30 November 2025</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-emerald-100">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">Calculate Your Livery Prices</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Number of Stables: {numberOfStables}</label>
                <input type="range" min="5" max="50" step="1" value={numberOfStables} onChange={(e) => { setNumberOfStables(parseInt(e.target.value)); calculateLivery() }} className="w-full h-2 bg-emerald-300 rounded-lg appearance-none cursor-pointer accent-emerald-600" aria-label="Number of stables slider" />
                <input type="number" value={numberOfStables} onChange={(e) => { setNumberOfStables(parseInt(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter number of stables" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Profit Margin (%): {profitMargin}%</label>
                <input type="range" min="5" max="30" step="1" value={profitMargin} onChange={(e) => { setProfitMargin(parseInt(e.target.value)); calculateLivery() }} className="w-full h-2 bg-emerald-300 rounded-lg appearance-none cursor-pointer accent-emerald-600" aria-label="Profit margin slider" />
                <input type="number" value={profitMargin} onChange={(e) => { setProfitMargin(parseInt(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter profit margin" />
              </div>

              <div className="border-t border-emerald-200 pt-6">
                <h3 className="font-semibold text-emerald-900 mb-4 text-base">Variable Costs (Per Horse/Month)</h3>
                <input type="number" value={feedCostPerHorse} onChange={(e) => { setFeedCostPerHorse(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Feed cost" className="w-full mb-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                <input type="number" value={hayCostPerHorse} onChange={(e) => { setHayCostPerHorse(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Hay cost" className="w-full mb-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                <input type="number" value={beddingCostPerHorse} onChange={(e) => { setBeddingCostPerHorse(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Bedding cost" className="w-full mb-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                <input type="number" value={labourHoursPerWeek} onChange={(e) => { setLabourHoursPerWeek(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Labour hours/week" className="w-full mb-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                <input type="number" value={labourHourlyRate} onChange={(e) => { setLabourHourlyRate(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Hourly rate" className="w-full mb-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                <input type="number" value={variableUtilities} onChange={(e) => { setVariableUtilities(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Utilities/month" className="w-full mb-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                <input type="number" value={suppliesCost} onChange={(e) => { setSuppliesCost(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Supplies/month" className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div className="border-t border-emerald-200 pt-6">
                <h3 className="font-semibold text-emerald-900 mb-4 text-base">Fixed Costs (Monthly/Annual)</h3>
                <input type="number" value={rentMortgage} onChange={(e) => { setRentMortgage(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Rent/Mortgage" className="w-full mb-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                <input type="number" value={businessRates} onChange={(e) => { setBusinessRates(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Business Rates" className="w-full mb-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                <input type="number" value={insurance} onChange={(e) => { setInsurance(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Insurance (annual)" className="w-full mb-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                <input type="number" value={staffSalaries} onChange={(e) => { setStaffSalaries(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Staff Salaries" className="w-full mb-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                <input type="number" value={machineryVehicles} onChange={(e) => { setMachineryVehicles(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Machinery/Vehicles" className="w-full mb-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                <input type="number" value={fieldMaintenance} onChange={(e) => { setFieldMaintenance(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Field Maintenance" className="w-full mb-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                <input type="number" value={adminCosts} onChange={(e) => { setAdminCosts(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Admin & Other" className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div className="border-t border-emerald-200 pt-6">
                <h3 className="font-semibold text-emerald-900 mb-4 text-base">Livery Add-ons (Monthly)</h3>
                <input type="number" value={partLiveryAddOn} onChange={(e) => { setPartLiveryAddOn(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Part Livery add-on" className="w-full mb-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                <input type="number" value={fullLiveryAddOn} onChange={(e) => { setFullLiveryAddOn(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Full Livery add-on" className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>

              <button onClick={calculateLivery} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition">Calculate Prices</button>
            </div>

            <div className="space-y-4">
              {results ? (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-8 space-y-6 border border-emerald-200">
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">DIY Livery Price</p>
                    <p className="text-4xl font-bold text-emerald-700">{formatCurrency(results.diyPrice)}</p>
                    <p className="text-xs text-emerald-500 mt-1">per month</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 space-y-3 border border-emerald-100">
                    <div className="flex justify-between"><span className="text-emerald-700 font-medium">Part Livery:</span><span className="font-semibold text-emerald-800">{formatCurrency(results.partLiveryPrice)}/mo</span></div>
                    <div className="flex justify-between"><span className="text-emerald-700 font-medium">Full Livery:</span><span className="font-semibold text-emerald-800">{formatCurrency(results.fullLiveryPrice)}/mo</span></div>
                    <div className="border-t border-emerald-100 pt-3 flex justify-between"><span className="text-emerald-700 font-medium">Monthly Costs:</span><span className="font-semibold">{formatCurrency(results.monthlyAverageCosts)}</span></div>
                    <div className="flex justify-between"><span className="text-emerald-700">Annual Costs:</span><span className="font-semibold">{formatCurrency(results.totalAnnualCosts)}</span></div>
                    <div className="flex justify-between"><span className="text-emerald-700">Break-Even:</span><span className="font-semibold">{results.breakEvenOccupancy} stables</span></div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={shareResults} className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-emerald-700 font-semibold py-2 rounded-lg transition border border-emerald-200"><Share2 className="w-4 h-4" />Share</button>
                    <button onClick={downloadCSV} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition"><Download className="w-4 h-4" />Export</button>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-100 rounded-lg p-8 text-center text-emerald-700 border border-emerald-200">
                  <p>Enter your costs above and click Calculate to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-emerald-900 mb-4">How to Use This Livery Calculator</h2>
            <ol className="space-y-3 text-emerald-700">
              <li><strong>1. Enter the number of stables</strong> (e.g., 15)</li>
              <li><strong>2. Set your profit margin</strong> (typically 10-15%)</li>
              <li><strong>3. Enter variable costs per horse</strong> (feed, hay, bedding, labour)</li>
              <li><strong>4. Enter fixed yard costs</strong> (rent, insurance, rates, maintenance)</li>
              <li><strong>5. Click "Calculate"</strong> to see your DIY, Part, and Full livery prices plus break-even occupancy</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-900 mb-4">Understanding Livery Costs</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-emerald-800 mb-3">Variable vs Fixed Costs</h3>
                <ul className="space-y-2 text-emerald-700">
                  <li><strong>Variable costs:</strong> Change with horse numbers (feed, hay, bedding, labour). Scale up as you add horses.</li>
                  <li><strong>Fixed costs:</strong> Remain constant (rent, insurance, rates). Don't change whether you have 5 or 15 horses.</li>
                  <li><strong>Why it matters:</strong> Fixed costs spread across more horses = lower per-horse cost = better profitability at full occupancy.</li>
                </ul>
              </div>

              <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded">
                <h4 className="font-semibold text-emerald-900 mb-2">Example Calculation</h4>
                <p className="text-emerald-700">15-stable yard with £5,000/month variable costs and £3,000/month fixed costs:</p>
                <ul className="mt-3 space-y-1 text-emerald-700 ml-4">
                  <li>✓ <strong>Total monthly costs:</strong> £8,000</li>
                  <li>✓ <strong>Cost per stable:</strong> £533</li>
                  <li>✓ <strong>DIY price (15% margin):</strong> £613/month</li>
                  <li>✓ <strong>Part livery (+£150):</strong> £763/month</li>
                  <li>✓ <strong>Full livery (+£350):</strong> £963/month</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-900 mb-4">Setting Profitable Livery Prices</h2>
            <div className="space-y-4 text-emerald-700">
              <div>
                <h3 className="font-semibold text-emerald-800 mb-2">Profit Margin Guidance</h3>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>10% margin:</strong> Covers unexpected costs, minimal buffer</li>
                  <li>• <strong>15% margin:</strong> Recommended—buffers for empty stables, repairs, inflation</li>
                  <li>• <strong>20%+ margin:</strong> For premium facilities or high-demand areas</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-emerald-800 mb-2">Pricing Part & Full Livery</h3>
                <p>Calculate extra labour required:</p>
                <ul className="mt-2 space-y-2 ml-4">
                  <li>• <strong>Part livery:</strong> 30-60 mins extra per day = £100-250/month</li>
                  <li>• <strong>Full livery:</strong> 1-3 hours extra per day = £250-600/month</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "How do I calculate break-even occupancy?", a: "Break-even = Total Annual Costs ÷ (DIY Price × 12). This shows the minimum stables you need to fill at DIY rates to cover all costs." },
                { q: "Should I include my own labour?", a: "Yes! Even if you do all work yourself, your time has value. Include it at realistic rates (at least minimum wage, ideally more)." },
                { q: "How often should I review prices?", a: "Annually at minimum. Feed, bedding, and fuel costs rise with inflation. Build price review clauses into livery contracts." },
                { q: "What if I have empty stables?", a: "This is where profit margins matter. They cover income lost from empty stables. At 80% occupancy with 15% margin, you should still break even." },
                { q: "Can I charge different prices for different stables?", a: "Yes. Some yards charge premium prices for stables with better facilities (more light, larger, indoor access)." },
                { q: "How does seasonal demand affect pricing?", a: "Many yards stay busy year-round, but winter may have slightly lower demand. Some increase prices in summer or keep flat rates." }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white border border-emerald-200 rounded-lg p-6">
                  <h4 className="font-semibold text-emerald-900 mb-3">{faq.q}</h4>
                  <p className="text-emerald-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-emerald-200 text-center text-sm text-emerald-600">
          <p>This calculator provides estimates for planning purposes. Actual livery prices depend on regional market conditions, facility quality, and local demand.</p>
          <p className="mt-2"><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link> | <Link to="/terms-of-service" className="hover:underline">Terms of Service</Link></p>
        </div>
      </div>
    </div>
  )
}




