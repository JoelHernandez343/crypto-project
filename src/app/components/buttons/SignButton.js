import React from 'react';

export default function SignButton({ click, buttonContent }) {
  return (
    // eslint-disable-next-line
    <a
      className="px-4 py-3 hover:bg-indigo-500 hover:bg-opacity-25 transition ease-in-out duration-150 cursor-pointer"
      onClick={click}
    >
      <div className="quicksand font-semibold text-sm text-left">
        {buttonContent}
      </div>
    </a>
  );
}
