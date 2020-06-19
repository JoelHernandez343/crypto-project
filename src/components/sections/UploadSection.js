import React from 'react';
import MainSection from './upload/MainSection';

export default function UploadSection({ view }) {

  return (
    <div className={`${view ? '' : 'hidden'} bg-gray-300 text-xl px-8 flex flex-col min-h-full`}>
      <div className="text-left">
        <h1 className="mt-5 text-5xl leading-9 text-indigo-900 title">
          Subir archivos
        </h1>
        <h2 className="text-2xl title text-gray-600">
          Sube los archivos a tu nube
        </h2>
      </div>

      <div className="flex-grow md:p-10 flex ">
        <MainSection />
      </div>
    </div >
  );
}