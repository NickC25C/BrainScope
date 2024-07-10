const { app, BrowserWindow, ipcMain, dialog } = require("electron");

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

  ipcMain.on("open-file-dialog", async (event) => {
    const { canceled, filePaths } = await dialog
      .showOpenDialog({
        properties: ["openFile", "multiSelections"], // Permite seleccionar múltiples archivos
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
