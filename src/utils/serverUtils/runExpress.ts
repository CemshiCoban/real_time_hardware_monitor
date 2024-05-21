import express from 'express';
import path from 'path';
import userSettingsRouter from '../../routes/userSettings';

const app = express();

app.use(express.json());
app.use('/api', userSettingsRouter);

app.use(express.static(path.join(__dirname, '../../../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../public/index.html'));
});

export default app;
