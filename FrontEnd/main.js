const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 1024,
    webPreferences: {
      contextIsolation: false,
      //preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadFile("pages/visualizar_page.html");
}

app.whenReady().then(createWindow);
