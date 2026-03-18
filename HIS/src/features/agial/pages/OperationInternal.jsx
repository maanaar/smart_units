import React from 'react'
import DashboardBoxes from '../components/DashboardBoxes'

export default function OperationInternal() {
    const headerOne = "التحاليل العملية";
    const contentOne = [
        { title: 'مطلوبة', number: 8400 , color:"darkslategrey"},
        { title: 'ما تم', number: 7900 , color:"green"},
        { title: 'لم يتم', number: 500 , color:"red"},
    ];
    const textOne="HbA1c :أكثر التحاليل طلباً"
     const headerTwo = "خدمات الأشعة";
    const contentTwo = [
        { title: 'مطلوبة', number: 3200 , color:"darkslategrey"},
        { title: 'ما تم', number: 3050 , color:"green"},
        { title: 'لم يتم', number: 150 , color:"red"},
    ];
        const textTwo="Ultrasound :أكثر الأشعة طلباً"
  return (
      <div dir="rtl" className='p-4'>
          <div className='grid grid-cols-1 md:grid-cols-2  gap-4'>
              <div>
                  <h4>
                      
                  </h4>
                  <DashboardBoxes header={headerOne} content={contentOne} text={textOne} />
                  <DashboardBoxes header={headerTwo} content={contentTwo} text={textTwo} />
                  </div>
              </div>
    </div>
  )
}
