import React, { useState } from 'react';
import './App.css';

import Navbar from './components/navbar/Navbar';
import mainRoutes from './routes/main_routes';
import Topbar from './components/Topbar';

function App() {

  const [section, setSection] = useState('upload');

  const buildSection = section => mainRoutes.find(route => route.section === section).route;

  return (
    <div className="text-center flex min-h-screen select-none min-w-screen">
      <Navbar changeSection={setSection} />
      <div className="flex-grow flex flex-col">
        <Topbar />
        <div className="flex-grow overflow-y-auto h-0">
          {buildSection(section)}
        </div>
      </div>
    </div>
  );
}

export default App;
