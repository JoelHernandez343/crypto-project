import React from 'react';
import FileItem from './staged_files/FileItem';
import PrFileItem from './protected_files/PrFileItem';
import CloseAllButton from '../../buttons/CloseAllButton';

export default function ListOfFiles({
  files,
  removeFile,
  removeAllFiles,
  stage = true,
  encrypt,
}) {
  const buildFileList = files =>
    files.map(file =>
      stage ? (
        <FileItem key={file} file={file} removeFile={removeFile} />
      ) : (
        <PrFileItem
          key={`protected-${file.path}`}
          file={file}
          removeFile={removeFile}
          encrypt={encrypt}
        />
      )
    );

  return (
    <div className="w-full flex-grow flex flex-col">
      <div className="flex-shrink-0 flex justify-end">
        <CloseAllButton onClick={removeAllFiles} />
      </div>
      <div className="flex-grow bg-gray-200 w-full overflow-y-auto scroll p-1">
        {buildFileList(files)}
      </div>
    </div>
  );
}
