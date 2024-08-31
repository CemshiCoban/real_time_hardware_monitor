import { Server } from 'socket.io';
import { getSystemInfo } from '../utils/systemInfoUtils';
import {
  CpuStatus,
  RamStatus,
  DiskStatus,
  NetworkStatus,
} from '../models/hardware_models';
import { UserSettings } from '../models/UserSettings';
import { detectAnomalies } from '../utils/controllerUtils/anomalyDetection';
import { aggregateData } from '../utils/controllerUtils/aggregator';
import {
  SystemInfoPerMinute,
  SystemInfoPerHour,
  SystemInfoPerDay,
  SystemInfoPerMonth,
  SystemInfoPerYear,
} from '../models/AggregatedStatuses';

export const handleSystemInfo = (io: Server) => {
  let documentCount = 0;
  let minuteDocumentCount = 0;
  let hourDocumentCount = 0;
  let dayDocumentCount = 0;
  let monthDocumentCount = 0;

  // Function to get the number of days in the current month
  const getDaysInCurrentMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  setInterval(async () => {
    try {
      const info = await getSystemInfo();
      io.emit('systemInfo', info);

      const settings = await UserSettings.findOne().sort({ createdAt: -1 });
      const anomalies = detectAnomalies(info, settings!);

      const cpuStatus = new CpuStatus({
        cores: info.cpu.cores,
        load: info.cpu.load,
        anomalyCpu: anomalies.anomalyCpu,
      });

      const ramStatus = new RamStatus({
        usage: info.ram,
      });

      const diskStatus = new DiskStatus({
        usage: info.disk,
        anomalyDisk: anomalies.anomalyDisk,
      });

      const networkStatus = new NetworkStatus({
        network: info.network,
      });

      await cpuStatus.save();
      await ramStatus.save();
      await diskStatus.save();
      await networkStatus.save();

      documentCount += 1;

      // Aggregate at minute level every 20 documents
      if (documentCount >= 60) {
        await aggregateData(
          [CpuStatus, RamStatus, DiskStatus, NetworkStatus],
          new Date(),
          SystemInfoPerMinute,
        );
        documentCount = 0;
        minuteDocumentCount += 1;
      }

      // Aggregate at hour level every 60 minute-level documents
      if (minuteDocumentCount >= 60) {
        await aggregateData(
          [SystemInfoPerMinute],
          new Date(),
          SystemInfoPerHour,
        );
        minuteDocumentCount = 0;
        hourDocumentCount += 1;
      }

      // Aggregate at day level every 24 hour-level documents
      if (hourDocumentCount >= 24) {
        await aggregateData([SystemInfoPerHour], new Date(), SystemInfoPerDay);
        hourDocumentCount = 0;
        dayDocumentCount += 1;
      }

      // Aggregate at month level every X day-level documents where X is the number of days in the current month
      const daysInCurrentMonth = getDaysInCurrentMonth();
      if (dayDocumentCount >= daysInCurrentMonth) {
        await aggregateData([SystemInfoPerDay], new Date(), SystemInfoPerMonth);
        dayDocumentCount = 0;
        monthDocumentCount += 1;
      }

      // Aggregate at year level every 12 month-level documents
      if (monthDocumentCount >= 12) {
        await aggregateData(
          [SystemInfoPerMonth],
          new Date(),
          SystemInfoPerYear,
        );
        monthDocumentCount = 0;
      }
    } catch (error) {
      console.error('Error getting system info', error);
    }
  }, 1000);
};
