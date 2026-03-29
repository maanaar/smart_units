import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  Tooltip,
  XAxis, YAxis,
} from 'recharts'

const PALETTE = ['#0d9488', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#3b82f6']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 text-xs text-gray-700" dir="rtl">
      {label && <p className="font-semibold mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  )
}

/** type: 'area' | 'bar' | 'pie' */
export default function MiniChart({ title, type = 'area', data, dataKey, nameKey = 'name', color = '#0d9488', height = 130 }) {
  return (
    <div className='w-full'>
      {title && <p className="text-sm font-semibold text-gray-600 mb-3">{title}</p>}

      {type === 'area' && (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <XAxis dataKey={nameKey} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#grad-${dataKey})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {type === 'bar' && (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barSize={14}>
            <XAxis dataKey={nameKey} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {type === 'pie' && (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={50} innerRadius={28} paddingAngle={3}>
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      )}

      {/* Legend for pie */}
      {type === 'pie' && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 justify-center">
          {data.map((d, i) => (
            <span key={i} className="flex items-center gap-1 text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: PALETTE[i % PALETTE.length] }} />
              {d[nameKey]}
            </span>
          ))}
        </div>
      )}
   </div>
  )
}
