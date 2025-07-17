import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { isDev } from './utils.js'
import { getStaticData, pollResources } from './resourceManager.js'
import { getPreloadPath } from './pathResolver.js'
import { ipcMainHandle } from './utils.js'


app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist-react', 'index.html'));
  }
  pollResources(mainWindow);

  ipcMainHandle('getStaticData', () => {
    return getStaticData();
  });
});
