import express from 'express';

import "./database";
import { router } from './routes';

const app = express();

const PORT = 3333;

app.use(express.json());

app.use(express.urlencoded({ extended: true}));

app.use(router);

app.listen(PORT, () => console.log(`server is running at port ${PORT}`));