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

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
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
        </Routes>
      </Router>
    </HelmetProvider>
  )
}

export default App
