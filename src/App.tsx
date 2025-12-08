import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import HorseLiveryCalculatorPage from './pages/HorseLiveryCalculatorPage'
import AnnualHorseCostCalculatorPage from './pages/AnnualHorseCostCalculatorPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculators/horse-livery" element={<HorseLiveryCalculatorPage />} />
        <Route path="/horse-livery" element={<HorseLiveryCalculatorPage />} />
      </Routes>
    </Router>
  )
}

export default App

