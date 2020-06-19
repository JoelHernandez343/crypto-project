import React from 'react';
import logo from './../../logo.svg';

export default function UploadSection() {
  return (
    <div className="bg-gray-300 min-h-full flex flex-col items-center justify-center text-xl text-white flex-grow">
      <img src={logo} className="h-64 pointer-events-none App-logo" alt="logo" />
    </div>
  );
}