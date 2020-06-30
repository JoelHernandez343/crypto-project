import React, { useState } from 'react';

import DownloadButton from '../../buttons/DownloadButton';
import { recover, deleteBothFiles } from '../../../helpers/drive';
import { areRsaKeys } from '../../../helpers/rsa';

export default function DownloadItem({ file, destDir, messageQueue }) {
  const [status, setStatus] = useState('waiting');
  const download = async (file, destDir) => {
    if (!(await areRsaKeys())) {
      messageQueue.add({
        title: 'No han sido agregadas las llaves',
        message:
          'No podemos terminar el proceso de encriptado sin las llaves del cliente.',
        style: 'error',
      });

      return;
    }

    setStatus('downloading');

    let answer = await recover(file, destDir);

    if (typeof answer === 'string') {
      messageQueue.add({
        title: 'No se pudo descargar',
        message: answer,
        style: 'error',
      });
      setStatus('waiting');
      return;
    }

    messageQueue.add({
      title: `Descargado ${file.name} exitosamente`,
      message: `El archivo ${file.name} fue descargado exitosamente en ${destDir}`,
      style: 'success',
    });

    setStatus('downloaded');
  };

  const del = async file => {
    let answer = await deleteBothFiles(file);

    if (typeof answer === 'string') {
      messageQueue.add({
        title: 'No se pudo eliminar',
        message: answer,
        style: 'error',
      });
      return;
    }

    messageQueue.add({
      title: `Archivo ${file.name} eliminado exitosamente`,
      message: `El archivo ${file.name} fue eliminado correctamente`,
      style: 'success',
    });
  };

  const setIcon = status =>
    status === 'downloading'
      ? 'loading Loading'
      : status === 'waiting'
      ? 'lock'
      : 'check-bold';

  return (
    <div className="w-full h-10 flex bg-gray-200 my-1 hover:bg-indigo-500 hover:bg-opacity-25 transition ease-in-out duration-150 text-gray-600">
      <div className="w-12 flex-shrink-0 flex items-center justify-center">
        <span className={`mdi mdi-${setIcon(status)}`}></span>
      </div>
      <div className="flex-grow flex flex-col text-left w-0">
        <p className="quicksand font-bold text-sm truncate -mb-px">
          {file.name}
        </p>
        <p className="quicksand font-semibold text-xs truncate">{file.id}</p>
      </div>
      <div className="w-10 flex-shrink-0 flex items-center justify-center">
        <DownloadButton
          onClick={() => {
            download(file, destDir);
          }}
        />
      </div>
      <div className="w-10 flex-shrink-0 flex items-center justify-center">
        <DownloadButton
          onClick={() => {
            del(file);
          }}
          del={true}
        />
      </div>
    </div>
  );
}
