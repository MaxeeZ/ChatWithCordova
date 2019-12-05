const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
//const server = require('./server/server');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
let win;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600, 
    frame: true,
    webPreferences: {
      allowRunningInsecureContent: true,
      nodeIntegration: false
    }
  });
  
    win.setMenu(null);

    win.maximize();
  
  // load the dist folder from Angular
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/TodoManager/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools optionally:
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  })

  win.once('ready-to-show', () => {
    win.show();
  })

}

app.on('ready', () => {
  createWindow();
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

