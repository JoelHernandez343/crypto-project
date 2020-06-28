import React, { useState } from 'react';

import Navbar from './components/navbar/Navbar';
import mainRoutes from './routes/main_routes';
import Topbar from './components/Topbar';
import MessageContainer from './components/messages/MessageContainer';
import { MessageQueue } from './components/messages/MessageQueue';
import { EncryptQueue } from './components/sections/upload/protected_files/EncryptQueue';
import Popup from './components/Popup';

// Initialization
const messageQueue = new MessageQueue();
const encrypt = new EncryptQueue();

export default function App({ initialUser }) {
  const [section, setSection] = useState('upload');

  const sections = mainRoutes.map(route => ({
    section: route.section,
    renderer: route.route,
  }));
  const buildSections = section =>
    sections.map((s, index) => (
      <s.renderer
        key={`section-${s.section}`}
        view={s.section === section}
        messageQueue={messageQueue}
        encrypt={s.section === 'upload' ? encrypt : undefined}
      />
    ));

  const [messageInfo, setMessageInfo] = useState({ display: false });
  messageQueue.triggerer = setMessageInfo;

  const [popup, setPopup] = useState(true);

  const hidePopup = () => setPopup(false);
  const toggPopup = () => setPopup(p => !p);

  const appPopup = e => {
    if (
      e.target.id === 'userButton' ||
      document.getElementById('popup').contains(e.target)
    )
      return;

    hidePopup();
  };

  const [session, setSession] = useState(initialUser);

  return (
    <div
      className="text-center flex min-h-screen select-none min-w-screen scroll overflow-hidden relative"
      onClick={appPopup}
    >
      <Navbar
        changeSection={setSection}
        userClick={toggPopup}
        session={session}
      />
      <Popup
        show={popup}
        messageQueue={messageQueue}
        session={session}
        setSession={setSession}
      />
      <div className="flex-grow flex flex-col w-0 relative">
        <Topbar />
        <div className="flex-grow overflow-y-auto overflow-x-hidden h-0 scroll">
          {buildSections(section)}
        </div>
        {messageInfo.display ? (
          <MessageContainer information={messageInfo} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
