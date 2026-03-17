import React from 'react'

export default function Card({ title, stat, description, descriptionColor = 'text-gray-400', icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 border border-gray-100">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</span>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-800">{stat}</p>
      {description && <p className={`text-sm font-medium ${descriptionColor}`}>{description}</p>}
    </div>
  )
}
