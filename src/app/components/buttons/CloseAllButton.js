import React from 'react';

export default function CloseAllButton({ onClick, enabled = true }) {
  return (
    // eslint-disable-next-line
    <a
      onClick={enabled ? onClick : () => {}}
      target="_blank"
      className={`${
        enabled
          ? 'text-red-500 bg-red-300 hover:bg-red-200'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      } inline-flex items-center justify-center border border-transparent text-sm leading-6 font-semibold rounded-sm transition ease-in-out duration-150 cursor-pointer p-1 m-1`}
    >
      <span className="mdi mdi-close pointer-events-none px-1"></span>
      <p className="pointer-events-none">Remover todos los archivos</p>
    </a>
  );
}
