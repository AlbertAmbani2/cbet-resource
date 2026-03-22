import { Check, CheckCircle, Lock, Smartphone, User } from 'lucide-react'
import './Payment.css'

export default function Payment() {
  return (
    <section id="signup" className="payment">
      <div className="container">
        <div className="payment-content">
          <div className="payment-left">
            <h2>Localized Commerce,<br />Built for Kenya's<br />Educational Market</h2>
            <p>
              Experience a secure checkout flow with M-Pesa Express (STK Push) integration
              and traditional card payments. Admin-reviewed resources are published for
              everyone to browse, with pricing added later by admin.
            </p>

            <div className="features-list">
              <div className="feature">
                <div className="checkmark">
                  <Check aria-hidden="true" />
                </div>
                <span>M-Pesa Express STK Push for instant mobile payments</span>
              </div>
              <div className="feature">
                <div className="checkmark">
                  <Check aria-hidden="true" />
                </div>
                <span>Bank-level encryption and transaction security</span>
              </div>
              <div className="feature">
                <div className="checkmark">
                  <Check aria-hidden="true" />
                </div>
                <span>Open browsing for everyone without signing in</span>
              </div>
            </div>

            <a href="#signup" className="btn-start">Start Your Journey</a>
          </div>

          <div className="payment-right">
            <div className="payment-illustration">
              <div className="character">
                <User aria-hidden="true" />
              </div>
              <div className="payment-badge received">
                <div className="badge-icon">
                  <Lock aria-hidden="true" />
                </div>
                <div>
                  <div className="badge-label">Verified</div>
                  <div className="badge-amount">KES 2,500</div>
                </div>
              </div>
              <div className="payment-badge success">
                <div className="badge-icon">
                  <CheckCircle aria-hidden="true" />
                </div>
                <div>
                  <div className="badge-label">Resource Access Granted</div>
                  <div className="badge-amount">Download Ready</div>
                </div>
              </div>
              <div className="wallet-icon">
                <Smartphone aria-hidden="true" />
              </div>
              <div className="tag-label">M-Pesa Ready</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
