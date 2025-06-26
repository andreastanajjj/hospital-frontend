"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Stethoscope, Users, Clock, CheckCircle, MapPin, User } from "lucide-react"
import Layout from "../components/Layout"
import LoadingSpinner from "../components/LoadingSpinner"

export default function DoctorDashboard() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  // fetch assigned requests
  const fetchRequests = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/doctor/requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRequests(data)
      setError("")
    } catch (err) {
      console.error("API Error:", err)
      setError("Unable to connect to server.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // handle both transfers and discharges
  const handleUpdate = async (id, destination, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/doctor/requests/${id}`,
        { destination, status },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setSuccess(status === "completed" ? "Patient discharged" : `Patient transferred to ${destination}`)
      await fetchRequests()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Update Error:", err)
      setError("Failed to update request")
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    )
  }

  // summary
  const total = requests.length
  const pending = requests.filter((r) => r.status === "pending").length
  const transferred = requests.filter((r) => r.status === "transferred").length
  const discharged = requests.filter((r) => r.status === "completed").length

  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Professional Header */}
        <div className="dashboard-header">
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            <Stethoscope />
          </div>
          <h1>Doctor Dashboard</h1>
          <p>Manage patient requests and treatments</p>
        </div>

        {/* Horizontal Stats */}
        <div className="stats-horizontal">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Users />
            </div>
            <div className="stat-content">
              <h3>{total}</h3>
              <p>Total Requests</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon cyan">
              <Clock />
            </div>
            <div className="stat-content">
              <h3>{pending}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <MapPin />
            </div>
            <div className="stat-content">
              <h3>{transferred}</h3>
              <p>Transferred</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <CheckCircle />
            </div>
            <div className="stat-content">
              <h3>{discharged}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Patient Requests Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Patient Requests</h3>
            <p className="card-subtitle">Manage and process appointments</p>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patient requests</h3>
              <p className="text-gray-600">Requests will appear here when submitted.</p>
            </div>
          ) : (
            <div className="professional-table">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Reason</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{r.patientName}</span>
                        </div>
                      </td>
                      <td>{r.reason}</td>
                      <td>
                        <span className={r.destination ? "text-blue-600" : "text-gray-400"}>
                          {r.destination || "Not assigned"}
                        </span>
                      </td>
                      <td>
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
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                          {r.status !== "completed" && (
                            <>
                              <select
                                defaultValue=""
                                onChange={(e) => {
                                  const [dest, stat] = e.target.value.split("|")
                                  if (dest && stat) {
                                    handleUpdate(r._id, dest, stat)
                                  }
                                }}
                                className="form-select"
                                style={{ minWidth: "120px", fontSize: "0.75rem" }}
                              >
                                <option value="">Transfer to…</option>
                                <option value="Infirmary|transferred">Infirmary</option>
                                <option value="Radiology|transferred">Radiology</option>
                                <option value="ICU|transferred">ICU</option>
                                <option value="Laboratory|transferred">Laboratory</option>
                              </select>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleUpdate(r._id, r.destination, "completed")}
                              >
                                Discharge
                              </button>
                            </>
                          )}
                          {r.status === "completed" && <span className="text-sm italic text-gray-500">Completed</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
