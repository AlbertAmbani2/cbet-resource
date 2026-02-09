import './Payment.css'

export default function Payment() {
  return (
    <section className="payment">
      <div className="container">
        <div className="payment-content">
          <div className="payment-left">
            <h2>Localized Commerce,<br />Built for Kenya's<br />Educational Market</h2>
            <p>
              Experience a secure checkout flow with M-Pesa Express (STK Push) integration
              and traditional card payments. Designed specifically for the Kenyan financial
              landscape to make learning resources accessible to everyone.
            </p>

            <div className="features-list">
              <div className="feature">
                <div className="checkmark">✓</div>
                <span>M-Pesa Express STK Push for instant mobile payments</span>
              </div>
              <div className="feature">
                <div className="checkmark">✓</div>
                <span>Bank-level encryption and transaction security</span>
              </div>
              <div className="feature">
                <div className="checkmark">✓</div>
                <span>Support for both educators and student buyers</span>
              </div>
            </div>

            <button className="btn-start">Start Your Journey</button>
          </div>

          <div className="payment-right">
            <div className="payment-illustration">
              <div className="character">👤</div>
              <div className="payment-badge received">
                <div className="badge-icon">🔒</div>
                <div>
                  <div className="badge-label">Verified</div>
                  <div className="badge-amount">KES 2,500</div>
                </div>
              </div>
              <div className="payment-badge success">
                <div className="badge-icon">✓</div>
                <div>
                  <div className="badge-label">Resource Access Granted</div>
                  <div className="badge-amount">Download Ready</div>
                </div>
              </div>
              <div className="wallet-icon">📱</div>
              <div className="tag-label">M-Pesa Ready</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
