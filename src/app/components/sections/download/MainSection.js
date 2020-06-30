import React, { useState, useEffect } from 'react';
import ListOfFiles from '../upload/ListOfFiles';
import { listOnlyFiles } from '../../../helpers/drive';
import { getDownloadDir, openDir } from '../../../helpers/files';

const cmpFileArrays = (a, b) => {
  if (a.length !== b.length) return false;

  return a.reduce((prev, f, index) => prev && f.hash === b[index].hash);
};

const updateFiles = async (session, messageQueue, files, setFiles) => {
  if (session.status !== 'connected') {
    messageQueue.add({
      title: 'No se puede actualizar en este momento.',
      message: 'Sesión no iniciada.',
      style: 'error',
    });
    return;
  }

  const answer = await listOnlyFiles();
  if (typeof answer === 'string') {
    messageQueue.add({
      title: 'No se puede actualizar en este momento.',
      message: answer,
      style: 'error',
    });
    return;
  }

  if (answer.length === 0) {
    messageQueue.add({
      title: 'No hay archivos que listar en Google Drive.',
      message: 'No hay archivos que listar',
      style: 'default',
    });
    return;
  }

  if (!cmpFileArrays(answer, files)) {
    messageQueue.add({
      title: 'Archivos actualizados',
      message: 'Se actualizó la lista de archivos',
      style: 'success',
    });
    setFiles(answer);
  }
};

export default function MainSection({ session, messageQueue }) {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    updateFiles(session, messageQueue, files, setFiles);
  }, [session, files, setFiles, messageQueue]);

  const [dir, setDir] = useState('');
  useEffect(() => {
    (async () => setDir(await getDownloadDir()))();
  }, []);

  return (
    <div className="w-full flex-grow flex flex-col min-h-full">
      <div className="w-full mb-1">
        <p className="quicksand text-sm font-semibold text-gray-600 text-left ml-2">
          Ingresa la ubicación en donde quieres descargar los archivos
        </p>
        <div className="flex">
          <input
            className="flex-grow appearance-none bg-gray-100 border-2 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-indigo-300 text-base quicksand font-semibold transition ease-in-out duration-150"
            value={dir}
            spellCheck="false"
          ></input>
          <div
            onClick={async () => {
              let dir = await openDir();
              if (dir) setDir(dir);
            }}
            className="flex-shrink-0 flex bg-transparent hover:bg-indigo-500 hover:bg-opacity-25 cursor-pointer transition ease-in-out duration-150 text-gray-500 items-center"
          >
            <span className="mdi mdi-folder-open-outline mx-2"></span>
          </div>
        </div>
      </div>
      <div className="flex-grow rounded bg-gray-200 shadow flex flex-col p-4">
        {files.length === 0 ? (
          ''
        ) : (
          <div className="w-full flex-grow flex h-56">
            <ListOfFiles
              files={files}
              state="download"
              destDir={dir}
              messageQueue={messageQueue}
            />
          </div>
        )}
        <div
          className={`${
            files.length === 0 ? 'flex-grow h-64' : 'h-20'
          } flex w-full`}
        >
          <div
            className={`${
              files.length === 0 ? 'flex-col' : ''
            } flex w-full h-full bg-transparent hover:bg-indigo-500 hover:bg-opacity-25 cursor-pointer transition ease-in-out duration-150 text-gray-500 items-center justify-center`}
            onClick={() => updateFiles(session, messageQueue, files, setFiles)}
          >
            <span
              className="mdi mdi-reload"
              style={{ fontSize: `${files.length === 0 ? '5rem' : '1.5rem'}` }}
            ></span>

            <p
              className={`${
                files.length === 0 ? '' : 'ml-3'
              } quicksand font-medium`}
            >
              Actualizar
            </p>
          </div>
        </div>
      </div>
      {/* {files.length === 0 ? (
        ''
      ) : (
        <div className=" flex-grow rounded bg-gray-200 shadow flex mt-5">
          <div className="w-full p-4 flex flex-col">
            <div className="w-full flex-grow flex h-64">
              <ListOfFiles
                files={files}
                downloadFile={() => {}}
                state="download"
              />
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
