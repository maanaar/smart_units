import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  HeartPulse,
  Users,
  LayoutDashboard,
  CalendarDays,
  FileBarChart,
  Stethoscope,
  ChevronDown,
  LogOut,
  ClipboardPlus,
} from 'lucide-react';
import useAuthStore from '../../features/auth/store';

const NAV = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    children: [
      { to: '/agial/centcom', label: 'CentCom Dashboard' },
      { to: '/agial/nationalcentcom',           label: 'National Command' },
      { to: '/agial/unitcentcom',   label: 'Unit Dashboard'   },
    ],
  },  
  { to: '/agial/calendar',  icon: CalendarDays,     label: 'Calendar'  },
  { to: '/agial/ReceptionPage',  icon: Users,       label: 'Reception' },
  { to: '/agial/patients',  icon: Users,            label: 'Patients'  },
  { to: '/agial/nursing',   icon: ClipboardPlus,     label: 'Nursing'   },
  { to:'/agial/doctorscreen',  icon: Stethoscope,  label: 'Doctor'     },
// { to: '/agial/reports',   icon: FileBarChart,     label: 'Reports'   },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, unit, logout } = useAuthStore();

  const [dashOpen, setDashOpen] = useState(true);

  return (
    <aside className="w-80 flex-shrink-0 overflow-hidden bg-gradient-to-b from-slate-900 via-teal-900 to-slate-900 flex flex-col h-screen sticky rounded-r-2xl top-0">

      {/* Orbs */}
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

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            if (item.children) {
              const isAnyActive = item.children.some(c => location.pathname === c.to);
              return (
                <div key={item.label}>
                  {/* group toggle */}
                  <button
                    onClick={() => setDashOpen(o => !o)}
                    className={`w-full flex items-center gap-8 px-3 py-2.5 rounded-xl text-lg font-medium transition-all ${
                      isAnyActive
                        ? 'bg-teal-500/20 text-white border border-teal-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dashOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* sub-items */}
                  {dashOpen && (
                    <div className="ml-6 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                      {item.children.map(child => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              isActive
                                ? 'bg-teal-500/20 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`
                          }
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-8 px-3 py-2.5 rounded-xl text-lg font-medium transition-all ${
                    isActive
                      ? 'bg-teal-500/20 text-white border border-teal-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
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
