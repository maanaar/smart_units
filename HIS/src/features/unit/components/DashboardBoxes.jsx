import React from 'react'

export default function DashboardBoxes({header, content=[{}], text}) {
  return (
      <div className='bg-white shadow-sm w-full p-5 rounded-2xl border border-gray-100 font-bold'>
          {header && (
               <h3>
              {header}
          </h3>
          )}
          <div className='flex justify-center '>
        {content && content.map((item, index) => (
            <div key={index} className="p-4 mb-4">
              <h4 className="text-lg font-semibold mb-2 text-gray-600">{item.title}</h4>
                <p className="text-center text-xl" style={{ color: item.color }}>{item.number}</p>
            </div>
        ))}
          </div>
           {text && (
                  <p className=' text-sm text-gray-500'>{text}</p>
              )}
      </div>
    )
}
