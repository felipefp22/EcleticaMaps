const { contextBridge, ipcRenderer } = require('electron');

// Expose methods to the renderer process (React app)
contextBridge.exposeInMainWorld('electronAPI', {
  queryDatabase: (query) => ipcRenderer.invoke('query-database', query),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
});

console.log('Preload script loaded');