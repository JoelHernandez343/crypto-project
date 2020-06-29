import React from 'react';
import DestinyButton from './../../buttons/DestinyButton';
import ListOfFiles from '../upload/ListOfFiles';
import { uploadFile } from './../../../helpers/up_file';

const openFileSelector = () => {};
const files = [
  '/home/marbrehi/Escritorio/hola.txt',
  '/home/marbrehi/Escritorio/hola (3° copia).txt',
  '/home/marbrehi/Escritorio/hola (3° copia)(3° copia).txt',
];

const upfile = async () => {
  new Promise((resolve, reject) => {
    console.log('what am i doing here?');
    uploadFile().then(resolve).catch(reject);
  });
};

export default function MainSection() {
  return (
    <div className="w-full flex-grow flex flex-col min-h-full">
      <div className=" items-center justify-center">
        <DestinyButton
          content="Seleccionar destino"
          onClick={openFileSelector}
        />
      </div>
      {files.length === 0 ? (
        ''
      ) : (
        <div className=" flex-grow rounded bg-gray-200 shadow flex mt-5">
          <div className="w-full p-4 flex flex-col">
            <div className="w-full flex-grow flex h-64">
              <ListOfFiles
                files={files}
                downloadFile={() => {}}
                state="download"
              />
            </div>
          </div>
        </div>
      )}
      <div className=" items-center justify-center">
        <DestinyButton content="Upload" onClick={upfile} />
      </div>
    </div>
  );
}
