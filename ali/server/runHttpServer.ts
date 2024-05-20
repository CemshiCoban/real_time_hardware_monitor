import http from 'http';
import express, { Express, Request, Response, NextFunction } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createError from 'http-errors';

export default (PORT: number): Promise<http.Server> => {
  return new Promise((resolve, reject) => {
    try {
      const app: Express = express();
      const server: http.Server = http.createServer(app);
      
      const __filename: string = fileURLToPath(import.meta.url);
      const __dirname: string = path.dirname(__filename);
  
      app.set('views', path.join(__dirname, 'views'));
      app.use(logger('dev'));
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      app.use(cookieParser());
      app.use(express.static(path.join(__dirname, 'public')));
  
      // app.use('/', routes);
  
      app.use((req: Request, res: Response, next: NextFunction) => {
        next(createError(404));
      });
  
      // error handler
      app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
  
        // render the error page
        res.status(err.status || 500);
        res.json({ error: err });
      });
  
      // Start listening on the specified port
      server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        resolve(server);
      });
    } catch (error) {
      reject(error);
    }
  });
};
