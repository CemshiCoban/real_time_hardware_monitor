import { Server } from 'socket.io';
import server from './runHttpServer';
import { handleSystemInfo } from '../controllers/systemController';

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  handleSystemInfo(io);
});

export default io;
