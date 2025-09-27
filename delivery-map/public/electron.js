const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const mysql = require('mysql2');
const path = require('path');
const { machineIdSync } = require('node-machine-id');
const fs = require('fs');
const { downloadTiles } = require('@codingspark/tiles-downloader');


let win;
const logFilePath = path.join(process.cwd(), 'app.log');

// Function to append logs to a file
function logToFile(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
}

app.on('ready', async () => {
  win = new BrowserWindow({
    width: 1100,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Secure bridge
      contextIsolation: true,
      enableRemoteModule: false,
      devTools: true,
    },
  });
  // Menu.setApplicationMenu(null);
  // Load your React app
  //win.loadURL('http://localhost:3000'); // For development
  win.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);

  globalShortcut.register('CommandOrControl+Shift+D', () => {
    if (win) {
      win.webContents.openDevTools({ mode: 'detach' }); // or 'undocked', 'bottom', etc.
    }
  });

  win.on('closed', () => {
    mainWindow = null;
  });
});

const dataFilePath = "./src/myVariables.json"

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
  console.log('Settings saved successfully! ' + settings);
  return 'Settings saved successfully!';
});

function loadSettings() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.log('Error reading settings:', err);
    return {}; // Return default settings if no file found
  }
}
// Handle loading settings
ipcMain.handle('load-settings', () => {
  return loadSettings();
});

function getFingerprint() {
  try {
    const id = machineIdSync();
    return id;
  } catch (error) {
    console.error('Error getting fingerprint:', error);
    return "erro";
  }
}

ipcMain.handle('get-fingerprint', () => {
  return getFingerprint();
});

ipcMain.handle('download-tiles', async (evt, args) => {
  async function fetchTiles(centerLat, centerLon, radiusMeters, minZoom, maxZoom) {
    const metersPerDegreeLat = 111_320;
    const metersPerDegreeLon = 111_320 * Math.cos(centerLat * Math.PI / 180);

    const latDelta = radiusMeters / metersPerDegreeLat;
    const lonDelta = radiusMeters / metersPerDegreeLon;

    const bounds = {
      minLat: centerLat - latDelta,
      maxLat: centerLat + latDelta,
      minLon: centerLon - lonDelta,
      maxLon: centerLon + lonDelta,
    };

    // path in your app to save tiles
    const outputRoot = path.join(__dirname, 'tiles');

    // optionally delete old tiles
    if (fs.existsSync(outputRoot)) {
      fs.rmSync(outputRoot, { recursive: true, force: true });
    }

    await downloadTiles(
      {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        zoomLevels: Array.from({ length: maxZoom - minZoom + 1 }, (_, i) => i + minZoom),
        bounds,
        throttleConfig: { limit: 2, interval: 500 }, // adjust rate-limiting
      },
      async ({ x, y, z, buffer }) => {
        const outDir = path.join(outputRoot, `${z}`, `${x}`);
        fs.mkdirSync(outDir, { recursive: true });
        const filePath = path.join(outDir, `${y}.png`);
        await fs.promises.writeFile(filePath, buffer);
        console.log('Tile saved:', filePath); // <-- full path

      }
    );

    console.log('Tiles download complete');
  }

  try {
    return await fetchTiles(args.lat, args.lon, args.radius, args.minZoom, args.maxZoom);
  } catch (err) {
    console.error('Tile download failed:', err);
    throw err;
  }
});

ipcMain.handle('query-database', async (event, query) => {
  const connection = mysql.createConnection({
    host: 'localhost',        // O host onde o MySQL está rodando
    user: 'felipe',             // Usuário do MySQL
    password: 'joaocoragem',  // Senha do MySQL
    database: 'ecleticavendas',
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
