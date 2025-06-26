"use client"

import { useNavigate } from "react-router-dom"

function Header() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return "🛡️"
      case "doctor":
        return "👨‍⚕️"
      case "patient":
        return "👤"
      default:
        return "👤"
    }
  }

  const getRolePath = (role) => {
    switch (role) {
      case "admin":
        return "/admin"
      case "doctor":
        return "/doctor"
      case "patient":
        return "/patient"
      default:
        return "/dashboard"
    }
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <a href="/" className="logo">
            <div className="logo-icon">❤️</div>
            <div className="logo-text">
              <h1>MediCare</h1>
              <p>Hospital Management</p>
            </div>
          </a>

          {token && user.role && (
            <nav className="nav-menu">
              <button
                onClick={() => navigate(getRolePath(user.role))}
                className="btn btn-secondary"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <span>{getRoleIcon(user.role)}</span>
                <span style={{ textTransform: "capitalize" }}>{user.role} Dashboard</span>
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  color: "var(--gray-600)",
                }}
              >
                <span>👤</span>
                <span>{user.name || user.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
