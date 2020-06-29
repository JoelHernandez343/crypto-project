import React from 'react';
import FileItem from './staged_files/FileItem';
import PrFileItem from './protected_files/PrFileItem';
import CloseAllButton from '../../buttons/CloseAllButton';

const shouldEnable = files =>
  files.reduce(
    (prev, file) =>
      prev || file.status === 'unprotected' || file.status === 'protected',
    false
  );

const renderCloseButton = (state, removeAllFiles, files) =>
  state === 'stage' || state === 'protected' ? (
    <div className="flex-shrink-0 flex justify-end">
      <CloseAllButton onClick={removeAllFiles} enabled={shouldEnable(files)} />
    </div>
  ) : (
    ''
  );

const renderItem = (file, state, removeFile, encrypt) => {
  return state === 'stage' ? (
    <FileItem key={file} file={file} removeFile={removeFile} />
  ) : state === 'protected' ? (
    <PrFileItem
      key={`protected-${file.path}`}
      file={file}
      removeFile={removeFile}
      encrypt={encrypt}
    />
  ) : (
    <FileItem key={file} file={file} />
  );
};

export default function ListOfFiles({
  files,
  removeFile,
  removeAllFiles,
  state = 'stage',
  encrypt,
}) {
  const buildFileList = files =>
    files.map(file => renderItem(file, state, removeFile, encrypt));

  return (
    <div className="w-full flex-grow flex flex-col">
      <div className="flex-shrink-0 flex justify-end">
        {renderCloseButton(state, removeAllFiles, files)}
      </div>
      <div className="flex-grow bg-gray-200 w-full overflow-y-auto scroll p-1">
        {buildFileList(files)}
      </div>
    </div>
  );
}
