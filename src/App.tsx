import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Home from './pages/Home'

// Lazy load all calculator pages — each becomes its own JS chunk
// loaded only when the user navigates to that route
const HorseLiveryCalculatorPage = lazy(() => import('./pages/HorseLiveryCalculatorPage'))
const AnnualHorseCostCalculatorPage = lazy(() => import('./pages/AnnualHorseCostCalculatorPage'))
const HorseFeedCalculatorPage = lazy(() => import('./pages/HorseFeedCalculatorPage'))
const FarrierCostCalculatorPage = lazy(() => import('./pages/FarrierCostCalculatorPage'))
const HorseWeightCalculatorPage = lazy(() => import('./pages/HorseWeightCalculatorPage'))
const CompetitionBudgetCalculatorPage = lazy(() => import('./pages/CompetitionBudgetCalculatorPage'))
const GamePage = lazy(() => import('./pages/GamePage'))
const HorseInsuranceCalculatorPage = lazy(() => import('./pages/HorseInsuranceCalculatorPage'))
const VetCostEstimatorPage = lazy(() => import('./pages/VetCostEstimatorPage'))
const TrailerCostCalculatorPage = lazy(() => import('./pages/TrailerCostCalculatorPage'))
const RidingLessonCalculatorPage = lazy(() => import('./pages/RidingLessonCalculatorPage'))
const FirstHorseCalculatorPage = lazy(() => import('./pages/FirstHorseCalculatorPage'))
const TackEquipmentCalculatorPage = lazy(() => import('./pages/TackEquipmentCalculatorPage'))
const HorseLoanCalculatorPage = lazy(() => import('./pages/HorseLoanCalculatorPage'))
const BeddingCostCalculatorPage = lazy(() => import('./pages/BeddingCostCalculatorPage'))
const ClippingCostCalculatorPage = lazy(() => import('./pages/ClippingCostCalculatorPage'))
const WormingCostCalculatorPage = lazy(() => import('./pages/WormingCostCalculatorPage'))
const HorseTransportCalculatorPage = lazy(() => import('./pages/HorseTransportCalculatorPage'))
const FieldRentCalculatorPage = lazy(() => import('./pages/FieldRentCalculatorPage'))
const DentalCostCalculatorPage = lazy(() => import('./pages/DentalCostCalculatorPage'))
const RugCostCalculatorPage = lazy(() => import('./pages/RugCostCalculatorPage'))
const RetirementCostCalculatorPage = lazy(() => import('./pages/RetirementCostCalculatorPage'))

