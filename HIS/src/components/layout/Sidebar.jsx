import { NavLink, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Users,
  LayoutDashboard,
  CalendarDays,
  FileBarChart,
  BellElectric,
  Stethoscope, 
  LogOut,
  ClipboardPlus,
} from 'lucide-react';
import useAuthStore from '../../features/auth/store';

const NAV = [
  { to: '/agial/patients',  icon: Users,            label: 'Patients'  },
  { to: '/agial/ReceptionPage',  icon: Users,       label: 'Reception' },
  { to: '/agial/dashboard', icon: LayoutDashboard,  label: 'Dashboard' },
  { to:'/agial/doctorscreen',  icon: Stethoscope,  label: 'Doctor'     },
  { to: '/agial/calendar',  icon: CalendarDays,     label: 'Calendar'  },
  { to: '/agial/reports',   icon: FileBarChart,     label: 'Reports'   },
  { to: '/agial/nursing',   icon: ClipboardPlus,     label: 'Nursing'   },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, unit, logout } = useAuthStore();

  return (
    <aside className="w-80 flex-shrink-0 overflow-hidden bg-gradient-to-b from-slate-900 via-teal-900 to-slate-900 flex flex-col h-screen sticky rounded-r-2xl top-0">

      {/* Orbs — mirrors the login panel */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 -right-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl animate-pulse [animation-delay:2s] pointer-events-none" />
      <div className="absolute -bottom-10 left-1/4 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl animate-pulse [animation-delay:4s] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* All content sits above the decorations */}
      <div className="relative z-10 flex flex-col h-full p-4">

        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30 flex-shrink-0">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-xl leading-tight">Smart Health</p>
            <p className="text-teal-400 text-xs font-medium capitalize">{unit || 'unit'}</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-8 px-3 py-2.5 rounded-xl text-lg font-medium transition-all ${
                  isActive
                    ? 'bg-teal-500/20 text-white border border-teal-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + sign out */}
        <div className="border-t border-white/10 pt-4 mt-2 space-y-2">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-teal-300 text-md font-bold">
                {(user?.name || 'A')[0].toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-slate-500 text-[11px] capitalize truncate">{unit || 'unit'}</p>
            </div>
          </div>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-8 h-8" />
            Sign out
          </button>
        </div>

      </div>
    </aside>
  );
}
