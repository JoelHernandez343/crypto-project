import React from 'react';
import MainSection from './upload/MainSection';

export default function UploadSection({ view, messageQueue }) {
  return (
    <div
      className={`${
        view ? '' : 'hidden'
      } bg-gray-300 text-xl px-8 flex flex-col min-h-full`}
    >
      <div className="text-left">
        <h1 className="mt-5 text-3xl leading-9 text-indigo-900 quicksand font-bold">
          Subir archivos
        </h1>
        <h2 className="text-xl text-gray-600 quicksand font-medium mb-3">
          Sube los archivos a tu nube
        </h2>
      </div>

      <div className="flex-grow py-10 md:px-10 lg:px-16 xl:px-32 flex ">
        <MainSection messageQueue={messageQueue} />
      </div>
    </div>
  );
}
