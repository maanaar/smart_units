import { FileText, AlertTriangle, StickyNote } from 'lucide-react';

/**
 * Renders Odoo HTML fields (diagnostic, Drug_Allergies, general_notes)
 * in sandboxed iframes to avoid style bleed.
 */
function HtmlFrame({ html, minHeight = 160 }) {
  if (!html || html.trim() === '') {
    return (
      <p className="text-sm text-gray-400 italic py-4 text-center">لا يوجد محتوى</p>
    );
  }

  const blob = new Blob([html], { type: 'text/html' });
  const src = URL.createObjectURL(blob);

  return (
    <iframe
      src={src}
      sandbox="allow-same-origin"
      className="w-full rounded-xl border border-gray-100"
      style={{ minHeight, border: 'none' }}
      onLoad={(e) => {
        // auto-resize iframe to its content height
        try {
          const h = e.target.contentDocument?.body?.scrollHeight;
          if (h) e.target.style.height = `${h + 24}px`;
        } catch {/* cross-origin — leave minHeight */}
      }}
    />
  );
}

function Section({ icon, title, children, accentClass = 'bg-teal-50 border-teal-100 text-teal-700' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`flex items-center gap-2.5 px-5 py-3 border-b ${accentClass}`}>
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

export default function DiagnosisPanel({ diagnosis, drugAllergies, generalNotes }) {
  return (
    <div className="space-y-4">
      <Section
        icon={<FileText className="w-4 h-4" />}
        title="التشخيص"
        accentClass="bg-teal-50 border-teal-100 text-teal-700"
      >
        <HtmlFrame html={diagnosis} />
      </Section>

      <Section
        icon={<AlertTriangle className="w-4 h-4" />}
        title="الحساسية الدوائية"
        accentClass="bg-red-50 border-red-100 text-red-600"
      >
        <HtmlFrame html={drugAllergies} />
      </Section>

      <Section
        icon={<StickyNote className="w-4 h-4" />}
        title="ملاحظات عامة"
        accentClass="bg-amber-50 border-amber-100 text-amber-700"
      >
        <HtmlFrame html={generalNotes} />
      </Section>
    </div>
  );
}
