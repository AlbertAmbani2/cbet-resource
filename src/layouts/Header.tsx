import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth'
import './Header.css'

export default function Header() {
  const { trainerData, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    setMobileOpen(false)
    logout()
    navigate('/')
  }

  const handleNavClick = () => {
    setMobileOpen(false)
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a href="#hero" className="logo" onClick={handleNavClick}>
            <img src="/images/CBET.png" alt="CBET" className="logo-img" />
          </a>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={`nav-menu ${mobileOpen ? 'nav-menu--open' : ''}`}>
            <a href="#resources" onClick={handleNavClick}>Browse Resources</a>
            <a href="#how-it-works" onClick={handleNavClick}>How It Works</a>
            <a href="#trainers-hub" onClick={handleNavClick}>For Trainers</a>
            <Link to="/leaderboard" onClick={handleNavClick}>Leaderboard</Link>
            <a href="#faq" onClick={handleNavClick}>FAQ</a>
            {trainerData ? (
              <>
                <span className="header-user mobile-only">{trainerData.fullName}</span>
                <Link to="/dashboard" className="btn-download mobile-only" onClick={handleNavClick}>Dashboard</Link>
                <button type="button" className="btn-download mobile-only" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/signin" className="btn-download mobile-only" onClick={handleNavClick}>Sign In</Link>
            )}
          </nav>

          {trainerData ? (
            <div className="header-actions desktop-only">
              <span className="header-user">{trainerData.fullName}</span>
              <Link to="/dashboard" className="btn-download">Dashboard</Link>
              <button type="button" className="btn-download" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/signin" className="btn-download desktop-only">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  )
}


