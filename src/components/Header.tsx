import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">📚</div>
            <span className="logo-text">cbet-resource</span>
          </div>
          
          <nav className="nav-menu">
            <a href="#resources">Resources</a>
            <a href="#educators">For Educators</a>
            <a href="#students">For Students</a>
            <a href="#about">About Us</a>
          </nav>

          <button className="btn-download">Get Started</button>
        </div>
      </div>
    </header>
  )
}
