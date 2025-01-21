const { app, BrowserWindow, ipcMain } = require('electron');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');

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
  //mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

const dataFilePath = path.join(__dirname, 'src', 'myVariables.json');

function loadSettings() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.log('Error reading settings:', err);
    return {}; // Return default settings if no file found
  }
}

// Function to save settings
function saveSettings(settings) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(settings, null, 2)); // Pretty print JSON
    console.log('Settings saved successfully!');
  } catch (err) {
    console.log('Error saving settings:', err);
  }
}

// Handle saving settings
ipcMain.handle('save-settings', (event, settings) => {
  saveSettings(settings);
  return 'Settings saved successfully!';
});

// Handle loading settings
ipcMain.handle('load-settings', () => {
  return loadSettings();
});

ipcMain.handle('query-database', async (event, query) => {
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
