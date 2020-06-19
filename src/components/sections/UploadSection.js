import React from 'react';
import logo from './../../logo.svg';

export default function UploadSection() {
  return (
    <header className="bg-gray-300 flex flex-col items-center justify-center text-xl text-white flex-grow min-h-full">
      <img src={logo} className="h-64 pointer-events-none" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
        </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
        </a>
    </header>
  );
}