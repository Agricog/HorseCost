import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Home from './pages/Home'
import HorseLiveryCalculatorPage from './pages/HorseLiveryCalculatorPage'
import AnnualHorseCostCalculatorPage from './pages/AnnualHorseCostCalculatorPage'
import HorseFeedCalculatorPage from './pages/HorseFeedCalculatorPage'
import FarrierCostCalculatorPage from './pages/FarrierCostCalculatorPage'
import HorseWeightCalculatorPage from './pages/HorseWeightCalculatorPage'
import CompetitionBudgetCalculatorPage from './pages/CompetitionBudgetCalculatorPage'
import GamePage from './pages/GamePage'
import HorseInsuranceCalculatorPage from './pages/HorseInsuranceCalculatorPage'
import VetCostEstimatorPage from './pages/VetCostEstimatorPage'
import TrailerCostCalculatorPage from './pages/TrailerCostCalculatorPage'
import RidingLessonCalculatorPage from './pages/RidingLessonCalculatorPage'
import FirstHorseCalculatorPage from './pages/FirstHorseCalculatorPage'
import TackEquipmentCalculatorPage from './pages/TackEquipmentCalculatorPage'
import HorseLoanCalculatorPage from './pages/HorseLoanCalculatorPage'
import BeddingCostCalculatorPage from './pages/BeddingCostCalculatorPage'
import ClippingCostCalculatorPage from './pages/ClippingCostCalculatorPage'
import WormingCostCalculatorPage from './pages/WormingCostCalculatorPage'
import HorseTransportCalculatorPage from './pages/HorseTransportCalculatorPage'
import FieldRentCalculatorPage from './pages/FieldRentCalculatorPage'

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

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
          
          {/* Horse Insurance Calculator */}
          <Route path="/horse-insurance-calculator" element={<HorseInsuranceCalculatorPage />} />
          <Route path="/insurance-calculator" element={<HorseInsuranceCalculatorPage />} />
          <Route path="/calculators/insurance" element={<HorseInsuranceCalculatorPage />} />

          {/* Vet Cost Estimator */}
          <Route path="/vet-cost-estimator" element={<VetCostEstimatorPage />} />
          <Route path="/vet-calculator" element={<VetCostEstimatorPage />} />
          <Route path="/calculators/vet-costs" element={<VetCostEstimatorPage />} />
          
          {/* Horse Livery Calculator */}
          <Route path="/calculators/horse-livery" element={<HorseLiveryCalculatorPage />} />
          <Route path="/horse-livery" element={<HorseLiveryCalculatorPage />} />
          
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
        </Routes>
      </Router>
    </HelmetProvider>
  )
}

export default App
