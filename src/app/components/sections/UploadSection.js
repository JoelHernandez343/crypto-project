import React from 'react';
import MainSection from './upload/MainSection';
import KeyButton from '../buttons/KeyButton';

export default function UploadSection({
  view,
  messageQueue,
  protect,
  upload,
  session,
}) {
  return (
    <div
      className={`${
        view ? '' : 'hidden'
      } bg-gray-300 text-xl px-8 flex flex-col min-h-full`}
    >
      <div className="text-left flex">
        <div className="flex-grow">
          <h1 className="mt-5 text-3xl leading-9 text-indigo-900 quicksand font-bold">
            Subir archivos
          </h1>
          <h2 className="text-xl text-gray-600 quicksand font-medium mb-3">
            Sube los archivos a tu nube
          </h2>
        </div>
        <div className="flex-shrink-0 flex justify-center items-center">
          <KeyButton messageQueue={messageQueue} />
        </div>
      </div>

      <div className="flex-grow py-10 md:px-10 flex">
        <MainSection
          messageQueue={messageQueue}
          protect={protect}
          upload={upload}
          session={session}
        />
      </div>
    </div>
  );
}
