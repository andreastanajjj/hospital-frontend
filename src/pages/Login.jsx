"use client"

import { useState } from "react"
import axios from "../api/axiosClient"

import { useNavigate } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      })

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      const role = res.data.user.role
      if (role === "admin") navigate("/admin")
      else if (role === "doctor") navigate("/doctor")
      else navigate("/patient")
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-bg login-bg"></div>

      <div className="auth-content">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">⚕</div>
          <h1>Welcome Back</h1>
          <p>Sign in to your MediCare account</p>
        </div>

        {/* Login Form */}
        <div className="auth-card">
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary auth-submit">
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <button onClick={() => navigate("/signup")} className="auth-link">
                Sign up as Patient
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

export default Login
