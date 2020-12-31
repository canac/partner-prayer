import express from 'express';
import { addApiRoutes } from './api.js';

const app = express();

app.use(express.static('build'));
addApiRoutes(app);

app.listen(process.env.PORT || 8080);
