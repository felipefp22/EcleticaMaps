const { contextBridge, ipcRenderer } = require('electron');

// Expose methods to the renderer process (React app)
contextBridge.exposeInMainWorld('electronAPI', {
  queryDatabase: (query) => ipcRenderer.invoke('query-database', query),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  getFingerprint: () => ipcRenderer.invoke('get-fingerprint'),
  onMainLog: (callback) => ipcRenderer.on('main-log', callback),
    // downloadTiles: (params) => ipcRenderer.invoke('download-tiles', params),

});

console.log('Preload script loaded');