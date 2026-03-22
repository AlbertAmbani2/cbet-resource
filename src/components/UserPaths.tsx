import { User } from 'lucide-react'
import './UserPaths.css'

export default function UserPaths() {
  return (
    <section id="paths" className="paths">
      <div className="container">
        <div className="section-head">
          <span className="section-kicker">Start Here</span>
          <h2 className="section-title">Trainer Path</h2>
          <p className="section-subtitle">
            Create your Trainer account to upload by department and publish after admin review.
          </p>
        </div>

        <div className="paths-grid">
          <div className="path-card featured">
            <div className="path-icon">
              <User aria-hidden="true" />
            </div>
            <h3>I am a Trainer</h3>
            <p>
              Share your expertise, submit resources for review, and help more learners
              access quality CBET content.
            </p>
            <ul className="path-list">
              <li>Create a Trainer account</li>
              <li>Upload resources by department</li>
              <li>Admin reviews and publishes for everyone</li>
            </ul>
            <a className="btn-secondary" href="#trainers-hub">Create Trainer Account</a>
          </div>
        </div>
      </div>
    </section>
  )
}

