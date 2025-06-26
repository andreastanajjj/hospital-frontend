"use client"

import { useNavigate } from "react-router-dom"
import { Home, ArrowLeft, AlertTriangle } from "lucide-react"

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-2xl">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back to safety.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
