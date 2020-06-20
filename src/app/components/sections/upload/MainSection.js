import React, { useState } from 'react';
import DragAndDrop from './DragAndDrop';
import MainButton from './../../buttons/MainButton';

export default function () {

  const [stageFiles, setStageFiles] = useState([]);

  const addFiles = files => {
    setStageFiles(prev => Array.from(new Set([...prev, ...files])));
  }

  return (
    <div className="w-full flex-grow flex flex-col md:flex-row">
      <div className="w-full flex flex-col">
        <div className="flex-grow flex p-5">
          <DragAndDrop addFiles={addFiles} stageFiles={[...stageFiles]} />
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