import { HelmetProvider } from 'react-helmet-async'
import Home from './pages/Home'
import HorseLiveryCalculatorPage from './pages/HorseLiveryCalculatorPage'
import AnnualHorseCostCalculatorPage from './pages/AnnualHorseCostCalculatorPage'
import GamePage from './pages/GamePage' // Import the new game page
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
          {/* Horse Care Challenge Game */}
          <Route path="/horse-care-challenge" element={<GamePage />} />
        </Routes>
      </Router>
    </HelmetProvider>
  )
}
export default App

