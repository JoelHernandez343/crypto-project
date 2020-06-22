import React, { useState } from 'react';
import DragAndDrop from './DragAndDrop';
import MainButton from './../../buttons/MainButton';

/*global _node*/

export default function () {

  const [stageFiles, setStageFiles] = useState([]);

  const getIsFile = async (file) =>
    (await _node.fsAsync.lstat(file)).isFile();

  const addFiles = async (files) => {

    const areFiles = await Promise.all(files.map(async (file) => await getIsFile(file)));
    let message = [];
    const filesToAdd = files.filter((file, index) => {
      if (!areFiles[index]) message.push(file);
      return areFiles[index];
    });

    setStageFiles(prev => Array.from(new Set([...prev, ...filesToAdd])));
  }

  const removeFile = file =>
    setStageFiles(prev => prev.filter(f => f !== file));

  return (
    <div className="w-full flex-grow flex flex-col md:flex-row">
      <div className="w-full flex flex-col">
        <div className="flex-grow flex">
          <DragAndDrop addFiles={addFiles} stageFiles={stageFiles} removeFile={removeFile} initial={stageFiles.length === 0} />
        </div>
        <div className={`${stageFiles.length === 0 ? 'hidden' : ''} w-full flex flex-col p-5`}>
          <MainButton content="Proteger" />
        </div>
      </div>
      <div className="bg-green-400 w-full hidden">
        <p>Hello world</p>
      </div>
    </div>
  );
}