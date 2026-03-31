export default function StatsCards({ title, content }) {
  return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
          <h2 className="text-gray-900 font-bold text-base  mb-5 text-right">
           {title}
          </h2>

          <div className="flex flex-col gap-4">
        {/* Row 1: إجمالي التشخيصات المسجلة */}
        {content && content.map((item, i) => (
  <div key={item.subtitle ?? i} className="flex  justify-between border-b border-gray-100 pb-4 last:border-b-0 " >
                  <span className="text-gray-600 text-base">{item.subtitle}</span>
            <span className="text-gray-900 font-bold text-lg">
              {item.percentage && (
<span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mr-2">
                  {item.percentage}
                </span>
              )}
               
              {item.number && item.number}
              {item.unit && (
                <span className="mr-1">{item.unit}</span>
              )}
              {item.text && item.text.map((t) => (
                  <span key={t} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium block mb-2 text-center"> {t} </span>
              ))}
               
                  </span>
            </div>
        ))}
          

      

         
          </div>
        </div>
  );
}