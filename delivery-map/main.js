const { app, BrowserWindow, ipcMain } = require('electron');
const mysql = require('mysql2');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Secure bridge
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  // Load your React app
  mainWindow.loadURL('http://localhost:3000'); // For development
  // Uncomment this for production (after building React)
  // mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

ipcMain.handle('query-database', async (event, query) => {
  console.log('aquiii');
  const connection = mysql.createConnection({
    host: 'localhost',        // O host onde o MySQL está rodando
    user: 'root',             // Usuário do MySQL
    password: 'minha_senha',  // Senha do MySQL
    database: 'ecletica',
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) return reject('Connection error: ' + err);

      connection.query(query, (err, results) => {
        if (err) {
          reject('Query error: ' + err);
        } else {

          resolve(results);
        }
        connection.end();
      });
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
