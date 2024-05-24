import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { handleSystemInfo } from '../../controllers/systemController';

const runSocketServer = (server: HttpServer) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    handleSystemInfo(io);
  });

  return io;
};

export default runSocketServer;

