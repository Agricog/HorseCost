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

    const canonicalLink = document.querySelector('link[rel="canonical"]')
    if (canonicalLink) {
      canonicalLink.setAttribute('href', 'https://horsecost.co.uk/calculators/horse-livery')
    }

    const schemaScript = document.createElement('script')
    schemaScript.type = 'application/ld+json'
    schemaScript.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Free UK Horse Livery Cost Calculator 2025',
      'description': 'Calculate sustainable DIY, Part, and Full livery prices for UK horse yards.',
      'applicationCategory': 'BusinessApplication',
      'url': 'https://horsecost.co.uk/calculators/horse-livery',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' }
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
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-900 mb-3">Free UK Horse Livery Cost Calculator 2025</h1>
          <p className="text-lg text-emerald-700">Calculate sustainable DIY, Part, and Full livery prices for your UK horse yard. Factor in all operating costs and set profitable rates with built-in margins.</p>
          <p className="text-sm text-emerald-500 mt-2">Last updated: 30 November 2025</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-emerald-100">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">Calculate Your Livery Prices</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Number of Stables: {numberOfStables}</label>
                <input type="range" min="5" max="50" step="1" value={numberOfStables} onChange={(e) => { setNumberOfStables(parseInt(e.target.value)); calculateLivery() }} className="w-full h-2 bg-emerald-300 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                <input type="number" value={numberOfStables} onChange={(e) => { setNumberOfStables(parseInt(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">Profit Margin (%): {profitMargin}%</label>
                <input type="range" min="5" max="30" step="1" value={profitMargin} onChange={(e) => { setProfitMargin(parseInt(e.target.value)); calculateLivery() }} className="w-full h-2 bg-emerald-300 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                <input type="number" value={profitMargin} onChange={(e) => { setProfitMargin(parseInt(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
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
      </div>
    </div>
  )
}



