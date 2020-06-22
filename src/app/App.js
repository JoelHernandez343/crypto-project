import React, { useState } from 'react';
import '../css/App.css';

import Navbar from './components/navbar/Navbar';
import mainRoutes from './routes/main_routes';
import Topbar from './components/Topbar';
import MessageContainer from './components/messages/MessageContainer';

function App() {

  const [section, setSection] = useState('upload');

  const sections = mainRoutes.map(route => ({ section: route.section, renderer: route.route }));
  const buildSections = section =>
    sections.map((s, index) => <s.renderer key={`section-${s.section}`} view={s.section === section} />);

  const [showMessage, setShowMessage] = useState(true);

  return (
    <div className="text-center flex min-h-screen select-none min-w-screen scroll">
      <Navbar changeSection={setSection} />
      <div className="flex-grow flex flex-col w-0 relative">
        <Topbar />
        <div className="flex-grow overflow-y-auto overflow-x-hidden h-0 scroll">
          {buildSections(section)}
        </div>
        <MessageContainer show={showMessage} style="other" title={'Esto es un titulo'} message={'Vivian, espero que no me odies, la cosa es que estoy roto por dentro y tengo mucho miedo de lastimarte'} />
      </div>
    </div>
  );
}

export default App;
