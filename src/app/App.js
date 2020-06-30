import React, { useState, useEffect } from 'react';

import Navbar from './components/navbar/Navbar';
import mainRoutes from './routes/main_routes';
import Topbar from './components/Topbar';
import Popup from './components/Popup';
import MessageContainer from './components/messages/MessageContainer';
import { MessageQueue } from './components/messages/MessageQueue';
import { ProtectQueue } from './components/sections/upload/protected_files/ProtectQueue';
import { UploadQueue } from './components/sections/upload/protected_files/UploadQueue';

import { areRsaKeys } from './helpers/rsa';

// Initialization
const messageQueue = new MessageQueue();
const protect = new ProtectQueue();
const upload = new UploadQueue();

export default function App({ initialUser }) {
  const [section, setSection] = useState('upload');

  const sections = mainRoutes.map(route => ({
    section: route.section,
    renderer: route.route,
  }));
  const buildSections = (section, session, settedKey, setSettedKey) =>
    sections.map(s => (
      <s.renderer
        key={`section-${s.section}`}
        view={s.section === section}
        session={session}
        messageQueue={messageQueue}
        protect={s.section === 'upload' ? protect : undefined}
        upload={s.section === 'upload' ? upload : undefined}
        settedKey={settedKey}
        setSettedKey={setSettedKey}
      />
    ));

  const [messageInfo, setMessageInfo] = useState({ display: false });
  messageQueue.triggerer = setMessageInfo;

  const [popup, setPopup] = useState(false);

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
  const [settedKey, setSettedKey] = useState(false);
  useEffect(() => {
    const checkForKeys = async () => setSettedKey(await areRsaKeys());
    checkForKeys();
  }, []);

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
          {buildSections(section, session, settedKey, setSettedKey)}
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
