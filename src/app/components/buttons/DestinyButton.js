import React from 'react';

export default function DestinyButton({ onClick, content, className }) {
  return (
    // eslint-disable-next-line
    <a
      onClick={onClick}
      target="_blank"
      className={`${className} w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base leading-6 font-semibold rounded-md text-white bg-indigo-900 shadow-md hover:bg-indigo-800 focus:outline-none focus:bg-gray-700 transition ease-in-out duration-150 xl:text-lg xl:py-4 cursor-pointer`}
    >
      {content}
    </a>
  );
}
