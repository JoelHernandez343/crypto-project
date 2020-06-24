import React, { useEffect, useState } from 'react';

import CloseButton from '../../../buttons/CloseButton';

import { getFileName } from '../../../../helpers/FileHelper';

export default function FileItem({ file, removeFile, encrypt }) {
  const [disabled, setDisabled] = useState(false);
  const [encrypted, setEncrypted] = useState(false);

  const setInProgress = isInProgress => setDisabled(isInProgress);

  const setTotalEncrypted = () => {
    file.encrypted = true;
    setEncrypted(true);
  };

  useEffect(() => {
    encrypt.add(file.path, setInProgress, setTotalEncrypted);
  }, [file.path, encrypt]);

  return (
    <div className="w-full h-10 flex bg-gray-200 my-1 hover:bg-indigo-500 hover:bg-opacity-25 transition ease-in-out duration-150 text-gray-600">
      <div className="w-12 flex-shrink-0 flex items-center justify-center">
        <span
          className={`mdi mdi-${
            encrypted ? 'shield-check' : 'shield-sync-outline'
          }`}
        ></span>
      </div>
      <div className="flex-grow flex flex-col text-left w-0">
        <p className="quicksand font-bold text-sm truncate -mb-px">
          {getFileName(file.path)}
        </p>
        <p className="quicksand font-semibold text-xs truncate">{file.path}</p>
      </div>
      <div className="w-16 flex-shrink-0 flex items-center justify-center">
        <CloseButton
          onClick={() => {
            encrypt.cancel(file.path);
            removeFile(file);
          }}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
