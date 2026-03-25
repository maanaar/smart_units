import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/unit/emergency',     label: 'حجز طوارئ',          icon: '⚡' },
  { to: '/unit/ReceptionPage', label: 'حجز عيادات',         icon: '🏥' },
  { to: '/unit/external',      label: 'حجز خدمات خارجية',   icon: '📋' },
];

export default function BookingTabs() {
  return (
    <div className="flex items-center gap-1 bg-white border-b border-gray-200 px-6 py-2" dir="rtl">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isActive
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <span>{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
