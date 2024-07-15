const { app, BrowserWindow, ipcMain, dialog } = require("electron");
require("@electron/remote/main").initialize();

global.fileLists = [];

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1480,
    height: 1010,
    minWidth: 1480,
    minHeight: 1010,
    webPreferences: {
      contextIsolation: false,
      //preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
    autoHideMenuBar: true,
  });

  require("@electron/remote/main").enable(mainWindow.webContents);

  mainWindow.loadFile("index.html");

  ipcMain.on("change-page", (event, path) => {
    mainWindow.loadFile(path);
  });

  ipcMain.on("open-data-window", () => {
    createDataWindow();
  });

  ipcMain.on("add-to-fileLists", (event, newFiles) => {
    global.fileLists = global.fileLists.concat(newFiles);
    console.log(global.fileLists);
  });

  ipcMain.on("get-global-list", (event) => {
    event.reply("global-var-reply", global.fileLists);
  });
}

function createDataWindow() {
  const dataWindow = new BrowserWindow({
    width: 931,
    height: 700,
    minWidth: 931,
    minHeight: 700,
    maxWidth: 931,
    maxHeight: 700,
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

  ipcMain.on("open-file-dialog", async (event) => {
    const { canceled, filePaths } = await dialog
      .showOpenDialog({
        properties: ["openFile"], // Permite seleccionar múltiples archivos
        filters: [{ name: "Files", extensions: ["csv", "mp4"] }],
      })
      .then((result) => {
        if (!result.canceled && result.filePaths.length > 0) {
          event.sender.send("selected-file", result.filePaths);
        }
      })
      .catch((err) => {
        console.log("Error al abrir el diálogo de archivos:", err);
      });
    if (!canceled) {
      event.reply("selected-file", filePaths);
    }
  });
}

app.whenReady().then(createWindow);

module.exports.createDataWindow = createDataWindow;
