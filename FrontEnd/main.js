const { app, BrowserWindow, ipcMain, dialog } = require("electron");
require("@electron/remote/main").initialize();

global.fileLists = [];
global.dataCsv;

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

  ipcMain.on("open-process-window", () => {
    createProcessWindow();
  });

  ipcMain.on("add-to-fileLists", (event, newFiles) => {
    global.fileLists = global.fileLists.concat(newFiles);
    console.log(global.fileLists);
  });

  ipcMain.on("add-to-fileProcess", (event, newFiles) => {
    global.fileLists = global.fileLists.concat(newFiles);
    console.log(global.fileLists);
  });

  ipcMain.on("assign_csv", (event, csvFile) => {
    global.dataCsv = csvFile;
  });

  ipcMain.on("get-global-list", (event) => {
    event.reply("global-var-reply", global.fileLists);
    global.fileLists = [];
  });

  ipcMain.handle("getVariableValue", async (event) => {
    return global.dataCsv; // Retorna el valor de la variable monitoreada
  });

  ipcMain.on("get-global-csv", (event) => {
    event.reply("global-csv-reply", global.dataCsv);
    global.dataCsv = undefined;
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

function createProcessWindow() {
  const processWindow = new BrowserWindow({
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

  processWindow.loadFile("pages/escoger_datos_procesar.html");

  ipcMain.on("close-me", (event) => {
    let window = BrowserWindow.fromWebContents(event.sender);
    window.close();
  });

  ipcMain.on("open-csv-dialog", async (event) => {
    const { canceled, filePaths } = await dialog
      .showOpenDialog({
        properties: ["openFile"], // Permite seleccionar múltiples archivos
        filters: [{ name: ".csv", extensions: ["csv"] }],
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
