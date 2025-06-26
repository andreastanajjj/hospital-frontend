"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Layout from "../components/Layout"
import LoadingSpinner from "../components/LoadingSpinner"
import { FaCalendarAlt, FaClock, FaCheck, FaTrash, FaUser, FaUserInjured } from "react-icons/fa"

export default function PatientPanel() {
  const [doctors, setDoctors] = useState([])
  const [requests, setRequests] = useState([])
  const [form, setForm] = useState({ doctorId: "", reason: "" })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  // Fetch doctors & this patient's requests
  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/public/doctors")
      setDoctors(data)
    } catch {
      setError("Failed to load doctors")
    }
  }

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/patient/requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRequests(data)
    } catch {
      setError("Failed to load your appointments")
    }
  }

  useEffect(() => {
    Promise.all([fetchDoctors(), fetchRequests()])
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      // Only doctorId & reason go to the backend
      await axios.post(
        "http://localhost:5000/api/patient/requests",
        {
          doctorId: form.doctorId,
          reason: form.reason,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setSuccess("Appointment requested!")
      setForm({ doctorId: "", reason: "" })
      await fetchRequests()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed")
    } finally {
      setSubmitting(false)
    }
  }

  const deleteRequest = async (id) => {
    if (!confirm("Cancel this appointment?")) return

    try {
      await axios.delete(`http://localhost:5000/api/patient/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess("Appointment canceled")
      await fetchRequests()
      setTimeout(() => setSuccess(""), 3000)
    } catch {
      setError("Failed to cancel")
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
            <FaUserInjured />
          </div>
          <h1>Patient Portal</h1>
          <p>Book appointments and manage your healthcare</p>
        </div>

        {/* Horizontal Stats */}
        <div className="stats-horizontal">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h3>{requests.length}</h3>
              <p>Total Requests</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon cyan">
              <FaClock />
            </div>
            <div className="stat-content">
              <h3>{requests.filter((r) => r.status === "pending").length}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <FaCheck />
            </div>
            <div className="stat-content">
              <h3>{requests.filter((r) => r.status === "completed").length}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        {/* Appointment Form */}
        <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="card-header">
            <h3 className="card-title">Submit New Request</h3>
            <p className="card-subtitle">Book an appointment with a doctor</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <div className="input-group">
                <span className="input-icon">
                  <FaUser />
                </span>
                <input
                  type="text"
                  className="form-input"
                  value={user.name || ""}
                  disabled
                  style={{ backgroundColor: "var(--gray-100)" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Doctor</label>
              <select
                className="form-select"
                value={form.doctorId}
                onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                required
              >
                <option value="">-- Choose a Doctor --</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id} disabled={!d.available}>
                    Dr. {d.name} - {d.specialization} {d.available ? "(Available)" : "(Unavailable)"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reason for Visit</label>
              <textarea
                className="form-textarea"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Please describe your symptoms or reason for the visit..."
                required
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              {submitting ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <FaCalendarAlt />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Requests */}
        {requests.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Your Appointments</h3>
              <p className="card-subtitle">Manage your current requests</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {requests.map((r) => (
                <div
                  key={r._id}
                  className="card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem",
                    margin: "0",
                    backgroundColor: "var(--gray-50)",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <FaUser style={{ color: "var(--primary-blue)" }} />
                      <strong>Dr. {r.doctorName}</strong>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : r.status === "transferred"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                        style={{ textTransform: "capitalize" }}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p style={{ color: "var(--gray-600)", margin: "0" }}>{r.reason}</p>
                    {r.destination && (
                      <p style={{ color: "var(--primary-blue)", margin: "0.25rem 0 0 0", fontSize: "0.875rem" }}>
                        Transferred to: {r.destination}
                      </p>
                    )}
                  </div>

                  {r.status !== "completed" && (
                    <button
                      onClick={() => deleteRequest(r._id)}
                      className="btn btn-danger btn-sm"
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <FaTrash />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
