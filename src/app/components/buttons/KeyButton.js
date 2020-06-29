import React, { useState, useEffect } from 'react';
import { loadRSAPaths, areRsaKeys } from '../../helpers/rsa';

const click = async (messageQueue, setInitial) => {
  let answer = await loadRSAPaths();

  if (typeof answer !== 'string') {
    messageQueue.add({
      title: 'Se agregaron las llaves exitosamente',
      message: 'Llaves agregadas correctamente',
      style: 'success',
    });

    setInitial(false);
  } else {
    messageQueue.add({
      title: 'Ocurrió un error al agregar las llaves',
      message: answer,
      style: 'error',
    });
  }
};

const checkForKeys = async setInitial => setInitial(!(await areRsaKeys()));

export default function KeyButton({ messageQueue }) {
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    checkForKeys(setInitial);
  }, []);

  return (
    // eslint-disable-next-line
    <a
      onClick={() => click(messageQueue, setInitial)}
      target="_blank"
      className="bg-gray-300 text-indigo-900 hover:bg-indigo-500 hover:bg-opacity-25 inline-flex items-center justify-center border border-transparent text-sm leading-6 font-semibold rounded-sm transition ease-in-out duration-150 cursor-pointer p-1 m-1"
    >
      <span className="mdi mdi-key-change pointer-events-none px-1"></span>
      <p className="pointer-events-none">
        {initial ? 'Establecer llaves' : 'Cambiar llaves'}
      </p>
    </a>
  );
}
