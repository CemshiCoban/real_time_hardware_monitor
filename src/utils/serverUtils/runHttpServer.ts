import http from 'http';
import express from 'express';
import path from 'path';
import cors from 'cors';
import userSettingsRouter from '../../routes/userSettings';

const runHttpServer = (port: number) => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use('/api', userSettingsRouter);
  app.use(express.static(path.join(__dirname, '../../../public')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/index.html'));
  });

  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  return server;
};

export default runHttpServer;
