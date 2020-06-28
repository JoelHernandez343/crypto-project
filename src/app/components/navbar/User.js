import React from 'react';

export default function User({ session: { name, email, image }, userClick }) {
  return (
    <div
      id="userButton"
      className="md:px-6 py-8 mb-2 flex items-center hover:bg-indigo-500 hover:bg-opacity-25 cursor-pointer justify-center transition ease-in-out duration-150"
      onClick={userClick}
    >
      <img
        src={image}
        className="h-12 w-12 pointer-events-none rounded-full md:mr-3"
        alt=""
      />
      <div className="hidden md:block flex-grow text-left pointer-events-none">
        <p className="quicksand font-bold">{name}</p>
        <p className="quicksand text-xs">{email}</p>
      </div>
    </div>
  );
}
