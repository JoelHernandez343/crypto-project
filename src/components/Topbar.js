import React from 'react';
/*global _node*/

export default function Topbar() {

  const minimize = () => _node.remote.getCurrentWindow().minimize();
  const close = () => _node.remote.getCurrentWindow().close();

  return (
    <div className="h-6 z-10 flex drag bg-gray-300 justify-end w-full items-center">
      <div className="nodrag cursor-pointer text-l px-3 hover:bg-gray-300" onClick={minimize}>
        <span className={`mdi mdi-chevron-down`}></span>
      </div>
      <div className="nodrag cursor-pointer text-l px-3 hover:bg-gray-300" onClick={close}>
        <span className={`mdi mdi-close`}></span>
      </div>
    </div>
  );
}