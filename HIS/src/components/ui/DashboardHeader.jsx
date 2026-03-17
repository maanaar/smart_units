import { CalendarDays, Plus } from 'lucide-react'

export default function DashboardHeader({ title, onAdd, addLabel = 'إضافة موعد جديد', dateValue, onDateChange }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Date filter */}
        <div className="relative flex items-center">
          <CalendarDays className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="date"
            value={dateValue}
            onChange={e => onDateChange?.(e.target.value)}
            className="pr-9 pl-4 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-300 text-gray-600"
          />
        </div>

        {/* Add button */}
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      </div>
    </div>
  )
}
