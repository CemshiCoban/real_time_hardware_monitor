import { Router } from 'express';
import { UserSettings } from '../models/UserSettings';

const router = Router();

router.post('/set-max-values', async (req, res) => {
  const { maxCpu, maxDisk, email } = req.body;

  if (!maxCpu || !maxDisk || !email) {
    return res.status(400).send('All fields are required');
  }

  const settings = new UserSettings({ maxCpu, maxDisk, email });
  await settings.save();

  res.send('Settings saved successfully');
});

export default router;
