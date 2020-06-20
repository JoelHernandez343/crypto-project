import React from 'react';

export default function Item({ className, icon, title, active, index, updateList }) {

  return (
    <li
      className={`${className} ${active ? 'bg-gray-300 text-indigo-900' : 'text-gray-600'} my-1 md:pl-6 h-10 flex items-center hover:bg-indigo-500 hover:bg-opacity-25 cursor-pointer text-sm transition ease-in-out duration-150`}
      onClick={() => { updateList(index) }}
    >
      <div className="flex-grow md:flex-grow-0 md:w-5 md:mr-5 text-xl">
        <span className={`mdi mdi-${icon}`}></span>
      </div>
      <div className="hidden md:block flex-grow flex text-left title">
        <p>{title}</p>
      </div>
      <div className={`${active ? 'bg-indigo-900' : ''} block h-full`} style={{ width: '4px' }}></div>
    </li>
  );
}