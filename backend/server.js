import 'dotenv/config';
import dns from 'node:dns';
import express from 'express';
import cors from 'cors';
import connectDatabase from './src/config/database.js';

dns.setServers(['8.8.8.8', '1.1.1.1'])

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Venta API is running',
  });
});

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Venta API running on port ${PORT}`)
  });
};

startServer();