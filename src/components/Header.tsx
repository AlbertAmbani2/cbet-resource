import { BookOpen } from 'lucide-react'
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
            <a href="#paths">Start Here</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#resources">Resources</a>
            <a href="#trainers-hub">For Trainers</a>
            <a href="#faq">About Us</a>
          </nav>

          <a href="#signup" className="btn-download">Get Started</a>
        </div>
      </div>
    </header>
  )
}


