"use client"

import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: "🔒",
      title: "Secure & Reliable",
      description: "Your medical data is protected with enterprise-grade security",
    },
    {
      icon: "👨‍⚕️",
      title: "Expert Medical Team",
      description: "Access to qualified doctors and medical professionals",
    },
    {
      icon: "🕐",
      title: "24/7 Availability",
      description: "Round-the-clock medical support when you need it most",
    },
  ]

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <a href="/" className="logo">
              <div className="logo-icon">⚕</div>
              <div className="logo-text">
                <h1>MediCare</h1>
                <p>Hospital Management</p>
              </div>
            </a>
            <nav className="nav-menu">
              <button onClick={() => navigate("/login")} className="btn btn-secondary">
                Login
              </button>
              <button onClick={() => navigate("/signup")} className="btn btn-primary">
                Sign Up
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-icon fade-in">⚕</div>
          <h1 className="fade-in">
            Advanced Hospital
            <br />
            <span className="highlight">Management System</span>
          </h1>
          <p className="fade-in">
            Streamline your healthcare experience with our comprehensive platform. Connect with doctors, manage
            appointments, and access your medical records securely.
          </p>
          <div className="hero-buttons fade-in">
            <button onClick={() => navigate("/signup")} className="btn btn-primary btn-lg">
              <span>Get Started as Patient</span>
              <span>→</span>
            </button>
            <button onClick={() => navigate("/login")} className="btn btn-secondary btn-lg">
              Healthcare Provider Login
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2>Why Choose MediCare?</h2>
            <p>Experience healthcare management like never before</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card slide-in-right" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item fade-in">
              <h3>500+</h3>
              <p>Patients Served</p>
            </div>
            <div className="stat-item fade-in">
              <h3>50+</h3>
              <p>Medical Experts</p>
            </div>
            <div className="stat-item fade-in">
              <h3>24/7</h3>
              <p>Support Available</p>
            </div>
            <div className="stat-item fade-in">
              <h3>99%</h3>
              <p>Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--gray-900)", color: "var(--white)", padding: "3rem 0" }}>
        <div className="container">
          <div className="flex-center flex-col">
            <div className="flex-center mb-6" style={{ gap: "0.75rem" }}>
              <div className="logo-icon">⚕</div>
              <div>
                <h3 className="text-xl font-bold">MediCare</h3>
                <p className="text-sm" style={{ color: "var(--gray-400)" }}>
                  Hospital Management System
                </p>
              </div>
            </div>
            <p style={{ color: "var(--gray-400)" }}>
              &copy; 2025 MediCare Hospital Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
