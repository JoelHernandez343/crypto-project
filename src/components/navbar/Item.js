import React from 'react';

export default function Item({ className, icon, title, active, index, updateList }) {

  return (
    <li
      className={`${className} ${active ? 'bg-gray-300 shadow' : ''} my-2 sm:pl-6 h-12 flex items-center hover:bg-gray-300 hover:shadow cursor-pointer text-indigo-900`}
      onClick={() => { updateList(index) }}
    >
      <div className="flex-grow sm:flex-grow-0 sm:w-5 sm:mr-5 text-2xl">
        <span className={`mdi mdi-${icon}`}></span>
      </div>
      <div className="hidden sm:block flex-grow flex text-left title">
        <p>{title}</p>
      </div>
      <div className={`${active ? 'bg-indigo-900' : ''} block h-full`} style={{ width: '4px' }}></div>
    </li>
  );
}