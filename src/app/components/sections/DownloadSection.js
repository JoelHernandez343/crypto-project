import React from 'react';
import MainSection from './download/MainSection';

export default function DownloadSection({ session, view, messageQueue }) {
  return (
    <div
      className={`${
        view ? '' : 'hidden'
      } bg-gray-300 text-xl px-8 flex flex-col min-h-full`}
    >
      <div className="text-left">
        <h1 className="mt-5 text-3xl leading-9 text-indigo-900 quicksand font-bold">
          Descargar archivos
        </h1>
        <h2 className="text-xl text-gray-600 quicksand font-medium mb-3">
          Desde tu nube
        </h2>
      </div>

      <div className="flex-grow py-10 md:px-10 xl:px-32 flex">
        <MainSection messageQueue={messageQueue} session={session} />
      </div>
    </div>
  );
}
