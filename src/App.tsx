import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import UserPaths from './components/UserPaths'
import HowItWorks from './components/HowItWorks'
import Solutions from './components/Solutions'
import TrainersHub from './components/TrainersHub'
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
        <UserPaths />
        <HowItWorks />
        <Solutions />
        <TrainersHub />
        <Payment />
        <FAQ />
        <Footer />
      </div>
    </div>
  )
}

export default App

