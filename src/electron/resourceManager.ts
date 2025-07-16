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