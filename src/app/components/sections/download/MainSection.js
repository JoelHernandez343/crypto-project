import React from 'react';
import DestinyButton from './../../buttons/DestinyButton';
import ListOfFiles from '../upload/ListOfFiles';

const openFileSelector = () => {};
const Files = ['/home/marbrehi/Escritorio/hola.txt'];

export default function MainSection() {
  return (
    <div className="w-full flex-grow flex flex-col lg:flex-row min-h-full">
      <div className=" items-center justify-center">
        <DestinyButton
          content="Seleccionar destino"
          onClick={openFileSelector}
        />
      </div>
      {Files.length === 0 ? (
        ''
      ) : (
        <div className="lg:w-0 flex-grow rounded bg-gray-200 shadow flex mt-5 lg:mt-0">
          <div className="w-full p-4 flex flex-col">
            <div className="w-full flex-grow flex h-64">
              <ListOfFiles
                files={[
                  '/home/marbrehi/Escritorio/hola.txt',
                  '/home/marbrehi/Escritorio/hola (3° copia).txt',
                  '/home/marbrehi/Escritorio/hola (3° copia)(3° copia).txt',
                ]}
                downloadFile={() => {}}
                state="download"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
