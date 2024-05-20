import * as si from 'systeminformation';
import mongoose from 'mongoose';

// Define Mongoose schema and model for the system data
interface ISystemStatus {
  cpuInfo: si.Systeminformation.CpuData;
  cpuLoad: si.Systeminformation.CurrentLoadData;
  memory: si.Systeminformation.MemData;
  diskUsage: any;
  networkStats: any;
  createdAt?: Date;
}

const SystemStatusSchema = new mongoose.Schema({
  cpuInfo: Object,
  cpuLoad: Object,
  memory: Object,
  diskUsage: Array,
  networkStats: Array,
  createdAt: { type: Date, default: Date.now }
});

const SystemStatusModel = mongoose.model<ISystemStatus & mongoose.Document>('SystemStatus', SystemStatusSchema);

// Variables to store CPU statistics
let minCpuUsage = Number.MAX_VALUE;
let maxCpuUsage = Number.MIN_VALUE;
let totalCpuUsage = 0;
let countCpuSamples = 0;

async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect('mongodb://localhost:27017/hardware_monitor');
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}

async function displaySystemStatus(): Promise<void> {
  try {
    const systemStatus: ISystemStatus = {
      cpuInfo: await si.cpu(),
      cpuLoad: await si.currentLoad(),
      memory: await si.mem(),
      diskUsage: await si.fsSize(),
      networkStats: await si.networkStats()
    };

    // Calculate the CPU usage statistics
    const currentCpuUsage = systemStatus.cpuLoad.currentLoad;
    minCpuUsage = Math.min(minCpuUsage, currentCpuUsage);
    maxCpuUsage = Math.max(maxCpuUsage, currentCpuUsage);
    totalCpuUsage += currentCpuUsage;
    countCpuSamples++;

    const meanCpuUsage = totalCpuUsage / countCpuSamples;

    console.log(`CPU Usage - Min: ${minCpuUsage.toFixed(2)}%, Max: ${maxCpuUsage.toFixed(2)}%, Mean: ${meanCpuUsage.toFixed(2)}%`);

    // Save the retrieved system status to the database
    const newSystemStatus = new SystemStatusModel(systemStatus);
    await newSystemStatus.save();

    console.log('System status saved:', newSystemStatus);

  } catch (error) {
    console.error('Error retrieving system information:', error);
  }
}

async function monitorSystem(): Promise<void> {
  await connectDatabase();
  
  // Set an interval to monitor the system status every 3 seconds
  setInterval(async () => {
    await displaySystemStatus();
  }, 3000);
}

monitorSystem();