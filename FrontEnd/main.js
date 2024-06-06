const { app, BrowserWindow } = require("electron");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 1024,
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);
