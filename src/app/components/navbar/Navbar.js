import React, { useState } from 'react';

import mainRoutes from '../../routes/main_routes';
import Item from './Item';
import User from './User';
import logo from './../../../images/logo@0,5.png';

export default function Navbar({ changeSection, userClick, session }) {
  const [active, setActive] = useState(0);

  const menu = mainRoutes.map(({ section, navInfo: { icon, title } }) => ({
    section,
    icon,
    title,
  }));

  const changeAll = index => {
    setActive(index);
    changeSection(menu[index].section);
  };

  const buildList = active =>
    menu.map(({ section, title, icon }, index) => (
      <Item
        key={`list-item-${section}`}
        title={title}
        icon={icon}
        index={index}
        active={index === active}
        updateList={changeAll}
      />
    ));

  return (
    <nav className="flex-shrink-0 w-16 md:w-64 bg-gray-200 h-screen flex flex-col">
      <div className="overflow-y-auto scroll flex-grow">
        <User session={session} userClick={userClick} />
        <ul>{buildList(active)}</ul>
      </div>
      <div className="flex-shrink-0 flex flex-col">
        <div className="h-px bg-gray-400"></div>
        <div className="px-3 py-4 flex items-center justify-center md:justify-start">
          <img
            src={logo}
            className="w-6 h-6 pointer-events-none my-2 md:mx-2"
            alt="logo"
          />
          <div className="flex-grow hidden md:flex flex-col text-left">
            <h1 className=" text-indigo-900 quicksand font-bold">
              <span className="text-indigo-700">C</span>rypto
              <span className="text-indigo-700">D</span>plication
            </h1>
            <h2 className="text-gray-500 quicksand font-bold text-xs">
              Versión 1.0.0
            </h2>
          </div>
        </div>
      </div>
    </nav>
  );
}
