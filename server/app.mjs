import express from 'express';
import { addPartnersRoute } from './api.js';

const app = express();

app.use(express.static('build'));
addPartnersRoute(app);

app.listen(process.env.PORT || 8080);
