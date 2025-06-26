// src/components/ProtectedRoute.jsx
import React from "react"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  // grab the token that you stored at login
  const token = localStorage.getItem("token")

  // if no token, redirect to /login
  if (!token) return <Navigate to="/login" replace />

  // otherwise render the protected page
  return children
}
