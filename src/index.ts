import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { getSystemInfo } from './services/systemInfoService';
import { CpuStatus, RamStatus, DiskStatus, NetworkStatus } from './models/SystemStatus';
import { UserSettings } from './models/UserSettings';
import { sendAlertEmail } from './services/emailService';
import userSettingsRouter from './routes/userSettings';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use('/api', userSettingsRouter);

mongoose.connect(process.env.MONGODB_URI as string, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  setInterval(async () => {
    try {
      const info = await getSystemInfo();
      io.emit('systemInfo', info);

      // Store system information in different collections
      const cpuStatus = new CpuStatus({ cores: info.cpu.cores, load: info.cpu.load });
      const ramStatus = new RamStatus({ usage: info.ram });
      const diskStatus = new DiskStatus({ usage: info.disk });
      const networkStatus = new NetworkStatus(info.network);

      await cpuStatus.save();
      await ramStatus.save();
      await diskStatus.save();
      await networkStatus.save();

      const settings = await UserSettings.findOne().sort({ createdAt: -1 });

      if (settings && settings.alertCount < 3) {
        if (info.cpu.load > settings.maxCpu) {
          await sendAlertEmail(
            settings.email,
            'CPU Usage Alert',
            `CPU usage has exceeded the maximum threshold of ${settings.maxCpu}%. Current usage is ${info.cpu.load}%.`
          );
          settings.alertCount += 1;
          await settings.save();
        }
        if (info.disk > settings.maxDisk) {
          await sendAlertEmail(
            settings.email,
            'Disk Usage Alert',
            `Disk usage has exceeded the maximum threshold of ${settings.maxDisk}%. Current usage is ${info.disk}%.`
          );
          settings.alertCount += 1;
          await settings.save();
        }
      }

      // Calculate statistics
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
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
