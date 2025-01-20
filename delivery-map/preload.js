const { contextBridge, ipcRenderer } = require('electron');

// Expose the 'query-database' method to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  queryDatabase: (query) => ipcRenderer.invoke('query-database', query),
});

console.log('Preload script loaded');