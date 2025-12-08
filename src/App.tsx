import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import HorseLiveryCalculatorPage from './pages/HorseLiveryCalculatorPage'
import AnnualHorseCostCalculatorPage from './pages/AnnualHorseCostCalculatorPage'

function App() {
  return (
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
      </Routes>
    </Router>
  )
}

export default App

