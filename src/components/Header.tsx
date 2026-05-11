import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a href="#hero" className="logo">
            <div className="logo-icon">
              <BookOpen aria-hidden="true" />
            </div>
            <span className="logo-text">cbet-resource</span>
          </a>

          <nav className="nav-menu">
            <a href="#resources">Browse Resources</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#trainers-hub">For Trainers</a>
            <a href="#faq">About</a>
          </nav>

          <Link to="/signin" className="btn-download">Sign In</Link>
        </div>
      </div>
    </header>
  )
}


