import { useState } from 'react'
import './FAQ.css'

interface FAQItem {
  id: number
  question: string
  answer: string
}

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(0)

  const faqs: FAQItem[] = [
    {
      id: 0,
      question: 'What is cbet-resource?',
      answer: 'cbet-resource is a digital platform for Kenyan TVET (Technical and Vocational Education and Training) Trainers to upload CBET-aligned materials. Admin reviews every submission before it is published for everyone to browse.'
    },
    {
      id: 1,
      question: 'Do I need an account to view resources?',
      answer: 'No. Anyone can browse published resources without signing in. Trainer accounts are only required to upload materials.'
    },
    {
      id: 2,
      question: 'How do Trainers upload resources?',
      answer: 'Create a Trainer account, select your department, and upload your lesson plans, notes, and schemes of work. Admin reviews all submissions before publishing, and pricing will be added later by admin.'
    },
    {
      id: 3,
      question: 'Is my payment information secure?',
      answer: 'Yes, we use bank-level encryption and advanced security protocols. We support M-Pesa Express (STK Push) for Kenyan users and traditional card payments, all protected with enterprise-grade security.'
    }
  ]

  return (
    <section id="faq" className="faq">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>

        <div className="faq-nav">
          <button className="nav-btn">FAQ</button>
        </div>

        <div className="faq-container">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`faq-item ${openId === faq.id ? 'active' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              >
                <span>{faq.question}</span>
                <span className="toggle-icon">
                  {openId === faq.id ? '×' : '+'}
                </span>
              </button>
              {openId === faq.id && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Security</h3>
            <div className="stat-number">100%</div>
            <p>Encrypted & Verified</p>
          </div>
          <div className="stat-card">
            <h3>Trainers</h3>
            <div className="stat-number">1000+</div>
            <p>Share Resources on cbet-resource</p>
          </div>
          <div className="stat-card featured">
            <h3>Resources</h3>
            <div className="stat-number">10k+</div>
            <p>CBET-Aligned Materials</p>
          </div>
          <div className="stat-card">
            <h3>Access</h3>
            <div className="stat-number">Open</div>
            <p>Browse Without Sign-In</p>
          </div>
        </div>
      </div>
    </section>
  )
}
