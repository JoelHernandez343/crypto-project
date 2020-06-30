import React from 'react';

export default function ({ onClick, className, del = false }) {
  return (
    // eslint-disable-next-line
    <a
      onClick={onClick}
      target="_blank"
      className={`${className} ${
        del
          ? 'bg-red-300 hover:bg-red-200 text-red-500'
          : 'bg-green-300 hover:bg-green-200 text-green-500'
      } download w-6 h-6 inline-flex items-center justify-center border border-transparent text-base leading-6 font-semibold rounded-md transition ease-in-out duration-150 cursor-pointer`}
    >
      <span
        className={`mdi mdi-${
          del ? 'trash-can-outline' : 'download'
        } pointer-events-none`}
      ></span>
    </a>
  );
}
