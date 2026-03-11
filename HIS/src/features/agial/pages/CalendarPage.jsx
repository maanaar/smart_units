import { useState, useEffect } from 'react';
import { MOCK_DOCTORS, MOCK_EVENTS } from '../mockCalendar';
// When real API is ready, replace the mock imports with:
// import { fetchCalendarMeta, fetchAppointments } from '../api/calendarApi';

// ── Status colours ─────────────────────────────────────────────────────────────
const STATUS = {
  ON_THE_FLY: { label: 'On The Fly',  bg: 'bg-sky-100',     text: 'text-sky-800',     dot: 'bg-sky-500'     },
  CONFIRMED:  { label: 'Confirmed',   bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  ARRIVED:    { label: 'Arrived',     bg: 'bg-teal-100',    text: 'text-teal-800',    dot: 'bg-teal-500'    },
  IN_CHAIR:   { label: 'In Chair',    bg: 'bg-violet-100',  text: 'text-violet-800',  dot: 'bg-violet-500'  },
  IN_PAYMENT: { label: 'In Payment',  bg: 'bg-amber-100',   text: 'text-amber-800',   dot: 'bg-amber-500'   },
  PAID:       { label: 'Paid',        bg: 'bg-lime-100',    text: 'text-lime-800',    dot: 'bg-lime-500'    },
  CLOSED:     { label: 'Closed',      bg: 'bg-gray-100',    text: 'text-gray-500',    dot: 'bg-gray-400'    },
};

// ── Grid config ────────────────────────────────────────────────────────────────
const HOUR_START = 7;
const HOUR_END   = 17;
const SLOT_MINS  = 15;
const SLOT_H     = 52; // px per 15-min slot

const SLOTS = [];
for (let h = HOUR_START; h < HOUR_END; h++) {
  for (let m = 0; m < 60; m += SLOT_MINS) {
    SLOTS.push({ h, m });
  }
}

// ── Tiny helpers ───────────────────────────────────────────────────────────────
const toISO   = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const toMins  = (iso) => { const [h, m] = iso.slice(11, 16).split(':').map(Number); return h * 60 + m; };
const fmtTime = (h, m) => {
  const ap = h < 12 ? 'AM' : 'PM';
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hh}:${String(m).padStart(2, '0')} ${ap}`;
};
const fmtDate = (d) => d.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// ── EventCard ──────────────────────────────────────────────────────────────────
function EventCard({ event }) {
  const s     = STATUS[event.status] || STATUS.ON_THE_FLY;
  const start = toMins(event.start);
  const end   = toMins(event.end);
  const time  = `${fmtTime(Math.floor(start / 60), start % 60)} – ${fmtTime(Math.floor(end / 60), end % 60)}`;

  return (
    <div
      className={`h-full w-full rounded-lg px-2.5 py-1.5 overflow-hidden shadow-sm border border-white/70 cursor-pointer hover:brightness-95 transition-all ${s.bg} ${s.text}`}
      title={`${event.patientName} · ${time} · ${s.label}`}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
        <span className="text-[11px] font-semibold truncate">{s.label}</span>
      </div>
      <div className="text-xs font-semibold truncate">{event.patientName}</div>
      <div className="text-[10px] opacity-60 mt-0.5">{time}</div>
    </div>
  );
}

// ── DoctorColumn ───────────────────────────────────────────────────────────────
function DoctorColumn({ events }) {
  return (
    <div className="relative border-r border-gray-100 last:border-0">
      {/* slot background lines */}
      {SLOTS.map((slot, i) => (
        <div
          key={i}
          className={`border-b ${slot.m === 0 ? 'border-gray-200' : 'border-gray-100'}`}
          style={{ height: SLOT_H }}
        />
      ))}

      {/* events */}
      {events.map(ev => {
        const startMins = toMins(ev.start);
        const endMins   = toMins(ev.end);
        const si   = Math.floor((startMins - HOUR_START * 60) / SLOT_MINS);
        const span = Math.max(Math.floor((endMins - startMins) / SLOT_MINS), 1);

        if (si < 0 || si >= SLOTS.length) return null;

        return (
          <div
            key={ev.id}
            className="absolute inset-x-1"
            style={{ top: si * SLOT_H + 2, height: span * SLOT_H - 4, zIndex: 2 }}
          >
            <EventCard event={ev} />
          </div>
        );
      })}
    </div>
  );
}

// ── CalendarPage ───────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const [date,    setDate]    = useState(new Date());
  const [doctors, setDoctors] = useState([]);
  const [events,  setEvents]  = useState([]);

  // Load doctors once — swap mock for real API when ready
  useEffect(() => {
    setDoctors(MOCK_DOCTORS);
  }, []);

  // Load appointments whenever date changes
  useEffect(() => {
    const dateStr = toISO(date);
    const filtered = MOCK_EVENTS.filter(e => e.start.startsWith(dateStr));
    setEvents(filtered);
    // Real API: fetchAppointments(dateStr).then(({ events }) => setEvents(events));
  }, [date]);

  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">

        {/* title + date nav */}
        <div className="px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full bg-emerald-700" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-900 to-teal-700 bg-clip-text text-transparent">
              Appointment Calendar
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setDate(d => addDays(d, -1))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={() => setDate(new Date())} className="px-3 py-1 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700">
              Today
            </button>
            <button onClick={() => setDate(d => addDays(d, 1))} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-800 ml-1">{fmtDate(date)}</span>
          </div>

          <span className="text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5" />
            {events.length} appointments · {doctors.length} doctors
          </span>
        </div>
      </div>

      {/* status legend */}
      <div className="px-6 py-2 bg-white border-b border-gray-100 flex-shrink-0 flex flex-wrap gap-x-5 gap-y-1">
        {Object.entries(STATUS).map(([key, s]) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        ))}
      </div>

      {/* ── Grid ── */}
      <div className="flex-1 overflow-auto">
        <div style={{ minWidth: `${80 + doctors.length * 180}px` }}>

          {/* doctor header — dynamic columns */}
          <div
            className="grid sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm"
            style={{ gridTemplateColumns: `80px repeat(${doctors.length}, 1fr)` }}
          >
            <div className="py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-r border-gray-100">
              Time
            </div>
            {doctors.map(doc => (
              <div key={doc.id} className="py-3 px-3 border-r border-gray-100 last:border-0 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {doc.name.split(' ').pop()[0]}
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-800 leading-tight">{doc.name}</div>
                  <div className="text-[10px] text-emerald-600 font-medium">
                    {events.filter(e => e.doctorId === doc.id).length} appt
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* time + doctor columns */}
          <div
            className="grid"
            style={{ gridTemplateColumns: `80px repeat(${doctors.length}, 1fr)` }}
          >
            {/* time gutter */}
            <div className="border-r border-gray-100">
              {SLOTS.map((slot, i) => (
                <div key={i} className="border-b border-gray-100 flex items-start justify-end pr-2 pt-1" style={{ height: SLOT_H }}>
                  {slot.m === 0 && (
                    <span className="text-[10px] font-medium text-gray-400">{fmtTime(slot.h, 0)}</span>
                  )}
                </div>
              ))}
            </div>

            {/* one column per doctor — rendered dynamically */}
            {doctors.map(doc => (
              <DoctorColumn
                key={doc.id}
                doctor={doc}
                events={events.filter(e => e.doctorId === doc.id)}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
