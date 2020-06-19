import React from 'react';

import userImage from '../../images/user.jpg';

export default function User({ user }) {
  return (
    <div className="sm:px-6 py-8 mb-2 flex items-center hover:bg-gray-300 cursor-pointer justify-center">
      <img src={userImage} className="h-12 w-12 pointer-events-none rounded-full sm:mr-3" alt="" />
      <div className="hidden sm:block flex-grow text-left">
        <p className="title">{user.name}</p>
        <p className="text-xs">{user.email}</p>
      </div>
    </div>
  );
}