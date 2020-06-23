import React from 'react';
import FileItem from './FileItem';

export default function ListOfFiles({ visible, stageFiles, removeFile }) {
  const buildFileList = files =>
    files.map(file => (
      <FileItem key={file} file={file} removeFile={removeFile} />
    ));

  return (
    <div
      className={`${
        visible ? '' : 'hidden'
      } flex-grow bg-gray-200 w-full h-56 overflow-y-auto scroll p-1`}
    >
      {buildFileList(stageFiles)}
    </div>
  );
}
