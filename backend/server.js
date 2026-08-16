import 'dotenv/config';
import dns from 'node:dns';
import express from 'express';
import cors from 'cors';
import connectDatabase from './src/config/database.js';
import userRoutes from './src/routes/userRoutes.js';
import listingRoutes from './src/routes/listingRoutes.js';
import conversationRoutes from './src/routes/conversationRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import errorHandler from './src/middleware/errorHandler.js';

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

// Routes
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/conversations", messageRoutes);

// Error handler 
app.use(errorHandler);

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Venta API running on port ${PORT}`)
  });
};

startServer();