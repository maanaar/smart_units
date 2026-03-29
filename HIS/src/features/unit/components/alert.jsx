import { useState } from "react";

// const alerts = [
//   {
//     id: 1,
//     type: "outbreak",
//     severity: "critical",
//     titleAr: "تفشٍّ محتمل (Possible Outbreak)",
//     subtitleAr: "Gastroenteritis",
//     detailAr: "خلال 3 أيار 27 - بمنطقة السلام (El Salam)",
//     icon: "⚠️",
//     bg: "from-red-600 to-red-700",
//     border: "border-red-400",
//     badge: "bg-red-900/40 text-red-200",
//     badgeText: "حرج",
//     pulse: true,
//   },
//   {
//     id: 2,
//     type: "waiting",
//     severity: "warning",
//     titleAr: "وقت انتظار مرتفع (High Waiting Time)",
//     subtitleAr: "",
//     detailAr: "متوسط الطاولة الفردي: متوسط الانتظار > 45 دقيقة حالياً",
//     icon: "🕐",
//     bg: "from-orange-500 to-orange-600",
//     border: "border-orange-400",
//     badge: "bg-orange-900/40 text-orange-200",
//     badgeText: "تحذير",
//     pulse: false,
//   },
// ];

//  function TestAlertCard({ alert, index }) {
//   const [expanded, setExpanded] = useState(false);

//     return (
//         <div className=" bg-gray-100 flex items-start justify-center p-4 sm:p-6 lg:p-8 font-sans">
//             <div className="w-full ">
//                  <div className="flex flex-col gap-3 sm:gap-4">
//     <div
//       className={`
//         relative overflow-hidden rounded-2xl border ${alert.border}
//         bg-gradient-to-r ${alert.bg}
//         shadow-lg transition-all duration-300
//         hover:shadow-xl hover:scale-[1.01] cursor-pointer
//         animate-fade-in
//       `}
//       style={{ animationDelay: `${index * 120}ms` }}
//       onClick={() => setExpanded(!expanded)}
//     >
//       {/* Subtle noise texture overlay */}
//       <div className="absolute inset-0 opacity-10 pointer-events-none"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
//         }}
//       />

//       {/* Glow line at top */}
//       <div className={`absolute top-0 left-0 right-0 h-[2px] ${alert.severity === "critical" ? "bg-red-300" : "bg-orange-300"} opacity-60`} />

//       <div className="relative flex items-start gap-3 p-4 sm:p-5">
//         {/* Icon with pulse */}
//         <div className="flex-shrink-0 mt-0.5">
//           <div className={`
//             w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl
//             bg-white/20 backdrop-blur-sm border border-white/30
//             ${alert.pulse ? "animate-pulse-slow" : ""}
//           `}>
//             {alert.icon}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 min-w-0" dir="rtl">
//           <div className="flex items-start justify-between gap-2 flex-wrap">
//             <h3 className="text-white font-bold text-sm sm:text-base leading-snug">
//               {alert.titleAr}
//             </h3>
//             <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${alert.badge}`}>
//               {alert.badgeText}
//             </span>
//           </div>

//           {alert.subtitleAr && (
//             <p className="text-white/70 text-xs sm:text-sm mt-0.5 font-medium">
//               {alert.subtitleAr}
//             </p>
//           )}

//           <p className="text-white/85 text-xs sm:text-sm mt-1 leading-relaxed">
//             {alert.detailAr}
//           </p>
//         </div>

//         {/* Chevron */}
//         <div className={`flex-shrink-0 text-white/60 text-xs transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
//           ▼
//         </div>
//       </div>

//       {/* Expandable detail row */}
//       {expanded && (
//         <div className="relative border-t border-white/20 bg-black/20 px-4 sm:px-5 py-3" dir="rtl">
//           <p className="text-white/70 text-xs">
//             اضغط لعرض التفاصيل الكاملة أو التوجه إلى لوحة التحكم الخاصة بهذا التنبيه.
//           </p>
//           <button className="mt-2 text-xs text-white underline underline-offset-2 hover:text-white/80 transition-colors">
//             عرض التفاصيل ←
//           </button>
//         </div>
//       )}
//                 </div>
//                 </div>
//             </div>
//              <style>{`
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(10px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           opacity: 0;
//           animation: fade-in 0.4s ease forwards;
//         }
//         @keyframes pulse-slow {
//           0%, 100% { opacity: 1; }
//           50%       { opacity: 0.6; }
//         }
//         .animate-pulse-slow {
//           animation: pulse-slow 2s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// }
export default function AlertCard({ alerts }) { 
    return (
        <div className=" bg-gray-100 flex items-start justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full ">  
                <div className="flex flex-col gap-3 sm:gap-4">
                    {alerts.map((alert, i) => (
                         <div
      className={`
        relative overflow-hidden rounded-2xl border ${alert.border}
        bg-gradient-to-r ${alert.bg}
        shadow-lg transition-all duration-300
        hover:shadow-xl hover:scale-[1.01] cursor-pointer
        animate-fade-in
      `}
    >
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Glow line at top */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${alert.severity === "critical" ? "bg-red-300" : "bg-orange-300"} opacity-60`} />

      <div className="relative flex items-start gap-3 p-4 sm:p-5">
        {/* Icon with pulse */}
        <div className="flex-shrink-0 mt-0.5">
          <div className={`
            w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl
            bg-white/20 backdrop-blur-sm border border-white/30
            ${alert.pulse ? "animate-pulse-slow" : ""}
          `}>
            {alert.icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0" >
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="text-white font-bold text-sm sm:text-base leading-snug">
              {alert.titleAr}
            </h3>
            <span className={`flex-shrink-0 text-xs px-2 py-1 pb-2 rounded-full font-medium ${alert.badge}`}>
              {alert.badgeText}
            </span>
          </div>

          {alert.subtitleAr && (
            <p className="text-white/70 text-xs sm:text-sm mt-1font-medium">
              {alert.subtitleAr}
            </p>
          )}

          <p className="text-white/85 text-xs sm:text-sm mt-1 leading-relaxed">
            {alert.detailAr}
          </p>
        </div>

        {/* Chevron */}
      
      </div>

   
      
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

//  function OutpatientAlerts() {
//   return (
// <div>
//         {/* Alert Cards */}
//         <div className="flex flex-col gap-3 sm:gap-4">
//           {alerts.map((alert, i) => (
//             <AlertCard key={alert.id} alert={alert} index={i} />
//           ))}
//         </div>

//         {/* Footer count */}
//         <p className="text-right text-gray-400 text-xs mt-4">
//           {alerts.length} تنبيه نشط
//         </p>
      

//       <style>{`
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(10px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           opacity: 0;
//           animation: fade-in 0.4s ease forwards;
//         }
//         @keyframes pulse-slow {
//           0%, 100% { opacity: 1; }
//           50%       { opacity: 0.6; }
//         }
//         .animate-pulse-slow {
//           animation: pulse-slow 2s ease-in-out infinite;
//         }
//       `}</style>
//   </div>
//   );
// }