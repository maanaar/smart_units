import {
  HeartPulse,
  CheckCircle2,
  Wifi,
  Shield,
  Activity,
  Stethoscope,
} from "lucide-react";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div className="flex min-h-screen">

      {/* ───── Left branding panel ───── */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">

        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-20 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center gap-14 p-14 w-full">

          {/* Top: Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/25">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              SHN
            </span>
          </div>

          {/* Center: Hero */}
          <div className="space-y-10">

            <div className="space-y-5">
              <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
                Smart Health
                <br />
                <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                  Network
                </span>
              </h1>

              <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
                Connecting Health Units. Empowering Communities across Egypt.
              </p>
            </div>

            {/* Feature cards */}
            <div className="space-y-4 max-w-sm">
              <FeatureCard
                icon={<Shield className="w-5 h-5" />}
                title="End-to-End Encrypted"
                desc="Military-grade security for patient data"
              />
              <FeatureCard
                icon={<Activity className="w-5 h-5" />}
                title="Real-time Sync"
                desc="Instant updates across all health units"
              />
              <FeatureCard
                icon={<Stethoscope className="w-5 h-5" />}
                title="HL7 & FHIR R4"
                desc="Full interoperability with global standards"
              />
            </div>

          </div>

        </div>
      </div>


      {/* ───── Right form panel ───── */}
      <div className="flex-1 flex flex-col bg-gray-50">

        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 p-6 bg-white border-b border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">
            Smart Health Network
          </span>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 py-16">
          <div className="w-full max-w-[420px]">

            {/* Header */}
            <div className="mb-10 space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back
              </h2>

              <p className="text-sm text-gray-500">
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <LoginForm />

          </div>
        </div>

        {/* Bottom badges */}
        <div className="border-t border-gray-200 bg-white px-6 py-5">
          <div className="flex items-center justify-center gap-7 flex-wrap">
            <BottomBadge
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              text="HL7 Ready"
            />
            <BottomBadge
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              text="FHIR R4"
            />
            <BottomBadge
              icon={<Wifi className="w-3.5 h-3.5" />}
              text="Low Bandwidth Optimized"
            />
          </div>

          {/* <p className="text-center text-[11px] text-gray-400 mt-4">
            &copy; {new Date().getFullYear()} Ministry of Health — Smart Health
            Network. All rights reserved.
          </p> */}
        </div>

      </div>
    </div>
  );
}


function FeatureCard({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/[0.08] transition-colors">
      <div className="flex-shrink-0 w-10 h-10 bg-teal-500/15 rounded-lg flex items-center justify-center text-teal-400">
        {icon}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
    </div>
  );
}


function BottomBadge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-gray-400">
      {icon}
      <span className="text-xs">{text}</span>
    </div>
  );
}