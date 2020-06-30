import React from 'react';
import MainSection from './download/MainSection';
import KeyButton from '../buttons/KeyButton';

export default function DownloadSection({
  session,
  view,
  messageQueue,
  settedKey,
  setSettedKey,
}) {
  return (
    <div
      className={`${
        view ? '' : 'hidden'
      } bg-gray-300 text-xl px-8 flex flex-col min-h-full`}
    >
      <h1 className="mt-5 text-3xl leading-9 text-indigo-900 quicksand font-bold">
        Descarga archivos
      </h1>
      <h2 className="text-xl text-gray-600 quicksand font-medium ">
        Descarga los archivos desde tu nube en{' '}
        <span className="font-semibold text-indigo-900">Google Drive</span>
      </h2>

      <div className="flex-shrink-0 flex justify-center items-center">
        <KeyButton
          messageQueue={messageQueue}
          settedKey={settedKey}
          setSettedKey={setSettedKey}
        />
      </div>

      <div className="flex-grow py-10 md:px-10 flex">
        <MainSection messageQueue={messageQueue} session={session} />
      </div>
    </div>
  );
}
