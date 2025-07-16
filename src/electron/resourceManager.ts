import fs from 'fs';

import osUtils from 'os-utils';


const POLLING_INTERVAL = 1000;

export function pollResources() {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const memoryUsage = await getMemoryUsage();
    console.log({
      cpuUsage,
      memoryUsage,
    });
  }, POLLING_INTERVAL);
}

function getCpuUsage() {
  return new Promise((resolve) => {
    osUtils.cpuUsage((percentage) => {
      resolve(percentage);
    });
  });
}

function getMemoryUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === 'win32' ? 'C:\\' : '/');
  const total = stats.bsize * stats.blocks;
  const free = stats.bfree * stats.bsize;
  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
}