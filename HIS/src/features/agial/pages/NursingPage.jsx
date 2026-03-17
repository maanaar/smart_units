import React from 'react'
import { useState } from "react";
import PatientQueue from '../components/PatientQueue';
import VitalSigns from '../components/VitalSigns';
import NursingNotes from '../components/NursingNotes';
import PatientComplaint from '../components/PatientComplaint';

export default function NursingPage() {
  return (
    <div className="h-full overflow-y-auto bg-gray-100  py-5 px-4 font-sans w-full bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="w-full ">
        {/* Header */}
     
              <div className=" relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900/80 to-slate-900  rounded-2xl">
      {/* Animated gradient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" />


        <div className="text-center py-10  relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900/80 to-slate-900" style={{
          backgroundImage: 'linear-gradient(rgb(255 255 255 / 11%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}>
         
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Nursing Screen
            </h1>
          </div>
        </div>
<div >
                  {/* Patient Queue */}
                  <div className='border border-gray-300 rounded-2xl overflow-hidden my-4 bg-white  shadow-md'>
                      <PatientQueue />
                      </div>

                  {/* Vital Signs */}
                  <div className='border border-gray-300 rounded-2xl overflow-hidden  my-4 bg-white  shadow-md'>
       <VitalSigns/>
                  </div>
                  <div className='flex gap-2'>
                  {/* Patient Complaint */}
                  <div className='border border-gray-300 rounded-2xl overflow-hidden  my-4 w-[50%] bg-white  shadow-md'>
                      <PatientComplaint />
                      </div>

                  {/* Nursing Notes */}
                    <div className='border border-gray-300 rounded-2xl overflow-hidden  my-4 w-[50%] bg-white  shadow-md'>
                      <NursingNotes />
                      </div>
                      </div>
              </div>
        <div>
            <div className="flex gap-2 justify-end">
              <button className=" bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold px-6 py-3 rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2">
                Save
              </button>
              <button className="bg-[#1c6a60]/80 hover:bg-[#048171]/80 active:scale-95 text-white font-bold py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2 px-6">
                Send to Doctor
              </button>
            </div>
                   {/* <div className="flex gap-2 justify-end">
              <button className="bg-[#9BD0CE]  text-teal-900 hover:text-white hover:bg-teal-700  text-base  rounded-2xl transition-colors px-6 py-1">
                Save
              </button>
              <button className=" bg-teal-900 text-white hover:text-teal-900 hover:bg-white border border-teal-900 text-base  rounded-2xl transition-colors px-6 py-1">
                Send to Doctor
              </button>
            </div> */}
              </div>
      </div>
    </div>
  );
};
