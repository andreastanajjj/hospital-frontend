"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        ...form,
        role: "patient",
      })

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      navigate("/patient")
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-bg signup-bg"></div>

      <div className="auth-content">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">⚕</div>
          <h1>Join MediCare</h1>
          <p>Create your patient account and start your healthcare journey</p>
        </div>

        {/* Signup Form */}
        <div className="auth-card">
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-input"
                  placeholder="Create a secure password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="patient-benefits">
              <h4>
                <span>🏥</span>
                Patient Account Benefits
              </h4>
              <ul>
                <li>Book appointments with qualified doctors</li>
                <li>Access your complete medical records</li>
                <li>Track treatment progress and history</li>
                <li>Secure and encrypted data storage</li>
                <li>24/7 access to your healthcare information</li>
              </ul>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary auth-submit">
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="auth-link">
                Sign in here
              </button>
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={() => navigate("/")} className="back-link">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default Signup
