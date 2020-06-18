import React from 'react';

export default function Item({ className }) {
  return (
    <li className={`${className} bg-gray-500 px-6 h-12 flex items-center`}>
      <div className="w-4">
        <p>Icon</p>
      </div>
      <div className="flex-grow flex">
        <p>Title</p>
      </div>
    </li>
  );
}