import React from 'react';
import Message from './Message';

export default function MessageContainer({ information }) {
  return (
    <div className="z-20 flex justify-center absolute left-0 right-0 mx-auto bottom-0 mb-4">
      <Message information={information} />
    </div>
  );
}
