import React from 'react'
import { useState } from "react";
import PatientQueue from '../components/PatientQueue';
import VitalSigns from '../components/VitalSigns';
import NursingNotes from '../components/NursingNotes';
import PatientComplaint from '../components/PatientComplaint';

export default function NursingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans w-full bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="w-full ">
        {/* Header */}
        <div className="border-b border-gray-300 py-3 px-6 text-center  rounded-2xl mb-4"  style={{
    backgroundImage: 'linear-gradient(to right, #10323E 0%, #185357 54%, #10323E 83%)'
  }}>
          <h1 className="text-6xl font-semibold text-white tracking-wide pb-3">Nursing Screen</h1>
        </div>
<div >
                  {/* Patient Queue */}
                  <div className='border border-gray-300 rounded-md overflow-hidden my-4'>
                      <PatientQueue />
                      </div>

                  {/* Vital Signs */}
                  <div className='border border-gray-300 rounded-md overflow-hidden  my-4'>
       <VitalSigns/>
                  </div>
                  <div className='flex gap-2'>
                  {/* Patient Complaint */}
                  <div className='border border-gray-300 rounded-md overflow-hidden  my-4 w-[50%]'>
                      <PatientComplaint />
                      </div>

                  {/* Nursing Notes */}
                    <div className='border border-gray-300 rounded-md overflow-hidden  my-4 w-[50%]'>
                      <NursingNotes />
                      </div>
                      </div>
              </div>
              <div>
                   <div className="flex gap-2">
              <button className="bg-[#9BD0CE]  text-teal-900 hover:text-white hover:bg-teal-700  text-base  rounded-2xl transition-colors px-6 py-1">
                Save
              </button>
              <button className=" bg-teal-900 text-white hover:text-teal-900 hover:bg-white border border-teal-900 text-base  rounded-2xl transition-colors px-6 py-1">
                Send to Doctor
              </button>
            </div>
              </div>
      </div>
    </div>
  );
};
