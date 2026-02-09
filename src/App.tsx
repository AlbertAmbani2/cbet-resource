import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Solutions from './components/Solutions'
import FAQ from './components/FAQ'
import Payment from './components/Payment'
import Footer from './components/Footer'
import { SparklesCore } from './components/ui/sparkles'

function App() {
  return (
    <div className="app relative w-full overflow-hidden">
      {/* Sparkles background - Full page */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={60}
          className="w-full h-full"
          particleColor="#3b5bdb"
          speed={2}
        />
      </div>

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
