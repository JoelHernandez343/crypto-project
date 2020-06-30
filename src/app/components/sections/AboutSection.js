import React from 'react';
import logo from './../../../images/logo@2x.png';

export default function AboutSection({ view }) {
  return (
    <div
      className={`${
        view ? '' : 'hidden'
      } bg-gray-300 text-xl px-8 flex flex-col min-h-full`}
    >
      <div className="flex justify-center pt-10">
        <img src={logo} className="h-32 w-32 pointer-events-none" alt="logo" />
      </div>
      <h1 className="mt-5 text-3xl leading-9 text-indigo-900 quicksand font-bold">
        <span className="text-indigo-700">C</span>rypto
        <span className="text-indigo-700">D</span>plication
      </h1>
      <h2 className="text-xl text-gray-600 quicksand font-medium ">
        Sube y descarga archivos de forma segura a{' '}
        <span className="font-semibold text-indigo-900">Google Drive</span>
      </h2>
    </div>
  );
}
