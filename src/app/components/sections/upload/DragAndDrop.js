import React from 'react';
import ListOfFiles from './ListOfFiles';
/*global _node */

export default function DragAndDrop({ addFiles, stageFiles, removeFile, initial }) {

  console.log(stageFiles);

  const addVisualEffect = e =>
    e.classList.add('bg-indigo-500', 'bg-opacity-25');

  const removeVisualEffect = e =>
    e.classList.remove('bg-indigo-500', 'bg-opacity-25');

  const rf = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragEnter = e => addVisualEffect(e.target);

  const onDragLeave = e => removeVisualEffect(e.target);

  const onDrop = e => {
    removeVisualEffect(e.target);

    e.preventDefault();
    e.stopPropagation();

    changeState(Array.from(e.dataTransfer.files).map(file => file.path));

    return false;
  }

  const changeState = files => {
    if (files.length !== 0)
      addFiles(files);
  }

  const onClick = async () => {
    const files = await _node.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
    changeState(files.filePaths);
  }

  return (
    <div className="w-full flex-grow rounded bg-gray-200 shadow p-4 flex justify-center items-center flex-col max-h-full">
      <ListOfFiles visible={!initial} stageFiles={stageFiles} removeFile={removeFile} />

      <div className={`${initial ? 'flex-grow flex-col' : 'h-20'} flex items-center justify-center w-full relative`}>
        <div className="absolute w-full h-full bg-transparent hover:bg-indigo-500 hover:bg-opacity-25 cursor-pointer transition ease-in-out duration-150"
          onDragEnter={onDragEnter} onDragOver={rf} onDragLeave={onDragLeave} onDragEnd={rf} onDrop={onDrop} onClick={onClick}
        />
        <span className={`mdi mdi-text-box-plus-outline text-gray-400`} style={{ fontSize: `${initial ? '5rem' : '1.5rem'}` }}></span>
        <p className={`${initial ? 'mb-4' : 'text-base ml-3'} text-gray-500 quicksand font-medium`}>Arrastra tus archivos aquí</p>
      </div>
    </div>
  );
}