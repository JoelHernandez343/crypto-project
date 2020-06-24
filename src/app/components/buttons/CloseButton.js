import React from 'react';

export default function ({ onClick, className, disabled = false }) {
  return (
    // eslint-disable-next-line
    <a
      onClick={onClick}
      target="_blank"
      className={`${className} ${
        disabled
          ? 'bg-gray-300 text-gray-500'
          : 'bg-red-300 hover:bg-red-200 text-red-500'
      } close-button w-6 h-6 inline-flex items-center justify-center border border-transparent text-base leading-6 font-semibold rounded-md transition ease-in-out duration-150 cursor-pointer`}
    >
      <span className={`mdi mdi-close pointer-events-none`}></span>
    </a>
  );
}
