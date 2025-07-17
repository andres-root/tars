import fs from 'fs';
import os from 'os';
import { BrowserWindow } from 'electron';
import osUtils from 'os-utils';
import { ipcWebContentsSend } from './utils.js';


const POLLING_INTERVAL = 500;

export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();
    ipcWebContentsSend('statistics', mainWindow.webContents, {
      cpuUsage,
      ramUsage,
      storageUsage: storageData.usage,
    });
  }, POLLING_INTERVAL);
}

export function getStorageData(): { total: number, usage: number } {
  const stats = fs.statfsSync(process.platform === 'win32' ? 'C:\\' : '/');
  const total = stats.bsize * stats.blocks;
  const free = stats.bfree * stats.bsize;
  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
}

export function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    osUtils.cpuUsage((percentage) => {
      resolve(percentage);
    });
  });
}

export function getRamUsage(): number {
  return 1 - osUtils.freememPercentage();
}

export function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  const totalMemoryGB = Math.floor(os.totalmem() / 1024); // in GB

  return {
    cpuModel,
    totalMemoryGB,
    totalStorage,
  };
}