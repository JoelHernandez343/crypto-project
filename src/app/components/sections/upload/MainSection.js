import React, { useState } from 'react';
import DragAndDrop from './DragAndDrop';
import MainButton from './../../buttons/MainButton';
import ListOfFiles from './ListOfFiles';

import { getFileName, getIsFile } from '../../../helpers/files';

import { areRsaKeys } from '../../../helpers/rsa';

/*global _node*/

const filterFolders = async (paths, messageQueue) => {
  let filter = await Promise.all(
    paths.map(async file => await getIsFile(file))
  );
  let files = paths.filter((file, index) => filter[index]);

  if (files.length < paths.length) {
    messageQueue.add({
      title: 'No se pueden agregar carpetas.',
      message:
        'Se intentaron agregar carpetas, pero esta característica no está soportada.',
      style: 'error',
    });
  }

  return files;
};

const filterStagedFiles = (files, stagedFiles) =>
  files.filter(file => !stagedFiles.includes(file));

const filterProtectedFiles = (files, protectedFiles, messageQueue) =>
  files.filter(file => {
    let isProtected = protectedFiles.filter(f => f.path === file).length === 1;

    if (isProtected) {
      messageQueue.add({
        title: `Archivo ya cifrado: ${getFileName(file)}`,
        message:
          'El archivo no se puede cifrar dos veces en el mismo proceso de subida.',
        style: 'error',
      });
    }

    return !isProtected;
  });

export default function MainSection({
  messageQueue,
  protect,
  upload,
  session,
}) {
  const [stagedFiles, setStagedFiles] = useState([]);
  const [protectedFiles, setProtectedFiles] = useState([]);

  const addFiles = async paths => {
    const files = await filterFolders(paths, messageQueue);

    if (files.length === 0) return;

    const notStagedFiles = filterStagedFiles(files, stagedFiles);

    const filesToAdd = filterProtectedFiles(
      notStagedFiles,
      protectedFiles,
      messageQueue
    );

    if (filesToAdd.length === paths.length) {
      messageQueue.add({
        title: `Todos los archivos (${filesToAdd.length}) se agregaron correctamente.`,
        message: `Se agregaron ${filesToAdd.length} archivo(s) correctamente.`,
        style: 'success',
      });
    } else if (filesToAdd.length === 0) {
      messageQueue.add({
        title: 'No hay archivos nuevos que agregar.',
        message: 'No se agregaron nuevos archivos para cifrar.',
        style: 'success',
      });
    } else {
      messageQueue.add({
        title: `Se agregaron ${filesToAdd.length} archivo(s) correctamente.`,
        message:
          'Algunos archivos ya habían sido agregados o se intentó agregar carpetas',
        style: 'success',
      });
    }

    setStagedFiles(prev => [...prev, ...filesToAdd]);
  };

  const removeFile = file =>
    setStagedFiles(stagedFiles.filter(f => f !== file));

  const removeAllFiles = () => setStagedFiles([]);

  const addProtectedFiles = async () => {
    if (!(await areRsaKeys())) {
      messageQueue.add({
        title: 'No han sido agregadas las llaves',
        message:
          'No podemos terminar el proceso de encriptado sin las llaves del cliente.',
        style: 'error',
      });

      return;
    }

    setProtectedFiles(prev => [
      ...prev,
      ...stagedFiles.map(f => ({ path: f, status: 'unprotected' })),
    ]);
    removeAllFiles();
  };

  const removeProtectedFile = async file =>
    setProtectedFiles(() => protectedFiles.filter(p => p.path !== file.path));

  const removeAllProtectedFiles = async () => {
    await _node.initTmpDirs();
    protect.cancelAll();
    setProtectedFiles([]);
  };

  const updateAllProtectedFiles = (status, prevStatus) =>
    setProtectedFiles(prev =>
      prev.map(f => {
        if (f.status === prevStatus) f.status = status;
        return f;
      })
    );

  const uploadFiles = () => {
    console.log(session);

    if (session.status !== 'connected') {
      messageQueue.add({
        title: 'No ha iniciado sesión',
        message: 'Inicie sesión en Google Drive para continuar',
        style: 'error',
      });

      return;
    }

    updateAllProtectedFiles('pending', 'protected');
  };

  const [enabledRemProAll, setEnabledRemProAll] = useState(true);
  const enableRemAll = () => {
    setEnabledRemProAll(
      protectedFiles.reduce(
        (prev, file) => prev && file.status !== 'pending',
        true
      )
    );
  };

  return (
    <div className="w-full flex-grow flex flex-col lg:flex-row min-h-full">
      <div
        className={`${
          protectedFiles.length === 0 ? '' : 'lg:mr-5'
        } lg:w-0 flex-grow flex flex-col`}
      >
        <div className="flex-grow flex">
          <DragAndDrop
            addFiles={addFiles}
            stagedFiles={stagedFiles}
            removeFile={removeFile}
            removeAllFiles={removeAllFiles}
            initial={stagedFiles.length === 0}
          />
        </div>
        <div
          className={`${
            stagedFiles.length === 0 ? 'hidden' : ''
          } w-full flex flex-col px-5 pt-5`}
        >
          <MainButton content="Proteger" onClick={addProtectedFiles} />
        </div>
      </div>
      {protectedFiles.length === 0 ? (
        ''
      ) : (
        <div className="lg:w-0 flex-grow flex flex-col">
          <div className="flex-grow rounded bg-gray-200 shadow flex mt-5 lg:mt-0">
            <div className="w-full p-4 flex flex-col">
              <div className="w-full flex-grow flex h-64">
                <ListOfFiles
                  files={protectedFiles}
                  removeFile={removeProtectedFile}
                  removeAllFiles={removeAllProtectedFiles}
                  state="protected"
                  protect={protect}
                  upload={upload}
                  messageQueue={messageQueue}
                  enabledRemoveAll={enabledRemProAll}
                  enableRemAll={enableRemAll}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col px-5 pt-5">
            <MainButton content="Subir" onClick={uploadFiles} />
          </div>
        </div>
      )}
    </div>
  );
}
