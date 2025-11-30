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
    if (twitterTitle) twitterTitle.setAttribute('content', 'Free Horse Livery Cost Calculator 2025')

    const twitterDesc = document.querySelector('meta[name="twitter:description"]')
    if (twitterDesc) twitterDesc.setAttribute('content', 'Calculate profitable livery pricing for your UK yard. Instant results for DIY, Part, and Full livery.')

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
          'description': 'Calculate sustainable DIY, Part, and Full livery prices for UK horse yards. Factor in all operating costs including feed, labour, utilities, insurance, and yard overheads.',
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
  }

  const formatCurrency = (value: string): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(value))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Free UK Horse Livery Cost Calculator 2025</h1>
          <p className="text-lg text-gray-600">Calculate sustainable DIY, Part, and Full livery prices for your UK horse yard. Factor in all operating costs and set profitable rates with built-in margins.</p>
          <p className="text-sm text-gray-500 mt-2">Last updated: 30 November 2025</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your Livery Prices</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Stables: {numberOfStables}</label>
                <input type="range" min="5" max="50" step="1" value={numberOfStables} onChange={(e) => { setNumberOfStables(parseInt(e.target.value)); calculateLivery() }} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" />
                <input type="number" value={numberOfStables} onChange={(e) => { setNumberOfStables(parseInt(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Profit Margin (%): {profitMargin}%</label>
                <input type="range" min="5" max="30" step="1" value={profitMargin} onChange={(e) => { setProfitMargin(parseInt(e.target.value)); calculateLivery() }} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" />
                <input type="number" value={profitMargin} onChange={(e) => { setProfitMargin(parseInt(e.target.value) || 0); calculateLivery() }} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Variable Costs (Per Horse/Month)</h3>
                <input type="number" value={feedCostPerHorse} onChange={(e) => { setFeedCostPerHorse(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Feed cost" className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="number" value={hayCostPerHorse} onChange={(e) => { setHayCostPerHorse(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Hay cost" className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="number" value={beddingCostPerHorse} onChange={(e) => { setBeddingCostPerHorse(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Bedding cost" className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="number" value={labourHoursPerWeek} onChange={(e) => { setLabourHoursPerWeek(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Labour hours/week" className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="number" value={labourHourlyRate} onChange={(e) => { setLabourHourlyRate(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Hourly rate" className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="number" value={variableUtilities} onChange={(e) => { setVariableUtilities(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Utilities/month" className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="number" value={suppliesCost} onChange={(e) => { setSuppliesCost(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Supplies/month" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Fixed Costs (Monthly/Annual)</h3>
                <input type="number" value={rentMortgage} onChange={(e) => { setRentMortgage(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Rent/Mortgage" className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="number" value={businessRates} onChange={(e) => { setBusinessRates(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Business Rates" className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="number" value={insurance} onChange={(e) => { setInsurance(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Insurance (annual)" className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="number" value={staffSalaries} onChange={(e) => { setStaffSalaries(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Staff Salaries" className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="number" value={machineryVehicles} onChange={(e) => { setMachineryVehicles(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Machinery/Vehicles" className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="number" value={fieldMaintenance} onChange={(e) => { setFieldMaintenance(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Field Maintenance" className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="number" value={adminCosts} onChange={(e) => { setAdminCosts(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Admin & Other" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Livery Add-ons (Monthly)</h3>
                <input type="number" value={partLiveryAddOn} onChange={(e) => { setPartLiveryAddOn(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Part Livery add-on" className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-lg" />
                <input type="number" value={fullLiveryAddOn} onChange={(e) => { setFullLiveryAddOn(parseFloat(e.target.value) || 0); calculateLivery() }} placeholder="Full Livery add-on" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>

              <button onClick={calculateLivery} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition">Calculate Prices</button>
            </div>

            <div className="space-y-4">
              {results ? (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-8 space-y-6">
                  <div>
                    <p className="text-sm text-gray-600">DIY Livery Price</p>
                    <p className="text-4xl font-bold text-emerald-600">{formatCurrency(results.diyPrice)}</p>
                    <p className="text-xs text-gray-500 mt-1">per month</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div className="flex justify-between"><span className="text-gray-700">Part Livery:</span><span className="font-semibold text-emerald-700">{formatCurrency(results.partLiveryPrice)}/mo</span></div>
                    <div className="flex justify-between"><span className="text-gray-700">Full Livery:</span><span className="font-semibold text-emerald-700">{formatCurrency(results.fullLiveryPrice)}/mo</span></div>
                    <div className="border-t pt-3 flex justify-between"><span className="text-gray-700 font-medium">Monthly Costs:</span><span className="font-semibold">{formatCurrency(results.monthlyAverageCosts)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-700">Annual Costs:</span><span className="font-semibold">{formatCurrency(results.totalAnnualCosts)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-700">Break-Even:</span><span className="font-semibold">{results.breakEvenOccupancy} stables</span></div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg transition"><Share2 className="w-4 h-4" />Share</button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg transition"><Download className="w-4 h-4" />Download</button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600">
                  <p>Enter your costs above and click Calculate to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use This Livery Calculator</h2>
            <ol className="space-y-3 text-gray-700">
              <li><strong>1. Enter yard details</strong> (number of stables and profit margin target)</li>
              <li><strong>2. Input variable costs</strong> (feed, hay, bedding, labour, utilities per horse per month)</li>
              <li><strong>3. Enter fixed costs</strong> (rent, insurance, rates, maintenance—monthly or annual)</li>
              <li><strong>4. Set service add-ons</strong> (extra charges for Part and Full livery)</li>
              <li><strong>5. Click Calculate</strong> to see DIY, Part, and Full livery prices plus break-even occupancy</li>
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

              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded">
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

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Types of Livery</h3>
                <ul className="space-y-3 text-gray-700">
                  <li><strong>DIY (Do-It-Yourself):</strong> Owner handles all care. Yard provides stable, grazing, facilities. Lowest cost.</li>
                  <li><strong>Part Livery:</strong> Yard handles morning/evening routines or specific tasks. Shared responsibility. Mid-range pricing.</li>
                  <li><strong>Full Livery:</strong> Yard handles all daily care (feed, mucking, turnout, rugs, exercise). Owner just rides. Premium price.</li>
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
                  <li>• <strong>Formula:</strong> (Extra hours × £ per hour × days worked) + small margin</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Market Research Tips</h3>
                <ul className="space-y-2 ml-4">
                  <li>• Check competitor pricing in your region (varies by location)</li>
                  <li>• South East England: Higher prices (£400-700+ DIY)</li>
                  <li>• North & rural areas: Lower prices (£250-450 DIY)</li>
                  <li>• Your costs set minimum price; market sets maximum</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Costs Often Forgotten</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Arena surface maintenance & top-ups',
                'Muck heap management or removal',
                'Fencing repairs (horses break fences!)',
                'Water trough cleaning & plumbing',
                'Yard lighting & security systems',
                'Professional memberships (BHS, EEA)',
                'Accountancy & bookkeeping fees',
                'Marketing & website costs',
                'Tractor/machinery maintenance & fuel',
                'Veterinary facilities & equipment',
                'Fire safety & insurance compliance',
                'Staff training & uniforms'
              ].map((cost, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">• {cost}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "How do I calculate break-even occupancy?", a: "Break-even = Total Annual Costs ÷ (DIY Price × 12 months). This shows the minimum stables you need to fill at DIY rates to cover all costs. Example: £96,000 costs ÷ (£600 × 12) = 13.3 stables out of 15 = 89% occupancy needed." },
                { q: "Should I include my own labour?", a: "Yes! Even if you do all work yourself, your time has value. Include it at realistic rates (at least minimum wage, ideally more). This ensures if you hire staff later, you can afford to pay them competitively." },
                { q: "How often should I review prices?", a: "Annually at minimum. Feed, bedding, and fuel costs rise with inflation. Build price review clauses into livery contracts so you can adjust when costs increase." },
                { q: "What if I have empty stables?", a: "This is where profit margins matter. They cover income lost from empty stables. At 80% occupancy with 15% margin, you should still break even or profit slightly." },
                { q: "Can I charge different prices for different stables?", a: "Yes. Some yards charge premium prices for stables with better facilities (more light, larger, indoor access). Justify higher prices with tangible benefits." },
                { q: "How does seasonal demand affect pricing?", a: "Many yards stay busy year-round, but winter may have slightly lower demand. Some increase prices in summer (show season) or keep flat rates year-round." },
                { q: "What about staff costs if I'm solo?", a: "Use £15-25/hour for your labour depending on region and experience. This helps calculate when hiring becomes necessary and ensures pricing supports staff employment." },
                { q: "Should insurance costs be in fixed or variable?", a: "Public liability and property insurance are fixed (same cost regardless of horses). Some policies increase with number of horses—check your policy." },
                { q: "How do I know if my prices are competitive?", a: "Research 5-10 yards locally. Compare facilities (arena, turnout, stabling). Your prices should reflect your facilities' quality. Premium facilities justify premium pricing." },
                { q: "Can I bundle services to increase revenue?", a: "Yes! Offer packages: DIY + farrier credit, Part + lessons, Full + hacking service. Bundles increase perceived value and customer loyalty." }
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
                { term: "LTV Ratio", def: "Load-to-Value for yard operations (cost per available space)" },
                { term: "Margin", def: "Profit percentage added to cost price. 15% typical for livery yards." },
                { term: "Part Livery", def: "Yard handles some duties (morning/evening routines or specific tasks)" },
                { term: "Revenue Projection", def: "Estimated annual income if all stables occupied at Full livery rates" },
                { term: "Variable Costs", def: "Expenses that change with number of horses (feed, hay, bedding)" },
                { term: "Fixed Costs", def: "Expenses that don't change (rent, insurance, rates regardless of horses)" },
                { term: "Yard Overheads", def: "All fixed costs required to operate the yard facilities" }
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
              <Link to="/calculators/annual-cost" className="bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500 p-6 rounded transition">
                <h3 className="font-semibold text-gray-900 mb-2">Annual Cost Calculator</h3>
                <p className="text-sm text-gray-700">Calculate total horse ownership costs annually</p>
              </Link>
              <Link to="/calculators/feed-budget" className="bg-green-50 hover:bg-green-100 border-l-4 border-green-500 p-6 rounded transition">
                <h3 className="font-semibold text-gray-900 mb-2">Feed Budget Planner</h3>
                <p className="text-sm text-gray-700">Plan hay, hard feed, and supplement costs</p>
              </Link>
              <Link to="/calculators/farrier-cost" className="bg-purple-50 hover:bg-purple-100 border-l-4 border-purple-500 p-6 rounded transition">
                <h3 className="font-semibold text-gray-900 mb-2">Farrier Cost Calculator</h3>
                <p className="text-sm text-gray-700">Budget annual farrier and hoof care expenses</p>
              </Link>
              <Link to="/calculators/weight-calculator" className="bg-orange-50 hover:bg-orange-100 border-l-4 border-orange-500 p-6 rounded transition">
                <h3 className="font-semibold text-gray-900 mb-2">Horse Weight Calculator</h3>
                <p className="text-sm text-gray-700">Estimate horse weight for accurate feeding</p>
              </Link>
            </div>
          </section>

          <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-3">Get Expert Livery Business Advice</h2>
            <p className="mb-6">Connect with equine business consultants to optimize your yard operations and profitability.</p>
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

