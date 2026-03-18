export default function SearchBar({ value, onChange, placeholder = 'بحث...', filters = [], filterValue, onFilterChange, fullWidth = false }) {
  return (
    <div className={`flex items-center gap-2 ${fullWidth ? 'w-full' : ''}`} dir="rtl">
      <div className={`relative ${fullWidth ? 'flex-1' : ''}`}>
        <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`pr-9 pl-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-300 shadow-sm ${fullWidth ? 'w-full' : 'w-56'}`}
        />
      </div>

      {filters.length > 0 && (
        <select
          value={filterValue}
          onChange={e => onFilterChange(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-300 text-gray-600 shadow-sm"
        >
          {filters.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      )}
    </div>
  )
}
