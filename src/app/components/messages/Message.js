import React, { useEffect, useState } from 'react';

const successStyle = 'bg-teal-100 border-teal-500 text-teal-900';
const errorStyle = 'bg-red-100 border-red-500 text-red-900';
const defaultStyle = 'bg-gray-200 border-indigo-900 text-indigo-900';

const setStyle = style =>
  style === 'success'
    ? successStyle
    : style === 'error'
    ? errorStyle
    : defaultStyle;

export default function Message({
  information: { style, title, message, closeFunction },
}) {
  const [closed, setClosed] = useState(false);

  const onAnimationEnd = () => {
    if (closed) closeFunction();
  };

  useEffect(() => {
    const timer = setTimeout(() => close(), 5000);
    return () => clearTimeout(timer);
  }, []);

  const close = () => setClosed(true);

  return (
    <div
      className={`${setStyle(style)} ${
        closed ? 'MessageOut' : ''
      } border-t-4 rounded-b px-4 pt-3 pb-6 shadow-md flex MessageIn`}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="w-10 flex-shrink-0 flex items-start justify-center">
        <span className="mdi mdi-information-outline text-2xl"></span>
      </div>
      <div className="flex-grow max-w-lg flex flex-col text-left">
        <div className="quicksand font-bold">{title}</div>
        <div className="quicksand font-medium text-sm break-words">
          {message}
        </div>
      </div>
      <div className="w-3 flex-shrink-0 flex items-start justify-center">
        <div className="cursor-pointer" onClick={close}>
          <span className="mdi mdi-close pointer-events-none"></span>
        </div>
      </div>
    </div>
  );
}
