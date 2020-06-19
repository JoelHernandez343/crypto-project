import React, { useState } from 'react';
import './App.css';

import Navbar from './components/navbar/Navbar';

import mainRoutes from './routes/main_routes';

function App() {

  const [section, setSection] = useState('encrypt');

  const buildSection = section => mainRoutes.find(route => route.section === section).route;

  return (
    <div className="text-center flex min-h-screen select-none min-w-screen">
      <Navbar changeSection={setSection} />
      {buildSection(section)}
    </div>
  );
}

export default App;
