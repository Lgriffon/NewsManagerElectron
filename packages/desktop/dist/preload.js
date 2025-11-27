const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  notify: (opts) => ipcRenderer.invoke('notify', opts),
});
