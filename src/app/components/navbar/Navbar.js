import React, { useState } from 'react';

import mainRoutes from '../../routes/main_routes';
import Item from './Item';
import User from './User';

export default function Navbar({ changeSection, userClick, user }) {
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
    <nav className="flex-shrink-0 w-16 md:w-64 bg-gray-200 z-20 h-screen overflow-y-auto scroll">
      <User user={user} userClick={userClick} />
      <ul>{buildList(active)}</ul>
    </nav>
  );
}
