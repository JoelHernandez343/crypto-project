import React, { useState } from 'react';
import SignButton from './buttons/SignButton';
import { closeSession, logSession } from './../helpers/session';

const renderMessage = status =>
  status === 'disconnected' ? (
    <>
      Ingresar con <span className="text-indigo-900 font-bold">Google</span>
    </>
  ) : status === 'loading' ? (
    <>Iniciando sesión...</>
  ) : (
    <>Sesión iniciada</>
  );

const setButtonContent = status =>
  status === 'disconnected' ? (
    <>Iniciar sesión</>
  ) : status === 'loading' ? (
    <div className="flex -ml-3">
      <div className="w-10 flex-shrink-0 flex items-center justify-center">
        <span className="mdi mdi-loading Loading"></span>
      </div>
      <p className="flex-grow">Cancelar</p>
    </div>
  ) : (
    <>Cerrar sesión</>
  );

export default function Popup({
  show,
  messageQueue,
  setSession,
  session: { status },
}) {
  const [cancel, setCancel] = useState({ cb() {} });

  const updateStatus = status =>
    setSession(prev => ({
      name: prev.name,
      email: prev.email,
      image: prev.image,
      status,
    }));

  const signIn = async () => {
    let promiseSignIn = () =>
      new Promise((resolve, reject) => {
        logSession().then(resolve).catch(reject);
        setCancel({
          cb() {
            resolve('Operación cancelada por el usuario');
          },
        });
      });

    updateStatus('loading');

    let resolve = await promiseSignIn();

    setCancel({ cb() {} });

    if (typeof resolve !== 'string') {
      setSession(resolve);

      messageQueue.add({
        title: 'Se inició la sesión exitosamente',
        message: 'La sesión de Google Drive se ha iniciado correctamente',
        style: 'success',
      });
      updateStatus('connected');
    } else {
      messageQueue.add({
        title: 'Ha ocurrido un error',
        message: resolve,
        style: 'error',
      });
      updateStatus('disconnected');
    }
  };

  const signOut = () => {
    closeSession(setSession);

    messageQueue.add({
      title: 'Sesión cerrada',
      message: 'Se cerró sesión con éxito.',
      style: 'success',
    });
  };

  const click = () =>
    status === 'disconnected'
      ? signIn()
      : status === 'loading'
      ? cancel.cb()
      : signOut();

  return (
    <div
      id="popup"
      className={`${
        show ? '' : 'hidden'
      } bg-gray-100 absolute z-30 mt-24 ml-16 shadow-lg flex flex-col w-64`}
    >
      <p className="quicksand font-semibold text-left mx-4 mt-4">
        {renderMessage(status)}
      </p>
      <SignButton buttonContent={setButtonContent(status)} click={click} />
    </div>
  );
}