// Loading fallback shown while a calculator chunk is fetching
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-amber-700 font-medium">Loading calculator...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Horse Livery Calculator */}
            <Route path="/horse-livery-calculator" element={<HorseLiveryCalculatorPage />} />
            <Route path="/calculators/horse-livery" element={<HorseLiveryCalculatorPage />} />
            <Route path="/horse-livery" element={<HorseLiveryCalculatorPage />} />
            <Route path="/livery-calculator" element={<HorseLiveryCalculatorPage />} />

            {/* Annual Horse Cost Calculator */}
            <Route path="/annual-horse-cost-calculator" element={<AnnualHorseCostCalculatorPage />} />
            <Route path="/horse-cost-calculator" element={<AnnualHorseCostCalculatorPage />} />
            <Route path="/yearly-horse-cost-calculator" element={<AnnualHorseCostCalculatorPage />} />

            {/* Horse Feed Calculator */}
            <Route path="/horse-feed-calculator" element={<HorseFeedCalculatorPage />} />
            <Route path="/feed-calculator" element={<HorseFeedCalculatorPage />} />
            <Route path="/calculators/feed-budget" element={<HorseFeedCalculatorPage />} />

            {/* Farrier Cost Calculator */}
            <Route path="/farrier-cost-calculator" element={<FarrierCostCalculatorPage />} />
            <Route path="/farrier-calculator" element={<FarrierCostCalculatorPage />} />
            <Route path="/calculators/farrier-cost" element={<FarrierCostCalculatorPage />} />

            {/* Horse Weight Calculator */}
            <Route path="/horse-weight-calculator" element={<HorseWeightCalculatorPage />} />
            <Route path="/weight-calculator" element={<HorseWeightCalculatorPage />} />
            <Route path="/calculators/weight-calculator" element={<HorseWeightCalculatorPage />} />

            {/* Competition Budget Calculator */}
            <Route path="/competition-budget-calculator" element={<CompetitionBudgetCalculatorPage />} />
            <Route path="/competition-calculator" element={<CompetitionBudgetCalculatorPage />} />
            <Route path="/calculators/competition-budget" element={<CompetitionBudgetCalculatorPage />} />

            {/* Horse Care Challenge Game */}
            <Route path="/horse-care-challenge" element={<GamePage />} />
            <Route path="/quiz" element={<GamePage />} />
            <Route path="/game" element={<GamePage />} />

            {/* Horse Insurance Calculator */}
            <Route path="/horse-insurance-calculator" element={<HorseInsuranceCalculatorPage />} />
            <Route path="/insurance-calculator" element={<HorseInsuranceCalculatorPage />} />
            <Route path="/calculators/insurance" element={<HorseInsuranceCalculatorPage />} />

            {/* Vet Cost Estimator */}
            <Route path="/vet-cost-estimator" element={<VetCostEstimatorPage />} />
            <Route path="/vet-calculator" element={<VetCostEstimatorPage />} />
            <Route path="/calculators/vet-costs" element={<VetCostEstimatorPage />} />

            {/* Trailer Running Cost Calculator */}
            <Route path="/trailer-cost-calculator" element={<TrailerCostCalculatorPage />} />
            <Route path="/horsebox-cost-calculator" element={<TrailerCostCalculatorPage />} />
            <Route path="/calculators/trailer-costs" element={<TrailerCostCalculatorPage />} />

            {/* Riding Lesson Calculator */}
            <Route path="/riding-lesson-calculator" element={<RidingLessonCalculatorPage />} />
            <Route path="/lesson-cost-calculator" element={<RidingLessonCalculatorPage />} />
            <Route path="/calculators/lessons" element={<RidingLessonCalculatorPage />} />

            {/* First Horse Calculator */}
            <Route path="/first-horse-calculator" element={<FirstHorseCalculatorPage />} />
            <Route path="/buying-first-horse" element={<FirstHorseCalculatorPage />} />
            <Route path="/calculators/first-horse" element={<FirstHorseCalculatorPage />} />

            {/* Tack & Equipment Calculator */}
            <Route path="/tack-equipment-calculator" element={<TackEquipmentCalculatorPage />} />
            <Route path="/tack-calculator" element={<TackEquipmentCalculatorPage />} />
            <Route path="/equipment-calculator" element={<TackEquipmentCalculatorPage />} />

            {/* Horse Loan Calculator */}
            <Route path="/horse-loan-calculator" element={<HorseLoanCalculatorPage />} />
            <Route path="/loan-calculator" element={<HorseLoanCalculatorPage />} />
            <Route path="/loan-vs-buy" element={<HorseLoanCalculatorPage />} />

            {/* Bedding Cost Calculator */}
            <Route path="/bedding-cost-calculator" element={<BeddingCostCalculatorPage />} />
            <Route path="/bedding-calculator" element={<BeddingCostCalculatorPage />} />
            <Route path="/stable-bedding-calculator" element={<BeddingCostCalculatorPage />} />

            {/* Clipping Calculator */}
            <Route path="/clipping-cost-calculator" element={<ClippingCostCalculatorPage />} />
            <Route path="/clipping-calculator" element={<ClippingCostCalculatorPage />} />
            <Route path="/horse-clipping-calculator" element={<ClippingCostCalculatorPage />} />

            {/* Worming Calculator */}
            <Route path="/worming-cost-calculator" element={<WormingCostCalculatorPage />} />
            <Route path="/worming-calculator" element={<WormingCostCalculatorPage />} />
            <Route path="/horse-worming-calculator" element={<WormingCostCalculatorPage />} />

            {/* Transport Calculator */}
            <Route path="/horse-transport-calculator" element={<HorseTransportCalculatorPage />} />
            <Route path="/transport-calculator" element={<HorseTransportCalculatorPage />} />
            <Route path="/horse-moving-calculator" element={<HorseTransportCalculatorPage />} />

            {/* Field Rent Calculator */}
            <Route path="/field-rent-calculator" element={<FieldRentCalculatorPage />} />
            <Route path="/grazing-calculator" element={<FieldRentCalculatorPage />} />
            <Route path="/paddock-rent-calculator" element={<FieldRentCalculatorPage />} />

            {/* Dental Cost Calculator */}
            <Route path="/dental-cost-calculator" element={<DentalCostCalculatorPage />} />
            <Route path="/horse-dental-calculator" element={<DentalCostCalculatorPage />} />
            <Route path="/teeth-cost-calculator" element={<DentalCostCalculatorPage />} />

            {/* Rug Calculator */}
            <Route path="/rug-cost-calculator" element={<RugCostCalculatorPage />} />
            <Route path="/horse-rug-calculator" element={<RugCostCalculatorPage />} />
            <Route path="/blanket-calculator" element={<RugCostCalculatorPage />} />

            {/* Retirement Calculator */}
            <Route path="/retirement-cost-calculator" element={<RetirementCostCalculatorPage />} />
            <Route path="/veteran-horse-calculator" element={<RetirementCostCalculatorPage />} />
            <Route path="/retired-horse-calculator" element={<RetirementCostCalculatorPage />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  )
}

export default App
