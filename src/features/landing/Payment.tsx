import { Check, Zap, Star, BookmarkPlus } from 'lucide-react'
import './Payment.css'
import { useState } from 'react'

export default function Payment() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <section id="freemium" className="payment">
      <div className="container">
        <div className="payment-content">
          <div className="payment-left">
            <span className="section-kicker">Coming Soon</span>
            <h2>Free Forever,<br />Premium Optional</h2>
            <p>
              Browse, download, and use all resources offline for free. Premium unlocks advanced 
              features coming soon like certificates, bookmarks, and batch downloads. Get notified 
              when premium launches.
            </p>

            <div className="features-list">
              <div className="feature">
                <div className="checkmark">
                  <Check aria-hidden="true" />
                </div>
                <span>Browse 30+ verified resources</span>
              </div>
              <div className="feature">
                <div className="checkmark">
                  <Check aria-hidden="true" />
                </div>
                <span>Download PDFs to work offline</span>
              </div>
              <div className="feature">
                <div className="checkmark">
                  <Check aria-hidden="true" />
                </div>
                <span>No login required to start</span>
              </div>
              <div className="feature">
                <div className="checkmark">
                  <Zap aria-hidden="true" />
                </div>
                <span>Premium: Certificates (coming soon)</span>
              </div>
              <div className="feature">
                <div className="checkmark">
                  <BookmarkPlus aria-hidden="true" />
                </div>
                <span>Premium: Save & organize resources (coming soon)</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="email-form">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="email-input"
              />
              <button type="submit" className="btn-notify">
                Notify Me
              </button>
              {submitted && <p className="submit-success"><Check size={16} /> We'll notify you soon!</p>}
            </form>
          </div>

          <div className="payment-right">
            <div className="freemium-comparison">
              <div className="comparison-card free">
                <div className="plan-label">Free</div>
                <div className="plan-price">Always $0</div>
                <ul className="plan-features">
                  <li><Star size={16} /> Browse Resources</li>
                  <li><Star size={16} /> Download PDFs</li>
                  <li><Star size={16} /> Offline Access</li>
                  <li><Star size={16} /> View Ratings</li>
                  <li className="unavailable"><Star size={16} /> <s>Certificates</s></li>
                  <li className="unavailable"><BookmarkPlus size={16} /> <s>Bookmarks</s></li>
                </ul>
              </div>

              <div className="comparison-card premium">
                <div className="plan-label premium-text">Premium</div>
                <div className="plan-price">Coming Soon</div>
                <ul className="plan-features">
                  <li><Check size={16} /> Browse Resources</li>
                  <li><Check size={16} /> Download PDFs</li>
                  <li><Check size={16} /> Offline Access</li>
                  <li><Check size={16} /> View Ratings</li>
                  <li><Zap size={16} /> Certificates</li>
                  <li><BookmarkPlus size={16} /> Save & Organize</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
