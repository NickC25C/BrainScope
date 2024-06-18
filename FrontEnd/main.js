const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 1024,
    minWidth: 1440,
    minHeight: 1024,
    webPreferences: {
      contextIsolation: false,
      //preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadFile("index.html");

  ipcMain.on("change-page", (event, path) => {
    mainWindow.loadFile(path);
  });

  ipcMain.on("open-data-window", () => {
    createDataWindow();
  });
}

function createDataWindow() {
  const dataWindow = new BrowserWindow({
    width: 931,
    height: 526,
    minWidth: 931,
    minHeight: 526,
    maxWidth: 931,
    maxHeight: 526,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
  });

  dataWindow.loadFile("pages/escoger_datos.html");

  ipcMain.on("close-me", (event) => {
    let window = BrowserWindow.fromWebContents(event.sender);
    window.close();
  });
}

app.whenReady().then(createWindow);

module.exports.createDataWindow = createDataWindow;
