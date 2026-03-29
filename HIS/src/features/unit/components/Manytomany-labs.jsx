import { useState, useRef, useEffect } from "react";
export default function Many2ManyField({ label, options, selected, setSelected, placeholder = "ابحث واختر...",className }) {
  const [query, setQuery]   = useState("");
  const [open,  setOpen]    = useState(false);
  const ref = useRef(null);

  // إغلاق الـ dropdown لو ضغط بره
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter(
    (o) => o.label.toLowerCase().includes(query.toLowerCase()) && !selected.find((s) => s.id === o.id)
  );

  const add    = (item) => { setSelected([...selected, item]); setQuery(""); };
  const remove = (id)   => setSelected(selected.filter((s) => s.id !== id));

  return (
    <div className="flex items-start gap-4" ref={ref}>
      {/* Label */}
      <label className={`${className} text-sm font-semibold text-slate-600 w-19 flex-shrink-0 pt-2`}>{label}</label>
      {/* Field */}
      <div className="flex-1 relative">
        {/* Tags + Input */}
        <div
          className="min-h-[42px] border border-slate-200 rounded-lg px-3 py-2 flex flex-wrap gap-1.5 cursor-text focus-within:ring-2 focus-within:ring-teal-500/40 focus-within:border-teal-600 transition"
          onClick={() => setOpen(true)}
        >
          {selected.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-full"
            >
              {s.label}
              <button
                onMouseDown={(e) => { e.stopPropagation(); remove(s.id); }}
                className="hover:text-red-500 leading-none"
              >×</button>
            </span>
          ))}
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] outline-none text-sm text-slate-700 placeholder:text-slate-300 bg-transparent text-right"
          />
        </div>

        {/* Dropdown */}
        {open && filtered.length > 0 && (
          <div className="absolute top-full mt-1 right-0 left-0 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
            {filtered.map((item) => (
              <div
                key={item.id}
                onMouseDown={() => add(item)}
                className="px-4 py-2.5 text-sm text-slate-700 hover:bg-teal-50 cursor-pointer transition text-right"
              >
                {item.label}
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {open && filtered.length === 0 && query.trim() !== "" && (
          <div className="absolute top-full mt-1 right-0 left-0 bg-white border border-slate-200 rounded-xl shadow-lg z-50 px-4 py-3 text-sm text-slate-400 text-right">
            لا توجد نتائج
          </div>
        )}
      </div>
    </div>
  );
}