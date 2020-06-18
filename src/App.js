import React from 'react';
import logo from './logo.svg';
import './App.css';

import Navbar from './components/navbar/Navbar';

function App() {
  return (
    <div className="text-center flex min-h-screen" style={{ minWidth: '100vw' }}>
      <Navbar className="hidden sm:block w-64" />
      <header className="bg-indigo-900 flex flex-col items-center justify-center text-xl text-white flex-grow">
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
    </div>
  );
}

export default App;
