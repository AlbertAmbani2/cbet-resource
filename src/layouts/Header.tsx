import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../features/auth'
import { Avatar } from '../components/ui'
import './Header.css'

export default function Header() {
  const { trainerData, openSignup } = useAuth()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavClick = () => {
    setMobileOpen(false)
  }

  const handleSectionClick = (id: string) => {
    setMobileOpen(false)
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleLogoClick = () => {
    setMobileOpen(false)
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleGetStarted = () => {
    setMobileOpen(false)
    openSignup('marketing-header')
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={handleLogoClick}>
            <img src="/images/CBET.png" alt="CBET" className="logo-img" />
          </Link>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={`nav-menu ${mobileOpen ? 'nav-menu--open' : ''}`}>
            <Link to="/#resources" onClick={() => handleSectionClick('resources')}>Browse Resources</Link>
            <Link to="/#how-it-works" onClick={() => handleSectionClick('how-it-works')}>How It Works</Link>
            <Link to="/#trainers-hub" onClick={() => handleSectionClick('trainers-hub')}>For Trainers</Link>
            <Link to="/leaderboard" onClick={handleNavClick}>Leaderboard</Link>
            <Link to="/#faq" onClick={() => handleSectionClick('faq')}>FAQ</Link>

            {trainerData ? (
              <Link to="/dashboard" className="btn-download mobile-only" onClick={handleNavClick}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signin" className="mobile-only" onClick={handleNavClick}>Sign In</Link>
                <button type="button" className="btn-download mobile-only" onClick={handleGetStarted}>
                  Get Started
                </button>
              </>
            )}
          </nav>

          {trainerData ? (
            <div className="header-actions desktop-only">
              <Link
                to="/dashboard"
                className="header-account"
                title="Open trainer dashboard"
              >
                <Avatar name={trainerData.fullName} size="sm" className="ring-0" />
                <span>Dashboard</span>
              </Link>
            </div>
          ) : (
            <div className="header-actions desktop-only">
              <Link to="/signin" className="header-signin">Sign In</Link>
              <button type="button" className="btn-download" onClick={handleGetStarted}>
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
