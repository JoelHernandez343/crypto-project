import React, { useState } from 'react';
import '../css/App.css';

import Navbar from './components/navbar/Navbar';
import mainRoutes from './routes/main_routes';
import Topbar from './components/Topbar';

function App() {

  const [section, setSection] = useState('upload');

  const sections = mainRoutes.map(route => ({ section: route.section, renderer: route.route }));
  const buildSections = section =>
    sections.map((s, index) => <s.renderer view={s.section === section} />);

  return (
    <div className="text-center flex min-h-screen select-none min-w-screen">
      <Navbar changeSection={setSection} />
      <div className="flex-grow flex flex-col w-0">
        <Topbar />
        <div className="flex-grow overflow-y-auto overflow-x-hidden h-0">
          {buildSections(section)}
        </div>
      </div>
    </div>
  );
}

export default App;
