"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Layout from "../components/Layout"
import LoadingSpinner from "../components/LoadingSpinner"
import { FaUserMd, FaCheckCircle, FaStethoscope, FaTrash, FaShieldAlt } from "react-icons/fa"

function AdminPanel() {
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({ name: "", email: "", password: "", specialization: "" })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showModal, setShowModal] = useState(false)

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const specializations = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Dermatology",
    "General Medicine",
    "Surgery",
    "Psychiatry",
  ]

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setDoctors(res.data)
    } catch (err) {
      setError("Failed to load doctors")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      await axios.post("http://localhost:5000/api/admin/doctor", form, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setForm({ name: "", email: "", password: "", specialization: "" })
      setSuccess("Doctor created successfully!")
      setShowModal(false)
      fetchDoctors()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create doctor")
    } finally {
      setSubmitting(false)
    }
  }

  const deleteDoctor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete Dr. ${name}?`)) return

    try {
      await axios.delete(`http://localhost:5000/api/admin/doctor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess("Doctor deleted successfully!")
      fetchDoctors()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to delete doctor")
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex-center" style={{ height: "400px" }}>
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Professional Header */}
        <div className="dashboard-header">
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            <FaShieldAlt />
          </div>
          <h1>Admin Panel</h1>
          <p>Manage doctors and system settings</p>
        </div>

        {/* Horizontal Stats */}
        <div className="stats-horizontal">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FaUserMd />
            </div>
            <div className="stat-content">
              <h3>{doctors.length}</h3>
              <p>Total Doctors</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <h3>{doctors.filter((d) => d.available).length}</h3>
              <p>Available</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <FaStethoscope />
            </div>
            <div className="stat-content">
              <h3>{new Set(doctors.map((d) => d.specialization)).size}</h3>
              <p>Specializations</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>✅</span>
            <span>{success}</span>
          </div>
        )}

        {/* Add Doctor Button */}
        <div className="flex-between">
          <div>
            <h2 className="text-2xl font-bold">Doctors Management</h2>
            <p style={{ color: "var(--gray-600)" }}>View and manage all doctors in the system</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <span>+</span>
            <span>Add New Doctor</span>
          </button>
        </div>

        {/* Doctors Grid */}
        {doctors.length === 0 ? (
          <div className="card text-center" style={{ padding: "4rem 2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.5 }}>
              <FaUserMd />
            </div>
            <h3 className="text-lg font-medium mb-2">No doctors yet</h3>
            <p style={{ color: "var(--gray-600)", marginBottom: "2rem" }}>Create your first doctor account</p>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              Add First Doctor
            </button>
          </div>
        ) : (
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="doctor-card">
                <div className="doctor-avatar">
                  <FaUserMd />
                </div>

                <h3 className="doctor-name">Dr. {doctor.name}</h3>
                <p className="doctor-email">{doctor.email}</p>

                <span className="doctor-specialization">{doctor.specialization}</span>

                <div className="doctor-status">
                  <span className={`status-dot ${doctor.available ? "available" : "unavailable"}`}></span>
                  <span className={`status-text ${doctor.available ? "available" : "unavailable"}`}>
                    {doctor.available ? "Available" : "Unavailable"}
                  </span>
                </div>

                <button
                  onClick={() => deleteDoctor(doctor._id, doctor.name)}
                  className="btn btn-danger btn-sm"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <div className={`modal-overlay ${showModal ? "active" : ""}`}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Add New Doctor</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Enter doctor's full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="Enter email address"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      required
                      className="form-input"
                      placeholder="Create password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Specialization</label>
                    <select
                      required
                      className="form-select"
                      value={form.specialization}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    >
                      <option value="">Select specialization</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                onClick={handleSubmit}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {submitting ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <span>+</span>
                    <span>Create Doctor</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminPanel
