import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors";

import createConnection from "./database";
import { AppError } from './errors/AppError';
import { router } from './routes';


createConnection();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(router);


app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
  if(err instanceof AppError) 
    return response.status(err.statusCode).json({message: err.message});

  return response.status(500).json({message: "Internal server error."});
})

export { app }