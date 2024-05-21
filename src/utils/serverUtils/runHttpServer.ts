import http from 'http';
import app from './runExpress';

const server = http.createServer(app);

export default server;
