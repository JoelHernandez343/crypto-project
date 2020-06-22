import React from 'react';
import Message from './Message';

export default function MessageContainer({ show, style, title, message, close }) {

  console.log(show);

  return (
    <div className={`${show ? '' : 'hidden'} z-20 flex justify-center absolute left-0 right-0 mx-auto bottom-0 mb-4`}>
      <Message title={title} message={message} style={style} close={close} />
    </div>
  );
}