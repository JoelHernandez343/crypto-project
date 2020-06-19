// Importamos app y la clase BrowserWindow de electron
const { app, BrowserWindow } = require('electron');

// Importamos la utilidad path
const path = require('path');

// Callback que se ejecutará cuando la aplicación este lista
const createWindow = () => {

  let options = {
    width: 1000,
    height: 680,
    frame: false,
    // Permitimos que el proceso Render acceda a la API de node directamente.
    webPreferences: {
      nodeIntegration: true
    }
  }

  let window = new BrowserWindow(options);

  // Si la aplicación no está empaquetada, usamos el servidor interno de React.
  // Si está empaquetada, cargamos el index.html
  window.loadURL(
    !app.isPackaged ?
      'http://localhost:3000' :
      `file://${path.join(__dirname, 'index.html')}`
  )
}

app.whenReady().then(createWindow);