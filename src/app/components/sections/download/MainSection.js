import React, { useState, useEffect } from 'react';
import ListOfFiles from '../upload/ListOfFiles';
import { listOnlyFiles } from '../../../helpers/drive';

export default function MainSection({ session, messageQueue }) {
  const [files, setFiles] = useState([{ name: 'texto.crp', id: '182837' }]);
  useEffect(() => {
    updateFiles();
  }, [session]);

  const updateFiles = async () => {
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

    setFiles(answer);
  };

  return (
    <div className="w-full flex-grow flex flex-col min-h-full">
      <div className=" ">
        <input></input>
      </div>
      <div className="flex-grow rounded bg-gray-200 shadow flex flex-col">
        {files.length === 0 ? (
          ''
        ) : (
          <div className="w-full flex-grow flex h-56">
            <ListOfFiles files={files} state="download" />
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
            onClick={updateFiles}
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
