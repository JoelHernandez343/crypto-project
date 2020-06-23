import React from 'react';
import FileItem from './FileItem';
import CloseAllButton from '../../buttons/CloseAllButton';

export default function ListOfFiles({
  visible,
  stagedFiles,
  removeFile,
  removeAllFiles,
}) {
  const buildFileList = files =>
    files.map(file => (
      <FileItem key={file} file={file} removeFile={removeFile} />
    ));

  return (
    <div
      className={`${
        visible ? '' : 'hidden'
      } w-full flex-grow flex h-56 flex-col`}
    >
      <div className="flex-shrink-0 flex justify-end">
        <CloseAllButton onClick={removeAllFiles} />
      </div>
      <div className="flex-grow bg-gray-200 w-full overflow-y-auto scroll p-1">
        {buildFileList(stagedFiles)}
      </div>
    </div>
  );
}
