import dotenv from 'dotenv'
import runDatabase from './server/runDatabase';
import runHttpServer from ''

dotenv.config();

const PORT = process.env.PORT || 3000;

runHttpServer(PORT)
  .then(() => runDatabase())
  .catch((error: any) => {
    console.log(error);
    process.exit(0);
  });