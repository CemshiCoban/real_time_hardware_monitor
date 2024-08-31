export interface CpuInfo {
  load: number;
  cores: number[];
}

export interface RamInfo {
  usage: number;
}

export interface DiskInfo {
  usage: number;
}

export interface NetworkInfo {
  [key: string]: {
    inputBytes: number;
    outputBytes: number;
  };
}

export interface SystemInfo {
  cpu: CpuInfo;
  ram: number;
  disk: number;
  network: NetworkInfo;
}
