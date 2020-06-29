import React from 'react';

export default function MainButton({ onClick, content, enabled = true }) {
  return (
    // eslint-disable-next-line
    <a
      onClick={enabled ? onClick : () => {}}
      target="_blank"
      className={`${
        enabled
          ? 'bg-indigo-900 hover:bg-indigo-800 cursor-pointer'
          : 'bg-gray-600 cursor-not-allowed'
      } w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base leading-6 font-semibold rounded-md text-white shadow-md focus:outline-none focus:bg-gray-700 transition ease-in-out duration-150 xl:text-lg xl:py-4`}
    >
      {content}
    </a>
  );
}
