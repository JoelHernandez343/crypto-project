import React, { useState } from "react";
import DragAndDrop from "./DragAndDrop";
import MainButton from "./../../buttons/MainButton";

/*global _node*/

export default function MainSection({ showMessage }) {
  const [stageFiles, setStageFiles] = useState([]);

  const getIsFile = async file => (await _node.fsAsync.lstat(file)).isFile();

  const addFiles = async files => {
    const areFiles = await Promise.all(
      files.map(async file => await getIsFile(file))
    );
    const filesToAdd = files.filter((file, index) => areFiles[index]);

    if (!areFiles.reduce((prev, current) => prev & current, true)) {
      showMessage({
        title: "No se pueden agregar carpetas.",
        message:
          "Se intentaron agregar carpetas, pero esta característica no está soportada.",
        style: "error",
        display: true,
      });
    }

    setStageFiles(prev => Array.from(new Set([...prev, ...filesToAdd])));
  };

  const removeFile = file =>
    setStageFiles(prev => prev.filter(f => f !== file));

  return (
    <div className="w-full flex-grow flex flex-col md:flex-row">
      <div className="w-full flex flex-col">
        <div className="flex-grow flex">
          <DragAndDrop
            addFiles={addFiles}
            stageFiles={stageFiles}
            removeFile={removeFile}
            initial={stageFiles.length === 0}
          />
        </div>
        <div
          className={`${
            stageFiles.length === 0 ? "hidden" : ""
          } w-full flex flex-col p-5`}
        >
          <MainButton content="Proteger" />
        </div>
      </div>
      <div className="bg-green-400 w-full hidden">
        <p>Hello world</p>
      </div>
    </div>
  );
}
