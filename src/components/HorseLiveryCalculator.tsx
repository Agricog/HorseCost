import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Wheat, 
  Users, 
  Zap, 
  ShoppingBag,
  Building2,
  Shield,
  Wrench,
  Fence,
  FileText,
  Calculator,
  PoundSterling,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Info,
  HelpCircle
} from 'lucide-react';

interface CostBreakdown {
  totalVariableCosts: number;
  totalFixedCosts: number;
  totalAnnualCosts: number;
  monthlyAverageCosts: number;
  baseCostPerStable: number;
  diyPrice: number;
  partLiveryPrice: number;
  fullLiveryPrice: number;
  annualRevenueAtFull: number;
  breakEvenOccupancy: number;
}

export default function HorseLiveryCalculator() {
  // Variable Costs State
  const [feedCostPerHorse, setFeedCostPerHorse] = useState<string>('80');
  const [hayCostPerHorse, setHayCostPerHorse] = useState<string>('120');
  const [beddingCostPerHorse, setBeddingCostPerHorse] = useState<string>('60');
  const [labourHoursPerWeek, setLabourHoursPerWeek] = useState<string>('40');
  const [labourHourlyRate, setLabourHourlyRate] = useState<string>('15');
  const [variableUtilities, setVariableUtilities] = useState<string>('200');
  const [suppliesCost, setSuppliesCost] = useState<string>('50');

  // Fixed Costs State
  const [rentMortgage, setRentMortgage] = useState<string>('1500');
  const [businessRates, setBusinessRates] = useState<string>('200');
  const [insurance, setInsurance] = useState<string>('2500');
  const [staffSalaries, setStaffSalaries] = useState<string>('0');
  const [machineryVehicles, setMachineryVehicles] = useState<string>('300');
  const [fieldMaintenance, setFieldMaintenance] = useState<string>('250');
  const [adminCosts, setAdminCosts] = useState<string>('100');

  // Yard Details
  const [numberOfStables, setNumberOfStables] = useState<string>('15');
  const [profitMargin, setProfitMargin] = useState<string>('15');

  // Part/Full Livery Add-ons
  const [partLiveryAddOn, setPartLiveryAddOn] = useState<string>('150');
  const [fullLiveryAddOn, setFullLiveryAddOn] = useState<string>('350');

  // Results
  const [results, setResults] = useState<CostBreakdown | null>(null);
  const [showVariableCosts, setShowVariableCosts] = useState(true);
  const [showFixedCosts, setShowFixedCosts] = useState(true);
  const [showPricing, setShowPricing] = useState(true);

  const parseNumber = (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateCosts = () => {
    const stables = parseNumber(numberOfStables);
    if (stables <= 0) {
      alert('Please enter the number of stables/spaces');
      return;
    }

    // Calculate Variable Costs (annual, per horse)
    const annualFeed = parseNumber(feedCostPerHorse) * 12;
    const annualHay = parseNumber(hayCostPerHorse) * 12;
    const annualBedding = parseNumber(beddingCostPerHorse) * 12;
    const annualLabour = parseNumber(labourHoursPerWeek) * parseNumber(labourHourlyRate) * 52;
    const annualVariableUtilities = parseNumber(variableUtilities) * 12;
    const annualSupplies = parseNumber(suppliesCost) * 12;

    const totalVariableCostsPerHorse = annualFeed + annualHay + annualBedding + annualSupplies;
    const totalVariableCostsYard = (totalVariableCostsPerHorse * stables) + annualLabour + annualVariableUtilities;

    // Calculate Fixed Costs (annual)
    const annualRent = parseNumber(rentMortgage) * 12;
    const annualRates = parseNumber(businessRates) * 12;
    const annualInsurance = parseNumber(insurance);
    const annualSalaries = parseNumber(staffSalaries) * 12;
    const annualMachinery = parseNumber(machineryVehicles) * 12;
    const annualFieldMaint = parseNumber(fieldMaintenance) * 12;
    const annualAdmin = parseNumber(adminCosts) * 12;

    const totalFixedCosts = annualRent + annualRates + annualInsurance + annualSalaries + annualMachinery + annualFieldMaint + annualAdmin;

    // Total Annual Operating Costs
    const totalAnnualCosts = totalVariableCostsYard + totalFixedCosts;

    // Monthly Average
    const monthlyAverageCosts = totalAnnualCosts / 12;

    // Base Cost Per Stable (DIY baseline)
    const baseCostPerStable = monthlyAverageCosts / stables;

    // Apply Profit Margin
    const margin = 1 + (parseNumber(profitMargin) / 100);
    const diyPrice = baseCostPerStable * margin;

    // Part & Full Livery Prices
    const partLiveryPrice = diyPrice + parseNumber(partLiveryAddOn);
    const fullLiveryPrice = diyPrice + parseNumber(fullLiveryAddOn);

    // Revenue Projection
    const annualRevenueAtFull = fullLiveryPrice * stables * 12;

    // Break-even occupancy
    const breakEvenOccupancy = totalAnnualCosts / (diyPrice * 12);

    setResults({
      totalVariableCosts: totalVariableCostsYard,
      totalFixedCosts,
      totalAnnualCosts,
      monthlyAverageCosts,
      baseCostPerStable,
      diyPrice,
      partLiveryPrice,
      fullLiveryPrice,
      annualRevenueAtFull,
      breakEvenOccupancy
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    icon: Icon,
    suffix = '/month',
    tooltip
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void; 
    placeholder: string;
    icon: React.ComponentType<{ className?: string }>;
    suffix?: string;
    tooltip?: string;
  }) => (
    <div className="mb-4">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
        <Icon className="w-4 h-4 text-emerald-600" />
        {label}
        {tooltip && (
          <div className="group relative">
            <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              {tooltip}
            </div>
          </div>
        )}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-8 pr-16 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{suffix}</span>
      </div>
    </div>
  );

  const SectionHeader = ({ 
    title, 
    icon: Icon, 
    isOpen, 
    onToggle,
    bgColor = 'bg-emerald-50',
    iconColor = 'text-emerald-600'
  }: { 
    title: string; 
    icon: React.ComponentType<{ className?: string }>; 
    isOpen: boolean; 
    onToggle: () => void;
    bgColor?: string;
    iconColor?: string;
  }) => (
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-4 ${bgColor} rounded-lg mb-4 hover:opacity-90 transition`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <span className="font-semibold text-gray-800">{title}</span>
      </div>
      {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition">
            <ArrowLeft className="w-4 h-4" />
            Back to All Calculators
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Horse Livery Cost Calculator</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Calculate your true operating costs and set profitable livery prices. Works out DIY, Part, and Full livery rates with built-in profit margins.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          
          {/* Yard Details */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 mb-6 text-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Your Yard Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-emerald-100 mb-1">Number of Stables/Spaces</label>
                <input
                  type="number"
                  value={numberOfStables}
                  onChange={(e) => setNumberOfStables(e.target.value)}
                  placeholder="e.g. 12"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/30 rounded-lg text-white placeholder-emerald-200 focus:ring-2 focus:ring-white focus:border-white transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-100 mb-1">Target Profit Margin (%)</label>
                <input
                  type="number"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/30 rounded-lg text-white placeholder-emerald-200 focus:ring-2 focus:ring-white focus:border-white transition"
                />
              </div>
            </div>
          </div>

          {/* Variable Costs Section */}
          <SectionHeader
            title="Variable Costs (Per Horse / Usage-Based)"
            icon={Wheat}
            isOpen={showVariableCosts}
            onToggle={() => setShowVariableCosts(!showVariableCosts)}
          />
          
          {showVariableCosts && (
            <div className="grid md:grid-cols-2 gap-x-6 mb-6 pl-2">
              <InputField
                label="Feed Cost per Horse"
                value={feedCostPerHorse}
                onChange={setFeedCostPerHorse}
                placeholder="80"
                icon={Wheat}
                tooltip="Monthly hard feed costs per horse"
              />
              <InputField
                label="Hay/Forage per Horse"
                value={hayCostPerHorse}
                onChange={setHayCostPerHorse}
                placeholder="120"
                icon={Wheat}
                tooltip="Monthly hay and haylage per horse"
              />
              <InputField
                label="Bedding per Horse"
                value={beddingCostPerHorse}
                onChange={setBeddingCostPerHorse}
                placeholder="60"
                icon={ShoppingBag}
                tooltip="Monthly shavings/straw per horse"
              />
              <InputField
                label="Supplies & Consumables"
                value={suppliesCost}
                onChange={setSuppliesCost}
                placeholder="50"
                icon={ShoppingBag}
                tooltip="Light bulbs, toilet paper, cleaning etc."
              />
              <div className="md:col-span-2 grid md:grid-cols-2 gap-x-6">
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Labour Hours (all horses)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={labourHoursPerWeek}
                      onChange={(e) => setLabourHoursPerWeek(e.target.value)}
                      placeholder="40"
                      className="w-full px-4 pr-16 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">hrs/week</span>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <PoundSterling className="w-4 h-4 text-emerald-600" />
                    Hourly Rate (inc. your time)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                    <input
                      type="number"
                      value={labourHourlyRate}
                      onChange={(e) => setLabourHourlyRate(e.target.value)}
                      placeholder="15"
                      className="w-full pl-8 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/hr</span>
                  </div>
                </div>
              </div>
              <InputField
                label="Variable Utilities"
                value={variableUtilities}
                onChange={setVariableUtilities}
                placeholder="200"
                icon={Zap}
                tooltip="Water & electric that varies with horse numbers"
              />
            </div>
          )}

          {/* Fixed Costs Section */}
          <SectionHeader
            title="Fixed Costs (Yard Overheads)"
            icon={Building2}
            isOpen={showFixedCosts}
            onToggle={() => setShowFixedCosts(!showFixedCosts)}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          
          {showFixedCosts && (
            <div className="grid md:grid-cols-2 gap-x-6 mb-6 pl-2">
              <InputField
                label="Rent / Mortgage"
                value={rentMortgage}
                onChange={setRentMortgage}
                placeholder="1500"
                icon={Building2}
              />
              <InputField
                label="Business Rates"
                value={businessRates}
                onChange={setBusinessRates}
                placeholder="200"
                icon={FileText}
              />
              <InputField
                label="Insurance (annual)"
                value={insurance}
                onChange={setInsurance}
                placeholder="2500"
                icon={Shield}
                suffix="/year"
                tooltip="Public liability, property, employer's etc."
              />
              <InputField
                label="Staff Salaries"
                value={staffSalaries}
                onChange={setStaffSalaries}
                placeholder="0"
                icon={Users}
                tooltip="Non-livery specific staff (admin etc.)"
              />
              <InputField
                label="Machinery & Vehicles"
                value={machineryVehicles}
                onChange={setMachineryVehicles}
                placeholder="300"
                icon={Wrench}
                tooltip="Fuel, maintenance, depreciation"
              />
              <InputField
                label="Field & Infrastructure"
                value={fieldMaintenance}
                onChange={setFieldMaintenance}
                placeholder="250"
                icon={Fence}
                tooltip="Fencing, arena, muck heap, drainage"
              />
              <InputField
                label="Admin & Other"
                value={adminCosts}
                onChange={setAdminCosts}
                placeholder="100"
                icon={FileText}
                tooltip="Software, phone, accountant, marketing"
              />
            </div>
          )}

          {/* Pricing Add-ons Section */}
          <SectionHeader
            title="Livery Package Add-ons"
            icon={TrendingUp}
            isOpen={showPricing}
            onToggle={() => setShowPricing(!showPricing)}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          
          {showPricing && (
            <div className="grid md:grid-cols-2 gap-x-6 mb-6 pl-2">
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Part Livery Add-on
                  <div className="group relative">
                    <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                      Extra for morning/evening duties, turnout, rugs
                    </div>
                  </div>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                  <input
                    type="number"
                    value={partLiveryAddOn}
                    onChange={(e) => setPartLiveryAddOn(e.target.value)}
                    placeholder="150"
                    className="w-full pl-8 pr-24 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">above DIY</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  Full Livery Add-on
                  <div className="group relative">
                    <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                      All care, exercise, grooming, farrier attendance
                    </div>
                  </div>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                  <input
                    type="number"
                    value={fullLiveryAddOn}
                    onChange={(e) => setFullLiveryAddOn(e.target.value)}
                    placeholder="350"
                    className="w-full pl-8 pr-24 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">above DIY</span>
                </div>
              </div>
            </div>
          )}

          {/* Calculate Button */}
          <button
            onClick={calculateCosts}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-emerald-700 hover:to-green-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calculate Livery Prices
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              Your Livery Pricing Results
            </h2>

            {/* Cost Breakdown */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Annual Variable Costs</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(results.totalVariableCosts)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Annual Fixed Costs</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(results.totalFixedCosts)}</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-sm text-emerald-600 mb-1">Total Annual Costs</p>
                <p className="text-xl font-bold text-emerald-700">{formatCurrency(results.totalAnnualCosts)}</p>
              </div>
            </div>

            {/* Monthly & Per Stable */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-600 mb-1">Monthly Operating Costs</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(results.monthlyAverageCosts)}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-sm text-purple-600 mb-1">Base Cost Per Stable</p>
                <p className="text-2xl font-bold text-purple-700">{formatCurrency(results.baseCostPerStable)}</p>
                <p className="text-xs text-purple-500 mt-1">Before profit margin</p>
              </div>
            </div>

            {/* Recommended Prices */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 text-white mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PoundSterling className="w-5 h-5" />
                Recommended Monthly Prices (inc. {profitMargin}% margin)
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-emerald-100 text-sm mb-1">DIY Livery</p>
                  <p className="text-3xl font-bold">{formatCurrency(results.diyPrice)}</p>
                  <p className="text-emerald-200 text-xs mt-1">per month</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <p className="text-emerald-100 text-sm mb-1">Part Livery</p>
                  <p className="text-3xl font-bold">{formatCurrency(results.partLiveryPrice)}</p>
                  <p className="text-emerald-200 text-xs mt-1">per month</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center border-2 border-white/30">
                  <p className="text-white text-sm mb-1 font-medium">Full Livery</p>
                  <p className="text-3xl font-bold">{formatCurrency(results.fullLiveryPrice)}</p>
                  <p className="text-emerald-200 text-xs mt-1">per month</p>
                </div>
              </div>
            </div>

            {/* Business Insights */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Break-Even Point</p>
                    <p className="text-lg font-bold text-amber-900">
                      {results.breakEvenOccupancy.toFixed(1)} stables at DIY rate
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      {((results.breakEvenOccupancy / parseNumber(numberOfStables)) * 100).toFixed(0)}% occupancy required to cover costs
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Max Annual Revenue</p>
                    <p className="text-lg font-bold text-green-900">
                      {formatCurrency(results.annualRevenueAtFull)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      If all stables full at Full Livery rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Educational Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Understanding Livery Costs & Pricing</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What This Calculator Does</h3>
              <p className="text-gray-600">
                This calculator helps yard owners determine sustainable and profitable livery prices by working backwards from actual operating costs. Rather than guessing prices based on local competition, it ensures you cover all expenses and build in appropriate margins for contingencies and profit.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Understanding Variable vs Fixed Costs</h3>
              <p className="text-gray-600">
                <strong>Variable costs</strong> change based on the number of horses you have - feed, hay, bedding, and the labour hours required increase with each additional horse. <strong>Fixed costs</strong> remain relatively constant regardless of occupancy - your rent, insurance, and business rates don't change whether you have 5 or 15 horses.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Types of Livery Explained</h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>DIY (Do-It-Yourself) Livery:</strong> The horse owner handles all daily care - mucking out, feeding, turnout, and bringing in. The yard provides stable space, grazing, and facilities.</li>
                <li><strong>Part Livery:</strong> The yard handles some duties (typically morning or evening routines, or specific tasks like turnout). This splits responsibility between owner and yard.</li>
                <li><strong>Full Livery:</strong> The yard handles all daily care - mucking out, feeding, turnout, rugs, and often exercise. The owner simply visits to ride.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Why Include Your Own Labour?</h3>
              <p className="text-gray-600">
                Many yard owners undervalue their time, leading to unsustainable businesses. Even if you do all the work yourself, your time has value. Include it at a realistic hourly rate (at least minimum wage, ideally more for skilled work). This ensures if you later hire staff, you can afford to pay them.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Setting Your Profit Margin</h3>
              <p className="text-gray-600">
                A 10-15% margin is typical, but this covers more than just profit. It provides a buffer for empty stables between clients, unexpected repairs, price increases from suppliers, and bad debts. Some yards use 20%+ margins in high-demand areas or for premium facilities.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Pricing Part & Full Livery Add-ons</h3>
              <p className="text-gray-600">
                The add-on prices should reflect the additional labour required. Part livery typically adds 30-60 minutes of work per day per horse. Full livery adds 1-2+ hours daily. Calculate the extra hours, multiply by your labour rate, add a small margin for responsibility/stress, and divide by the days worked per month.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Common Costs Often Forgotten</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>Arena surface top-ups and maintenance</li>
                <li>Muck heap removal or management</li>
                <li>Fencing repairs (horses break fencing regularly)</li>
                <li>Water trough cleaning and plumbing repairs</li>
                <li>Yard lighting and security</li>
                <li>Professional memberships (BHS, EEA)</li>
                <li>Accountancy and bookkeeping</li>
                <li>Marketing and website costs</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Regional Price Variations</h3>
              <p className="text-gray-600">
                Livery prices vary significantly across the UK. South East England commands premium prices (often £500+ for DIY, £1000+ for full), while northern regions and rural areas are typically lower. Your costs should drive your minimum price, with local market conditions helping determine how much margin you can add.
              </p>
            </div>

            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <p className="text-sm text-emerald-800">
                <strong>💡 Tip:</strong> Review your costs annually - feed and bedding prices can change significantly. Build in an annual price review clause in your livery contracts to protect your business from inflation.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Calculator designed for UK livery yard owners. Prices and calculations in GBP.</p>
        </div>
      </div>
    </div>
  );
}
