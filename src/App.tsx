import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Solutions from './components/Solutions'
import FAQ from './components/FAQ'
import Payment from './components/Payment'
import Footer from './components/Footer'
//import { SparklesCore } from './components/ui/sparkles'

function App() {
  return (
    <div className="app relative w-full overflow-hidden">

      {/* Content wrapper */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <Solutions />
        <Payment />
        <FAQ />
        <Footer />
      </div>
    </div>
  )
}

export default App
