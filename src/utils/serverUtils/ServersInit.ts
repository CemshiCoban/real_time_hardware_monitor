import dotenv from 'dotenv';
import runHttpServer from './runHttpServer';
import runDatabase from './runDatabase';
import runSocketServer from './runSocketioServer';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const ServersInit = async () => {
  try {
    const server = await runHttpServer(PORT);
    console.log(`HTTP server is running on port ${PORT}`);

    await runSocketServer(server);
    console.log('Socket.IO server is running');

    await runDatabase();
    console.log('Database connection established');

  } catch (error) {
    console.error('Error starting servers:', error);
    process.exit(1);
  }
};

export default ServersInit;