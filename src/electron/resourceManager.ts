import fs from 'fs';
import os from 'os';
import { BrowserWindow } from 'electron';
import osUtils from 'os-utils';


const POLLING_INTERVAL = 1000;

export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const memoryUsage = await getMemoryUsage();
    const storageData = getStorageData();
    mainWindow.webContents.send('statistics', {
      cpuUsage,
      memoryUsage,
      storageData: storageData.usage,
    });
  }, POLLING_INTERVAL);
}

export function getCpuUsage() {
  return new Promise((resolve) => {
    osUtils.cpuUsage((percentage) => {
      resolve(percentage);
    });
  });
}

export function getMemoryUsage() {
  return 1 - osUtils.freememPercentage();
}

export function getStorageData() {
  const stats = fs.statfsSync(process.platform === 'win32' ? 'C:\\' : '/');
  const total = stats.bsize * stats.blocks;
  const free = stats.bfree * stats.bsize;
  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
}

export function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  const totalMemory = Math.floor(os.totalmem() / 1024); // in GB

  return {
    cpuModel,
    totalMemory,
    totalStorage,
  };
}