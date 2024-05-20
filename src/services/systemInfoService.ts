import si from 'systeminformation';

interface CpuInfo {
  load: number;
  cores: number[];
}

interface RamInfo {
  usage: number;
}

interface DiskInfo {
  usage: number;
}

interface NetworkInfo {
  [key: string]: {
    inputBytes: number;
    outputBytes: number;
  };
}

interface SystemInfo {
  cpu: CpuInfo;
  ram: number;
  disk: number;
  network: NetworkInfo;
}

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
