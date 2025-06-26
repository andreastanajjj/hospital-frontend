"use client"

import { useNavigate } from "react-router-dom"
import { Heart, ArrowRight, Shield, Stethoscope, User } from "lucide-react"
import Layout from "../components/Layout"
import Card from "../components/Card"

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const roleCards = [
    {
      role: "admin",
      title: "Admin Panel",
      description: "Manage doctors, system settings, and user accounts",
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      color: "from-purple-600 to-purple-700",
      path: "/admin",
    },
    {
      role: "doctor",
      title: "Doctor Dashboard",
      description: "View patient requests, manage treatments, and update records",
      icon: <Stethoscope className="w-8 h-8 text-green-600" />,
      color: "from-green-600 to-green-700",
      path: "/doctor",
    },
    {
      role: "patient",
      title: "Patient Portal",
      description: "Book appointments, view medical records, and track treatments",
      icon: <User className="w-8 h-8 text-blue-600" />,
      color: "from-blue-600 to-blue-700",
      path: "/patient",
    },
  ]

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to MediCare</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive hospital management system. Access your dashboard based on your role.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {roleCards.map((card) => (
            <Card key={card.role} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="text-center space-y-4">
                <div className="flex justify-center">{card.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
                <button
                  onClick={() => navigate(card.path)}
                  className={`w-full bg-gradient-to-r ${card.color} text-white py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center space-x-2 group-hover:scale-105 transform transition-transform`}
                >
                  <span>Access Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Current User Info */}
        {user.role && (
          <Card className="max-w-md mx-auto text-center bg-gray-50">
            <div className="space-y-3">
              <div className="text-sm text-gray-600">Currently logged in as:</div>
              <div className="font-semibold text-gray-900 capitalize">{user.role}</div>
              <div className="text-sm text-gray-600">{user.name || user.email}</div>
              <button
                onClick={() => navigate(roleCards.find((c) => c.role === user.role)?.path || "/dashboard")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Go to your dashboard →
              </button>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard
