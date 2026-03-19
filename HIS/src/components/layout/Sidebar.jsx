import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  HeartPulse,
  Users,
  LayoutDashboard,
  Stethoscope,
  ChevronDown,
  LogOut,
  ClipboardPlus,
  FlaskConical,
  Scan,
} from 'lucide-react';
import useAuthStore from '../../features/auth/store';

const NAV = [
  {
    icon: LayoutDashboard,
    label: 'Dashboards',
    key: 'dashboard',
    children: [
      // { to: '/agial/centcom',             label: 'لوحة التحكم المركزية'    },
      // { to: '/agial/nationalcentcom',     label: 'لوحة التحكم الوطنية'     },
      // { to: '/agial/unitcentcom',         label: 'لوحة الوحدة'              },
      { to: '/agial/operationinternal', label: 'مؤشرات العيادات الخارجية' },
      { to: '/agial/patientdashboard',    label: 'لوحة المرضى'              },
      { to: '/agial/operationsdashboard', label: 'لوحة العمليات الطبية'     },
      { to: '/agial/pharmacydashboard',   label: 'لوحة الصيدلية والأدوية'   },
    ],
  },
  {
    icon: Users,
    label: 'الاستقبال',
    key: 'reception',
    children: [
      { to: '/agial/calendar',     label: 'التقويم'         },
      { to: '/agial/appointments', label: 'قائمة المواعيد'  },
    ],
  },
  { to: '/agial/patients',     icon: Users,         label: 'المرضى'          },
  { to: '/agial/nursing',      icon: ClipboardPlus, label: 'التمريض'         },
  { to: '/agial/doctorscreen', icon: Stethoscope,   label: 'الطبيب'          },
  { to: '/agial/labTests',     icon: FlaskConical,  label: 'طلبات التحاليل'  },
  { to: '/agial/radTests',     icon: Scan,          label: 'طلبات الأشعة'    },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, unit, logout } = useAuthStore();

  const [openGroups, setOpenGroups] = useState({ dashboard: true, reception: true });

  const toggleGroup = (key) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <aside className="w-80 flex-shrink-0 overflow-hidden bg-gradient-to-b from-slate-900 via-teal-900 to-slate-900 flex flex-col h-screen sticky rounded-l-2xl top-0">

      {/* Orbs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 -left-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl animate-pulse [animation-delay:2s] pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl animate-pulse [animation-delay:4s] pointer-events-none" />

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
        <div className="flex items-center flex-row-reverse gap-3 px-2 py-4 mb-6">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30 flex-shrink-0">
            <HeartPulse className="w-8 h-8 text-white" />
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-xl leading-tight">Smart Units</p>
            <p className="text-teal-400 text-xs font-medium capitalize">{unit || 'وحدة'}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            if (item.children) {
              const isAnyActive = item.children.some(c => location.pathname === c.to);
              const isOpen = openGroups[item.key] ?? false;
              return (
                <div key={item.key}>
                  <button
                    onClick={() => toggleGroup(item.key)}
                    className={`w-full flex items-center flex-row-reverse gap-3 px-3 py-2.5 rounded-xl text-base font-medium transition-all ${
                      isAnyActive
                        ? 'bg-teal-500/20 text-white border border-teal-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-right">{item.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="mr-6 mt-0.5 space-y-0.5 border-r border-white/10 pr-3">
                      {item.children.map(child => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) =>
                            `flex items-center flex-row-reverse gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
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
                  `flex items-center flex-row-reverse gap-3 px-3 py-2.5 rounded-xl text-base font-medium transition-all ${
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
          <div className="flex items-center flex-row-reverse gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-teal-300 text-md font-bold">
                {(user?.name || 'A')[0].toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 text-right">
              <p className="text-white text-sm font-medium truncate">{user?.name || 'مسؤول'}</p>
              <p className="text-slate-500 text-[11px] capitalize truncate">{unit || 'وحدة'}</p>
            </div>
          </div>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center flex-row-reverse gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>

      </div>
    </aside>
  );
}
