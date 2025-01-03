// Electron
const { app, Menu, ipcMain } = require("electron");

// Import the Express server
require('./server');

app.whenReady().then(() => {
  // Main window
  const window = require("./src/window");
  mainWindow = window.createBrowserWindow(app);

  // Option 1: Uses Webtag and load a custom html file with external content
  mainWindow.loadFile("start.html");

  ipcMain.on('switch-page', (event, page, query) => {
    mainWindow.loadFile(`${page}.html`, {
      query,
    });
  });

  Menu.setApplicationMenu(null);
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
