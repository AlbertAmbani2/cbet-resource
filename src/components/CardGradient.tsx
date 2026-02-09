import './CardGradient.css'

export default function CardGradient() {
  return (
    <div className="card-container">
      <div className="card card-front">
        <div className="card-chip">
          <div className="chip-svg">💳</div>
        </div>
        <div className="card-number">4567 8596<br />7810 4508</div>
        <div className="card-footer">
          <div>
            <div className="card-label">Card holder name</div>
            <div className="card-name">Tahsin Ahmed</div>
          </div>
          <div className="visa-logo">VISA</div>
        </div>
      </div>

      <div className="card card-back-1">
        <div className="card-inner"></div>
      </div>

      <div className="card card-back-2">
        <div className="card-inner"></div>
      </div>

      <div className="card card-back-3">
        <div className="card-inner"></div>
      </div>
    </div>
  )
}
