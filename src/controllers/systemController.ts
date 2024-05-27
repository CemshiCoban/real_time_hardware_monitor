import { Server } from 'socket.io';
import { getSystemInfo } from '../utils/systemInfoUtils';
import { CpuStatus, RamStatus, DiskStatus, NetworkStatus } from '../models/hardware_models';
import { UserSettings } from '../models/UserSettings';
import { sendAlertEmail } from '../services/emailService';

export const handleSystemInfo = (io: Server) => {
  let alertCount = 0;

  io.on('connection', (socket) => {
    alertCount = 0;
    console.log('alertCount reset to 0');

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  setInterval(async () => {
    try {
      const info = await getSystemInfo();
      io.emit('systemInfo', info);

      const cpuStatus = new CpuStatus({ cores: info.cpu.cores, load: info.cpu.load });
      const ramStatus = new RamStatus({ usage: info.ram });
      const diskStatus = new DiskStatus({ usage: info.disk });
      const networkStatus = new NetworkStatus({ network: info.network });

      await cpuStatus.save();
      await ramStatus.save();
      await diskStatus.save();
      await networkStatus.save();

      const settings = await UserSettings.findOne().sort({ createdAt: -1 });
      console.log(settings);

      if (settings && alertCount < 3) {
        if (info.cpu.load > settings.maxCpu) {
          await sendAlertEmail(
            settings.email,
            'CPU Usage Alert',
            `CPU usage has exceeded the maximum threshold of ${settings.maxCpu}%. Current usage is ${info.cpu.load}%.`
          );
          alertCount++;
        }
        if (info.disk > settings.maxDisk) {
          await sendAlertEmail(
            settings.email,
            'Disk Usage Alert',
            `Disk usage has exceeded the maximum threshold of ${settings.maxDisk}%. Current usage is ${info.disk}%.`
          );
          alertCount++;
        }
      }

      const stats = await CpuStatus.aggregate([
        {
          $group: {
            _id: null,
            avgCpu: { $avg: '$load' },
            minCpu: { $min: '$load' },
            maxCpu: { $max: '$load' }
          }
        }
      ]);

      if (stats.length > 0) {
        io.emit('cpuStats', {
          avgCpu: stats[0].avgCpu,
          minCpu: stats[0].minCpu,
          maxCpu: stats[0].maxCpu
        });
      }
    } catch (error) {
      console.error('Error getting system info', error);
    }
  }, 3000);
};
