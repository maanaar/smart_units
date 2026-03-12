import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  ChevronDown,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import useAuthStore from '../store';

const ROLES = [
  'MOH',
  'Governorate',
  'Hospital Admin',
  'Doctor',
  'Nurse',
  'Pharmacist',
  'Lab Technician',
  'Receptionist',
];

const LOCATIONS = [
  'Cairo Governorate - Main HQ',
  'Alexandria Governorate - Main HQ',
];

// Static credentials — replace with Odoo call when ready
const STATIC_USER = 'admin';
const STATIC_PASS = 'admin123';

export default function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({
    username: '',
    password: '',
    role: '',
    location: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (form.username !== STATIC_USER || form.password !== STATIC_PASS) {
      setError('Invalid username or password');
      return;
    }
    login({ name: 'Admin' }, 'static-token', 'agial');
    navigate('/agial/centcom');
  };

  const inputBase =
    'block w-full rounded-xl border bg-white py-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-offset-0';
  const inputNormal = `${inputBase} border-gray-200 hover:border-gray-300 focus:border-teal-500 focus:ring-teal-500/20`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <User className="h-[18px] w-[18px] text-gray-400" />
          </div>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="admin.cairo"
            autoComplete="username"
            className={`${inputNormal} pl-10 pr-4`}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Lock className="h-[18px] w-[18px] text-gray-400" />
          </div>
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="current-password"
            className={`${inputNormal} pl-10 pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Role & Location — side by side on wider screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* System Role */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">System Role</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <ShieldCheck className="h-[18px] w-[18px] text-gray-400" />
            </div>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`${inputNormal} appearance-none pl-10 pr-9 cursor-pointer`}
            >
              <option value="" disabled>Select role</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Assigned Location */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <MapPin className="h-[18px] w-[18px] text-gray-400" />
            </div>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className={`${inputNormal} appearance-none pl-10 pr-9 cursor-pointer`}
            >
              <option value="" disabled>Select location</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between">
        <label className="relative flex items-center gap-2.5 cursor-pointer select-none group">
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={handleChange}
            className="peer sr-only"
          />
          <div className="h-5 w-5 rounded-md border-2 border-gray-300 bg-white flex items-center justify-center transition-all peer-checked:border-teal-500 peer-checked:bg-teal-500 peer-focus-visible:ring-2 peer-focus-visible:ring-teal-500/30 group-hover:border-gray-400 peer-checked:group-hover:border-teal-600">
            <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 12 10" fill="none">
              <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
        </label>
        <a
          href="#"
          className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline underline-offset-2 transition-all"
        >
          Forgot password?
        </a>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="group relative w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:from-teal-600 hover:to-emerald-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 transition-all duration-200"
      >
        Sign In
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </form>
  );
}
