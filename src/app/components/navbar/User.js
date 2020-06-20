import React from 'react';

import userImage from '../../../images/user.jpg';

export default function User({ user }) {
  return (
    <div className="md:px-6 py-8 mb-2 flex items-center hover:bg-indigo-500 hover:bg-opacity-25 cursor-pointer justify-center transition ease-in-out duration-150">
      <img src={userImage} className="h-12 w-12 pointer-events-none rounded-full md:mr-3" alt="" />
      <div className="hidden md:block flex-grow text-left">
        <p className="title">{user.name}</p>
        <p className="text-xs">{user.email}</p>
      </div>
    </div>
  );
}