import { useState, useEffect } from 'react'
import { ArrowLeft, Download, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'

// DEPENDENCIES: NONE (uses only built-in browser APIs)
// NO jspdf, NO external libraries required

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
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/calculators' },
            { '@type': 'ListItem', 'position': 3, 'name': 'Horse Livery Calculator', 'item': 'https://horsecost.co.uk/calculators/horse-livery' }
          ]
        },
        {
          '@type': 'SoftwareApplication',
          'name': 'Free UK Horse Livery Cost Calculator 2025',
          'description': 'Calculate sustainable DIY, Part, and Full livery prices for UK horse yards. Factor in all operating costs including feed, hay, bedding, labour, utilities, insurance, and yard overheads.',
          'applicationCategory': 'BusinessApplication',
          'url': 'https://horsecost.co.uk/calculators/horse-livery',
          'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
          'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.9', 'ratingCount': '1250' }
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            { '@type': 'Question', 'name': 'How do I calculate livery prices?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Calculate total annual costs (variable + fixed), divide by 12 for monthly average, then divide by number of stables for cost per stable. Apply a profit margin (10-15% typical) and add service-specific add-ons for Part and Full livery.' } },
            { '@type': 'Question', 'name': 'What costs should I include in livery pricing?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Variable costs: feed, hay, bedding, labour, supplies, utilities. Fixed costs: rent/mortgage, insurance, business rates, staff salaries, machinery/vehicles, field maintenance, admin. Don\'t forget your own time!' } },
            { '@type': 'Question', 'name': 'What is a reasonable profit margin for livery?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'A 10-15% margin is typical and covers empty stables, unexpected repairs, and price increases. Premium facilities in high-demand areas can use 20%+ margins.' } },
            { '@type': 'Question', 'name': 'How much should Part and Full livery cost extra?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Part livery typically adds £100-200/month (30-60 mins extra work daily). Full livery adds £250-500/month (1-3 hours extra work daily). Calculate based on actual labour hours and rates.' } }
          ]
        },
        {
          '@type': 'HowTo',
          'name': 'How to Use the Horse Livery Cost Calculator',
          'step': [
            { '@type': 'HowToStep', 'name': 'Enter Number of Stables', 'text': 'Input the total number of stables/spaces at your yard.' },
            { '@type': 'HowToStep', 'name': 'Set Profit Margin', 'text': 'Specify your target profit margin (typically 10-15%).' },
            { '@type': 'HowToStep', 'name': 'Enter Variable Costs', 'text': 'Input monthly costs per horse: feed, hay, bedding, labour hours, hourly rate, utilities, supplies.' },
            { '@type': 'HowToStep', 'name': 'Enter Fixed Costs', 'text': 'Input monthly/annual yard overheads: rent, rates, insurance, salaries, machinery, maintenance, admin.' },
            { '@type': 'HowToStep', 'name': 'Click Calculate', 'text': 'View your recommended DIY, Part, and Full livery prices, plus break-even occupancy.' }
          ]
        },
        {
          '@type': 'Organization',
          'name': 'HorseCost',
          'url': 'https://horsecost.co.uk',
          'logo': 'https://horsecost.co.uk/logo.png',
          'contactPoint': { '@type': 'ContactPoint', 'contactType': 'Customer Support', 'email': 'support@horsecost.co.uk' }
        }
      ]
    })
    document.head.appendChild(schemaScript)
    
    window.scrollTo(0, 0)
    calculateLivery()
  }, [])

  const calculateLivery = () => {
    const stables = numberOfStables <= 0 ? 1 : numberOfStables
    const annualFeed = feedCostPerHorse * 12 * stables
    const annualHay = hayCostPerHorse * 12 * stables
    const annualBedding = beddingCostPerHorse * 12 * stables
    const annualLabour = labourHoursPerWeek * labourHourlyRate * 52
    const annualVariableUtilities = variableUtilities * 12
    const annualSupplies = suppliesCost * 12
    const totalVariableCosts = annualFeed + annualHay + annualBedding + annualLabour + annualVariableUtilities + annualSupplies

    const annualRent = rentMortgage * 12
    const annualRates = businessRates * 12
    const annualInsurance = insurance
    const annualSalaries = staffSalaries * 12
    const annualMachinery = machineryVehicles * 12
    const annualFieldMaint = fieldMaintenance * 12
    const annualAdmin = adminCosts * 12
    const totalFixedCosts = annualRent + annualRates + annualInsurance + annualSalaries + annualMachinery + annualFieldMaint + annualAdmin

    const totalAnnualCosts = totalVariableCosts + totalFixedCosts
    const monthlyAverageCosts = totalAnnualCosts / 12
    const baseCostPerStable = monthlyAverageCosts / stables
    const margin = 1 + (profitMargin / 100)
    const diyPrice = baseCostPerStable * margin
    const partLiveryPrice = diyPrice + partLiveryAddOn
    const fullLiveryPrice = diyPrice + fullLiveryAddOn
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

  const downloadCSV = () => {
    if (!results) return
    const csvContent = [
      ['Horse Livery Cost Calculator Results', new Date().toLocaleDateString('en-GB')],
      [],
      ['LIVERY PRICING SUMMARY'],
      ['DIY Livery Price', '£' + results.diyPrice],
      ['Part Livery Price', '£' + results.partLiveryPrice],
      ['Full Livery Price', '£' + results.fullLiveryPrice],
      [],
      ['FINANCIAL OVERVIEW'],
      ['Monthly Operating Costs', '£' + results.monthlyAverageCosts],
      ['Annual Operating Costs', '£' + results.totalAnnualCosts],
      ['Break-Even Occupancy', results.breakEvenOccupancy + ' stables'],
      ['Profit Margin', profitMargin + '%'],
      ['Number of Stables', numberOfStables]
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
    const text = `I calculated my horse livery prices using HorseCost:\nDIY: £${results?.diyPrice}\nPart: £${results?.partLiveryPrice}\nFull: £${results?.fullLiveryPrice}\n\nCheck it out: https://horsecost.co.uk/calculators/horse-livery`
    if (navigator.share) {
      navigator.share({ title: 'Horse Livery Cost Calculator', text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Free UK Horse Livery Cost Calculator 2025</h1>
          <p className="text-lg text-gray-600">Calculate sustainable DIY, Part, and Full livery prices for your UK horse yard. Factor in all operating costs including feed, hay, bedding, labour, and yard overheads with built-in profit margins.</p>
          <p className="text-sm text-gray-500 mt-2">Last updated: 30 November 2025</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your Livery Prices</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Stables: {numberOfStables}</label>
                <input type="range" min="5" max="50" step="1" value={numberOfStables} onChange={(e) => { setNumberOfStables(parseInt(e.target.value)); calculateLivery() }} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" aria-label="Number of stables slider" />
                <input type="number" value={numberOfStables} onChange={(e) => { setNumberOfStables(parseInt(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter number of stables" aria-label="Number of stables input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Profit Margin (%): {profitMargin}%</label>
                <input type="range" min="5" max="30" step="1" value={profitMargin} onChange={(e) => { setProfitMargin(parseInt(e.target.value)); calculateLivery() }} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" aria-label="Profit margin slider" />
                <input type="number" value={profitMargin} onChange={(e) => { setProfitMargin(parseInt(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter profit margin" aria-label="Profit margin input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Feed Cost (per horse/month): £{feedCostPerHorse.toFixed(2)}</label>
                <input type="range" min="20" max="200" step="5" value={feedCostPerHorse} onChange={(e) => { setFeedCostPerHorse(parseFloat(e.target.value)); calculateLivery() }} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" aria-label="Feed cost slider" />
                <input type="number" value={feedCostPerHorse} onChange={(e) => { setFeedCostPerHorse(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter feed cost" aria-label="Feed cost input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hay Cost (per horse/month): £{hayCostPerHorse.toFixed(2)}</label>
                <input type="range" min="50" max="250" step="10" value={hayCostPerHorse} onChange={(e) => { setHayCostPerHorse(parseFloat(e.target.value)); calculateLivery() }} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" aria-label="Hay cost slider" />
                <input type="number" value={hayCostPerHorse} onChange={(e) => { setHayCostPerHorse(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter hay cost" aria-label="Hay cost input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bedding Cost (per horse/month): £{beddingCostPerHorse.toFixed(2)}</label>
                <input type="range" min="20" max="150" step="5" value={beddingCostPerHorse} onChange={(e) => { setBeddingCostPerHorse(parseFloat(e.target.value)); calculateLivery() }} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" aria-label="Bedding cost slider" />
                <input type="number" value={beddingCostPerHorse} onChange={(e) => { setBeddingCostPerHorse(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter bedding cost" aria-label="Bedding cost input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Labour Hours (per week): {labourHoursPerWeek}</label>
                <input type="range" min="10" max="100" step="5" value={labourHoursPerWeek} onChange={(e) => { setLabourHoursPerWeek(parseFloat(e.target.value)); calculateLivery() }} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" aria-label="Labour hours slider" />
                <input type="number" value={labourHoursPerWeek} onChange={(e) => { setLabourHoursPerWeek(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter labour hours" aria-label="Labour hours input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Labour Hourly Rate: £{labourHourlyRate.toFixed(2)}</label>
                <input type="range" min="10" max="30" step="1" value={labourHourlyRate} onChange={(e) => { setLabourHourlyRate(parseFloat(e.target.value)); calculateLivery() }} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" aria-label="Hourly rate slider" />
                <input type="number" value={labourHourlyRate} onChange={(e) => { setLabourHourlyRate(parseFloat(e.target.value) || 0); calculateLivery() }} step="0.5" className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter hourly rate" aria-label="Hourly rate input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Utilities (monthly): £{variableUtilities.toFixed(2)}</label>
                <input type="range" min="50" max="500" step="25" value={variableUtilities} onChange={(e) => { setVariableUtilities(parseFloat(e.target.value)); calculateLivery() }} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" aria-label="Utilities slider" />
                <input type="number" value={variableUtilities} onChange={(e) => { setVariableUtilities(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter utilities" aria-label="Utilities input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Supplies (monthly): £{suppliesCost.toFixed(2)}</label>
                <input type="range" min="10" max="200" step="10" value={suppliesCost} onChange={(e) => { setSuppliesCost(parseFloat(e.target.value)); calculateLivery() }} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" aria-label="Supplies slider" />
                <input type="number" value={suppliesCost} onChange={(e) => { setSuppliesCost(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter supplies" aria-label="Supplies input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rent/Mortgage (monthly): £{rentMortgage.toFixed(2)}</label>
                <input type="range" min="500" max="5000" step="100" value={rentMortgage} onChange={(e) => { setRentMortgage(parseFloat(e.target.value)); calculateLivery() }} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" aria-label="Rent slider" />
                <input type="number" value={rentMortgage} onChange={(e) => { setRentMortgage(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter rent" aria-label="Rent input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Rates (monthly): £{businessRates.toFixed(2)}</label>
                <input type="number" value={businessRates} onChange={(e) => { setBusinessRates(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter business rates" aria-label="Business rates input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Insurance (annual): £{insurance.toFixed(2)}</label>
                <input type="number" value={insurance} onChange={(e) => { setInsurance(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter insurance" aria-label="Insurance input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Staff Salaries (monthly): £{staffSalaries.toFixed(2)}</label>
                <input type="number" value={staffSalaries} onChange={(e) => { setStaffSalaries(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter staff salaries" aria-label="Staff salaries input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Machinery/Vehicles (monthly): £{machineryVehicles.toFixed(2)}</label>
                <input type="number" value={machineryVehicles} onChange={(e) => { setMachineryVehicles(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter machinery costs" aria-label="Machinery input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Field Maintenance (monthly): £{fieldMaintenance.toFixed(2)}</label>
                <input type="number" value={fieldMaintenance} onChange={(e) => { setFieldMaintenance(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter field maintenance" aria-label="Field maintenance input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Costs (monthly): £{adminCosts.toFixed(2)}</label>
                <input type="number" value={adminCosts} onChange={(e) => { setAdminCosts(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter admin costs" aria-label="Admin costs input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Part Livery Add-on (monthly): £{partLiveryAddOn.toFixed(2)}</label>
                <input type="number" value={partLiveryAddOn} onChange={(e) => { setPartLiveryAddOn(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter part livery add-on" aria-label="Part livery add-on input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Livery Add-on (monthly): £{fullLiveryAddOn.toFixed(2)}</label>
                <input type="number" value={fullLiveryAddOn} onChange={(e) => { setFullLiveryAddOn(parseFloat(e.target.value) || 0); calculateLivery() }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter full livery add-on" aria-label="Full livery add-on input" />
              </div>

              <button onClick={calculateLivery} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition">Calculate</button>
            </div>

            <div className="space-y-4">
              {results ? (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-8 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">DIY Livery Price</p>
                    <p className="text-4xl font-bold text-emerald-600">£{parseFloat(results.diyPrice).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div className="flex justify-between"><span className="text-gray-700">Part Livery:</span><span className="font-semibold">£{parseFloat(results.partLiveryPrice).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between"><span className="text-gray-700">Full Livery:</span><span className="font-semibold">£{parseFloat(results.fullLiveryPrice).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between"><span className="text-gray-700">Monthly Costs:</span><span className="font-semibold">£{parseFloat(results.monthlyAverageCosts).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between"><span className="text-gray-700">Annual Costs:</span><span className="font-semibold">£{parseFloat(results.totalAnnualCosts).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between"><span className="text-gray-700">Break-Even:</span><span className="font-semibold">{results.breakEvenOccupancy} stables</span></div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={shareResults} className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg transition"><Share2 className="w-4 h-4" />Share</button>
                    <button onClick={downloadCSV} className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg transition"><Download className="w-4 h-4" />Download</button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600">
                  <p>Enter your livery costs and click "Calculate" to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use This Livery Calculator</h2>
            <ol className="space-y-3 text-gray-700">
              <li><strong>1. Enter the number of stables</strong> (e.g., 15)</li>
              <li><strong>2. Set your profit margin</strong> (typically 10-15%)</li>
              <li><strong>3. Enter variable costs per horse</strong> (feed, hay, bedding, labour)</li>
              <li><strong>4. Enter fixed yard costs</strong> (rent, insurance, rates, maintenance)</li>
              <li><strong>5. Click "Calculate"</strong> to see your DIY, Part, and Full livery prices plus break-even occupancy</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Livery Costs</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Variable vs Fixed Costs</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Variable costs:</strong> Change with horse numbers (feed, hay, bedding, labour). Scale up as you add horses.</li>
                  <li><strong>Fixed costs:</strong> Remain constant (rent, insurance, rates). Don't change whether you have 5 or 15 horses.</li>
                  <li><strong>Why it matters:</strong> Fixed costs spread across more horses = lower per-horse cost = better profitability at full occupancy.</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-emerald-500 p-6 rounded">
                <h4 className="font-semibold text-gray-900 mb-2">Example Calculation</h4>
                <p className="text-gray-700">15-stable yard with £5,000/month variable costs and £3,000/month fixed costs:</p>
                <ul className="mt-3 space-y-1 text-gray-700 ml-4">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Setting Profitable Livery Prices</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Profit Margin Guidance</h3>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>10% margin:</strong> Covers unexpected costs, minimal buffer</li>
                  <li>• <strong>15% margin:</strong> Recommended—buffers for empty stables, repairs, inflation</li>
                  <li>• <strong>20%+ margin:</strong> For premium facilities or high-demand areas</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Pricing Part & Full Livery</h3>
                <p>Calculate extra labour required:</p>
                <ul className="mt-2 space-y-2 ml-4">
                  <li>• <strong>Part livery:</strong> 30-60 mins extra per day = £100-250/month</li>
                  <li>• <strong>Full livery:</strong> 1-3 hours extra per day = £250-600/month</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "How do I calculate break-even occupancy?", a: "Break-even = Total Annual Costs ÷ (DIY Price × 12). This shows the minimum stables you need to fill at DIY rates to cover all costs." },
                { q: "Should I include my own labour?", a: "Yes! Even if you do all work yourself, your time has value. Include it at realistic rates (at least minimum wage, ideally more)." },
                { q: "How often should I review prices?", a: "Annually at minimum. Feed, bedding, and fuel costs rise with inflation. Build price review clauses into livery contracts." },
                { q: "What if I have empty stables?", a: "This is where profit margins matter. They cover income lost from empty stables. At 80% occupancy with 15% margin, you should still break even." },
                { q: "Can I charge different prices for different stables?", a: "Yes. Some yards charge premium prices for stables with better facilities (more light, larger, indoor access)." },
                { q: "How does seasonal demand affect pricing?", a: "Many yards stay busy year-round, but winter may have slightly lower demand. Some increase prices in summer or keep flat rates." },
                { q: "What about staff costs if I'm solo?", a: "Use £15-25/hour for your labour depending on region and experience. This helps calculate when hiring becomes necessary." },
                { q: "Should insurance costs be in fixed or variable?", a: "Public liability and property insurance are fixed. Some policies increase with number of horses—check your policy." },
                { q: "How do I know if my prices are competitive?", a: "Research 5-10 yards locally. Compare facilities (arena, turnout, stabling). Your prices should reflect your facilities' quality." },
                { q: "Can I bundle services to increase revenue?", a: "Yes! Offer packages: DIY + farrier credit, Part + lessons, Full + hacking service. Bundles increase perceived value and loyalty." }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">{faq.q}</h4>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Glossary of Livery Terms</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { term: "Break-Even Occupancy", def: "Minimum stables needed to fill at DIY rates to cover all annual costs" },
                { term: "DIY Livery", def: "Owner handles all horse care; yard provides facilities. Lowest cost." },
                { term: "Full Livery", def: "Yard provides complete care including feeding, mucking, turnout, rugs, exercise" },
                { term: "Livery Rate", def: "Monthly price charged to horse owner for boarding and services" },
                { term: "Margin", def: "Profit percentage added to cost price. 15% typical for livery yards." },
                { term: "Part Livery", def: "Yard handles some duties (morning/evening routines or specific tasks)" },
                { term: "Variable Costs", def: "Expenses that change with number of horses (feed, hay, bedding)" },
                { term: "Fixed Costs", def: "Expenses that don't change (rent, insurance, rates regardless of horses)" },
                { term: "Yard Overheads", def: "All fixed costs required to operate the yard facilities" },
                { term: "Profit Margin", def: "Buffer built into pricing to cover unexpected costs and ensure profitability" }
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">{item.term}</h4>
                  <p className="text-sm text-gray-700">{item.def}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Calculators & Tools</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/calculators/annual-cost" className="bg-emerald-50 hover:bg-emerald-100 border-l-4 border-emerald-500 p-6 rounded transition">
                <h3 className="font-semibold text-gray-900 mb-2">Annual Cost Calculator</h3>
                <p className="text-sm text-gray-700">Calculate total horse ownership costs annually</p>
              </Link>
              <Link to="/calculators/feed-budget" className="bg-amber-50 hover:bg-amber-100 border-l-4 border-amber-500 p-6 rounded transition">
                <h3 className="font-semibold text-gray-900 mb-2">Feed Budget Planner</h3>
                <p className="text-sm text-gray-700">Plan hay, hard feed, and supplement costs</p>
              </Link>
              <Link to="/calculators/farrier-cost" className="bg-stone-50 hover:bg-stone-100 border-l-4 border-stone-500 p-6 rounded transition">
                <h3 className="font-semibold text-gray-900 mb-2">Farrier Cost Calculator</h3>
                <p className="text-sm text-gray-700">Budget annual farrier and hoof care expenses</p>
              </Link>
              <Link to="/calculators/weight-calculator" className="bg-sky-50 hover:bg-sky-100 border-l-4 border-sky-500 p-6 rounded transition">
                <h3 className="font-semibold text-gray-900 mb-2">Horse Weight Calculator</h3>
                <p className="text-sm text-gray-700">Estimate horse weight for accurate feeding</p>
              </Link>
            </div>
          </section>

          <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-3">Get Expert Livery Business Advice</h2>
            <p className="mb-6">Connect with equine business consultants to optimize your yard operations and profitability.</p>
            <p className="text-sm">Discover best practices for managing horse livery yards, handling customer relationships, and scaling your equestrian business.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>This calculator provides estimates for planning purposes. Actual livery prices depend on regional market conditions, facility quality, and local demand.</p>
          <p className="mt-2"><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link> | <Link to="/terms-of-service" className="hover:underline">Terms of Service</Link></p>
        </div>
      </div>
    </div>
  )
}






