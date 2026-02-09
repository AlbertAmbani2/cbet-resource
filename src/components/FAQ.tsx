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
      answer: 'cbet-resource is a digital marketplace designed for the Kenyan TVET (Technical and Vocational Education and Training) ecosystem. We bridge the gap between educators and students by providing a scalable platform for CBET-aligned academic resources including notes, schemes of work, and lesson plans.'
    },
    {
      id: 1,
      question: 'How do I buy resources as a student?',
      answer: 'Students can browse our curated marketplace of learning materials. You can preview resources online and purchase them securely using M-Pesa or card payments. Once purchased, you can read online or download for offline study.'
    },
    {
      id: 2,
      question: 'How can educators monetize their resources?',
      answer: 'Educators can upload their notes, lesson plans, and schemes of work to our platform. You get access to a comprehensive dashboard to manage your catalog, track earnings, and view performance analytics with revenue growth insights.'
    },
    {
      id: 3,
      question: 'Is my payment information secure?',
      answer: 'Yes, we use bank-level encryption and advanced security protocols. We support M-Pesa Express (STK Push) for Kenyan users and traditional card payments, all protected with enterprise-grade security.'
    }
  ]

  return (
    <section className="faq">
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
                  {openId === faq.id ? '✕' : '+'}
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
            <h3>Educators</h3>
            <div className="stat-number">1000+</div>
            <p>Share Resources on cbet-resource</p>
          </div>
          <div className="stat-card featured">
            <h3>Resources</h3>
            <div className="stat-number">10k+</div>
            <p>CBET-Aligned Materials</p>
          </div>
          <div className="stat-card">
            <h3>Students</h3>
            <div className="stat-number">Growing</div>
            <p>Learning on cbet-resource</p>
          </div>
        </div>
      </div>
    </section>
  )
}
