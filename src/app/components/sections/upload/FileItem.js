import React, { useState, useEffect } from 'react';
import getIcon from './getIcon';

import CloseButton from '../../buttons/CloseButton';

/*global _node*/

export default function FileItem({ file, removeFile }) {

  const [isFile, setIsFile] = useState(true);

  const getIsFile = async (file) =>
    setIsFile((await _node.fsAsync.lstat(file)).isFile());

  useEffect(() => { getIsFile(file) }, []);

  const getFileName = file => file.replace(/.*[\\/]/, '');

  const buildIcon = (file, isFile) => {
    if (!isFile) {
      // Handle error
      return;
    }

    return <span className={`mdi mdi-${getIcon(getFileName(file))}`}></span>;
  }

  const fileItemClick = e => {
    if (e.target.classList.contains('close-button')) return;

    console.log('item!');
  }

  const closeClick = () => {
    removeFile(file);
  }

  return (
    <div onClick={fileItemClick} className="w-full h-10 flex bg-gray-200 my-1 hover:bg-indigo-500 hover:bg-opacity-25 transition ease-in-out duration-150 text-gray-600">
      <div className="w-12 flex-shrink-0 flex items-center justify-center">
        {buildIcon(file, isFile)}
      </div>
      <div className="flex-grow flex flex-col text-left w-0">
        <p className="quicksand font-bold text-sm truncate -mb-px">{getFileName(file)}</p>
        <p className="quicksand font-semibold text-xs truncate">{file}</p>
      </div>
      <div className="w-16 flex-shrink-0 flex items-center justify-center">
        <CloseButton onClick={closeClick} />
      </div>
    </div>
  );
}