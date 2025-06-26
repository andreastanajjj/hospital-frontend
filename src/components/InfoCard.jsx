"use client"

import React from "react"

export default function InfoCard({ Icon, value, label }) {
  return (
    <div
      className="card flex items-center"
      style={{
        padding: "1rem",
        gap: "1rem",
      }}
    >
      <Icon size={36} style={{ color: "var(--accent-purple)" }} />
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm" style={{ color: "var(--gray-600)" }}>
          {label}
        </div>
      </div>
    </div>
  )
}
