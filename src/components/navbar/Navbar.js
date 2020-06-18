import React from 'react';

import Item from './Item';

export default function Navbar({ className }) {
  return (
    <nav className={className}>
      <ul>
        <Item />
      </ul>
    </nav>
  );
}