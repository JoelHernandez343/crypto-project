import React from 'react';

import DownloadButton from '../../buttons/DownloadButton';

export default function FileItem({ file }) {
  return (
    <div className="w-full h-10 flex bg-gray-200 my-1 hover:bg-indigo-500 hover:bg-opacity-25 transition ease-in-out duration-150 text-gray-600">
      <div className="w-12 flex-shrink-0 flex items-center justify-center">
        <span className={`mdi mdi-lock`}></span>
      </div>
      <div className="flex-grow flex flex-col text-left w-0">
        <p className="quicksand font-bold text-sm truncate -mb-px">
          {file.name}
        </p>
        <p className="quicksand font-semibold text-xs truncate">{file.id}</p>
      </div>
      <div className="w-10 flex-shrink-0 flex items-center justify-center">
        <DownloadButton onClick={() => {}} />
      </div>
      <div className="w-10 flex-shrink-0 flex items-center justify-center">
        <DownloadButton onClick={() => {}} del={true} />
      </div>
    </div>
  );
}
