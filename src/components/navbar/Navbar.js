import React, { useState } from 'react';

import Item from './Item';

import mainRoutes from '../../routes/main_routes';

export default function Navbar({ changeSection }) {

  const [active, setActive] = useState(0);

  const menu = mainRoutes.map(
    ({ section, navInfo: { icon, title } }) => ({ section, icon, title })
  );

  const changeAll = index => {
    setActive(index);
    changeSection(menu[index].section);
  }

  const buildList = active =>
    menu.map(({ section, title, icon }, index) => (
      <Item key={section} title={title} icon={icon} index={index} active={index === active} updateList={changeAll} />
    ));

  return (
    <nav className="w-16 sm:w-64 bg-gray-200">
      <ul>
        {buildList(active)}
      </ul>
    </nav>
  );
}