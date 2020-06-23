import React, { useState } from 'react';
import DragAndDrop from './DragAndDrop';
import MainButton from './../../buttons/MainButton';

import { getFileName, getIsFile } from '../../../helpers/FileHelper';

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
    let isProtected = protectedFiles.includes(file);

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

export default function MainSection({ messageQueue }) {
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
    setStagedFiles(prev => prev.filter(f => f !== file));

  const removeAllFiles = () => setStagedFiles([]);

  const addProtectedFiles = files => {};

  return (
    <div className="w-full flex-grow flex flex-col md:flex-row">
      <div className="w-full flex flex-col">
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
          } w-full flex flex-col p-5`}
        >
          <MainButton content="Proteger" />
        </div>
      </div>
      <div className="bg-green-400 w-full hidden">
        <p>Hello world</p>
      </div>
    </div>
  );
}
