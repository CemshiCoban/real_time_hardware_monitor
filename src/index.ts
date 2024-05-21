import dotenv from 'dotenv';
import server from './utils/serverUtils/runHttpServer';
import './utils/serverUtils/runSocketioServer';
import { connectDatabase } from './utils/serverUtils/runDatabase';

dotenv.config();

connectDatabase();

server.listen(3000, () => {
  console.log('listening on *:3000');
});
