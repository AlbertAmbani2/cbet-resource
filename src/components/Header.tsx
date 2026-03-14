import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a href="#hero" className="logo">
            <div className="logo-icon">📚</div>
            <span className="logo-text">cbet-resource</span>
          </a>
          
          <nav className="nav-menu">
            <a href="#resources">Resources</a>
            <a href="#educators">For Educators</a>
            <a href="#students">For Students</a>
            <a href="#faq">About Us</a>
          </nav>

          <a href="#signup" className="btn-download">Get Started</a>
        </div>
      </div>
    </header>
  )
}
