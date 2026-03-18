import { useState } from 'react'

export default function NursingNotes() {
  const [notes, setNotes] = useState('');

  return (
    <div>
      <div className="p-5" dir="rtl">
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={5}
          placeholder="أدخل ملاحظات التمريض هنا..."
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 transition resize-none"
        />
      </div>
    </div>
  );
}
