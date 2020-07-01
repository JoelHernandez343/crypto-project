import React, { useEffect, useState } from 'react';

import CloseButton from '../../../buttons/CloseButton';

import { getFileName, removeFile as rmf } from '../../../../helpers/files';

export default function PrFileItem({
  file,
  removeFile,
  protect,
  upload,
  messageQueue,
  enableRemAll,
}) {
  const [disabled, setDisabled] = useState(false);
  const [status, setStatus] = useState(file.status);
  const updateStatus = status => {
    file.status = status;

    enableRemAll();

    setStatus(status);
  };

  useEffect(() => {
    protect.add(file.path, setDisabled, setFinished); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    updateStatus(file.status);
    if (file.status === 'pending') {
      upload.add(file, setUploaded);
    } // eslint-disable-next-line
  }, [file.status]);

  const setFinished = result => {
    if (typeof result === 'string') {
      messageQueue.add({
        title: 'No se pudo proteger el archivo',
        message: result,
        style: 'error',
      });
      updateStatus('unprotected');
      return;
    }

    let { outDir, outName, pKey, pHash } = result;

    file.outDir = outDir;
    file.outName = outName;
    file.key = pKey;
    file.hash = pHash;

    updateStatus('protected');
  };

  const setUploaded = result => {
    if (typeof result !== 'string') {
      updateStatus('uploaded');
    } else {
      messageQueue.add({
        title: 'No se pudo subir el archivo',
        message: result,
        style: 'error',
      });

      updateStatus('protected');
    }
  };

  return (
    <div
      className={`${
        status === 'uploaded'
          ? 'bg-green-300 hover:bg-green-200'
          : 'bg-gray-200 hover:bg-indigo-500 hover:bg-opacity-25'
      } my-1 w-full h-10 flex transition ease-in-out duration-150 text-gray-600`}
      onClick={() => console.log(file)}
    >
      <div className="w-12 flex-shrink-0 flex items-center justify-center">
        <span
          className={`mdi mdi-${
            status === 'unprotected'
              ? 'shield-sync-outline'
              : status === 'protected'
              ? 'shield-check'
              : status === 'pending'
              ? 'loading Loading'
              : 'check-bold'
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
          onClick={async () => {
            switch (status) {
              case 'unprotected':
                protect.cancel(file.path);
                break;

              case 'protected':
                await rmf({ dir: file.outDir, name: file.outName });
                break;

              case 'pending':
                setStatus('protected');
                return;

              default:
                await rmf({ dir: file.outDir, name: file.outName });
                break;
            }

            removeFile(file);
          }}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
