import React from 'react';
import FileItem from './staged_files/FileItem';
import PrFileItem from './protected_files/PrFileItem';
import CloseAllButton from '../../buttons/CloseAllButton';

const renderCloseButton = (state, removeAllFiles, enabledRemoveAll) =>
  state === 'stage' || state === 'protected' ? (
    <div className="flex-shrink-0 flex justify-end">
      <CloseAllButton
        onClick={removeAllFiles}
        enabled={state !== 'protected' ? true : enabledRemoveAll}
      />
    </div>
  ) : (
    ''
  );

const renderItem = (
  file,
  state,
  removeFile,
  protect,
  upload,
  messageQueue,
  enableRemAll
) => {
  return state === 'stage' ? (
    <FileItem key={file} file={file} removeFile={removeFile} />
  ) : state === 'protected' ? (
    <PrFileItem
      key={`protected-${file.path}`}
      file={file}
      removeFile={removeFile}
      protect={protect}
      upload={upload}
      messageQueue={messageQueue}
      enableRemAll={enableRemAll}
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
  protect,
  upload,
  messageQueue,
  enabledRemoveAll,
  enableRemAll,
}) {
  const buildFileList = files =>
    files.map(file =>
      renderItem(
        file,
        state,
        removeFile,
        protect,
        upload,
        messageQueue,
        enableRemAll
      )
    );

  return (
    <div className="w-full flex-grow flex flex-col">
      <div className="flex-shrink-0 flex justify-end">
        {renderCloseButton(state, removeAllFiles, enabledRemoveAll)}
      </div>
      <div className="flex-grow bg-gray-200 w-full overflow-y-auto scroll p-1">
        {buildFileList(files)}
      </div>
    </div>
  );
}
