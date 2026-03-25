import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_DOCTORS, MOCK_SPECIALTIES, MOCK_EVENTS } from '../mockCalendar';
import useAgialStore from '../store';

// ── Status colours ─────────────────────────────────────────────────────────────
const STATUS = {
  ON_THE_FLY: { label: 'عاجل',       bg: 'bg-sky-100',     text: 'text-sky-800',     dot: 'bg-sky-500'     },
  CONFIRMED:  { label: 'مؤكد',       bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  ARRIVED:    { label: 'وصل',        bg: 'bg-teal-100',    text: 'text-teal-800',    dot: 'bg-teal-500'    },
  IN_CHAIR:   { label: 'في العيادة', bg: 'bg-violet-100',  text: 'text-violet-800',  dot: 'bg-violet-500'  },
  IN_PAYMENT: { label: 'في الدفع',   bg: 'bg-amber-100',   text: 'text-amber-800',   dot: 'bg-amber-500'   },
  PAID:       { label: 'تم الدفع',   bg: 'bg-lime-100',    text: 'text-lime-800',    dot: 'bg-lime-500'    },
  CLOSED:     { label: 'مغلق',       bg: 'bg-gray-100',    text: 'text-gray-500',    dot: 'bg-gray-400'    },
};

// ── Grid config ────────────────────────────────────────────────────────────────
const HOUR_START = 7;
const HOUR_END   = 17;
const SLOT_MINS  = 15;
const SLOT_H     = 52;

const SLOTS = [];
for (let h = HOUR_START; h < HOUR_END; h++) {
  for (let m = 0; m < 60; m += SLOT_MINS) {
    SLOTS.push({ h, m });
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const toISO   = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const toMins  = (iso) => { const [h, m] = iso.slice(11, 16).split(':').map(Number); return h * 60 + m; };
const fmtTime = (h, m) => {
  const ap = h < 12 ? 'ص' : 'م';
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hh}:${String(m).padStart(2, '0')} ${ap}`;
};
const fmtDate = (d) => d.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// ── EventCard ──────────────────────────────────────────────────────────────────
function EventCard({ event, onClick }) {
  const s     = STATUS[event.status] || STATUS.ON_THE_FLY;
  const start = toMins(event.start);
  const end   = toMins(event.end);
  const time  = `${fmtTime(Math.floor(start / 60), start % 60)} – ${fmtTime(Math.floor(end / 60), end % 60)}`;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(event); }}
      className={`h-full w-full rounded-lg px-2.5 py-1.5 overflow-hidden shadow-sm border border-white/70 cursor-pointer hover:brightness-95 hover:shadow-md transition-all ${s.bg} ${s.text}`}
      title={`${event.patientName} · ${time} · ${s.label}`}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
        <span className="text-[11px] font-semibold truncate">{s.label}</span>
      </div>
      <div className="text-xs font-semibold truncate">{event.patientName}</div>
      <div className="text-[10px] opacity-60 mt-0.5" dir="ltr">{time}</div>
    </div>
  );
}

// ── SpecialtyColumn ──────────────────────────────────────────────────────────
function SpecialtyColumn({ specialty, events, dateStr, onEventClick, onSlotClick }) {
  return (
    <div className="relative border-r border-gray-100 last:border-0">
      {SLOTS.map((slot, i) => {
        const slotStartMins = slot.h * 60 + slot.m;
        const hasEvent = events.some(ev => {
          const evStart = toMins(ev.start);
          const evEnd = toMins(ev.end);
          return slotStartMins >= evStart && slotStartMins < evEnd;
        });

        return (
          <div
            key={i}
            className={`border-b ${slot.m === 0 ? 'border-gray-200' : 'border-gray-100'} ${
              !hasEvent ? 'hover:bg-teal-50/50 cursor-pointer group' : ''
            }`}
            style={{ height: SLOT_H }}
            onClick={() => {
              if (!hasEvent) onSlotClick(specialty, slot, dateStr);
            }}
          >
            {!hasEvent && (
              <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-medium text-teal-500 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  + جديد
                </span>
              </div>
            )}
          </div>
        );
      })}

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
            <EventCard event={ev} onClick={onEventClick} />
          </div>
        );
      })}
    </div>
  );
}

// ── CalendarPage ───────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const navigate = useNavigate();
  const [date,        setDate]        = useState(new Date());
  const [specialties, setSpecialties] = useState([]);
  const [events,      setEvents]      = useState([]);

  const storeAppointments = useAgialStore((s) => s.appointments);

  useEffect(() => { setSpecialties(MOCK_SPECIALTIES); }, []);

  // Merge mock + store appointments
  useEffect(() => {
    const dateStr = toISO(date);
    const mockForDate = MOCK_EVENTS.filter(e => e.start.startsWith(dateStr));
    const savedForDate = storeAppointments.filter(e => e.start?.startsWith(dateStr));
    const merged = [...mockForDate];
    savedForDate.forEach(sa => {
      const idx = merged.findIndex(m => m.id === sa.id);
      if (idx >= 0) merged[idx] = sa;
      else merged.push(sa);
    });
    setEvents(merged);
  }, [date, storeAppointments]);

  // Navigate to reception page with slot data
  const handleEventClick = (event) => {
    const doctor = MOCK_DOCTORS.find(d => d.id === event.doctorId);
    navigate('/unit/ReceptionPage', {
      state: {
        slot: {
          event,
          doctor,
          specialty: doctor?.specialty || '',
          date: toISO(date),
          time: event.start?.slice(11, 16),
        },
      },
    });
  };

  const handleSlotClick = (specialty, slot, dateStr) => {
    const time = `${String(slot.h).padStart(2, '0')}:${String(slot.m).padStart(2, '0')}`;
    navigate('/unit/ReceptionPage', {
      state: {
        slot: {
          event: null,
          specialty: specialty.id,
          date: dateStr,
          time,
        },
      },
    });
  };

  const dateStr = toISO(date);

  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
        <div className="px-6 py-3 flex items-center justify-between gap-4 flex-wrap" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
            <h1 className="text-xl font-bold bg-gradient-to-l from-emerald-800 to-teal-600 bg-clip-text text-transparent">
              تقويم المواعيد
            </h1>
          </div>

          {/* Date navigator */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1">
            {/* RTL: right arrow = go back (previous day) */}
            <button
              onClick={() => setDate(d => addDays(d, -1))}
              className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-teal-600 transition-all"
              title="اليوم السابق"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setDate(new Date())}
              className="px-3 py-1 text-sm font-semibold rounded-lg hover:bg-white hover:shadow-sm text-gray-700 hover:text-teal-700 transition-all"
            >
              اليوم
            </button>

            {/* left arrow = go forward (next day) */}
            <button
              onClick={() => setDate(d => addDays(d, 1))}
              className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-gray-500 hover:text-teal-600 transition-all"
              title="اليوم التالي"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="text-sm font-semibold text-gray-800 px-2 border-r border-gray-200 mr-1">
              {fmtDate(date)}
            </span>
          </div>

          <span className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {events.length} موعد · {specialties.length} تخصص
          </span>
        </div>
      </div>

      {/* status legend */}
      <div className="px-6 py-2 bg-white border-b border-gray-100 flex-shrink-0 flex flex-wrap gap-x-5 gap-y-1" dir="rtl">
        {Object.entries(STATUS).map(([key, s]) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        ))}
        <span className="mr-auto text-xs text-teal-600 font-medium">
          اضغط على خانة فارغة لحجز موعد · اضغط على موعد لعرضه/تعديله
        </span>
      </div>

      {/* ── Grid ── */}
      <div className="flex-1 overflow-auto">
        <div style={{ minWidth: `${80 + specialties.length * 180}px` }}>

          {/* specialty header */}
          <div
            className="grid sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm"
            style={{ gridTemplateColumns: `80px repeat(${specialties.length}, 1fr)` }}
          >
            <div className="py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-r border-gray-100">
              الوقت
            </div>
            {specialties.map(spec => {
              const specDoctors = MOCK_DOCTORS.filter(d => d.specialty === spec.id);
              const specEvents  = events.filter(e => specDoctors.some(d => d.id === e.doctorId));
              return (
                <div key={spec.id} className="py-3 px-3 border-r border-gray-100 last:border-0 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {spec.label[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-800 leading-tight">{spec.label}</div>
                    <div className="text-[10px] text-emerald-600 font-medium">
                      {specEvents.length} موعد · {specDoctors.length} طبيب
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* time + specialty columns */}
          <div
            className="grid"
            style={{ gridTemplateColumns: `80px repeat(${specialties.length}, 1fr)` }}
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

            {specialties.map(spec => {
              const specDoctors = MOCK_DOCTORS.filter(d => d.specialty === spec.id);
              const specEvents  = events.filter(e => specDoctors.some(d => d.id === e.doctorId));
              return (
                <SpecialtyColumn
                  key={spec.id}
                  specialty={spec}
                  events={specEvents}
                  dateStr={dateStr}
                  onEventClick={handleEventClick}
                  onSlotClick={handleSlotClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
