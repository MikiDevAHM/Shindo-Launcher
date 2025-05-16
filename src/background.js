'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import path from 'path' // Adicionado
import { autoUpdater } from 'electron-updater' 

const isDevelopment = process.env.NODE_ENV !== 'production'

let mainWindow;
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 700,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      devTools: false,  // força desabilitar o devtools
      nodeIntegration: true,     // Habilita nodeIntegration para usar ipcRenderer direto
      contextIsolation: false 
    },
    icon: path.join(__dirname, '..', 'public', 'favicon.ico')
  })
  mainWindow.setMenuBarVisibility(false);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile('../public/index.html')
  }

  if (!isDevelopment) {
    autoUpdater.checkForUpdatesAndNotify();
  }

  return mainWindow;
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {

  await createWindow()
  
});

  

autoUpdater.on('update-available', () => {
  console.log('Atualização disponível.');
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Atualização pronta',
    message: 'A nova versão foi baixada. Reiniciar agora?',
    buttons: ['Sim', 'Depois']
  }).then(result => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.handle('run-updater', () => {
    const updaterPath = isDevelopment
      ? path.join(__dirname, '..', 'public', 'updater.exe')
      : path.join(process.resourcesPath(), 'updater.exe');
      shell.openPath(updaterPath)
});

ipcMain.handle('launch-client',  () => {
    const launcherPath = isDevelopment
      ? path.join(__dirname, '..', 'public', 'launcher.exe')
      : path.join(process.resourcesPath(), 'launcher.exe');
      shell.openPath(launcherPath)
});