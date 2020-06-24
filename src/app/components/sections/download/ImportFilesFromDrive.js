import React from 'react';
import ListOfFiles from '../UploadSection/ListOfFiles';

export default function ImportFilesFromDrive({
  addFiles,
  stagedFiles,
  removeFile,
  removeAllFiles,
  initial,
}) {
  const changeState = files => {
    if (files.length !== 0) addFiles(files);
  };

  const onClick = async () => {
    const files = ['/home/marbrehi/Escritorio'];
    changeState(files.filePaths);
  };

  return (
    <div className="w-full flex-grow rounded bg-gray-200 shadow p-4 flex justify-center items-center flex-col">
      {initial ? (
        ''
      ) : (
        <div className="w-full flex-grow flex h-56">
          <ListOfFiles
            files={stagedFiles}
            removeFile={removeFile}
            removeAllFiles={removeAllFiles}
          />
        </div>
      )}

      <div
        className={`${
          initial ? 'flex-grow flex-col h-64' : 'h-20'
        } flex items-center justify-center w-full relative`}
      >
        <div
          className="absolute w-full h-full bg-transparent hover:bg-indigo-500 hover:bg-opacity-25 cursor-pointer transition ease-in-out duration-150"
          onClick={onClick}
        />
        <span
          className={`mdi mdi-text-box-plus-outline text-gray-400`}
          style={{ fontSize: `${initial ? '5rem' : '1.5rem'}` }}
        ></span>
        <p
          className={`${
            initial ? 'mb-4' : 'text-base ml-3'
          } text-gray-500 quicksand font-medium`}
        >
          Arrastra tus archivos aquí
        </p>
      </div>
    </div>
  );
}
