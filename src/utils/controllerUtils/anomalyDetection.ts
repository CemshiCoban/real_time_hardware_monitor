import { IUserSettings } from '../../models/UserSettings';

export interface ISystemInfoNoNetwork {
  cpu: {
    load: number;
    cores: number[];
  };
  ram: number;
  disk: number;
}

export function detectAnomalies(
  info: ISystemInfoNoNetwork,
  settings: IUserSettings,
) {
  let anomalyCpu = 0,
    anomalyDisk = 0;

  if (settings) {
    if (info.cpu.load > settings.maxCpu) {
      anomalyCpu = 1;
    }
    if (info.disk > settings.maxDisk) {
      anomalyDisk = 1;
    }
  }

  return { anomalyCpu, anomalyDisk };
}
