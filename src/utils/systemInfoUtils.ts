import si from 'systeminformation';
import { CpuInfo, NetworkInfo, SystemInfo } from '../types/systemInfo';

export const getSystemInfo = async (): Promise<SystemInfo> => {
  const cpu = await si.currentLoad();
  const mem = await si.mem();
  const disk = await si.fsSize();
  const network = await si.networkStats();

  const cpuInfo: CpuInfo = {
    load: cpu.currentLoad,
    cores: cpu.cpus.map(cpu => cpu.load)
  };

  const networkInfo: NetworkInfo = network.reduce((acc: NetworkInfo, iface) => {
    acc[iface.iface] = {
      inputBytes: iface.rx_bytes,
      outputBytes: iface.tx_bytes
    };
    return acc;
  }, {});

  return {
    cpu: cpuInfo,
    ram: (mem.active / mem.total) * 100,
    disk: disk[0].use,
    network: networkInfo
  };
};
