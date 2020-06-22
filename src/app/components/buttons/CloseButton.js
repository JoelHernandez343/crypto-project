import React from 'react';

export default function ({ onClick, className }) {
  return (
    // eslint-disable-next-line
    <a onClick={onClick} target="_blank" className={`${className} close-button w-6 h-6 inline-flex items-center justify-center border border-transparent text-base leading-6 font-semibold rounded-md text-white bg-red-300 hover:bg-red-200 focus:outline-none focus:bg-gray-700 transition ease-in-out duration-150 cursor-pointer`}>
      <span className={`mdi mdi-close text-red-500 pointer-events-none`}></span>
    </a>
  );
}