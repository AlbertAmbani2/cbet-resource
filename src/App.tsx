import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import ResourceBrowser from './components/ResourceBrowser'
import TrainersHub from './components/TrainersHub'
import FAQ from './components/FAQ'
import Payment from './components/Payment'
import Footer from './components/Footer'
import { TrainerSignupProvider, TrainerSignupModal } from './features/TrainerOnboarding'
import { SignInPage } from './pages/SignInPage'

function App() {
  return (
    <Router>
      <TrainerSignupProvider>
        <div className="app relative w-full overflow-hidden">
          {/* Global Modal */}
          <TrainerSignupModal />

          <Routes>
            {/* Sign In Page */}
            <Route path="/signin" element={<SignInPage />} />

            {/* Home Page */}
            <Route path="/" element={
              <>
                {/* Content wrapper */}
                <div className="relative z-10">
                  <Header />
                  <Hero />
                  <ResourceBrowser />
                  <HowItWorks />
                  <TrainersHub />
                  <Payment />
                  <FAQ />
                  <Footer />
                </div>
              </>
            } />
          </Routes>
        </div>
      </TrainerSignupProvider>
    </Router>
  )
}

export default App

