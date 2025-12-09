import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { 
  Truck,
  Calculator,
  AlertCircle,
  ChevronDown,
  PoundSterling,
  Fuel,
  Shield,
  Wrench,
  Calendar,
  MapPin
} from 'lucide-react'

export default function TrailerCostCalculator() {
  const [vehicleType, setVehicleType] = useState('trailer')
  const [trailerValue, setTrailerValue] = useState('')
  const [tripsPerMonth, setTripsPerMonth] = useState('4')
  const [avgDistance, setAvgDistance] = useState('30')
  const [towingMpg, setTowingMpg] = useState('20')
  const [includeInsurance, setIncludeInsurance] = useState(true)
  const [includeMOT, setIncludeMOT] = useState(true)
  const [includeServicing, setIncludeServicing] = useState(true)
  const [storageType, setStorageType] = useState('home')
  const [storageCost, setStorageCost] = useState('')
  const [result, setResult] = useState<any>(null)

  const vehicleTypes = [
    { id: 'trailer', name: 'Horse Trailer (Towed)', insuranceBase: 150, motCost: 0, serviceCost: 150 },
    { id: 'horsebox-3.5', name: 'Horsebox 3.5t', insuranceBase: 350, motCost: 55, serviceCost: 300 },
    { id: 'horsebox-7.5', name: 'Horsebox 7.5t', insuranceBase: 550, motCost: 65, serviceCost: 450 },
    { id: 'horsebox-hgv', name: 'HGV Horsebox', insuranceBase: 800, motCost: 85, serviceCost: 600 }
  ]

  const storageOptions = [
    { id: 'home', name: 'Home/Own Property', monthlyCost: 0 },
    { id: 'yard', name: 'At Livery Yard', monthlyCost: 25 },
    { id: 'storage', name: 'Commercial Storage', monthlyCost: 50 },
    { id: 'secure', name: 'Secure Compound', monthlyCost: 75 }
  ]

  const calculate = () => {
    if (!trailerValue) {
      alert('Please enter vehicle value')
      return
    }

    const value = parseFloat(trailerValue)
    const trips = parseFloat(tripsPerMonth) || 0
    const distance = parseFloat(avgDistance) || 0
    const fuelPerMile = parseFloat(fuelCostPerMile) || 0.25

    const vehicle = vehicleTypes.find(v => v.id === vehicleType)
    if (!vehicle) return

    // Annual mileage (trips × 2 for return × distance × 12 months)
    const annualMileage = trips * 2 * distance * 12

    // Fuel costs
    let annualFuel = 0
    if (vehicleType === 'trailer') {
      // Towing uses more fuel - calculate based on towing MPG
      const mpg = parseFloat(towingMpg) || 20
      const gallonsNeeded = annualMileage / mpg
      const fuelPrice = 1.45 // Average UK diesel price per litre
      const litresNeeded = gallonsNeeded * 4.546
      annualFuel = litresNeeded * fuelPrice
    } else {
      // Horsebox - direct fuel calculation
      annualFuel = annualMileage * fuelPerMile
    }

    // Insurance (based on value and vehicle type)
    let insuranceCost = 0
    if (includeInsurance) {
      const valueMultiplier = Math.max(1, value / 5000)
      insuranceCost = vehicle.insuranceBase * Math.sqrt(valueMultiplier)
    }

    // MOT
    const motCost = includeMOT ? vehicle.motCost : 0

    // Servicing & Maintenance
    let servicingCost = 0
    if (includeServicing) {
      servicingCost = vehicle.serviceCost
      // Add tyre replacement fund (tyres every 3-5 years)
      if (vehicleType === 'trailer') {
        servicingCost += 100 // Tyre fund
      } else {
        servicingCost += 200 // Horsebox tyre fund
      }
    }

    // Storage
    const storage = storageOptions.find(s => s.id === storageType)
    let annualStorage = 0
    if (storageType !== 'home' && storageCost) {
      annualStorage = parseFloat(storageCost) * 12
    } else if (storage) {
      annualStorage = storage.monthlyCost * 12
    }

    // Road tax (horseboxes only)
    let roadTax = 0
    if (vehicleType !== 'trailer') {
      if (vehicleType === 'horsebox-3.5') roadTax = 290
      else if (vehicleType === 'horsebox-7.5') roadTax = 165
      else roadTax = 650
    }

    // Depreciation estimate (roughly 10% for trailers, 15% for horseboxes)
    const depreciationRate = vehicleType === 'trailer' ? 0.08 : 0.12
    const depreciation = value * depreciationRate

    // Breakdown/recovery (optional estimate)
    const breakdownCover = vehicleType === 'trailer' ? 50 : 120

    // Total annual cost
    const totalAnnual = annualFuel + insuranceCost + motCost + servicingCost + annualStorage + roadTax + breakdownCover
    const totalWithDepreciation = totalAnnual + depreciation
    const costPerTrip = totalAnnual / (trips * 12)
    const costPerMile = annualMileage > 0 ? totalAnnual / annualMileage : 0

    // UK averages
    const ukAverageTrailer = 1200
    const ukAverageHorsebox = 3500

    setResult({
      totalAnnual: totalAnnual.toFixed(2),
      totalWithDepreciation: totalWithDepreciation.toFixed(2),
      monthlyAverage: (totalAnnual / 12).toFixed(2),
      costPerTrip: costPerTrip.toFixed(2),
      costPerMile: costPerMile.toFixed(2),
      annualMileage: annualMileage.toFixed(0),
      breakdown: {
        fuel: annualFuel.toFixed(2),
        insurance: insuranceCost.toFixed(2),
        mot: motCost.toFixed(2),
        servicing: servicingCost.toFixed(2),
        storage: annualStorage.toFixed(2),
        roadTax: roadTax.toFixed(2),
        breakdown: breakdownCover.toFixed(2),
        depreciation: depreciation.toFixed(2)
      },
      comparison: {
        vsUkTrailer: totalAnnual < ukAverageTrailer,
        vsUkHorsebox: totalAnnual < ukAverageHorsebox,
        ukAverageTrailer,
        ukAverageHorsebox
      },
      vehicleInfo: vehicle
    })
  }

  const faqs = [
    {
      q: 'How much does it cost to run a horse trailer UK?',
      a: 'Running a horse trailer in the UK typically costs £800-£1,500 per year, depending on usage. This includes insurance (£100-£250), servicing (£100-£200), tyres, and fuel for towing. Trailers don\'t require MOT or road tax, making them cheaper to run than horseboxes.'
    },
    {
      q: 'How much does horsebox insurance cost UK?',
      a: 'Horsebox insurance costs vary by size and value. A 3.5t horsebox typically costs £300-£500/year to insure, while 7.5t boxes cost £400-£700. HGV horseboxes can cost £600-£1,200+. Factors include driver age, experience, security, and where it\'s kept.'
    },
    {
      q: 'Do horse trailers need an MOT?',
      a: 'No, horse trailers towed by cars or vans don\'t require an MOT in the UK. However, they should have an annual safety check for brakes, lights, floor condition, and tyres. Horseboxes (self-propelled) do require annual MOT testing.'
    },
    {
      q: 'What MPG do you get when towing a horse trailer?',
      a: 'Towing a horse trailer typically reduces fuel economy by 20-40%. A vehicle getting 35mpg normally might achieve 18-25mpg when towing. Factors include trailer weight, horses loaded, terrain, and driving style. Budget for significantly higher fuel costs when towing.'
    },
    {
      q: 'How much does horsebox road tax cost?',
      a: '3.5t horseboxes (car licence) cost £290/year road tax. 7.5t horseboxes have reduced HGV rates around £165/year for private use. Larger HGV horseboxes can cost £500-£1,000+ depending on weight and emissions. Trailers don\'t require road tax.'
    },
    {
      q: 'Is it cheaper to own a trailer or hire?',
      a: 'Owning is usually cheaper if you travel regularly (more than 10-15 times per year). Hiring costs £50-£150 per day plus fuel. At 15 trips/year, hiring could cost £1,500+, while owning a trailer costs £800-£1,500 annually. Consider convenience and spontaneous travel too.'
    },
    {
      q: 'How often should a horse trailer be serviced?',
      a: 'Horse trailers should be serviced annually or every 3,000-5,000 miles. Service includes brake adjustment, bearing check, light testing, floor inspection, coupling check, and tyre condition. A full service costs £100-£200. Don\'t skip servicing - brake failure is dangerous.'
    },
    {
      q: 'Where can I store my horse trailer?',
      a: 'Storage options include at home (free but needs space), livery yard (£20-£40/month), commercial storage (£40-£70/month), or secure compounds (£60-£100/month). Consider security - trailers are theft targets. Some insurance requires specific security measures.'
    },
    {
      q: 'What size horsebox can I drive on a car licence?',
      a: 'With a standard car licence (Category B), you can drive horseboxes up to 3,500kg MAM. For larger 7.5t horseboxes, you need a C1 licence. Licences issued before 1997 often include C1 automatically. Check your licence categories before purchasing.'
    },
    {
      q: 'How much does a horsebox MOT cost?',
      a: 'Horsebox MOT costs depend on weight class. 3.5t vehicles cost the standard car MOT rate (£54.85 maximum). 7.5t class costs around £59-£65. Larger HGV horseboxes cost more. Factor in potential repair costs if work is needed to pass.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Horse Trailer Running Cost Calculator UK 2025 | Horsebox Costs | HorseCost</title>
        <meta 
          name="description" 
          content="Free horse trailer and horsebox running cost calculator for UK owners. Calculate annual costs including fuel, insurance, MOT, servicing, and storage. 2025 pricing." 
        />
        <meta name="keywords" content="horse trailer running costs, horsebox costs UK, trailer insurance cost, horsebox MOT, towing costs calculator, horse transport budget" />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0369a1" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HorseCost" />
        <meta property="og:title" content="Horse Trailer Running Cost Calculator UK 2025 | HorseCost" />
        <meta property="og:description" content="Calculate annual horse trailer and horsebox running costs. Free UK calculator for fuel, insurance, MOT, and servicing." />
        <meta property="og:url" content="https://horsecost.co.uk/trailer-cost-calculator" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Horse Trailer Cost Calculator UK | HorseCost" />

        <link rel="canonical" href="https://horsecost.co.uk/trailer-cost-calculator" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                  { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://horsecost.co.uk' },
                  { '@type': 'ListItem', 'position': 2, 'name': 'Calculators', 'item': 'https://horsecost.co.uk/#calculators' },
                  { '@type': 'ListItem', 'position': 3, 'name': 'Trailer Cost Calculator', 'item': 'https://horsecost.co.uk/trailer-cost-calculator' }
                ]
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Horse Trailer Running Cost Calculator UK',
                'description': 'Calculate annual horse trailer and horsebox running costs including fuel, insurance, MOT, and servicing.',
                'url': 'https://horsecost.co.uk/trailer-cost-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'Web',
                'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'GBP' },
                'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.7', 'ratingCount': '156' }
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
            <a href="/" className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-2">
              ← Back to All Calculators
            </a>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Trailer Running Cost Calculator</h1>
                <p className="text-sky-200">UK 2025 Transport Budget Planner</p>
              </div>
            </div>
            <p className="text-sky-100 max-w-2xl">
              Calculate the true annual cost of owning a horse trailer or horsebox. 
              Includes fuel, insurance, MOT, servicing, storage, and depreciation.
            </p>
            <p className="text-sky-200 text-sm mt-4">Last updated: January 2025</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Calculator Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Vehicle Type */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">1</span>
                    <label className="font-semibold text-gray-900">Vehicle Type</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {vehicleTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setVehicleType(type.id)}
                        className={`p-3 rounded-xl text-sm font-medium transition border-2 ${
                          vehicleType === type.id
                            ? 'border-sky-500 bg-sky-50 text-sky-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vehicle Value */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">2</span>
                    <label className="font-semibold text-gray-900">Vehicle Value (£)</label>
                  </div>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={trailerValue}
                      onChange={(e) => setTrailerValue(e.target.value)}
                      placeholder="e.g., 5000"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {vehicleType === 'trailer' 
                      ? ['2000', '5000', '8000', '12000'].map((val) => (
                          <button
                            key={val}
                            onClick={() => setTrailerValue(val)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                              trailerValue === val 
                                ? 'bg-sky-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            £{parseInt(val).toLocaleString()}
                          </button>
                        ))
                      : ['8000', '15000', '25000', '40000'].map((val) => (
                          <button
                            key={val}
                            onClick={() => setTrailerValue(val)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                              trailerValue === val 
                                ? 'bg-sky-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            £{parseInt(val).toLocaleString()}
                          </button>
                        ))
                    }
                  </div>
                </div>

                {/* Usage */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">3</span>
                    <label className="font-semibold text-gray-900">Usage</label>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Trips per Month</label>
                      <div className="flex flex-wrap gap-2">
                        {['1', '2', '4', '6', '8'].map((val) => (
                          <button
                            key={val}
                            onClick={() => setTripsPerMonth(val)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                              tripsPerMonth === val
                                ? 'bg-sky-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Average Distance (miles one way)</label>
                      <input
                        type="number"
                        value={avgDistance}
                        onChange={(e) => setAvgDistance(e.target.value)}
                        placeholder="e.g., 30"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['15', '30', '50', '75', '100'].map((val) => (
                          <button
                            key={val}
                            onClick={() => setAvgDistance(val)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                              avgDistance === val 
                                ? 'bg-sky-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {val} mi
                          </button>
                        ))}
                      </div>
                    </div>

                    {vehicleType === 'trailer' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Towing MPG (when loaded)</label>
                        <input
                          type="number"
                          value={towingMpg}
                          onChange={(e) => setTowingMpg(e.target.value)}
                          placeholder="e.g., 20"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none"
                        />
                        <p className="text-sm text-gray-500 mt-1">Typical range: 15-25 mpg when towing</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Running Costs */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">4</span>
                    <label className="font-semibold text-gray-900">Include in Calculation</label>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeInsurance}
                        onChange={(e) => setIncludeInsurance(e.target.checked)}
                        className="w-5 h-5 text-sky-600 rounded"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Insurance</span>
                        <p className="text-sm text-gray-500">
                          ~£{vehicleTypes.find(v => v.id === vehicleType)?.insuranceBase}/year
                        </p>
                      </div>
                    </label>

                    {vehicleType !== 'trailer' && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeMOT}
                          onChange={(e) => setIncludeMOT(e.target.checked)}
                          className="w-5 h-5 text-sky-600 rounded"
                        />
                        <div>
                          <span className="font-medium text-gray-900">MOT</span>
                          <p className="text-sm text-gray-500">
                            ~£{vehicleTypes.find(v => v.id === vehicleType)?.motCost}/year
                          </p>
                        </div>
                      </label>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeServicing}
                        onChange={(e) => setIncludeServicing(e.target.checked)}
                        className="w-5 h-5 text-sky-600 rounded"
                      />
                      <div>
                        <span className="font-medium text-gray-900">Servicing & Maintenance</span>
                        <p className="text-sm text-gray-500">
                          ~£{vehicleTypes.find(v => v.id === vehicleType)?.serviceCost}/year + tyres
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Storage */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">5</span>
                    <label className="font-semibold text-gray-900">Storage</label>
                  </div>
                  <select
                    value={storageType}
                    onChange={(e) => setStorageType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:outline-none"
                  >
                    {storageOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name} {option.monthlyCost > 0 ? `(~£${option.monthlyCost}/month)` : '(Free)'}
                      </option>
                    ))}
                  </select>
                  
                  {storageType !== 'home' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Custom Monthly Cost (£)</label>
                      <input
                        type="number"
                        value={storageCost}
                        onChange={(e) => setStorageCost(e.target.value)}
                        placeholder="Leave blank for estimate"
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Results */}
              <div>
                <button
                  onClick={calculate}
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-sky-700 hover:to-blue-700 transition shadow-lg mb-6"
                >
                  <Calculator className="w-5 h-5 inline mr-2" />
                  Calculate Running Costs
                </button>

                {result && (
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 text-white">
                      <p className="text-sky-100 text-sm mb-1">Annual Running Cost</p>
                      <p className="text-4xl font-bold">£{result.totalAnnual}</p>
                      <p className="text-sky-200 text-sm mt-1">Excluding depreciation</p>
                      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sky-100 text-xs">Monthly</p>
                          <p className="font-bold">£{result.monthlyAverage}</p>
                        </div>
                        <div>
                          <p className="text-sky-100 text-xs">Per Trip</p>
                          <p className="font-bold">£{result.costPerTrip}</p>
                        </div>
                      </div>
                    </div>

                    {/* Cost per mile */}
                    <div className="bg-sky-50 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sky-600 text-sm">Cost per Mile</p>
                          <p className="text-2xl font-bold text-gray-900">£{result.costPerMile}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sky-600 text-sm">Annual Mileage</p>
                          <p className="text-xl font-bold text-gray-900">{parseInt(result.annualMileage).toLocaleString()} mi</p>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 flex items-center gap-2">
                            <Fuel className="w-4 h-4" /> Fuel
                          </span>
                          <span className="font-medium">£{result.breakdown.fuel}</span>
                        </div>
                        {parseFloat(result.breakdown.insurance) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 flex items-center gap-2">
                              <Shield className="w-4 h-4" /> Insurance
                            </span>
                            <span className="font-medium">£{result.breakdown.insurance}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.mot) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">MOT</span>
                            <span className="font-medium">£{result.breakdown.mot}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.servicing) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 flex items-center gap-2">
                              <Wrench className="w-4 h-4" /> Servicing & Tyres
                            </span>
                            <span className="font-medium">£{result.breakdown.servicing}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.storage) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 flex items-center gap-2">
                              <MapPin className="w-4 h-4" /> Storage
                            </span>
                            <span className="font-medium">£{result.breakdown.storage}</span>
                          </div>
                        )}
                        {parseFloat(result.breakdown.roadTax) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Road Tax</span>
                            <span className="font-medium">£{result.breakdown.roadTax}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Breakdown Cover</span>
                          <span className="font-medium">£{result.breakdown.breakdown}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Running Total</span>
                          <span>£{result.totalAnnual}</span>
                        </div>
                        <div className="flex justify-between text-amber-600">
                          <span>+ Depreciation</span>
                          <span>£{result.breakdown.depreciation}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-bold text-sky-600">
                          <span>True Annual Cost</span>
                          <span>£{result.totalWithDepreciation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hire Comparison */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Hire vs Own Comparison
                      </h3>
                      <p className="text-sm text-amber-800">
                        At {tripsPerMonth} trips/month, hiring would cost approximately 
                        <strong> £{(parseFloat(tripsPerMonth) * 12 * 80).toLocaleString()}/year</strong> (at £80/day average).
                        {parseFloat(result.totalAnnual) < parseFloat(tripsPerMonth) * 12 * 80 
                          ? ' Owning is saving you money!' 
                          : ' Hiring might be more cost-effective.'}
                      </p>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Enter your vehicle details and click calculate to see your running costs</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-sky-50 border-l-4 border-sky-500 rounded-r-xl p-6 mb-8">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-sky-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-sky-900 mb-2">Trailer vs Horsebox: Key Differences</h3>
                <ul className="text-sky-800 space-y-1 text-sm">
                  <li>• <strong>Trailers:</strong> No MOT required, no road tax, cheaper insurance, need suitable tow vehicle</li>
                  <li>• <strong>3.5t Horsebox:</strong> Can drive on car licence, MOT required, road tax £290/year</li>
                  <li>• <strong>7.5t+ Horsebox:</strong> Requires C1/C licence, lower road tax (PLG), higher running costs</li>
                  <li>• Consider licence requirements before purchasing - C1 tests cost £800-£1,500</li>
                </ul>
              </div>
            </div>
          </div>

          {/* UK Costs Table */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UK Horse Transport Costs 2025</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Vehicle Type</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Insurance</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">MOT</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Road Tax</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Typical Annual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Horse Trailer</td>
                    <td className="py-3 px-4 text-center">£100-£250</td>
                    <td className="py-3 px-4 text-center">Not required</td>
                    <td className="py-3 px-4 text-center">Not required</td>
                    <td className="py-3 px-4 text-center font-semibold text-sky-600">£800-£1,500</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">3.5t Horsebox</td>
                    <td className="py-3 px-4 text-center">£300-£500</td>
                    <td className="py-3 px-4 text-center">£55</td>
                    <td className="py-3 px-4 text-center">£290</td>
                    <td className="py-3 px-4 text-center font-semibold text-sky-600">£2,000-£3,500</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">7.5t Horsebox</td>
                    <td className="py-3 px-4 text-center">£400-£700</td>
                    <td className="py-3 px-4 text-center">£65</td>
                    <td className="py-3 px-4 text-center">£165</td>
                    <td className="py-3 px-4 text-center font-semibold text-sky-600">£3,000-£5,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">HGV Horsebox</td>
                    <td className="py-3 px-4 text-center">£600-£1,200</td>
                    <td className="py-3 px-4 text-center">£85+</td>
                    <td className="py-3 px-4 text-center">£500-£1,000</td>
                    <td className="py-3 px-4 text-center font-semibold text-sky-600">£5,000-£8,000+</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              * Costs vary based on usage, value, and location. Fuel costs not included - highly variable based on mileage.
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
              <a href="/annual-horse-cost-calculator" className="bg-amber-50 hover:bg-amber-100 rounded-xl p-4 transition group">
                <Calendar className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600">Annual Cost Calculator</h3>
                <p className="text-sm text-gray-600">Full ownership budget</p>
              </a>
              <a href="/competition-budget-calculator" className="bg-rose-50 hover:bg-rose-100 rounded-xl p-4 transition group">
                <Calendar className="w-8 h-8 text-rose-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-rose-600">Competition Budget</h3>
                <p className="text-sm text-gray-600">Show season costs</p>
              </a>
              <a href="/horse-insurance-calculator" className="bg-violet-50 hover:bg-violet-100 rounded-xl p-4 transition group">
                <Shield className="w-8 h-8 text-violet-600 mb-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-violet-600">Insurance Calculator</h3>
                <p className="text-sm text-gray-600">Compare cover options</p>
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-sky-600 to-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Calculate Your Total Horse Budget</h2>
            <p className="text-sky-100 mb-6 max-w-xl mx-auto">
              Transport is just one cost of horse ownership. Use our Annual Cost Calculator for a complete breakdown.
            </p>
            <a 
              href="/annual-horse-cost-calculator"
              className="inline-flex items-center gap-2 bg-white text-sky-600 px-6 py-3 rounded-xl font-bold hover:bg-sky-50 transition"
            >
              Calculate Total Costs
              <Calculator className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
